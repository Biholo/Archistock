const express = require("express");
const route = express.Router();
const databaseController = require("../controllers/databaseController");

route.get("/createTableAddress", databaseController.createTableAddress);
route.get("/createTableCompany", databaseController.createTableCompany);
route.get("/createTableUser", databaseController.createTableUser);
route.get("/createTableSubscribe", databaseController.createTableSubscribe);
route.get("/createTableSubscription", databaseController.createTableSubscription);
route.get("/createTableFile", databaseController.createTableFile);
route.get("/createAllTable", databaseController.createAllTable);

module.exports = route;
