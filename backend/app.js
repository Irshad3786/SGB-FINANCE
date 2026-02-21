import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import subAdminRoutes from "./routes/subAdminRoutes.js"
import userRoute from "./routes/userRoutes.js"

const app = express();


// ✅ CORS CONFIGURATION

function configureCORS() {
  const corsOptions = {
    origin: true,
    credentials: true,
  };

  app.use(cors(corsOptions));
}

// Call CORS configuration early
configureCORS();

// middleware 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/subadmin", subAdminRoutes);
app.use("/api/user", userRoute);

export { app, configureCORS };

