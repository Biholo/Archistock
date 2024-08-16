const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const { Server } = require('socket.io');

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser());

const databaseRoute = require("./src/routes/databaseRoute");
const userRoute = require("./src/routes/userRoute");
const companyRoute = require("./src/routes/companyRoute");
const fileRoute = require("./src/routes/fileRoute");
const folderRoute = require("./src/routes/folderRoute");
const subscriptionRoute = require("./src/routes/subscriptionRoute");
const userSubscriptionRoute = require("./src/routes/userSubscriptionRoute");

app.use("/database", databaseRoute);
app.use("/user", userRoute);
app.use("/company", companyRoute);
app.use("/file", fileRoute);
app.use("/folder", folderRoute);
app.use("/subscription", subscriptionRoute);
app.use("/usersubscription", userSubscriptionRoute);

app.use("/files", express.static("src/files"));

const httpServer = require('http').createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

const waitingClients = [];
const supports = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Rejoindre une salle basée sur le rôle
  socket.on('joinRoom', ({ role, room }) => {
    socket.join(room);
    console.log(`${role} joined room: ${room}`);
  });

  // Contacter le support
  socket.on('contactSupport', () => {
    waitingClients.push(socket.id);
    io.emit('clientsWaiting', waitingClients.map(id => ({ id })));
  });

  // Répondre à un client
  socket.on('answerClient', ({ clientId }) => {
    if (waitingClients.includes(clientId)) {
      // Suppression du client de la liste d'attente
      waitingClients.splice(waitingClients.indexOf(clientId), 1);
      io.to(clientId).emit('supportAssigned', { supportId: socket.id });
      socket.emit('connected', { clientId });
    }
  });

  // Envoyer un message
  socket.on('sendMessage', ({ recipientId, message }) => {
    io.to(recipientId).emit('receiveMessage', { message, senderId: socket.id });
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Nettoyer les clients en attente et les supports
    const index = waitingClients.indexOf(socket.id);
    if (index > -1) waitingClients.splice(index, 1);
    supports.delete(socket.id);
    io.emit('clientsWaiting', waitingClients.map(id => ({ id })));
  });
});

httpServer.listen(8000, function () {
  console.log("Serveur ouvert sur le port 8000");
});
