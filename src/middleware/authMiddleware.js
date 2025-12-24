import jwt from "jsonwebtoken";
import db from "../config/db.js";

/**
 * Authentication Middleware
 * - Memvalidasi JWT Bearer Token
 * - Memastikan user masih valid di database
 * - Menyimpan user minimal ke req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Cek header Authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token tidak ditemukan atau format salah",
      });
    }

    // 2. Ambil token
    const token = authHeader.split(" ")[1];

    // 3. Verifikasi JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({
        message: "Token tidak valid atau kadaluarsa",
      });
    }

    // 4. Validasi payload minimum
    if (!decoded.id) {
      return res.status(403).json({
        message: "Token tidak valid",
      });
    }

    // 5. Cek user masih ada di database
    const [rows] = await db.query(
      "SELECT id, email, nama FROM users WHERE id = ? LIMIT 1",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "User tidak ditemukan atau sudah dihapus",
      });
    }

    // 6. Attach user minimal ke request (trust boundary)
    req.user = {
      id: rows[0].id,
      email: rows[0].email,
      nama: rows[0].nama,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada proses autentikasi",
    });
  }
};

export default authMiddleware;
