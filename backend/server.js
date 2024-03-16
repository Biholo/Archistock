const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const databaseRoute = require("./routes/databaseRoute");
const userRoute = require("./routes/userRoute");
const addressRoute = require("./routes/addressRoute");
const subscribeRoute = require("./routes/subscribeRoute");
const subscribtionRoute = require("./routes/subscriptionRoute");
const fileRoute = require("./routes/fileRoute");
const companyRoute = require("./routes/companyRoute");

app.use("/database", databaseRoute);
app.use("/user", userRoute);
app.use("/address", addressRoute);
app.use("/subscribe", subscribeRoute);
app.use("/subscription", subscribtionRoute);
app.use("/file", fileRoute);
app.use("/company", companyRoute);

app.listen(8000, function () {
  console.log("Serveur ouvert: ");
});
