import db from "../config/db.js";
import AppError from "../utils/AppError.js";

export const findAllByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT id, nama, kategori, nominal, tanggal
     FROM transaksi
     WHERE user_id = ?
     ORDER BY tanggal DESC`,
    [userId]
  );

  return rows;
};

export const insert = async (userId, { nama, kategori, nominal, tanggal }) => {
  const [result] = await db.query(
    `INSERT INTO transaksi (user_id, nama, kategori, nominal, tanggal)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, nama, kategori, Number(nominal), tanggal]
  );

  return result.insertId;
};

export const updateById = async (
  id,
  userId,
  { nama, kategori, nominal, tanggal }
) => {
  const [result] = await db.query(
    `UPDATE transaksi
     SET nama = ?, kategori = ?, nominal = ?, tanggal = ?
     WHERE id = ? AND user_id = ?`,
    [nama, kategori, nominal, tanggal, id, userId]
  );

  return result.affectedRows;
};

export const deleteById = async (id, userId) => {
  const [result] = await db.query(
    `DELETE FROM transaksi
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );

  return result.affectedRows;
};
