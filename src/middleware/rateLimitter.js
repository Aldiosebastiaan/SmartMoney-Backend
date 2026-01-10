import rateLimit from 'express-rate-limit';

// authLimiter: Jika tetap digunakan, buat sangat longgar (misalnya, untuk endpoint selain login)

export const authLimiter = rateLimit({

 windowMs: 24 * 60 * 60 * 1000, // 24 jam (sangat panjang)
 max: 1000, // Banyak sekali, agar jarang blokir
 message: 'Terlalu banyak percobaan login dari IP ini. Coba lagi nanti.',
 standardHeaders: true,
 legacyHeaders: false,
 // Opsional: Skip untuk localhost jika testing
 skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1',
});

// apiLimiter: Tetap untuk endpoint lain

export const apiLimiter = rateLimit({

 windowMs: 15 * 60 * 1000, // 15 menit
 max: 100, // 100 requests per IP per 15 menit
 message: 'Terlalu banyak permintaan. Coba lagi nanti.',
});