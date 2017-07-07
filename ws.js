/**
 * @Author: bitzo
 * @Date: 2017/7/7 9:13
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/7 9:13
 * @Function:
 */

let config = appRequire('config/config'),
    RedisHelper = appRequire('utils/redisHelper'),
    redisCache = new RedisHelper(),
    moment = require('moment');

let response = {
    code: '',
    data: ''
};

exports.init = function (userinfo) {
    redisCache.expire(userinfo.accountID, 0, function (err, data) {
        if(err) {
            console.log('init fail')
        }
    })
};

exports.addChat = function (userInfo, ws) {
    let accountID = userInfo.accountID,
        username = userInfo.username;

    //1. 判端之前是否有聊天，有则通知对方下线。
    redisCache.get(accountID, function (msg, data) {
        if (msg === 'OK') {
            console.log(data)
            response.code = 'chatEnd';
            ws[data.toString()].send(JSON.stringify(response));
        }
    });

    //2. 查询等待队列是否有人，有则直接匹配
    redisCache.get(config.key.waitChat, function (msg, data) {
        if (msg === 'OK' && data != accountID + ':' + username) {
            let dataInfo = data.split(':');
            let matchedAccountID = dataInfo[0],
                matchedUserName = dataInfo[1];

            //匹配成功，删除等待队列
            redisCache.expire(config.key.waitChat, 0, function (err,expireRes) {
                if (err) {
                    response.code = 'matchFail';
                    return ws[accountID.toString()].send(JSON.stringify(response));
                }
            });

            //建立聊天
            redisCache.set(accountID, matchedAccountID, function (err, setKeyRes) {
                if (err) {
                    console.log('存储redis失败!');
                    response.code = 'matchFail';
                    return ws[accountID.toString()].send(JSON.stringify(response));
                }
                //建立聊天时限
                redisCache.expire(accountID, 60*60, function (err,expireRes) {
                    if (err) {
                        console.log('设置redis过期时间错误!');
                        response.code = 'matchFail';
                        ws[accountID.toString()].send(JSON.stringify(response));
                    }

                    let data = {
                        accountID: accountID,
                        username: username
                    };

                    //通知被匹配到的用户
                    response.code = 'matchSuccess';
                    response.data = data;
                    ws[matchedAccountID.toString()].send(JSON.stringify(response))

                    data = {
                        accountID: matchedAccountID,
                        username: matchedUserName
                    };

                    //为被匹配用户建立聊天
                    redisCache.set(matchedAccountID, accountID, function (err, setKeyRes) {
                        if (err) {
                            console.log('设置redis过期时间错误!');
                            response.code = 'matchFail';
                            ws[matchedAccountID.toString()].send(JSON.stringify(response));
                        }

                        redisCache.expire(matchedAccountID, 60*60, function (err,expireRes) {
                            if (err) {
                                console.log('设置redis过期时间错误!');
                                response.code = 'matchFail';
                                ws[matchedAccountID.toString()].send(JSON.stringify(response));
                            }
                        })
                    });

                    //通知主动匹配的用户
                    response.code = 'matchSuccess';
                    response.data = data;
                    return ws[accountID.toString()].send(JSON.stringify(response));
                });
            });

        } else {
            //等待队列无人，用户进入等待队列。
            redisCache.set(config.key.waitChat, accountID + ':' +  username, function (err, setKeyRes) {
                if (err) {
                    console.log('存储redis失败!');
                    response.code = 'matchFail';
                    return ws[accountID.toString()].send(JSON.stringify(response));
                }
                console.log('setKeyRes' + setKeyRes);

                redisCache.expire(config.key.waitChat, 60*2, function (err,expireRes) {
                    if (err) {
                        console.log('设置redis过期时间错误!');
                        response.code = 'matchFail';
                        return ws[accountID.toString()].send(JSON.stringify(response));
                    }

                    console.log('expireRes' + expireRes);
                });
            });
        }
    })
};

exports.sendMsg = function (data, userinfo, ws) {
    console.log(data)
    //判断发送方和接收方是否还处于聊天中
    redisCache.get(data.accountID, function (msg, results) {
        if (msg === 'OK' && results == userinfo.accountID) {
            let chatlog = {
                from: userinfo.accountID,
                fName: userinfo.username,
                to: data.accountID,
                tName: data.username,
                msg: data.msg,
                data: moment().format('YYYY-MM-DD'),
                time: moment().format('HH:mm:ss'),
                hasRead: true,
                isPerson: false
            };
            response.code = 'msg';
            response.data = chatlog;
            console.log(data.accountID);
            ws[data.accountID.toString()].send(JSON.stringify(response));
            chatlog.isPerson = true;
            ws[userinfo.accountID.toString()].send(JSON.stringify(response));
        }else{
            response.code = 'chatEnd';
            ws[userinfo.accountID.toString()].send(JSON.stringify(response));
        }
    })
};