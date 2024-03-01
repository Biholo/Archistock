const sequelize = require("../database/database");

exports.createAllTable = async (req, res) => {
  await sequelize.sync({ alter: true });
  res.status(200).json("Tables creer");
};
