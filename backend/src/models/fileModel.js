const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Subscription = require("./subscriptionModel");

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

File.belongsTo(Subscription, { foreignKey: "subscriptionId", as: "subscription" });
Subscription.hasMany(File, { foreignKey: "subscriptionId", as: "files" });

module.exports = File;
