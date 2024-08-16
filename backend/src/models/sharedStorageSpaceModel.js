const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const companyModel = require("./companyModel");

const SharedStorageSpace = sequelize.define(
    "sharedStorageSpace",
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
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: companyModel,
                key: "id",
            },
        },
   
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = SharedStorageSpace;

//relations
SharedStorageSpace.belongsTo(companyModel, { foreignKey: "companyId" });
companyModel.hasMany(SharedStorageSpace, { foreignKey: "companyId" });
