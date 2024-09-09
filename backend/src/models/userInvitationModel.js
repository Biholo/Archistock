const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const User = require("./userModel");
const Company = require("./companyModel");

const UserInvitation = sequelize.define(
    "userInvitation",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        invitedEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        invitedByUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: "id",
            },
        },
        invitedByCompanyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Company,
                key: "id",
            },
        },
        isAccepted: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: null,
        },
        acceptedRole: {
            type: DataTypes.ENUM("owner", "admin", "employee", "manager"),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "accepted", "cancelled"),
            allowNull: false,
            defaultValue: "pending",
        }
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

// Define relationships
UserInvitation.belongsTo(User, { foreignKey: "invitedByUserId", as: "invitedBy" });
User.hasMany(UserInvitation, { foreignKey: "invitedByUserId", as: "userInvitations" });

UserInvitation.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(UserInvitation, { foreignKey: "userId", as: "invitations" });

UserInvitation.belongsTo(Company, { foreignKey: "invitedByCompanyId", as: "invitedByCompany" });
Company.hasMany(UserInvitation, { foreignKey: "invitedByCompanyId", as: "invitations" });

module.exports = UserInvitation;
