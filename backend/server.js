const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const { Server } = require('socket.io');

const UserSubscription = require('./src/models/userSubscriptionModel');
const User = require("./src/models/userModel");
const Subscription = require("./src/models/subscriptionModel");
const Address = require("./src/models/addressModel");
const { createInvoice } = require("./src/controllers/userSubscriptionController");
const cron = require('node-cron');

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
const invitationRequestRoute = require("./src/routes/invitationRequestRoute");
const sharedStorageSpaceRoute = require("./src/routes/sharedStorageSpaceRoute");
const rightRoute = require("./src/routes/rightRoute");
const countryRoute = require("./src/routes/countryRoute");
const userInvitationRoute = require("./src/routes/userInvitationRoute");

app.use("/database", databaseRoute);
app.use("/user", userRoute);
app.use("/company", companyRoute);
app.use("/file", fileRoute);
app.use("/folder", folderRoute);
app.use("/subscription", subscriptionRoute);
app.use("/usersubscription", userSubscriptionRoute);
app.use("/invitation-request", invitationRequestRoute);
app.use("/sharedstorage-space", sharedStorageSpaceRoute);
app.use("/right", rightRoute);
app.use("/country", countryRoute);
app.use('/user-invitation', userInvitationRoute);


app.use("/files", express.static("src/files"));
app.use("/invoices", express.static("src/files/invoices"));
app.use('/Images', express.static('./Images'));

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

// check if 'src/files' directory exists, if not create it
if (!fs.existsSync(path.join(__dirname, "src/files"))) {
  fs.mkdirSync(path.join(__dirname, "src/files"));
}

// check if 'invoices' directory exists, if not create it

if (!fs.existsSync(path.join(__dirname, "src/files/invoices"))) {
  fs.mkdirSync(path.join(__dirname, "src/files/invoices"));
}

// check if 'Images' directory exists, if not create it
if (!fs.existsSync(path.join(__dirname, "Images"))) {
  fs.mkdirSync(path.join(__dirname, "Images"));
}

cron.schedule('* * * * *', async () => {
  try {
    console.log("Running the billing cron job...");

    // Récupérer tous les abonnements actifs
    const userSubscriptions = await UserSubscription.findAll({
      where: { renew: true },
      include: [
        {
          model: Subscription,
          as: 'subscription'
        },
        {
          model: User,
          as: 'user',
          include: [
            {
              model: Address,
              as: 'address',
            },
          ],
        },
      ]
    });

    const today = new Date();

    // Parcourir chaque abonnement pour vérifier si une nouvelle facture doit être créée
    for (let userSubscription of userSubscriptions) {
      const { subscription, user, startDate } = userSubscription;
      const { duration } = subscription;

      const nextBillingDate = new Date(startDate);
      nextBillingDate.setMonth(nextBillingDate.getMonth() + duration);

      if (today >= nextBillingDate) {
        // Créer une facture
        await createInvoice(user, subscription, userSubscription);

        // Mettre à jour la date de début pour refléter la nouvelle période de facturation
        await userSubscription.update({
          startDate: today,
        });

        console.log(`Invoice created for user: ${user.email}`);
      }
    }

    console.log("Billing cron job completed.");

  } catch (error) {
    console.error("Error running the billing cron job:", error);
  }
});

httpServer.listen(8000, function () {
  console.log("Serveur ouvert sur le port 8000");
});
