/**
 * @Author: bitzo
 * @Date: 2017/7/5 14:15
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/5 14:15
 * @Function:
 */

var config = require('../config/config'),
    crypto = require('crypto'),
    hasha = require('hasha');

exports.hash = function (pwd) {
    return hasha(pwd);
};

exports.pwdDecode = function (password) {

};