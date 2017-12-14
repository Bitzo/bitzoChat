const validAuth = require('./validAuth');
const _ = require('lodash');

function urlPass(method, url) {
  console.log(method, url);
  if (_.toUpper(method) === 'POST' && _.toLower(url) === '/api/register') return true;
  if (_.toUpper(method) === 'POST' && _.toLower(url) === '/api/login') return true;
  return false;
}

function tokenCheck(ctx) {
  let { method, url } = ctx.request;
  url = url.split('?')[0];
  if (urlPass(method, url)) {
    return {
      isSuccess: true,
    };
  }
  try {
    const token = ctx.request.body.token || ctx.query.token || '';
    validAuth.verifyJWT(token);
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
