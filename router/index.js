const Router = require('koa-router');
const apiRouter = require('./api/index');

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

router.use('/api', apiRouter.routes());

module.exports = router;
