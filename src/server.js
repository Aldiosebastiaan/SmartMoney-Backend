import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import transaksiRoutes from "./routes/transaksiRoutes.js";
import kategoriRoutes from "./routes/kategoriRoutes.js";

import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}]`, req.method, req.originalUrl);
  next();
});

app.use("/api/auth", authRoutes);

// Route yang butuh auth middleware sendiri
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/kategori", kategoriRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.use(cors({
  origin: ["https://smart-money-weld.vercel.app/"], // URL Vercel Anda nanti
  credentials: true
}));
