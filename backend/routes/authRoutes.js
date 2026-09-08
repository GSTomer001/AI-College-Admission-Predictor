const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const controller = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  controller.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  controller.login
);

router.get("/me", protect, controller.me);

module.exports = router;
