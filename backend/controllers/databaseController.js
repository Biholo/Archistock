const sequelize = require("../database/database");
const User = require("../models/userModel");
const Address = require("../models/addressModel");
const Company = require("../models/companyModel");
const Subscription = require("../models/subscriptionModel");
const UserCompany = require("../models/userCompanyModel");
const UserSubscription = require("../models/userSubscriptionModel");
const File = require("../models/fileModel");
const Country = require("../models/countryModel");




exports.createAllTable = async (req, res) => {
  try {
    await sequelize.sync({ alter: true });
    res.status(200).json("All good");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};
