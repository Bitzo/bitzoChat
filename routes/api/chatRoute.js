/**
 * @Author: bitzo
 * @Date: 2017/7/6 9:55
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/6 9:55
 * @Function:
 */


let express = require('express'),
    router = express.Router(),
    config = appRequire('config/config'),
    RedisHelper = appRequire('utils/redisHelper'),
    redisCache = new RedisHelper();

router.post('/add', function (req, res) {
    console.log(req.decodeData);
    let accountID = req.decodeData.accountID,
        username = req.decodeData.username;

    redisCache.get(config.key.waitChat, function (msg, data) {
        if (msg === 'OK' && data != accountID + ':' + username) {
            let dataInfo = data.split(':');
            let matchedAccountID = dataInfo[0],
                matchedUserName = dataInfo[1];

            redisCache.expire(config.key.waitChat, 0, function (err,expireRes) {
                if (err) {
                    console.log('设置redis过期时间错误!');
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器错误'
                    });
                }
            });

            redisCache.set(accountID, matchedAccountID, function (err, setKeyRes) {
                if (err) {
                    console.log('存储redis失败!');
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器错误'
                    });
                }

                redisCache.expire(accountID, 60*60, function (err,expireRes) {
                    if (err) {
                        console.log('设置redis过期时间错误!');
                        res.status(500);
                        return res.json({
                            code: 500,
                            isSuccess: false,
                            msg: '服务器错误'
                        });
                    }

                    return res.json({
                        code: 200,
                        isSuccess: true,
                        data: {
                            accountID: matchedAccountID,
                            username: matchedUserName
                        },
                        msg: "匹配成功"
                    })
                });
            });

        } else {
            redisCache.set(config.key.waitChat, accountID + ':' +  username, function (err, setKeyRes) {
                if (err) {
                    console.log('存储redis失败!');
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '服务器错误'
                    });
                }
                console.log('setKeyRes' + setKeyRes);

                redisCache.expire(config.key.waitChat, 60*2, function (err,expireRes) {
                    if (err) {
                        console.log('设置redis过期时间错误!');
                        res.status(500);
                        return res.json({
                            code: 500,
                            isSuccess: false,
                            msg: '服务器错误'
                        });
                    }

                    console.log('expireRes' + expireRes);

                    res.status(200);
                    return res.json({
                        code: 300,
                        msg: "Wait ... 正在匹配"
                    })
                });
            });
        }
    })

});

module.exports = router;
