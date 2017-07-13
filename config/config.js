/**
 * @Author: bitzo
 * @Date: 2017/7/5 13:51
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/5 13:51
 * @Function:
 */

let config = {
    // 基本配置
    app_name : `bitzoChat`,
    app_version : `0.1.0`,
    app_description : `NodeJS聊天页面`,
    // 项目相关配置
    jwt_secret : 'b9i4tz4o',
    // 是否在开发中
    isdev : true,
    //服务器公网
    IP: '115.159.201.83',
    //本地ip
    localIP: 'localhost',
    //局域网测试对外公网IP
    localOpenIP: '192.168.1.155',
    //数据库配置
    mysql : {
        host : '',
        user : '',
        password : '',
        database : '',
        connectionLimit : 100,
        supportBigNumbers : true,
    },
    // 开发环境下的redis配置
    redis_prd : {
        host : '115.159.201.83',
        port : '6379'
    },
    // 上线时的redis配置
    redis_local : {
        host : '127.0.0.1',
        port : '6379',
    },
    redis : {
        password :''
    },
    //其他配置
    key: {
        waitChat: 'waitChat',
        matchChat: 'matchChat'
    }
};

module.exports = config;