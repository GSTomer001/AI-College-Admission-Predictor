const asyncHandler = require("express-async-handler");
const Prediction = require("../models/Prediction");
const aiService = require("../services/aiService");
const collegeService = require("../services/collegeService");

const REQUIRED = ["gre", "toefl", "rating", "sop", "lor", "cgpa", "research"];

// @route  POST /api/predictions  (protected)
exports.createPrediction = asyncHandler(async (req, res) => {
  const { profile } = req.body;
  const missing = REQUIRED.filter((f) => profile?.[f] === undefined);
  if (missing.length) {
    res.status(400);
    throw new Error(`Profile is missing fields: ${missing.join(", ")}`);
  }

  const { chanceOfAdmit, source } = await aiService.getAdmissionChance(profile);
  const matchedColleges = await collegeService.matchColleges(profile, 8);

  const prediction = await Prediction.create({
    user: req.user._id,
    profile,
    chanceOfAdmit,
    source,
    matchedColleges,
  });

  res.status(201).json(prediction);
});

// @route  GET /api/predictions  (protected) — history for current user
exports.getMyPredictions = asyncHandler(async (req, res) => {
  const predictions = await Prediction.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("matchedColleges.college", "name location ranking")
    .lean();
  res.json(predictions);
});

// @route  DELETE /api/predictions/:id  (protected)
exports.deletePrediction = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!prediction) {
    res.status(404);
    throw new Error("Prediction not found");
  }
  await prediction.deleteOne();
  res.json({ message: "Prediction deleted" });
});
