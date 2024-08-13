const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const User = require("./userModel");
const Company = require("./companyModel");
const SharedStorageSpace = require("./sharedStorageSpaceModel");

const Right = sequelize.define(
    "right",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        roles: {
            type: DataTypes.ENUM("owner", "admin", "employee", "manager"),
            allowNull: false,
        },
        acceptedRole: {
            type: DataTypes.ENUM("owner", "admin", "employee", "manager"),
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sharedStorageSpaceId: {
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
Right.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Right, { foreignKey: "userId" });
Right.belongsTo(Company, { foreignKey: "companyId" });
Company.hasMany(Right, { foreignKey: "companyId" });
Right.belongsTo(SharedStorageSpace, { foreignKey: "sharedStorageSpaceId" });
SharedStorageSpace.hasMany(Right, { foreignKey: "sharedStorageSpaceId" });

module.exports = Right;
