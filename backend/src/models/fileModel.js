const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Subscription = require("./subscriptionModel");
const UserSubscription = require("./userSubscriptionModel");
const Folder = require("./folderModel");

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
            allowNull: false,
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Folder,
                key: "id",
            },
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
File.belongsTo(Folder, { foreignKey: "parentId", as: "parent" });
Folder.hasMany(File, { foreignKey: "parentId", as: "files" });

module.exports = File;
