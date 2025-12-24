import db from "../config/db.js";

export const findAllByUser = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM kategori WHERE user_id = ? ORDER BY id DESC",
    [userId]
  );
  return rows;
};
