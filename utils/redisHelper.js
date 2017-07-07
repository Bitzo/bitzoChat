/**
 * @Author: Cecurio
 * @Date: 2017/6/16 19:29
 * @Last Modified by: Cecurio
 * @Last Modified time: 2017/6/16 19:29
 * @Function: redis帮助方法
 */
let redis = require('redis');

let config = require('../config/config');

let RedisCache = function() {
    this.redisConfig = config.isdev ? config.redis_prd : config.redis_local;
};
/**
 * @param key 要存储的键
 * @param value 要存储的值
 * @param cb(err,data)
 * 如果err为true,说明出错了
 */
RedisCache.prototype.set = function (key, value, cb) {
    let client  = redis.createClient(this.redisConfig);

    client.auth(config.redis.password,function () {
        console.log('通过认证');
    });

    client.on("error", function(error) {
        client.quit();
        return cb(true,null);
    });

    client.on('ready',function () {
        client.set(key, value, function (err,data) {
            client.quit();
            if (err) {
                return cb(true,null);
            }

            if (data != 'OK') {
                return cb(true,null);
            }

            return cb(false,data);
        });
    });
};

RedisCache.prototype.get = function (key, cb) {

    let client  = redis.createClient(this.redisConfig);

    client.auth(config.redis.password,function () {
        console.log('通过认证');
    });

    client.on("error", function(error) {
        client.quit();
        console.log(error);
        console.log("执行这里");
        return cb(true,null);
    });

    client.on('ready',function () {
        client.get(key, function (err,data) {
            client.quit();
            if (err) {
                return cb('ERR',"error-occur");
            }

            if (!data) {
                return cb('NOT_EXIST',"not_exist")
            }

            return cb('OK',data);
        });
    });
};

//将某个redis的删除
RedisCache.prototype.delete = function(key, cb) {
    let client  = redis.createClient(this.redisConfig);

    client.auth(config.redis.password,function () {
        console.log('通过认证');
    });

    client.on("error", function(error) {
        client.quit();
        return cb(true,null);
    });

    client.on("ready", function() {
        client.expire(k, interval,function (err,data) {
            client.quit();
            if (err) {
                return cb(true,err);
            }

            if (data != 1) {
                return cb(true,null);
            }

            return cb(false,data);
        });
    });
};

//将某个redis的键设置为N秒过期
RedisCache.prototype.expire = function(k, interval, cb) {
    let client  = redis.createClient(this.redisConfig);

    client.auth(config.redis.password,function () {
        console.log('通过认证');
    });

    client.on("error", function(error) {
        client.quit();
        return cb(true,null);
    });

    client.on("ready", function() {
        client.expire(k, interval,function (err,data) {
            client.quit();
            if (err) {
                return cb(true,err);
            }

            if (data != 1) {
                return cb(true,null);
            }

            return cb(false,data);
        });
    });
};

module.exports = RedisCache;


