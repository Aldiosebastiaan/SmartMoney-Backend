import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import transaksiRoutes from "./routes/transaksiRoutes.js";
import kategoriRoutes from "./routes/kategoriRoutes.js";

import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// ====================
// Global Middleware
// ====================
app.use(cors());
app.use(express.json());

// ====================
// Routes
// ====================
app.use("/api/auth", authRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/kategori", kategoriRoutes);

// ====================
// 404 Handler (Optional tapi Best Practice)
// ====================
app.use((req, res, next) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan",
  });
});

// ====================
// Global Error Handler (HARUS PALING BAWAH)
// ====================
app.use(errorHandler);

// ====================
// Server Listener
// ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
