/**
 * @Author: bitzo
 * @Date: 2017/6/16 15:59
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/6/16 15:59
 * @Function: 身份验证
 */

var jwtHelper = require('./jwtHelper'),
    config = require('../config/config');

function urlPass(req) {
    if(req.url === '/api/login') return true;
    if(req.url === '/api/register') return true;

    return false;
}

module.exports = function(req, res, next) {
    if (urlPass(req)) {
        next();
    } else {
        let token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];

        if (token) {
            try {
                if (token == undefined) {
                    res.status(400);
                    return res.json({
                        code: 400,
                        msg: "token不合法!",
                    });
                }

                let decoded = jwtHelper.tokenDecode(token, config.jwt_secret);
                req.decodeData = decoded;
                next();
            } catch (err) {
                res.status(500);
                res.json({
                    code: 500,
                    msg: err.message
                });
            }
        } else {
            res.status(400);
            return res.json({
                code: 401,
                "errMsg": "未提供鉴权Token!"
            });
        }
    }
};