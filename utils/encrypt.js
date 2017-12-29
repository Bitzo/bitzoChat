const crypto = require('crypto');
const _ = require('lodash');
const { salt } = require('../config/config');

/**
 * 数据加密
 * @param {String} data 需要加密的数据
 * @return {Object} {encrypted, key}
 */
function encrypt(data) {
  let key = salt + _.random(10000, 100000);
  key = _.shuffle(key.split('')).join('');
  const cip = crypto.createCipher('aes-256-cfb', key);
  let encrypted = '';
  encrypted = cip.update(data, 'utf8', 'hex');
  return { encrypted, key };
}

/**
 * 数据解密
 * @param {String} encrypted 需要解密的数据
 * @param {String} key 密钥
 * @return {String} decrypted
 */
function decrypt(encrypted, key) {
  let decrypted = '';
  const decipher = crypto.createDecipher('aes-256-cfb', key);
  decrypted = decipher.update(encrypted, 'hex', 'utf8');
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};
