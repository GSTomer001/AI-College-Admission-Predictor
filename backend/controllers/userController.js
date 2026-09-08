const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Student = require("../models/Student");

// @route  GET /api/users/profile  (protected)
exports.getProfile = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  res.json({
    user: { _id: req.user._id, name: req.user.name, email: req.user.email },
    student,
  });
});

// @route  PUT /api/users/profile  (protected)
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, student: studentData } = req.body;

  if (name) {
    req.user.name = name;
    await req.user.save();
  }

  let student = await Student.findOneAndUpdate(
    { user: req.user._id },
    { $set: { ...studentData, user: req.user._id } },
    { new: true, upsert: true, runValidators: true }
  );

  res.json({
    user: { _id: req.user._id, name: req.user.name, email: req.user.email },
    student,
  });
});

// @route  PUT /api/users/password  (protected)
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: "Password updated" });
});
