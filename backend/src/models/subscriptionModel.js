const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Subscription = sequelize.define(
    "subscription",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        size: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        features: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },        
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = Subscription;
