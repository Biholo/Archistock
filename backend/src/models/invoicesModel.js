const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");
const User = require("./userModel");
const UserSubscription = require("./userSubscriptionModel");

const Invoice = sequelize.define(
    "invoice",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
        },
        invoiceDate: {
            type: DataTypes.DATE,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "id",
            },
        },
        userSubscriptionId: {
            type: DataTypes.INTEGER,
            references: {
                model: UserSubscription,
                key: "id",
            },
        }
    },
    {
        tableName: "invoices",
    }
)

User.hasMany(Invoice, { foreignKey: "userId", as: "invoices" });    
Invoice.belongsTo(User, { foreignKey: "userId", as: "user" });

UserSubscription.hasMany(Invoice, { foreignKey: "userSubscriptionId", as: "invoices" });
Invoice.belongsTo(UserSubscription, { foreignKey: "userSubscriptionId", as: "usersubscription" });

module.exports = Invoice;