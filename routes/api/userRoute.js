/**
 * @Author: bitzo
 * @Date: 2017/7/5 14:04
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/5 14:04
 * @Function:
 */

let express = require('express'),
    router = express.Router(),
    pwd = appRequire('utils/pwdEncode'),
    userService = appRequire('service/userService');


router.get('/person', function (req, res) {
    let accountID = req.decodeData.accountID || '';

    userService.queryUsers({accountID: accountID}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器错误'
            });
        }

        if(results.length > 0) {
            let result = results[0];
            delete result.password;
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                data: result,
                msg: '查询成功'
            });
        } else {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: '无记录'
            });
        }
    });
});


router.get('/', function (req, res) {
    let accountID = req.query.accountID || '';

    userService.queryUsers({accountID: accountID}, function (err, results) {
        if (err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器错误'
            });
        }

        if(results.length > 0) {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                data: results,
                msg: '查询成功'
            });
        } else {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: '无记录'
            });
        }
    })
});

router.put('/', function (req, res) {
    let userData = req.decodeData,
        data = req.body.userInfo;
    // console.log(req.body)

    // console.log(data);
    if(data && data.password && data.password.trim()) {
        data.password = pwd.hash(data.password);
    }

    userService.updateUserInfo(userData.accountID, data, function (err, results) {
        if(err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器错误，稍后再试'
            });
        }

        if(results && results.affectedRows > 0) {
            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                data: results,
                msg: '更新成功'
            });
        }
        res.status(200);
        return res.json({
            code: 200,
            isSuccess: true,
            data: results,
            msg: '查询成功'
        });
    })
});

module.exports = router;
