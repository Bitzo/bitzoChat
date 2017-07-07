/**
 * @Author: bitzo
 * @Date: 2017/7/6 13:58
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/6 13:58
 * @Function:
 */

let friendDAL = require(APP_PATH + '/dal/friendDAL');

exports.queryRelation = function (data, callback) {
    let queryData = {
        'accountID': data.accountID || '',
        'friendID': data.friendID || '',
    };

    friendDAL.queryRelation(queryData, function (err, results) {
        if (err) {
            return callback(true, results);
        }

        return callback(false, results);
    })
};

exports.addRelation = function (accountID, friendID, callback) {

    friendDAL.addRelation(accountID, friendID, function (err, results) {
        if (err) {
            return callback(true, results);
        }

        return callback(false, results);
    })
};

exports.deleteRelation = function (accountID, friendID, callback) {

    friendDAL.deleteRelation(accountID, friendID, function (err, results) {
        if (err) {
            return callback(true, results);
        }

        return callback(false, results);
    })
};