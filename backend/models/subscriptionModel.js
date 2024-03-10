const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Subscribe = require("./subscribeModel");
const User = require("./userModel");

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
        space: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        subscribeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Subscribe,
                key: "id",
            },
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: User,
                key: "id",
            },
        },
        
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = Subscription;
