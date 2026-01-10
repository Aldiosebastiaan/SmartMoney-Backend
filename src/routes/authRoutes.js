import express from "express";

import { login, refresh, logout, getProfile, updateProfile } from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import { apiLimiter } from "../middleware/rateLimitter.js"; // Hapus authLimiter dari import

const router = express.Router();

// Terapkan apiLimiter untuk semua routes di bawah ini

router.use(apiLimiter);

router.post("/login", login); // HAPUS authLimiter di sini - andalkan loginLimitter.js saja

router.post("/refresh", refresh);

router.post("/logout", logout);

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

export default router;