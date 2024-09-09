const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
require("dotenv").config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

const databaseRoute = require("./src/routes/databaseRoute");
const userRoute = require("./src/routes/userRoute");
const fileRoute = require("./src/routes/fileRoute");
const folderRoute = require("./src/routes/folderRoute");
const subscriptionRoute = require("./src/routes/subscriptionRoute");
const userSubscriptionRoute = require("./src/routes/userSubscriptionRoute");
const countryRoute = require("./src/routes/countryRoute");
const stripeRoute = require("./src/routes/stripeRoute");

app.use("/database", databaseRoute);
app.use("/user", userRoute);
app.use("/file", fileRoute);
app.use("/folder", folderRoute);
app.use("/subscription", subscriptionRoute);
app.use("/user-subscription", userSubscriptionRoute);
app.use("/country", countryRoute);
app.use('/stripe', stripeRoute);

// add route ai/generate to fetch http://geminiswerk.zapto.org:50000/generate 
app.post("/ai/generate", async (req, res) => {

  const message = req.body.message;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // si message > 120 caractères
  if (message.length > 120) {
    // cut message to 120 characters
    req.body.message = message.substring(0, 120);
  }

  await fetch("http://geminiswerk.zapto.org:50000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "http://localhost:5173",
      Authorization: "Bearer " + process.env.SECRET_GOOGLE_AI,
    },
    body: JSON.stringify(req.body),
  })
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

app.use("/files", express.static("src/files"));
app.use("/invoices", express.static("src/files/invoices"));
app.use('/Images', express.static('./Images'));

const httpServer = require("http").createServer(app);

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

httpServer.listen(8000, function () {
  console.log("Serveur ouvert sur le port 8000");
});
