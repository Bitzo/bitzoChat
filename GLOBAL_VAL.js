/**
 * @Author: bitzo
 * @Date: 2017/7/5 13:54
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/5 13:54
 * @Function:
 */

global.APP_PATH = __dirname;

global.errAlert = function (errMsg, location) {
    console.log('=====ERROR=========================================================================');
    console.log('| ' + location + ' : ');
    console.log('| ');
    console.log('| ' + errMsg);
    console.log('| ');
    console.log('===================================================================================');
};

global.appRequire = function(path) {
    return require(require('path').resolve(__dirname, path));
};