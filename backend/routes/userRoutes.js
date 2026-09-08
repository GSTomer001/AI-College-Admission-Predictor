const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const controller = require("../controllers/userController");

const router = express.Router();

router.use(protect);

router.get("/profile", controller.getProfile);
router.put(
  "/profile",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("student.bachelorGPA").optional().isFloat({ min: 0, max: 10 }),
    body("student.gradYear").optional().isInt({ min: 1990, max: 2100 }),
  ],
  validate,
  controller.updateProfile
);
router.put(
  "/password",
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  validate,
  controller.updatePassword
);

module.exports = router;
