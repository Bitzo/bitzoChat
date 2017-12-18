const Router = require('koa-router');
const _ = require('lodash');
const userService = require('../../service/userService');
const dv = require('../../utils/dataValidator');

const router = new Router();

// user query
router.get('/', async (ctx) => {
  const { id, username, isActive } = ctx.query || '';
  const userInfo = {
    id: _.toNumber(id),
    username,
    isActive,
  };

  if (userInfo.id !== ctx.token.id) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: '权限不足',
    };
    return;
  }

  let users = await userService.queryUsers(userInfo);

  if (!users) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: '查询失败',
    };
    return;
  }

  users = users.map((user) => {
    const u = _.omit(user, ['key', 'password']);
    return u;
  });

  ctx.status = 200;
  ctx.body = {
    status: 200,
    isSuccess: true,
    msg: '查询成功',
    data: users,
  };
});

// update user profiles
router.put('/', async (ctx) => {
  const {
    id,
    username,
    gender,
    birthday,
    descrption,
  } = ctx.request.body || '';

  const userInfo = {
    id: _.toNumber(id),
    username,
    gender,
    birthday,
    descrption,
  };

  if (userInfo.id !== ctx.token.id) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: '权限不足',
    };
    return;
  }

  const err = dv.isParamsInvalid({ id, username, gender });

  if (err) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: `{ ${err} } 参数填写错误`,
    };
    return;
  }

  // 验证用户是否存在
  let result = await userService.queryUsers({ id });

  if (!result || result.length === 0) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      isSuccess: false,
      msg: '用户信息不存在, 更新失败',
    };
    return;
  }

  // 验证用户昵称不重复
  // 1. 查询不到用户名
  // 2. 查询到, 且此结果的用户id与请求的用户id相同
  result = await userService.queryUsers({ username });
  if (result && result.length > 0) {
    for (const i in result) {
      if (result[i].id !== userInfo.id) {
        ctx.status = 400;
        ctx.body = {
          status: 400,
          isSuccess: false,
          msg: '用户名重复',
        };
        return;
      }
    }
  }

  // result:
  //  false: 修改失败 (服务器/数据库错误)
  //  1: 修改成功
  //  0: 未修改(修改的数据已经最新)
  result = await userService.updateUser(userInfo);

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
    msg: '更新成功',
  };
});


module.exports = router;
