const Sequelize = require('sequelize');
const sequelize = require('../db/db');

// idsubscription, name, price, duration, features

const Subscription = sequelize.define('subscription', {
    idsubscription: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
    },
    duration: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    features: {
        type: Sequelize.STRING(45),
        allowNull: true
    }
    }, {
    sequelize,
    tableName: 'subscription',
    timestamps: false
});

module.exports = Subscription;