import * as service from "../services/transaksiService.js";
import db from "../config/db.js";

export const getTransaksi = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil ID user dari middleware auth
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 1. Tambahkan WHERE user_id = ? agar total yang dihitung hanya milik user tersebut
    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) as total FROM transaksi WHERE user_id = ?",
      [userId]
    );

    // 2. Tambahkan WHERE user_id = ? agar data yang ditarik hanya milik user tersebut
    const [rows] = await db.query(
      `SELECT * FROM transaksi 
       WHERE user_id = ? 
       ORDER BY tanggal DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    res.json({
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil transaksi" });
  }
};

{/* export const getAllTransaksi = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM transaksi ORDER BY tanggal ASC"
  );
  res.json(rows);
}; */}

export const createTransaksi = async (req, res, next) => {
  try {
    const userId = req.user.id; // dari authMiddleware
    const transaksiId = await service.createTransaksi(userId, req.body);

    res.status(201).json({
      message: "Transaksi berhasil ditambahkan",
      data: { id: transaksiId },
    });
  } catch (err) {
    next(err);
  }
};

export const updateTransaksi = async (req, res, next) => {
  try {
    await service.updateTransaksi(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({ message: "Transaksi berhasil diperbarui" });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaksi = async (req, res, next) => {
  try {
    await service.deleteTransaksi(
      req.params.id,
      req.user.id
    );
    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};
