const Sequelize = require('sequelize');
const config = require('../config/config').mysql;

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 10,
    min: 0,
    idle: 30000,
  },
});

module.exports = sequelize;
