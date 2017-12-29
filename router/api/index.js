const Router = require('koa-router');
const usersRouter = require('./users');
const dv = require('../../utils/dataValidator');
const crypt = require('../../utils/encrypt');
const userService = require('../../service/userService');
const validAuth = require('../../utils/validAuth');

const router = new Router();

router.use('/users', usersRouter.routes());

/**
 * @api {POST} /api/register 用户注册-普通
 * @apiName userRegister
 * @apiGroup base
 * @apiVersion 1.0.0
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 200,
 *       "isSuccess": true,
 *       "msg": "注册成功"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": 400,
 *       "isSuccess": false,
 *       "msg": "errorMsg"
 *     }
 */
router.post('/register', async (ctx) => {
  const { username, password } = ctx.request.body;

  const userInfo = { username, password };

  const err = dv.isParamsInvalid(userInfo);

  if (err) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: `{ ${err} } 参数填写不正确`,
    };
    return;
  }

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

  const { encrypted, key } = crypt.encrypt(password);

  userInfo.password = encrypted;
  userInfo.key = key;

  result = await userService.addUser(userInfo);

  if (result) {
    ctx.status = 200;
    ctx.body = {
      status: 200,
      isSuccess: true,
      msg: '注册成功',
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

/**
 * @api {POST} /api/login 用户登录
 * @apiName userLogin
 * @apiGroup base
 * @apiVersion 1.0.0
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 200,
 *       "isSuccess": true,
 *       "msg": "登录成功"，
 *       ”token“: "akasddsaduashdawohowho.sdfasfds.sfdasfs"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": 400,
 *       "isSuccess": false,
 *       "msg": "errorMsg"
 *     }
 */
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  const err = dv.isParamsInvalid({ username, password });

  if (err) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: `{ ${err} } 参数填写错误`,
    };
    return;
  }

  let result = await userService.queryUsers({ username });

  if (result && result.length === 1) {
    [result] = result;
    const decryptPwd = await crypt.decrypt(result.password, result.key);
    if (decryptPwd === password) {
      const token = validAuth.getJWT({
        id: result.id,
        username: result.username,
      });
      ctx.body = {
        status: 200,
        isSuccess: true,
        msg: '登录成功',
        token,
      };
      return;
    }
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: '登录失败',
    };
  }

  ctx.status = 400;
  ctx.body = {
    status: 400,
    isSuccess: false,
    msg: '登录失败',
  };
});

/**
 * @api {POST} /api/password 修改密码
 * @apiName chagePwd
 * @apiGroup base
 * @apiVersion 1.0.0
 *
 * @apiParam {String} token token
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 200,
 *       "isSuccess": true,
 *       "msg": "修改成功"，
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": 400,
 *       "isSuccess": false,
 *       "msg": "errorMsg"
 *     }
 *
 * @apiErrorExample Forbidden:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "status": 403,
 *       "isSuccess": false,
 *       "msg": "errorMsg"
 *     }
 */
router.post('/password', async (ctx) => {
  const { password } = ctx.request.body;
  const { id } = ctx.token;
  let result = await dv.isParamsInvalid({ password });

  if (result) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: `{ ${result} } 参数填写错误`,
    };
    return;
  }

  result = await userService.queryUsers({ id });

  if (!result || result.length === 0) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: '用户不存在',
    };
    return;
  }

  const { encrypted, key } = await crypt.encrypt(password);

  result = await userService.updateUser({
    password: encrypted,
    key,
    id,
  });

  if (result === false) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: '用户信息更新失败',
    };
    return;
  }

  ctx.status = 200;
  ctx.body = {
    status: 200,
    isSuccess: true,
    msg: '修改成功',
  };
});

module.exports = router;
