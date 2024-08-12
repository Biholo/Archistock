const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Subscription = require("./subscriptionModel");
const UserSubscription = require("./userSubscriptionModel");

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
        userSubscriptionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: UserSubscription,
                key: "id",
            },
        },
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

File.belongsTo(UserSubscription, { foreignKey: "userSubscriptionId", as: "usersubscription" });
UserSubscription.hasMany(File, { foreignKey: "userSubscriptionId", as: "files" });

module.exports = File;
