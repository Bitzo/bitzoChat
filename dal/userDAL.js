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
    const u = await User.create({
      username: userInfo.username,
      password: userInfo.password,
      gender: userInfo.gender,
      descrption: userInfo.descrption,
      isActive: userInfo.isActive,
    });

    console.log(`Created User: ${JSON.stringify(u)}`);
    return true;
  } catch (err) {
    console.log(`Created User Failed: ${err}`);
    return false;
  }
};

module.exports = userDAL;
