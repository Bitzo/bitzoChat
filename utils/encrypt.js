const crypto = require('crypto');
const _ = require('lodash');
const { salt } = require('../config/config');

const encryptUtil = {};

encryptUtil.encrypt = (data) => {
  let key = salt + _.random(10000, 100000);
  key = _.shuffle(key.split('')).join('');
  const cip = crypto.createCipher('aes-256-cfb', key);
  let encrypted = '';
  encrypted = cip.update(data, 'utf8', 'hex');
  return { encrypted, key };
};

encryptUtil.decrypt = (encrypted, key) => {
  let decrypted = '';
  const decipher = crypto.createDecipher('aes-256-cfb', key);
  decrypted = decipher.update(encrypted, 'hex', 'utf8');
  return decrypted;
};

module.exports = encryptUtil;
