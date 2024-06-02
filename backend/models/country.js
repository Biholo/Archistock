const Sequelize = require('sequelize');
const sequelize = require('../db/db');

const Country = sequelize.define('country', {
    idcountry: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(45),
        allowNull: true
    }
    }, {
    sequelize,
    tableName: 'country',
    timestamps: false
});

module.exports = Country;