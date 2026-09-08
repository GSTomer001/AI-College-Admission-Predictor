const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/User");

/** Verifies the JWT from the Authorization header and attaches req.user. */
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Not authorized — no token provided" });
    }
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized — invalid token" });
  }
}

/** Restrict a route to specific roles, e.g. authorize("admin"). */
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden — insufficient role" });
    }
    next();
  };

module.exports = { protect, authorize };
