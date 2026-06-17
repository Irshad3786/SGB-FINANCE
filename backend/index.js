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

      // Drop stale non-sparse agreementNo index on Buyer collection so it can be recreated as sparse
      const { default: Buyer } = await import("./models/buyerModel.js");
      await Buyer.collection.dropIndex("agreementNo_1").catch(() => null);
    } catch (migErr) {
      console.error("❌ Failed to run startup migrations/indices adjustments:", migErr);
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on :${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`❌ Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  });



