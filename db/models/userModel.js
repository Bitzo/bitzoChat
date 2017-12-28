const Sequelize = require('sequelize');
const sequelize = require('../db');

const user = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 20],
    },
  },
  email: {
    type: Sequelize.STRING(50),
    allowNull: true,
    isEmail: true,
  },
  password: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  key: {
    type: Sequelize.STRING(20),
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
  birthday: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  descrption: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 1,
  },
  avatar: {
    type: Sequelize.CHAR(100),
    allowNull: true,
    defaultValue: '/img/avatarDefault.jpg',
  },
}, {
  timestamps: false,
});

module.exports = user;
