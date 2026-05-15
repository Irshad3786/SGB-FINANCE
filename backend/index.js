import "dotenv/config";

const { app, configureCORS } = await import("./app.js");
const { default: connectDB } = await import("./config/db.js");

// ✅ Configure CORS after .env is loaded
configureCORS();

const PORT = process.env.PORT || 5100;

// Connect to MongoDB, then start Express server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on :${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`❌ Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  });


  
