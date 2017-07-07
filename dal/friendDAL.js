/**
 * @Author: bitzo
 * @Date: 2017/7/6 13:51
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/6 13:51
 * @Function:
 */
var db = require(APP_PATH + '/db/db');

exports.queryRelation = function (data, callback) {
    var sql = 'select * from friends where 1=1';

    for (let key in data) {
        if (data[key] !== '') {
            sql += ' and ' + key + " = '" + data[key] + "'";
        }
    }

    console.log('查询关系信息：' + sql);

    db.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            errAlert('数据库连接失败！' + err, 'userDAL.queryUsers()');
            return callback(true, '连接数据库失败');
        }

        connection.query(sql, function(err, results) {
            connection.release();

            if (err) {
                errAlert('sql语句：' + err, 'userDAL.queryUsers()');
                return callback(true, '查询失败');
            }
            return callback(false, results);
        });
    });
};

//删除关系信息
exports.deleteRelation = function (accountID, friendID, callback) {
    let sql = "delete from relationship where accountID = '" + accountID + "' and friendID = '" + friendID + "'"

    console.log('修改关系信息：' + sql);

    db.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            errAlert('数据库连接失败！' + err, 'userDAL.queryUsers()');
            return callback(true, '连接数据库失败');
        }

        connection.query(sql, function(err, results) {
            connection.release();

            if (err) {
                errAlert('sql语句：' + err, 'userDAL.queryUsers()');
                return callback(true, '修改失败');
            }
            return callback(false, results);
        });
    });
};

/**
 * 新增用户
 * @param userInfo
 * @param callback
 */
exports.addRelation = function (accountID, friendID, callback) {
    let sql = "INSERT INTO relationship set accountID = '" + accountID + "', friendID = '" + friendID + "'";

    console.log('增加关系信息：' + sql);

    db.mysqlPool.getConnection(function(err, connection) {
        if (err) {
            errAlert('数据库连接失败！' + err, 'userDAL.addUserInfo()');
            return callback(true, '连接数据库失败');
        }

        connection.query(sql, function(err, results) {
            connection.release();

            if (err) {
                errAlert('sql语句：' + err, 'userDAL.addUserInfo()');
                return callback(true, '增加用户失败');
            }
            return callback(false, results);
        });
    });
};

