const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");


const Subscribe = sequelize.define(
    "subscribe",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        space: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = Subscribe;