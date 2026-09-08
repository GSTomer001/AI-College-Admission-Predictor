const express = require("express");
const { body, param } = require("express-validator");
const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const controller = require("../controllers/predictionController");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  [
    body("profile.gre").isFloat({ min: 260, max: 340 }).withMessage("GRE must be between 260 and 340"),
    body("profile.toefl").isFloat({ min: 0, max: 120 }).withMessage("TOEFL must be between 0 and 120"),
    body("profile.rating").isInt({ min: 1, max: 5 }).withMessage("University rating must be 1-5"),
    body("profile.sop").isFloat({ min: 1, max: 5 }).withMessage("SOP rating must be 1-5"),
    body("profile.lor").isFloat({ min: 1, max: 5 }).withMessage("LOR rating must be 1-5"),
    body("profile.cgpa").isFloat({ min: 0, max: 10 }).withMessage("CGPA must be between 0 and 10"),
    body("profile.research").isInt({ min: 0, max: 1 }).withMessage("Research must be 0 or 1"),
  ],
  validate,
  controller.createPrediction
);

router.get("/", controller.getMyPredictions);

router.delete("/:id", param("id").isMongoId().withMessage("Invalid id"), validate, controller.deletePrediction);

module.exports = router;
