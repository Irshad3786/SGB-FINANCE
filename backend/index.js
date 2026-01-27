import dotenv from "dotenv";
dotenv.config(); // ✅ Load environment variables before anything else

import { app, configureCORS } from "./app.js";
import connectDB from "./config/db.js";

// ✅ Configure CORS after .env is loaded
configureCORS();

const PORT = process.env.PORT || 5100;

//Connect to MongoDB, then start Express server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on :${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`❌ Failed to connect to MongoDB: ${err.message}`);
    process.exit(1); // Optional: Exit process on DB failure
  });


  
