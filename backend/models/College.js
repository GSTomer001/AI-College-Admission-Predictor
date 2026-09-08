const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    location: { type: String, required: true },
    ranking: { type: Number, required: true },
    acceptanceRate: { type: Number, required: true, min: 0, max: 1 },
    avgGRE: { type: Number, required: true },
    avgTOEFL: { type: Number, required: true },
    avgCGPA: { type: Number, required: true },
    minCGPA: { type: Number, default: 6.0 },
    tuition: { type: Number, default: 0 },
    courses: { type: [String], default: [] },
    website: { type: String, default: "" },
  },
  { timestamps: true }
);

collegeSchema.index({ name: "text", location: "text" });

module.exports = mongoose.model("College", collegeSchema);
