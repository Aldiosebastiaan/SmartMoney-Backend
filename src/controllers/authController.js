import * as authService from "../services/authService.js";
import { checkLoginLock } from "../utils/loginLimitter.js";
import { recordFailedLogin, resetLoginAttempts } from "../utils/loginLimitter.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔐 VALIDASI WAJIB
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    // 🔑 IDENTIFIER FINAL
    const identifier = email.trim().toLowerCase();

    // 🔒 CHECK LOCK
    const lock = await checkLoginLock(identifier);
    if (!lock.allowed) {
      return res.status(429).json({
        message: `Terlalu banyak percobaan login. Coba lagi dalam ${lock.retryAfter} detik`,
      });
    }

    console.log(`Login attempt for ${identifier} from IP ${req.ip}: allowed=${lock.allowed}`);

    // 🔑 AUTH
    const result = await authService.login({ email: identifier, password });

    if (!result) {
      await recordFailedLogin(identifier);
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    // 🔓 SUCCESS → RESET LIMITER
    await resetLoginAttempts(identifier);

    return res.json({
      message: "Login berhasil",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token wajib diisi" });
    }
    const accessToken = await authService.refreshToken(refreshToken);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token wajib diisi" });
    }
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

    // Validasi sederhana
    if (!nama || typeof nama !== 'string') {
      return res.status(400).json({ message: "Nama wajib diisi dan harus string" });
    }

    await authService.updateProfile(userId, {
      nama: nama.trim(),
      no_telp: no_telp ? no_telp.trim() : null,
      alamat: alamat ? alamat.trim() : null,
    });

    res.json({ message: "Profil berhasil diperbarui" });
  } catch (err) {
    next(err);
  }
};