import "dotenv/config";

const { app, configureCORS } = await import("./app.js");
const { default: connectDB } = await import("./config/db.js");

console.log("CI/CD check: deploy working successfully!");

// ✅ Configure CORS after .env is loaded
configureCORS();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start Express server
connectDB()
  .then(async () => {
    try {
      const { runCapitalizeMigration } = await import("./utils/capitalizeMigration.js");
      await runCapitalizeMigration();
    } catch (migErr) {
      console.error("❌ Failed to run capitalization migration:", migErr);
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on :${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`❌ Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  });



