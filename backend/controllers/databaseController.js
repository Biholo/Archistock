const sequelize = require("../database/database");
const Address = require("../models/addressModel");
const Company = require("../models/companyModel");
const File = require("../models/fileModel");
const Subscribe = require("../models/subscribeModel");
const Subscription = require("../models/subscriptionModel");
const User = require("../models/userModel");

exports.createTableAddress = async (req, res) => {
  await Address.sync();
  res.status(200).json("Table adresse créer");
};

exports.createTableCompany = async (req, res) => {
  await Company.sync();
  res.status(200).json("Table company créer");
};

exports.createTableUser = async (req, res) => {
  await User.sync();
  res.status(200).json("Table user créer");
};

exports.createTableSubscribe = async (req, res) => {
  await Subscribe.sync();
  res.status(200).json("Table subscribe créer");
};

exports.createTableSubscription = async (req, res) => {
  await Subscription.sync();
  res.status(200).json("Table subscription créer");
};

exports.createTableFile = async (req, res) => {
  await File.sync();
  res.status(200).json("Table file créer");
};

exports.createAllTable = async (req, res) => {
  await sequelize.sync({ alter: true });
  res.status(200).json("Tables creer");
};
