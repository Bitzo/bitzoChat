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
    relationService = appRequire('service/relationService'),
    userService = appRequire('service/userService'),
    moment = require('moment');

//回复消息模版
let response = {
    code: '',
    data: ''
};

//redis初始化及其它初始化功能
exports.init = function (userinfo) {
    redisCache.expire(userinfo.accountID, 0, function (err, data) {
        if(err) {
            // console.log('init fail')
        }
    })
};

//加入匹配聊天
exports.addChat = function (userInfo, ws) {
    let accountID = userInfo.accountID,
        username = userInfo.username;

    //1. 判端之前是否有聊天，有则通知对方下线。
    redisCache.get(accountID, function (msg, data) {
        if (msg === 'OK') {
            response.code = 'chatEnd';
            redisCache.get(data, function (msg, result) {
               if(msg === 'OK' && result == accountID) {
                   try {
                       ws[data.toString()].send(JSON.stringify(response));
                   }catch (e){

                   }
               }
            });
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
                    try {
                        relationService.queryRelation({accountID: matchedAccountID, friendID: accountID}, function (err, results) {
                            if(err) {
                                console.log('relationService Fail');
                            }else{
                                if(results && results.length>0) {
                                    ws[matchedAccountID.toString()].send(JSON.stringify({
                                        code: 'friendStatus',
                                        data: {
                                            isFriend: true
                                        }
                                    }))
                                }else{
                                    ws[matchedAccountID.toString()].send(JSON.stringify({
                                        code: 'friendStatus',
                                        data: {
                                            isFriend: false
                                        }
                                    }))
                                }
                            }
                        });
                        userService.queryUsers({accountID: accountID}, function (err, data) {
                            if (err){

                            } else {
                                if(data && data.length > 0){
                                    ws[matchedAccountID.toString()].send(JSON.stringify({
                                        code: 'chatAvatar',
                                        data: {
                                            avatar: data[0].avatar
                                        }
                                    }));
                                }
                            }
                        });
                        ws[matchedAccountID.toString()].send(JSON.stringify(response))
                    }catch(e){
                        redisCache.expire(accountID, 60*60, function (err,expireRes) {
                            if (err) {

                            }
                        });
                        response.code = 'matchFail';
                        return ws[accountID.toString()].send(JSON.stringify(response));

                    }

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
                    //查询当前用户与匹配用户的关系
                    relationService.queryRelation({accountID: accountID, friendID: matchedAccountID}, function (err, results) {
                        if(err) {
                            console.log('relationService Fail');
                        }else{
                            if(results && results.length>0) {
                                ws[accountID.toString()].send(JSON.stringify({
                                    code: 'friendStatus',
                                    data: {
                                        isFriend: true
                                    }
                                }))
                            }else{
                                ws[accountID.toString()].send(JSON.stringify({
                                    code: 'friendStatus',
                                    data: {
                                        isFriend: false
                                    }
                                }))
                            }
                        }
                    });
                    userService.queryUsers({accountID: matchedAccountID}, function (err, data) {
                       if (err){

                       } else {
                           if(data && data.length > 0){
                               ws[accountID.toString()].send(JSON.stringify({
                                   code: 'chatAvatar',
                                   data: {
                                       avatar: data[0].avatar
                                   }
                               }));
                           }
                       }
                    });
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

                redisCache.expire(config.key.waitChat, 60*2, function (err,expireRes) {
                    if (err) {
                        console.log('设置redis过期时间错误!');
                        response.code = 'matchFail';
                        return ws[accountID.toString()].send(JSON.stringify(response));
                    }

                });
            });
        }
    })
};

//转发用户消息
exports.sendMsg = function (data, userinfo, ws) {
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
            // console.log(data.accountID);
            try {
                ws[data.accountID.toString()].send(JSON.stringify(response));
            } catch (e){
                redisCache.expire(data.accountID, 0, function (err, data) {
                    if(err) {
                        // console.log('init fail')
                    }
                });
                redisCache.expire(userinfo.accountID, 0, function (err, data) {
                    if(err) {
                        // console.log('init fail')
                    }
                });
                response.code = 'chatEnd';
                return ws[userinfo.accountID.toString()].send(JSON.stringify(response));
            }
            chatlog.isPerson = true;
            ws[userinfo.accountID.toString()].send(JSON.stringify(response));
        }else{
            response.code = 'chatEnd';
            redisCache.expire(userinfo.accountID, 0, function (err, data) {
                if(err) {
                    // console.log('init fail')
                }
            });
            ws[userinfo.accountID.toString()].send(JSON.stringify(response));
        }
    })
};

//添加用户
exports.addFriend = function (userinfo, data, ws) {
    let accountID = data,
        userID = userinfo.accountID;

    userService.queryUsers({accountID: userID}, function (err, results) {
        if(err){

        }
        if(results&&results.length>0){
            results = results[0];
            response.code = 'addFriendRequest';
            response.data = {
                accountID: results.accountID,
                username: results.username,
                avatar: results.avatar
            };
            try {
                return ws[accountID.toString()].send(JSON.stringify(response));
            }catch (err){
                response.code = 'chatEnd';
                try {
                    return ws[userID.toString()].send(JSON.stringify(response));
                }catch (err){
                    return '';
                }
            }
        }else{

        }
    })
};

//添加用户核实请求
exports.addFriendCheck = function (userinfo, data, ws) {
    let accountID = data.accountID,
        userID = userinfo.accountID,
        result = data.isSuccess;

    userService.queryUsers({accountID: userID}, function (err, results) {
        if(err) {

        }

        if(results&&results.length>0){
            results = results[0];
            if(result) {
                response.code = 'addFriendCheck';
                response.data = {
                    isSuccess: true,
                    accountID: results.accountID,
                    username: results.username,
                    avatar: results.avatar
                };
                try{
                    console.log(accountID);
                    return ws[accountID.toString()].send(JSON.stringify(response));
                }catch (err) {
                    relationService.addRelation(accountID, userID, function (err, results) {
                        if(err){
                            console.log('添加失败');
                        }

                    })
                }
            }else{
                response.code = 'addFriendCheck';
                response.data = {
                    isSuccess: false,
                    accountID: accountID,
                    username: results.username,
                    avatar: results.avatar
                };
                try{
                    return ws[accountID.toString()].send(JSON.stringify(response));
                }catch (err) {

                }
            }
        }else{

        }
    })
};
