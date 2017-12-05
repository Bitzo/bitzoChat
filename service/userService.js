const userDAL = require('../dal/userDAL');
const _ = require('lodash');

const userService = {};

userService.addUser = async (userInfo) => {
  // 检查userinfo， 确保每个属性都是合法的符合预期的
  // 不过由于使用了sequelize
  // 似乎也可以把这种值判断直接写进model里，通过组件自动处理 ？
  const info = {};
  _.forIn(userInfo, (value, key) => {
    if (!(value === '' || value === null || value === undefined)) {
      info[key] = value;
    }
  });
  try {
    return await userDAL.addUser(userInfo);
  } catch (err) {
    console.log(`Add User Failed: ${err}`);
    return false;
  }
};

userService.queryUsers = async (userInfo) => {
  const info = {};
  _.forIn(userInfo, (value, key) => {
    if (!(value === null || value === undefined || value === '')) {
      info[key] = value;
    }
  });
  try {
    return await userDAL.queryUsers(info);
  } catch (err) {
    console.log(`Query User Failed: ${err}`);
    return false;
  }
};

module.exports = userService;
