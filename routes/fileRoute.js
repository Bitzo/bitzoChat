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
    fs = require('fs');

router.use('/', function (req, res, next) {
    let chunks = [];
    let size = 0;
    req.on('data' , function(chunk){
        chunks.push(chunk);
        size+=chunk.length;
    });

    req.on("end",function(){
        let buffer = Buffer.concat(chunks , size);

        // let boundary = buffer.toString().split('\r\n')[0];
        // let result = buffer.toString().split(/------[a-zA-Z0-9]+[-]{0,2}/);
        //
        // let word = '';

        //
        // for(let i=0; i<result.length; ++i) {
        //     for(let j=0; j<result[i].length; ++j) {
        //         if(result[i][j] === '\r\n\r\n') {
        //             delete result[i][j]
        //         }
        //     }
        // }
        // for(let i=0; i<result.length; ++i) {
        //     word += result[i] + '\r\n\r\n';
        // }
        //
        //
        //
        // // console.log(result);
        //
        // fs.writeFileSync(APP_PATH + '/temp.txt', word);


        if(!size){
            res.writeHead(404);
            res.end('');
            return;
        }

        let rems = [];

        //根据\r\n分离数据和报头
        for(let i=0;i<buffer.length;i++){
            let v = buffer[i];
            let v2 = buffer[i+1];
            if(v == 13 && v2 == 10){
                rems.push(i);
            }
        }


        //图片信息
        let picmsg_1 = buffer.slice(rems[0]+2,rems[1]).toString();
        let filename = picmsg_1.match(/filename=".*"/g)[0].split('"')[1];

        //图片数据
        let nbuf = buffer.slice(rems[3]+2,rems[rems.length-2]);

        let path = APP_PATH + '/public/images/avatar/'+filename;
        fs.writeFileSync(path , nbuf);
        console.log("保存"+filename+"成功");

        return res.json({
            success: true
        });
    });
});


module.exports = router;
