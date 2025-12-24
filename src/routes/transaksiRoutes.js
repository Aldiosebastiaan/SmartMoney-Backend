import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import validateTransaksi from "../middleware/validateTransaksi.js";
import * as controller from "../controllers/transaksiController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", authMiddleware, controller.getTransaksi);

router.post(
  "/",
  authMiddleware,
  validateTransaksi,
  controller.createTransaksi
);

router.put(
  "/:id",
  authMiddleware,
  validateTransaksi,
  controller.updateTransaksi
);

router.delete(
  "/:id",
  authMiddleware,
  controller.deleteTransaksi
);

export default router;
