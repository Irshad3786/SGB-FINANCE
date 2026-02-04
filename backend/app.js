import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();


// ✅ CORS CONFIGURATION

function configureCORS() {
  // Remove trailing slash from origin to avoid CORS mismatch
  const origin = (process.env.CORS_ORIGIN || "*").replace(/\/$/, "");

  app.use(
    cors({
      origin,
      credentials: true,
    })
  );
}

// Call CORS configuration early
configureCORS();

// middleware 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅admin routes
app.use("/api/admin", adminRoutes);

export { app, configureCORS };

