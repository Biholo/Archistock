const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors(
  origin = "*",
));
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
app.use('/Images', express.static('./Images'));

app.listen(8000, function () {
  console.log("Serveur ouvert: ");
});
