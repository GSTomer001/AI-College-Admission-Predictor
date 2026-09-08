const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 * Sign a JWT for a user id.
 * @param {string} userId - Mongo user id
 * @returns {string} signed token
 */
const generateToken = (userId) =>
  jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

module.exports = generateToken;
