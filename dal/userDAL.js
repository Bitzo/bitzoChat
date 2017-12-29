const _ = require('lodash');
const User = require('../db/models/userModel');

async function addUser(userInfo) {
  try {
    let u = await User.create(userInfo);
    console.log(`Created User: ${JSON.stringify(u)}`);
    u = JSON.parse(JSON.stringify(u));
    return _.omit(u, ['key', 'password']);
  } catch (err) {
    console.log(`Created User Failed: ${err}`);
    return false;
  }
}

async function queryUsers(userInfo) {
  try {
    let users = await User.findAll({
      where: userInfo,
    });
    users = JSON.parse(JSON.stringify(users));
    return users;
  } catch (err) {
    console.log(`Query Users Error: ${err}`);
    return false;
  }
}

async function updateUser(userInfo) {
  try {
    let result = await User.update(
      _.omit(userInfo, 'id'),
      {
        where: {
          id: userInfo.id,
        },
      },
    );
    [result] = result;
    return result;
  } catch (err) {
    console.log(`Update User Error: ${err}`);
    return false;
  }
}

module.exports = {
  addUser,
  queryUsers,
  updateUser,
};
