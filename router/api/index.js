const Router = require('koa-router');
const usersRouter = require('./users');

const router = new Router();

router.use('/users', usersRouter.routes());

module.exports = router;
