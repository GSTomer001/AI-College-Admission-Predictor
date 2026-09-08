const app = require("./app");
const connectDB = require("./config/db");
const config = require("./config/config");
const College = require("./models/College");
const colleges = require("./data/colleges.json");

/** Insert the college catalog once when the collection is empty. */
async function ensureCollegesSeeded() {
  const count = await College.countDocuments();
  if (count === 0) {
    await College.insertMany(colleges);
    console.log(`Auto-seeded ${colleges.length} colleges (collection was empty).`);
  }
}

const start = async () => {
  await connectDB();
  await ensureCollegesSeeded();

  const server = app.listen(config.port, () => {
    console.log(`API running in ${config.env} mode on http://localhost:${config.port}`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received — closing server...`);
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

start();

