const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const Account = sequelize.define('Account', {
  accountId: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  appSecretToken: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => crypto.randomBytes(32).toString('hex')
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Account;
