const Sequelize = require('sequelize');
const sequelize = require('../db/db');
const UserSubscription = require('./usersubscription');

// idfile, name, path, size, type, date, idusersubscription

const File = sequelize.define('file', {
    idfile: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    path: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    size: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    type: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    idusersubscription: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'usersubscription',
            key: 'idusersubscription'
        }
    }
    }, {
    sequelize,
    tableName: 'file',
    timestamps: false
});

File.belongsTo(UserSubscription, {foreignKey: 'idusersubscription'});
UserSubscription.hasMany(File, {foreignKey: 'idusersubscription'});

module.exports = File;