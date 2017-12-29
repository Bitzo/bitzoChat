const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * 生成JWT
 * @param {Object} data 需要放入token的数据
 * @param {String} JWT 生成的token
 */
function getJWT(userInfo) {
  return jwt.sign({
    data: userInfo,
  }, config.secret, {
    expiresIn: '30m',
  });
}

/**
 * 验证token有效性
 * @param {String} token
 * @return {Object} {}
 */
function verifyJWT(token) {
  return jwt.verify(token, config.secret);
}

module.exports = {
  getJWT,
  verifyJWT,
};
