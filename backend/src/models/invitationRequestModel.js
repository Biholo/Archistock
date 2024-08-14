const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const User = require("./userModel");
const Company = require("./companyModel");
const SharedStorageSpace = require("./sharedStorageSpaceModel");

const InvitationRequest = sequelize.define(
    "invitationRequest",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM("invitation", "request"),
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Company,
                key: "id",
            },
        },
        sharedStorageSpaceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: SharedStorageSpace,
                key: "id",
            },
        },
        status: {
            type: DataTypes.ENUM("pending", "accepted", "declined", "cancelled"),
            allowNull: false,
        },
        acceptedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        validate: {
            cannotBeBothNullOrBothNonNull() {
                const companyId = this.companyId === undefined ? null : this.companyId;
                const sharedStorageSpaceId = this.sharedStorageSpaceId === undefined ? null : this.sharedStorageSpaceId;

                if ((companyId === null && sharedStorageSpaceId === null) ||
                    (companyId !== null && sharedStorageSpaceId !== null)) {
                    throw new Error('Either companyId or sharedStorageSpaceId must be set, but not both.');
                }
            }
        }
    }
);


// Relations
InvitationRequest.belongsTo(User, { foreignKey: "userId" });
User.hasMany(InvitationRequest, { foreignKey: "userId" });
InvitationRequest.belongsTo(Company, { foreignKey: "companyId" });
Company.hasMany(InvitationRequest, { foreignKey: "companyId" });
InvitationRequest.belongsTo(SharedStorageSpace, { foreignKey: "sharedStorageSpaceId" });
SharedStorageSpace.hasMany(InvitationRequest, { foreignKey: "sharedStorageSpaceId" });

module.exports = InvitationRequest;