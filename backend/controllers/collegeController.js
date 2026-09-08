const asyncHandler = require("express-async-handler");
const College = require("../models/College");
const collegeService = require("../services/collegeService");

// @route  GET /api/colleges?q=&sort=
exports.getColleges = asyncHandler(async (req, res) => {
  const { q, sort } = req.query;
  const filter = q
    ? { $or: [{ name: new RegExp(q, "i") }, { location: new RegExp(q, "i") }] }
    : {};
  const sortOption = sort === "ranking" ? { ranking: 1 } : { name: 1 };
  const colleges = await College.find(filter).sort(sortOption).lean();
  res.json(colleges);
});

// @route  GET /api/colleges/:id
exports.getCollege = asyncHandler(async (req, res) => {
  const college = await College.findById(req.params.id).lean();
  if (!college) {
    res.status(404);
    throw new Error("College not found");
  }
  res.json(college);
});

// @route  POST /api/colleges/match  (protected)
exports.matchColleges = asyncHandler(async (req, res) => {
  const profile = req.body;
  const matches = await collegeService.matchColleges(profile, 10);
  res.json(matches);
});
