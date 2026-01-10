import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import transaksiRoutes from "./routes/transaksiRoutes.js";
import kategoriRoutes from "./routes/kategoriRoutes.js";

import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

/**
 * ====================
 * TRUST PROXY
 * ====================
 * WAJIB sebelum middleware lain
 * supaya req.ip konsisten
 */
app.set("trust proxy", 1);

/**
 * ====================
 * GLOBAL MIDDLEWARE
 * ====================
 */
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}]`, req.method, req.originalUrl);
  next();
});

/**
 * ====================
 * ROUTES
 * ====================
 * ⚠️ PENTING:
 * - LOGIN limiter SUDAH ADA di authController
 * - JANGAN pasang express-rate-limit di /auth
 */
app.use("/api/auth", authRoutes);

// Route yang butuh auth middleware sendiri
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/kategori", kategoriRoutes);

/**
 * ====================
 * 404 HANDLER
 * ====================
 */
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan",
  });
});

/**
 * ====================
 * GLOBAL ERROR HANDLER
 * ====================
 */
app.use(errorHandler);

/**
 * ====================
 * SERVER
 * ====================
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
