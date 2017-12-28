function isParamsInvalid(p) {
  for (const key in p) {
    if (p[key] === null || p[key] === '' || p[key] === undefined) {
      return key;
    }
  }
  return false;
}

function isParamsValid(p) {
  for (const key in p) {
    if (p[key] === null || p[key] === '' || p[key] === undefined) {
      return false;
    }
  }
  return true;
}

module.exports = {
  isParamsInvalid,
  isParamsValid,
};
