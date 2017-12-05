const dataValidator = {};

dataValidator.checkParameters = (p) => {
  if (p === null || p === '' || p === undefined) {
    return true;
  }
  return false;
};


module.exports = dataValidator;
