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
    let decodeData = '';
    try {
        decodeData = jwt.verify(token, secret);
    }catch (e) {
        decodeData = '';
    }finally {
        return decodeData;
    }
};
