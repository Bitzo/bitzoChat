const Router = require('koa-router');
const apiRouter = require('./api/index');
const apiAuth = require('../utils/apiAuth');

const router = new Router();

router.get('/', (ctx) => {
  ctx.status = 200;
  return ctx.render('index', {
  });
});

router.get('/login', (ctx) => {
  ctx.status = 200;
  return ctx.render('login', {
  });
});

router.get('/home', (ctx) => {
  ctx.status = 200;
  return ctx.render('home', {
  });
});

router.get('/register', (ctx) => {
  ctx.status = 200;
  return ctx.render('register', {
  });
});

router.get('/apidoc', ctx => ctx.render('index.html'));

/**
 * 后端接口请求鉴权
 * token无效或错误返回403
 */
router.all('/api/*', async (ctx, next) => {
  const result = await apiAuth.tokenCheck(ctx);
  if (result && !result.isSuccess) {
    ctx.status = 403;
    ctx.body = {
      status: 403,
      isSuccess: false,
      msg: result.msg,
    };
  } else {
    await next();
  }
});

router.use('/api', apiRouter.routes());

module.exports = router;
