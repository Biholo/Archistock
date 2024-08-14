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
            validate: {
                cannotBeBothNull(value) {
                    if (value === null && this.sharedStorageSpaceId === null) {
                        throw new Error('CompanyId and SharedStorageSpaceId cannot both be null.');
                    }
                },
                cannotBeBothNonNull(value) {
                    if (value !== null && this.sharedStorageSpaceId !== null) {
                        throw new Error('CompanyId and SharedStorageSpaceId cannot both be non-null.');
                    }
                }
            }
        },
        sharedStorageSpaceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                cannotBeBothNull(value) {
                    if (value === null && this.companyId === null) {
                        throw new Error('CompanyId and SharedStorageSpaceId cannot both be null.');
                    }
                },
                cannotBeBothNonNull(value) {
                    if (value !== null && this.companyId !== null) {
                        throw new Error('CompanyId and SharedStorageSpaceId cannot both be non-null.');
                    }
                }
            }
        },
    },
    {
        sequelize,
        freezeTableName: true,
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
