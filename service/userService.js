const userDAL = require('../dal/userDAL');

const userService = {};

userService.addUser = async (userInfo) => {
  // 检查userinfo， 确保每个属性都是合法的符合预期的
  // 不过由于使用了sequelize
  // 似乎也可以把这种值判断直接写进model里，通过组件自动处理 ？
  try {
    return await userDAL.addUser(userInfo);
  } catch (err) {
    console.log(`Add User Failed: ${err}`);
    return false;
  }
};

module.exports = userService;
