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
    })
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

router.post('/', function (req, res) {
    console.log(11111111);
    return res.json({
        code: 200
    })
});

module.exports = router;
