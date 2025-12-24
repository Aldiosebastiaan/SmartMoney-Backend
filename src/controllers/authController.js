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

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // dari JWT
    const profile = await authService.getProfile(userId);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { nama, no_telp, alamat } = req.body;

    await authService.updateProfile(userId, {
      nama,
      no_telp,
      alamat,
    });

    res.json({ message: "Profil berhasil diperbarui" });
  } catch (err) {
    next(err);
  }
};
