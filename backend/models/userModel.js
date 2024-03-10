const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Address = require("./addressModel");
const Company = require("./companyModel");

const User = sequelize.define(
    "user",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM("admin, user"),
            defaultValue: null,
            allowNull: true,
        },
        addressId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Address,
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
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = User;
