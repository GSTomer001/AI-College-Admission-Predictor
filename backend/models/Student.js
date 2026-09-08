const mongoose = require("mongoose");

// Extended student record: academic history + saved preferences.
const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bachelorGPA: { type: Number, min: 0, max: 10 },
    degree: { type: String, default: "B.Tech" },
    fieldOfStudy: { type: String, default: "" },
    gradYear: { type: Number },
    workExperienceMonths: { type: Number, default: 0 },
    savedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
