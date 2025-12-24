import express from "express";
import { login, refresh, logout, getProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getProfile);

export default router;
