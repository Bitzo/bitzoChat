const userDAL = require('../dal/userDAL');
const _ = require('lodash');
const dv = require('../utils/dataValidator');

const userService = {};

userService.addUser = async (userInfo) => {
  const info = {};
  _.forIn(userInfo, (value, key) => {
    if (dv.isParamsValid({ value })) {
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
    if (dv.isParamsValid({ value })) {
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

userService.updateUser = async (userInfo) => {
  const info = {};
  _.forIn(userInfo, (value, key) => {
    if (dv.isParamsValid({ value })) {
      info[key] = value;
    }
  });
  try {
    return await userDAL.updateUser(info);
  } catch (err) {
    console.log(`Update User Failed: ${err}`);
    return false;
  }
};

module.exports = userService;
