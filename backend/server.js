const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const databaseRoute = require("./routes/databaseRoute");
const userRoute = require("./routes/userRoute");
const addressRoute = require("./routes/addressRoute");
const subscribeRoute = require("./routes/subscribeRoute");

app.use("/database", databaseRoute);
app.use("/user", userRoute);
app.use("/address", addressRoute);
app.use("/subscribe", subscribeRoute);

app.listen(8000, function () {
  console.log("Serveur ouvert: ");
});
