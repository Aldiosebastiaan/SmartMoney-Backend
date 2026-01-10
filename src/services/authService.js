import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import * as repo from "../repositories/authRepository.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import * as userRepo from "../repositories/userRepository.js";

export const login = async ({ email, password }) => {
  // Gunakan repository untuk konsistensi
  const user = await repo.findUserByEmail(email);
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id }); // Sekarang string, bukan objek

  // Gunakan repository untuk insert (tanpa expires_at, sesuai schema)
  await repo.saveRefreshToken(user.id, refreshToken);

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
  await repo.deleteRefreshToken(refreshToken);
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