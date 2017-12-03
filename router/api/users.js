const Router = require('koa-router');

const router = new Router();

router.get('/users', (ctx) => {
  ctx.status = 200;
  ctx.body = 'Nobody...';
});

module.exports = router;
