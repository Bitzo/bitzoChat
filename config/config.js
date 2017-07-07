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
    //数据库配置
    mysql : {
        host : '115.159.201.83',
        user : 'bitzo',
        password : 'bitzo',
        database : 'bitzoChat',
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
        password :'bitzobitzo'
    },
    //其他配置
    key: {
        waitChat: 'waitChat',
        matchChat: 'matchChat'
    }
};

module.exports = config;