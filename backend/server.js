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
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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
const stripeRoute = require("./src/routes/stripeRoute");

app.use("/database", databaseRoute);
app.use("/user", userRoute);
app.use("/company", companyRoute);
app.use("/file", fileRoute);
app.use("/folder", folderRoute);
app.use("/subscription", subscriptionRoute);
app.use("/user-subscription", userSubscriptionRoute);
app.use("/invitation-request", invitationRequestRoute);
app.use("/sharedstorage-space", sharedStorageSpaceRoute);
app.use("/right", rightRoute);
app.use("/country", countryRoute);
app.use('/user-invitation', userInvitationRoute);
app.use('/stripe', stripeRoute);


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
cron.schedule('0 2 * * *', async () => {
  try {
    console.log("Running the billing cron job...");

    // Récupérer les abonnements actifs et inactifs
    const userSubscriptions = await UserSubscription.findAll({
      where: { 
        status: ["active", "inactive"] // On récupère les abonnements "active" et "inactive"
      },
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

    // Parcourir chaque abonnement pour vérifier si une nouvelle facture doit être créée ou terminer l'abonnement
    for (let userSubscription of userSubscriptions) {
      const { subscription, user, startDate, status } = userSubscription;
      const { duration } = subscription;

      const nextBillingDate = new Date(startDate);
      nextBillingDate.setMonth(nextBillingDate.getMonth() + duration);

      if (today >= nextBillingDate) {
        if (status === "active") {
          // Si l'abonnement est actif, on crée une nouvelle facture
          await createInvoice(user, subscription, userSubscription);

          // Mettre à jour la date de début pour refléter la nouvelle période de facturation
          await userSubscription.update({
            startDate: today,
          });

          console.log(`Invoice created for user: ${user.email}`);
        } else if (status === "inactive") {
          // Si l'abonnement est inactif, on le termine
          await userSubscription.update({
            status: "ended",
          });

          console.log(`Subscription ended for user: ${user.email}`);
        }
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
