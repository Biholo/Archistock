const sequelize = require("../database/database");

exports.createAllTable = async (req, res) => {
  try {
    await sequelize.sync({ alter: true });
    res.status(200).json("All good");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};
