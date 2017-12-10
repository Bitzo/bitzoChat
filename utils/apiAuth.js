const validAuth = require('./validAuth');
const _ = require('lodash');

function urlPass(method, url) {
  if (_.upperCase(method) === 'POST' && _.lowerCase(url) === '/api/register') return true;
  if (_.upperCase(method) === 'POST' && _.lowerCase(url) === '/api/login') return true;
  return false;
}

module.exports = (ctx, next) => {
  if (urlPass(ctx.method, ctx.url)) {
    next();
  } else {
    try {
      validAuth.verify(ctx.token);
    } catch (err) {
      console.log(err);
      ctx.body = {
        isSuccess: false,
        status: 400,
        msg: '签名失效,请重试',
      };
      ctx.status = 400;
    }
    next();
  }
};
