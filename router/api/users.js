const Router = require('koa-router');
const userService = require('../../service/userService');

const router = new Router();

// user query
router.get('/', async (ctx) => {
  const userInfo = ctx.query;
  if (userInfo === null || userInfo === undefined) {
    ctx.status = 400;
    ctx.body = 'error';
    return;
  }

  const users = await userService.queryUsers(userInfo);

  ctx.status = 200;
  let html = '';
  users.forEach((user) => {
    html += `<h3>${JSON.stringify(user)}</h3><br />`;
  });
  ctx.body = html;
});


module.exports = router;
