const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Country = require("./countryModel");

const Address = sequelize.define(
    "address",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Country,
                key: "id",
            },
        },
        postalCode: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = Address;

//relations
Address.belongsTo(Country, { foreignKey: "countryId", as: "country" });