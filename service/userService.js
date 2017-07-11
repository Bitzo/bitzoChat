/**
 * @Author: bitzo
 * @Date: 2017/7/5 14:08
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/5 14:08
 * @Function:
 */


/**
 * @Author: bitzo
 * @Date: 2017/6/16 18:09
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/6/16 18:09
 * @Function:
 */

var userDAL = require(APP_PATH + '/dal/userDAL');

/**
 * data: {
 *  [accountID] : 123123,
 *  [username]: 'name',
 *  [password]: 'password',
 *  [gender]: 1,
 *  [phoneNumber]: 1565278146,
 *  [type]: 1,
 *  [recommendNeeded]: 1,
 *  [openid]: ''
 * }
 */
exports.queryUsers = function (data, callback) {
    let queryData = {
        'accountID': data.accountID || '',
        'username': data.username || '',
        'password': data.password || '',
        'gender': data.gender || '',
        'phoneNumber': data.phoneNumber || '',
        'avatar': data.avatar || '',
    };

    userDAL.queryUsers(queryData, function (err, results) {
        if (err) {
            return callback(true, results);
        }

        return callback(false, results);
    })

};

/**
 * 新增用户信息
 * userdata：{
 *  [username]: 'name',
 *  [password]: 'password',
 *  [gender]: 1,
 *  [phoneNumber]: 1565278146,
 *  [type]: 1,
 *  [recommendNeeded]: 1,
 *  [openid]: ''
 * }
 */
exports.addUserInfo = function (userdata, callback) {
    let addInfo = {
        'username': userdata.username || '',
        'password': userdata.password || '',
        'gender': userdata.gender || '',
        'phoneNumber': userdata.phoneNumber || '',
        'avatar': userdata.avatar || '',
    };

    userDAL.addUserInfo(addInfo, function (err, results) {
        if (err) {
            return callback(true, results);
        }

        return callback(false, results);
    })
};


exports.updateUserInfo = function (accountID ,userdata, callback) {
    let addInfo = {
        'username': userdata.username || '',
        'password': userdata.password || '',
        'gender': userdata.gender || '',
        'phoneNumber': userdata.phoneNumber || '',
        'avatar': userdata.avatar || '',
    };

    userDAL.updateUserInfo(accountID, addInfo, function (err, results) {
        if (err) {
            return callback(true, results);
        }

        return callback(false, results);
    })
};
