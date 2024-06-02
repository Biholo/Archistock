const Sequelize = require('sequelize');
const sequelize = require('../db/db');
const Address = require('./address');
const Company = require('./company');

// iduser, firstname, lastname, email, phone, idaddress, idcompany
// company relation through usercompany table 

const User = sequelize.define('user', {
    iduser: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    firstname: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    lastname: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    email: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    phone: {
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
    },
    }, {
    sequelize,
    tableName: 'user',
    timestamps: false
});

User.belongsTo(Address, {foreignKey: 'idaddress'});
Address.hasMany(User, {foreignKey: 'idaddress'});

User.belongsToMany(Company, {through: 'usercompany', foreignKey: 'iduser'});
Company.belongsToMany(User, {through: 'usercompany', foreignKey: 'idcompany'});

module.exports = User;
