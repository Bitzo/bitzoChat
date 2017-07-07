/**
 * @Author: bitzo
 * @Date: 2017/7/5 14:01
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/5 14:01
 * @Function:
 */

let express = require('express'),
    router = express.Router(),
    api = require('./api/routes');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Hello'});
});

router.get('/register', function (req, res, next) {
    res.render('register');
});

router.get('/login', function (req, res) {
    res.render('login', {title: 'Hello'});
});

router.get('/home', function (req, res) {
    res.render('home', {title: 'Hello'});
});

/**
 *  API
 */
router.use('/api', api);

module.exports = router;
