const { validationResult } = require("express-validator");

/** Runs express-validator checks and returns 422 on the first failure. */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(422).json({
    message: errors.array()[0].msg,
    errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
  });
}

module.exports = validate;
