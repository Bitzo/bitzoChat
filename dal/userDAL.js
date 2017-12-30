const _ = require('lodash');
const User = require('../db/models/userModel');

/**
 * db_addUser
 * @param {object} userInfo
 * @param {string} userInfo.username 用户名
 * @param {string} userInfo.password 密码
 * @param {string} userInfo.key 密钥
 * @param {string=} userInfo.email 邮箱
 * @param {boolean=1} userInfo.gender 性别
 * @param {date=} userInfo.birthday 生日
 * @param {string=} userInfo.descrption 个性签名
 * @param {string=1} userInfo.isActive 是否有效
 * @param {string=} userInfo.avatar 头像
 *
 * @return {boolean|object} 新增成功返回插入的数据基本信息
 *                          失败则返回false
 */
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

/**
 * db_queryUsers
 * @param {object} userInfo
 * @param {number=} userInfo.id 用户id
 * @param {string=} userInfo.username 用户名
 * @param {string=} userInfo.email 邮箱
 * @param {boolean=1} userInfo.gender 性别
 * @param {date=} userInfo.birthday 生日
 * @param {string=} userInfo.descrption 个性签名
 * @param {string=1} userInfo.isActive 是否有效
 * @param {string=} userInfo.avatar 头像
 *
 * @return {boolean|array} 查询成功返回对象数组，查询失败则返回false
 */
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

/**
 * db_updateUser
 * @param {object} userInfo
 * @param {number} userInfo.id 用户id
 * @param {string=} userInfo.password 密码
 * @param {string=} userInfo.key 密钥
 * @param {string=} userInfo.username 用户名
 * @param {string=} userInfo.email 邮箱
 * @param {boolean=1} userInfo.gender 性别
 * @param {date=} userInfo.birthday 生日
 * @param {string=} userInfo.descrption 个性签名
 * @param {string=1} userInfo.isActive 是否有效
 *
 * @return {boolean|object}
 */
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
