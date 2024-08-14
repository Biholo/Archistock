const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const User = require("./userModel");
const Subscription = require("./subscriptionModel");
const SharedStorageSpace = require("./sharedStorageSpaceModel");

const UserSubscription = sequelize.define(
    "userSubscription",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "New storage",
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sharedStorageSpaceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: SharedStorageSpace,
                key: "id",
            },  
        },
        subscriptionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        validate: {
            userOrStorageSpaceExclusive() {
                if ((this.userId === null && this.sharedStorageSpaceId === null) ||
                    (this.userId !== null && this.sharedStorageSpaceId !== null)) {
                    throw new Error("Either userId or sharedStorageSpaceId must be set, but not both.");
                }
            },
        },
    }
);

module.exports = UserSubscription;

// Relations
UserSubscription.belongsTo(User, { foreignKey: "userId" });
User.hasMany(UserSubscription, { foreignKey: "userId" });
UserSubscription.belongsTo(Subscription, { foreignKey: "subscriptionId" });
Subscription.hasMany(UserSubscription, { foreignKey: "subscriptionId" });

