const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");
const UserSubscription = require("./userSubscriptionModel");

const Folder = sequelize.define(
    "folder",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "folder",
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

Folder.belongsTo(Folder, { foreignKey: "parentId", as: "parent" });
Folder.hasMany(Folder, { foreignKey: "parentId", as: "children" });
Folder.belongsTo(UserSubscription, { foreignKey: "userSubscriptionId", as: "usersubscription" });
UserSubscription.hasMany(Folder, { foreignKey: "userSubscriptionId", as: "folders" });

module.exports = Folder;
