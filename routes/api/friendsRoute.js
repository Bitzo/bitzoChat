/**
 * @Author: bitzo
 * @Date: 2017/7/6 13:49
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/6 13:49
 * @Function:
 */

let express = require('express'),
    router = express.Router(),
    config = appRequire('config/config'),
    RedisHelper = appRequire('utils/redisHelper'),
    redisCache = new RedisHelper(),
    relationService = appRequire('service/relationService');

router.get('/', function (req, res) {
    let accountID = req.decodeData.accountID;

    relationService.queryRelation({accountID:accountID}, function (err, results) {
        if(err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器异常'
            })
        }

        res.status(200);
        return res.json({
            code: 200,
            isSuccess: true,
            data: results,
            msg: '查询成功'
        })

    })
});


router.post('/:accountID', function (req, res) {
    let accountID = req.decodeData.accountID,
        fid = req.params.accountID;

    if(accountID == fid) {
        res.status(400);
        return res.json({
            code: 400,
            isSuccess: false,
            msg: '不可以添加自己为好友哦'
        })
    }

    relationService.queryRelation({accountID:accountID, friendID: fid}, function (err, results) {
        if(err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器异常'
            })
        }

        if(results.length>0) {
            res.status(400);
            return res.json({
                code: 400,
                isSuccess: false,
                msg: '你们已经是朋友啦！'
            })
        }

        relationService.addRelation(accountID, fid, function (err, results) {
            if(err) {
                res.status(500);
                return res.json({
                    code: 500,
                    isSuccess: false,
                    msg: '服务器异常'
                })
            }

            res.status(200);
            return res.json({
                code: 200,
                isSuccess: true,
                data: results,
                msg: '添加成功'
            })

        })
    })
});



router.delete('/:fid', function (req, res) {
    let accountID = req.decodeData.accountID,
        friendID = req.params.fid;

    console.log(friendID)

    if(!friendID) {
        res.status(400);
        return res.json({
            code: 300,
            isSuccess: false,
            msg: '好友信息有误！'
        })
    }

    relationService.deleteRelation(accountID, friendID, function (err, results) {
        if(err) {
            res.status(500);
            return res.json({
                code: 500,
                isSuccess: false,
                msg: '服务器异常'
            })
        }

        res.status(200);
        return res.json({
            code: 200,
            isSuccess: true,
            msg: '删除成功'
        })

    })
});

module.exports = router;
