import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  // Access token biasanya expiry pendek, misalnya 15 menit
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload) => {
  // Refresh token expiry panjang, misalnya 7 hari
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};