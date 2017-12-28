const validAuth = require('./validAuth');
const _ = require('lodash');

function urlPass(method, url) {
  console.log(method, url);
  if (_.toUpper(method) === 'POST' && _.toLower(url) === '/api/register') return true;
  if (_.toUpper(method) === 'POST' && _.toLower(url) === '/api/login') return true;
  return false;
}

function tokenCheck(ctx) {
  const { method } = ctx.request;
  let { url } = ctx.request;
  [url] = url.split('?');
  if (urlPass(method, url)) {
    return {
      isSuccess: true,
    };
  }
  try {
    const token = ctx.request.body.token || ctx.query.token || '';
    const tokenDecode = validAuth.verifyJWT(token);
    ctx.token = tokenDecode.data;
    return {
      isSuccess: true,
    };
  } catch (err) {
    return {
      isSuccess: false,
      msg: err.message,
    };
  }
}

module.exports = {
  tokenCheck,
};
