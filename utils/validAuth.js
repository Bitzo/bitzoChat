const jwt = require('jsonwebtoken');
const config = require('../config/config');

function getJWT(userInfo) {
  return jwt.sign({
    data: userInfo,
  }, config.secret, {
    expiresIn: '30m',
  });
}

function verifyJWT(token) {
  return jwt.verify(token, config.secret);
}

module.exports = {
  getJWT,
  verifyJWT,
};
