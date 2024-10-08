const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Address = require("./addressModel");

const Company = sequelize.define(
    "company",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        addressId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Address,
                key: "id",
            },
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = Company;

//relations
Company.belongsTo(Address, { foreignKey: 'addressId', as: 'address' });
