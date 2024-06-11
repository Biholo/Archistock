const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const databaseRoute = require("./src/routes/databaseRoute");
const userRoute = require("./src/routes/userRoute");
const companyRoute = require("./src/routes/companyRoute");
const fileRoute = require("./src/routes/fileRoute");
const subscriptionRoute = require("./src/routes/subscriptionRoute");

app.use("/database", databaseRoute);
app.use("/user", userRoute);
app.use("/company", companyRoute);
app.use("/file", fileRoute);
app.use("/subscription", subscriptionRoute);

app.listen(8000, function () {
  console.log("Serveur ouvert: ");
});
