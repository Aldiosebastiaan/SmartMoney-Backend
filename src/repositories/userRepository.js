import db from "../config/db.js";

export const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, nama, email, no_telp, alamat
     FROM users
     WHERE id = ?`,
    [id]
  );
  return rows[0];
};

export const updateProfile = async (id, { nama, no_telp, alamat }) => {
  const [result] = await db.query(
    `UPDATE users
     SET nama = ?, no_telp = ?, alamat = ?
     WHERE id = ?`,
    [nama, no_telp, alamat, id]
  );

  return result.affectedRows;
};
