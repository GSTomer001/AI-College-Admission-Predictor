/**
 * Seeds the College collection from data/colleges.json.
 * Usage: npm run seed   (from the backend directory)
 */
require("dotenv").config();
const connectDB = require("./config/db");
const College = require("./models/College");
const colleges = require("./data/colleges.json");

async function seed() {
  await connectDB();
  let upserted = 0;
  for (const college of colleges) {
    await College.updateOne({ name: college.name }, { $set: college }, { upsert: true });
    upserted += 1;
  }
  console.log(`Seeded ${upserted} colleges.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
