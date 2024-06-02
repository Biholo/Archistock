const Sequelize = require('sequelize');
const sequelize = require('../db/db');
const Address = require('./address');

// idcompany, name, idaddress
const Company = sequelize.define('company', {
    idcompany: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    idaddress: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'address',
            key: 'idaddress'
        }
    }
    }, {
    sequelize,
    tableName: 'company',
    timestamps: false
});

Company.belongsTo(Address, {foreignKey: 'idaddress'});
Address.hasMany(Company, {foreignKey: 'idaddress'});

module.exports = Company;