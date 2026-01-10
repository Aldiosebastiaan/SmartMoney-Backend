import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import validateTransaksi from "../middleware/validateTransaksi.js";
import { getTransaksi } from "../controllers/transaksiController.js";
import * as controller from "../controllers/transaksiController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", authMiddleware, getTransaksi);
//router.get("/all", authMiddleware.getAllTransaksi);
router.post("/", validateTransaksi, controller.createTransaksi);
router.put("/:id", validateTransaksi, controller.updateTransaksi);
router.delete("/:id", controller.deleteTransaksi);


export default router;
