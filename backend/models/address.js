const Sequelize = require('sequelize');
const sequelize = require('../db/db');
const Country = require('./country');
// idaddress, street, street2, zip, city, idcountry

const Address = sequelize.define('address', {
    idaddress: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    street: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    street2: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    zip: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    city: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    idcountry: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'country',
            key: 'idcountry'
        }
    }
    }, {
    sequelize,
    tableName: 'address',
    timestamps: false
});

Address.belongsTo(Country, {foreignKey: 'idcountry'});
Country.hasMany(Address, {foreignKey: 'idcountry'});

module.exports = Address;