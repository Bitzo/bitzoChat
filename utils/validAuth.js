const jwt = require('jsonwebtoken');
const config = require('../config/config');

function getJWT(username) {
  return jwt.sign({
    data: {
      username,
    },
  }, config.secret, {
    expiresIn: '3s',
  });
}

function verifyJWT(token) {
  return jwt.verify(token, config.secret);
}

module.exports = {
  getJWT,
  verifyJWT,
};
