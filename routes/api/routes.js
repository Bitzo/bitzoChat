/**
 * @Author: bitzo
 * @Date: 2017/7/5 18:49
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/5 18:49
 * @Function:
 */

let express = require('express'),
    router = express.Router(),
    userService = appRequire('service/userService'),
    pwdEncode = appRequire('utils/pwdEncode'),
    jwtHelper = appRequire('utils/jwtHelper'),
    chatroute = appRequire('routes/api/chatRoute'),
    userroute = appRequire('routes/api/userRoute'),
    friendsroute = appRequire('routes/api/friendsRoute');

router.use('/chat', chatroute);
router.use('/users', userroute);
router.use('/friends', friendsroute);

router.post('/login', function(req, res) {
    let username = req.body.username,
        password = req.body.password,
        queryData = {
            username: username,
            password: pwdEncode.hash(password)
        };

    userService.queryUsers(queryData, (err, results) => {
        if(err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器异常'
            })
        }

        if (results && results.length>0){

            let token = jwtHelper.getToken({
                accountID: results[0].accountID,
                username: username
            });
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                token: token,
                msg: '登录成功'
            })
        } else {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: '账号不存在或密码错误'
            })
        }
    });
});

router.post('/register', function(req, res, next) {
    console.log(req.body)
    let username = req.body.username || '',
        password = req.body.password || '',
        queryData = {
            username: username,
            password: pwdEncode.hash(password)
        };

    userService.queryUsers({username:username}, (err, queryRes) => {
        if(err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器异常'
            })
        }

        if(queryRes.length !== 0) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: '用户名已存在，请更换'
            })
        }

        userService.addUserInfo(queryData, (err, results) => {
            if(err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: '服务器异常'
                })
            }
            if (results && results.affectedRows>0){
                let token = jwtHelper.getToken({
                    accountID: results.insertId,
                    username: username
                });
                res.status(200);
                return res.json({
                    code: 200,
                    isSuccess: true,
                    token: token,
                    msg: '登录成功'
                })
            } else {
                res.status(400);
                return res.json({
                    code: 400,
                    isSuccess: false,
                    msg: '账号不存在或密码错误'
                })
            }
        });
    })
});

module.exports = router;
