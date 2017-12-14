function isParamValid(p) {
  for (const key in p) {
    if (p[key] === null || p[key] === '' || p[key] === undefined) {
      return key;
    }
  }
  return false;
}

module.exports = {
  isParamValid,
};
