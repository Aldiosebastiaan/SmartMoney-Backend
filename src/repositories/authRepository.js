import db from "../config/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT id, email, password FROM users WHERE email=?",
    [email]
  );
  return rows[0];
};

export const saveRefreshToken = async (userId, token) => { // Hapus expiresAt, sesuai schema
  await db.query(
    "INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)",
    [userId, token]
  );
};

export const findRefreshToken = async (token) => {
  const [rows] = await db.query(
    "SELECT * FROM refresh_tokens WHERE token=?",
    [token]
  );
  return rows[0];
};

export const deleteRefreshToken = async (token) => {
  await db.query("DELETE FROM refresh_tokens WHERE token=?", [token]);
};