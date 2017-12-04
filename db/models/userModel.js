const Sequelize = require('sequelize');
const sequelize = require('../db');

const user = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    unique: true,
  },
  username: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  gender: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 1,
    get() {
      return this.getDataValue('gender') ? '男' : '女';
    },
    set(gender) {
      let g = gender;
      if (gender === '男' || gender === '女') {
        g = (gender === '男') ? 1 : 0;
      }
      this.setDataValue('gender', g);
    },
  },
  descrption: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  timestamps: false,
});

module.exports = user;
