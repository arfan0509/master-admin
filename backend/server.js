import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import machinetypeRoutes from "./routes/machinetypeRoutes.js";
import machinegroupRoutes from "./routes/machinegroupRoutes.js";
import machineidRoutes from "./routes/machineidRoutes.js";
import machinedetailRoutes from "./routes/machinedetailRoutes.js";
import machineprofileRoutes from "./routes/machineprofileRoutes.js";
import machineproductivityRoutes from "./routes/machineproductivityRoutes.js";
import machinerecordsRoutes from "./routes/machinerecordsRoutes.js";
import vendorRoutes from "./routes/vendorRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Gunakan CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Ganti dengan URL frontend Anda
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Jika Anda memerlukan credentials (misalnya cookies)
  })
);

app.use(express.json());

app.use("/api", machinetypeRoutes);
app.use("/api", machinegroupRoutes);
app.use("/api", machineidRoutes);
app.use("/api", machinedetailRoutes);
app.use("/api", machineprofileRoutes);
app.use("/api", machineproductivityRoutes);
app.use("/api", machinerecordsRoutes);
app.use("/api", vendorRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
