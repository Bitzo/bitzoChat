const Sequelize = require('sequelize');
const sequelize = require('../db');

const relationship = sequelize.define('relationship', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  uID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  fID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  createTime: Sequelize.DATE,
  updateTime: Sequelize.DATE,
}, {
  createdAt: 'createTime',
  updatedAt: 'updateTIme',
  tableName: 'relationship',
});

module.exports = relationship;
