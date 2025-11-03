import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // cek apakah email sudah ada
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)",
      [nama, email, hashedPassword]
    );

    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const user = rows[0];

    // ✅ Cek password yang di-hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    // ✅ Buat token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error saat login:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token tidak ada" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.query("SELECT id, nama, email, no_telp, alamat FROM users WHERE id = ?", [decoded.id]);
    if (rows.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error get profile:", error);
    res.status(500).json({ message: "Gagal mengambil profil user" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Token tidak ada" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { nama, no_telp, alamat } = req.body;

    await db.query(
      "UPDATE users SET nama = ?, no_telp = ?, alamat = ? WHERE id = ?",
      [nama, no_telp, alamat, decoded.id]
    );

    res.json({ message: "Profil berhasil diperbarui" });
  } catch (error) {
    console.error("Error update profile:", error);
    res.status(500).json({ message: "Gagal memperbarui profil" });
  }
};