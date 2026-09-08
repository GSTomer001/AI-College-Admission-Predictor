const express = require("express");
const { query, param, body } = require("express-validator");
const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const controller = require("../controllers/collegeController");

const router = express.Router();

router.get(
  "/",
  query("q").optional().isString().trim(),
  query("sort").optional().isIn(["name", "ranking"]),
  validate,
  controller.getColleges
);

router.post(
  "/match",
  [
    body("gre").isFloat({ min: 260, max: 340 }).withMessage("GRE must be 260-340"),
    body("toefl").isFloat({ min: 0, max: 120 }).withMessage("TOEFL must be 0-120"),
    body("cgpa").isFloat({ min: 0, max: 10 }).withMessage("CGPA must be 0-10"),
  ],
  validate,
  protect,
  controller.matchColleges
);

router.get("/:id", param("id").isMongoId().withMessage("Invalid college id"), validate, controller.getCollege);

module.exports = router;
