const Sequelize = require('sequelize');
const sequelize = require('../db/db');
const Subscription = require('./subscription');
const User = require('./user');

// idusersubscription, iduser, idsubscription, startdate 

const UserSubscription = sequelize.define('usersubscription', {
    idusersubscription: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    iduser: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'user',
            key: 'iduser'
        }
    },
    idsubscription: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'subscription',
            key: 'idsubscription'
        }
    },
    startdate: {
        type: Sequelize.DATEONLY,
        allowNull: true
    }
    }, {
    sequelize,
    tableName: 'usersubscription',
    timestamps: false
});

UserSubscription.belongsTo(User, {foreignKey: 'iduser'});
User.hasMany(UserSubscription, {foreignKey: 'iduser'});
UserSubscription.belongsTo(Subscription, {foreignKey: 'idsubscription'});
Subscription.hasMany(UserSubscription, {foreignKey: 'idsubscription'});

module.exports = UserSubscription;