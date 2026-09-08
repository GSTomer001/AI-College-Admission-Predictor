const mongoose = require("mongoose");

// The academic profile submitted for a prediction.
const profileSchema = new mongoose.Schema(
  {
    gre: { type: Number, min: 260, max: 340 },
    toefl: { type: Number, min: 0, max: 120 },
    rating: { type: Number, min: 1, max: 5 }, // university rating
    sop: { type: Number, min: 1, max: 5 },
    lor: { type: Number, min: 1, max: 5 },
    cgpa: { type: Number, min: 0, max: 10 },
    research: { type: Number, min: 0, max: 1 },
    fieldOfStudy: { type: String, default: "" },
  },
  { _id: false }
);

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    profile: { type: profileSchema, required: true },
    chanceOfAdmit: { type: Number, required: true }, // 0..1
    source: { type: String, enum: ["model", "heuristic"], default: "model" },
    matchedColleges: [
      {
        college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
        name: String,
        fitScore: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
