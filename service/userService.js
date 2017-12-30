const userDAL = require('../dal/userDAL');
const _ = require('lodash');
const dv = require('../utils/dataValidator');

/**
 * service_addUser
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
}

/**
 * service_queryUsers
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
}

/**
 * service_updateUser
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
 * @return {boolean|array} 更新成功返回对象数组，查询失败则返回false
 */
async function updateUser(userInfo) {
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
}

module.exports = {
  addUser,
  queryUsers,
  updateUser,
};
