const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");


const User = sequelize.define(
    "user",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
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
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        street: {
            type: DataTypes.TEXT,
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
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = User;
