const _ = require('lodash');
const User = require('../db/models/userModel');

const userDAL = {};

userDAL.addUser = async (userInfo) => {
  try {
    let u = await User.create(userInfo);
    console.log(`Created User: ${JSON.stringify(u)}`);
    u = JSON.parse(JSON.stringify(u));
    return _.omit(u, ['key', 'password']);
  } catch (err) {
    console.log(`Created User Failed: ${err}`);
    return false;
  }
};

userDAL.queryUsers = async (userInfo) => {
  try {
    let users = await User.findAll({
      where: userInfo,
    });
    users.forEach((user) => {
      console.log(`Query Users: ${user}`);
    });
    users = JSON.parse(JSON.stringify(users));
    return users;
  } catch (err) {
    console.log(`Query Users Error: ${err}`);
    return false;
  }
};

module.exports = userDAL;
