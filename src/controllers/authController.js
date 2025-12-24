import * as authService from "../services/authService.js";

export const login = async (req, res, next) => {
  try {
    const tokens = await authService.login(req.body);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const accessToken = await authService.refreshToken(refreshToken);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.json({ message: "Logout berhasil" });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res) => {
  try {
    // req.user sudah diisi oleh authMiddleware
    res.json(req.user);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
