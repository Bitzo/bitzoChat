const Router = require('koa-router');
const usersRouter = require('./users');
const dv = require('../../utils/dataValidator');
const crypt = require('../../utils/encrypt');
const userService = require('../../service/userService');

const router = new Router();

router.use('/users', usersRouter.routes());

// user register
router.post('/register', async (ctx) => {
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

// user login
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  const result = await userService.queryUsers({ username });

  if (result && result.length === 1) {
    const decryptPwd = await crypt.decrypt(result[0].password, result[0].key);
    if (decryptPwd === password) {
      ctx.body = {
        status: 200,
        isSuccess: true,
        msg: '登录成功',
      };
      return;
    }
  }

  ctx.status = 400;
  ctx.body = {
    status: 400,
    isSuccess: false,
    msg: '登录失败',
  };
});

module.exports = router;
