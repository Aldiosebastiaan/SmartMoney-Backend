import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import * as repo from "../repositories/authRepository.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import * as userRepo from "../repositories/userRepository.js";
import db from "../config/db.js";

export const login = async ({ email, password }) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (rows.length === 0) {
    throw new Error("Email tidak terdaftar");
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password salah");
  }

  // Menghapus refresh token lama (logout device lain)
  await db.query("DELETE FROM refresh_tokens WHERE user_id = ?", [user.id]);

  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id });

  await db.query(
    "INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)",
    [user.id, refreshToken]
  );

  return { accessToken, refreshToken };
};


export const refreshToken = async (token) => {
  const stored = await repo.findRefreshToken(token);
  if (!stored) throw new AppError("Refresh token tidak valid", 403);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError("Refresh token expired", 403);
  }

  const newAccessToken = generateAccessToken({
    id: decoded.id,
    email: decoded.email,
  });

  return newAccessToken;
};

export const logout = async (refreshToken) => {
  await db.query(
    "DELETE FROM refresh_tokens WHERE token = ?",
    [refreshToken]
  );
};


export const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);

  if (!user) {
    throw new AppError("User tidak ditemukan", 404);
  }

  return user;
};

export const updateProfile = async (userId, data) => {
  const affected = await userRepo.updateProfile(userId, data);

  if (affected === 0) {
    throw new AppError("User tidak ditemukan", 404);
  }
};