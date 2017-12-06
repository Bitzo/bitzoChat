const _ = require('lodash');
const User = require('../db/models/userModel');

const userDAL = {};

userDAL.addUser = async (userInfo) => {
  // User
  //   .create({
  //     username: userInfo.username,
  //     password: userInfo.password,
  //     gender: userInfo.gender,
  //     descrption: userInfo.descrption,
  //     isActive: userInfo.isActive,
  //   })
  //   .then((p) => {
  //     console.log(`Created User: ${JSON.stringify(p)}`);
  //   })
  //   .catch((err) => {
  //     console.log(`Created User Failed: ${err}`);
  //   });

  // if use async/await, use try/catch handle error.
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
    const users = await User.findAll({
      where: userInfo,
      attributes: ['id', 'username', 'gender', 'descrption', 'isActive'],
    });
    users.forEach((user) => {
      console.log(`Query Users: ${user}`);
    });
    return users;
  } catch (err) {
    console.log(`Query Users Error: ${err}`);
    return false;
  }
};

module.exports = userDAL;
