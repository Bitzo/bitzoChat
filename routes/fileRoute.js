/**
 * @Author: bitzo
 * @Date: 2017/7/10 14:55
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/10 14:55
 * @Function:
 */


let express = require('express'),
    router = express.Router(),
    api = require('./api/routes'),
    fs = require('fs'),
    config = appRequire('config/config'),
    userService = appRequire('service/userService'),
    formidable = require('formidable'),
    util = require('util'),
    jwtHelper = appRequire('utils/jwtHelper');

router.use('/', function (req, res, next) {

    // parse a file upload
    let form = new formidable.IncomingForm();
    form.uploadDir = APP_PATH + "/public/images/avatar";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {

        let token = fields.token;
        let decodeData = jwtHelper.tokenDecode(token, config.jwt_secret);
        // fs.writeFileSync(APP_PATH + '/temp.txt', files);

        if(decodeData === '') {
            res.status(401);
            return res.json({
                code: 401,
                isSuccess: false,
                msg: '请登录后进行此操作！'
            });
        }

        let uploadDir = APP_PATH + "/public/images/avatar/",
            filename = decodeData.accountID + '.png';
        fs.rename(files.userAvatar.path, uploadDir + filename, function (err, results) {
            if(err){
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: '请稍后再试！！'
                });
            }
            files.userAvatar.path = '/images/avatar/' + filename;
            userService.updateUserInfo(decodeData.accountID, {avatar: '/images/avatar/'+filename}, function (err, results) {
                if (err) {
                    res.status(500);
                    return res.json({
                        code: 500,
                        isSuccess: false,
                        msg: '请稍后再试！！'
                    });
                }

                if (results && results.affectedRows > 0) {
                    res.status(200);
                    return res.json({
                        code: 200,
                        isSuccess: true,
                        msg: '成功！',
                        data: files
                    });
                }
                res.status(200);
                return res.json({
                    code: 200,
                    isSuccess: true,
                    msg: '成功！',
                    data: files

                });
            })
        });
    });
});

module.exports = router;
