const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const User = require("./userModel");
const Subscription = require("./subscriptionModel");

const UserSubscription = sequelize.define(
    "userSubscription",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        subscriptionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = UserSubscription;

//relations
UserSubscription.belongsTo(User, { foreignKey: "userId" });
User.hasMany(UserSubscription, { foreignKey: "userId" });
UserSubscription.belongsTo(Subscription, { foreignKey: "subscriptionId" });
Subscription.hasMany(UserSubscription, { foreignKey: "subscriptionId" });