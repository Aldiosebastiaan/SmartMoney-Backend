import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import * as repo from "../repositories/authRepository.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";

export const login = async ({ email, password }) => {
  console.log("Login attempt:", email);
  const user = await repo.findUserByEmail(email);
  console.log("User found:", user);

  if (!user) throw new AppError("Email atau password salah", 401);

  const match = await bcrypt.compare(password, user.password);
  console.log("Password match:", match);
  if (!match) throw new AppError("Email atau password salah", 401);

  const payload = { id: user.id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

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

export const logout = async (token) => {
  await repo.deleteRefreshToken(token);
};
