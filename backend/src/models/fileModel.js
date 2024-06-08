const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Subscription = require("./userSubscriptionModel");

const File = sequelize.define(
    "file",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        format: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        subscriptionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Subscription,
                key: "id",
            },
        },
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = File;

//relations
File.belongsTo(Subscription, { foreignKey: "subscriptionId" });
Subscription.hasMany(File, { foreignKey: "subscriptionId" });


