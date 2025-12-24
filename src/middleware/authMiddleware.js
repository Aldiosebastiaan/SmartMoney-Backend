import jwt from "jsonwebtoken";
import db from "../config/db.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const accessToken = authHeader.split(" ")[1];

    // 1️⃣ Verify ACCESS TOKEN
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Access token tidak valid" });
    }

    // 2️⃣ CEK USER
    const [[user]] = await db.query(
      "SELECT id, email, nama FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    // 3️⃣ CEK REFRESH TOKEN MASIH ADA (SESSION VALID)
const [tokenRows] = await db.query(
  "SELECT id FROM refresh_tokens WHERE user_id = ? LIMIT 1",
  [decoded.id]
);

if (tokenRows.length === 0) {
  return res.status(401).json({
    message: "Sesi login telah berakhir",
  });
}


    

    // 4️⃣ ATTACH USER
    req.user = {
      id: user.id,
      email: user.email,
      nama: user.nama,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ message: "Auth server error" });
  }
};

export default authMiddleware;
