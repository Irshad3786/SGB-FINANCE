import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import subAdminRoutes from "./routes/subAdminRoutes.js"
import userRoute from "./routes/userRoutes.js"
import buyerSellerManagementRoutes from "./routes/subAdminManagementRoutes/buyerSellerManagementRoutes.js";
import userDataRoutes from "./routes/subAdminManagementRoutes/userDataRoutes.js";
import vehicleStockRoute from "./routes/subAdminManagementRoutes/vehicleStockRoute.js";
import pendingPaymentsRoute from "./routes/subAdminManagementRoutes/pendingPaymentsRoute.js";
import financeRoute from "./routes/subAdminManagementRoutes/financeRoute.js";
import dashboardRoute from "./routes/subAdminManagementRoutes/dashboardRoute.js";
import requestsManagementRoute from "./routes/subAdminManagementRoutes/requestsManagementRoute.js";
import districtLocationRoute from "./routes/subAdminManagementRoutes/districtLocationRoute.js";
import ownershipTransferRoute from "./routes/subAdminManagementRoutes/ownershipTransferRoute.js";

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

//subadmin-management routes
app.use("/api/subadmin/management", buyerSellerManagementRoutes);
app.use("/api/subadmin/management", userDataRoutes);
app.use("/api/subadmin/management", vehicleStockRoute);
app.use("/api/subadmin/management", pendingPaymentsRoute);
app.use("/api/subadmin/management", financeRoute);
app.use("/api/subadmin/management", dashboardRoute);
app.use("/api/subadmin/management", requestsManagementRoute);
app.use("/api/subadmin/management", districtLocationRoute);
app.use("/api/subadmin/management/ownership-transfer", ownershipTransferRoute);

export { app, configureCORS };

