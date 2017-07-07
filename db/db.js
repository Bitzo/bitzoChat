/**
 * @Author: bitzo
 * @Date: 2017/7/5 14:10
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/5 14:10
 * @Function:
 */

let mysql = require('mysql'),
    config = require('../config/config'),
    dbPool = mysql.createPool(config.mysql);

exports.mysqlPool = dbPool;