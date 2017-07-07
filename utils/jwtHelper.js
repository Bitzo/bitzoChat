/**
 * @Author: bitzo
 * @Date: 2017/6/16 15:43
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/6/16 15:43
 * @Function: generate JWT
 */

let jwt = require('jsonwebtoken'),
    config = require('../config/config');

exports.getToken = function (data) {
    return token = jwt.sign(data, config.jwt_secret, { expiresIn: '1d' });
};

exports.tokenDecode = function (token, secret) {
    return decodedData = jwt.verify(token, secret);
};
