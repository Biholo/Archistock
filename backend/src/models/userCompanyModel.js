const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const User = require("./userModel");
const Company = require("./companyModel");

const UserCompany = sequelize.define(
    "userCompany",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: "id",
            },
        },
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Company,
                key: "id",
            },
        },
        roles: {
            type: DataTypes.ENUM("admin", "user"),
            defaultValue: "user",
            allowNull: false,
        }
    },
    {
        sequelize,
        freezeTableName: true,
    }
);

module.exports = UserCompany;

//relations
UserCompany.belongsTo(User, { foreignKey: "userId" });
User.hasMany(UserCompany, { foreignKey: "userId" });
