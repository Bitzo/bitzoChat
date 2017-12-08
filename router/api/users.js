const Router = require('koa-router');
const userService = require('../../service/userService');
const dv = require('../../utils/dataValidator');
const crypt = require('../../utils/encrypt');

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

// user register
router.post('/', async (ctx) => {
  const { username, password, enPassword } = ctx.request.body;

  if (password !== enPassword) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: '密码不一致',
    };
    return;
  }

  const userInfo = {
    username,
    password,
  };

  for (const i in userInfo) {
    if (dv.checkParameters(userInfo[i])) {
      console.log(`${i}: ${userInfo[i]}`);
      ctx.status = 400;
      ctx.body = {
        status: 400,
        isSuccess: false,
        msg: '参数填写不正确',
      };
      return;
    }
  }

  const { encrypted, key } = crypt.encrypt(password);

  userInfo.password = encrypted;
  userInfo.key = key;

  let result = await userService.queryUsers({ username });

  if (!result || result.length) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: '注册失败, 用户名重复。',
    };
    return;
  }

  result = await userService.addUser(userInfo);

  if (result) {
    ctx.status = 200;
    ctx.body = {
      status: 200,
      isSuccess: true,
      msg: '注册成功',
      data: result,
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: '注册失败',
    };
  }
});

module.exports = router;
