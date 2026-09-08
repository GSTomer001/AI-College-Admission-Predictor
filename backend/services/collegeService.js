/**
 * Matches a student profile against colleges in the DB and returns ranked
 * recommendations with a 0..100 fit score.
 */
function computeFit(college, profile) {
  // How close the student's scores are to the college's average admit.
  const greFit = 1 - Math.min(Math.abs(profile.gre - college.avgGRE) / 40, 1);
  const toeflFit = 1 - Math.min(Math.abs(profile.toefl - college.avgTOEFL) / 30, 1);
  const cgpaFit = 1 - Math.min(Math.abs(profile.cgpa - college.avgCGPA) / 2.5, 1);
  // Meets minimum CGPA?
  const meetsMin = profile.cgpa >= college.minCGPA ? 1 : 0.3;

  const raw = greFit * 0.4 + toeflFit * 0.2 + cgpaFit * 0.3 + meetsMin * 0.1;
  return Math.round(raw * 100);
}

async function matchColleges(profile, limit = 8) {
  const College = require("../models/College");
  const colleges = await College.find().sort({ ranking: 1 }).lean();
  return colleges
    .map((c) => ({ college: c._id, name: c.name, fitScore: computeFit(c, profile) }))
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, limit);
}

module.exports = { matchColleges, computeFit };
