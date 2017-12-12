const Koa = require('koa');
const router = require('./router');
const views = require('koa-views');
const bodyparser = require('koa-bodyparser');
const statics = require('koa-static');
const path = require('path');

const app = new Koa();

// set static files path
const staticFIlesPath = './public';

// set views like path,ext...
app.use(views(path.join(__dirname, '/public/views'), {
  extension: 'jade',
}));

app.use(statics(path.join(__dirname, staticFIlesPath)));

// body handler, resolve post data
app.use(bodyparser());

// routers
app.use(router.routes());

// handle 404 page
app.use(async (ctx) => {
  ctx.response.status = 404;
  await ctx.render('error', {
    error: ctx.error,
  });
});

app.listen(3000);
