import express from "express";
import { register, login } from "../controllers/authController.js";
import { getProfile, updateProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
