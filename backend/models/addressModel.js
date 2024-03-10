const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");


const Address = sequelize.define(
    "address",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
        city: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = Address;