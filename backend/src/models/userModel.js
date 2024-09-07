const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const Address = require("./addressModel");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      length: 255,
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("admin"),
      defaultValue: null,
      allowNull: true,
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Address,
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.password && user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

module.exports = User;

//relations one user have one adress
User.belongsTo(Address, { foreignKey: "addressId", as: "address" });
Address.hasOne(User, { foreignKey: "addressId", as: "user" });
