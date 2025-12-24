/**
 * Middleware validasi input transaksi
 * Mencegah:
 * - Data kosong / tidak valid
 * - Logical abuse (nominal minus, tanggal aneh)
 * - Field tidak dikenal (overposting)
 */
const validateTransaksi = (req, res, next) => {
  const { nama, kategori, nominal, tanggal } = req.body;

  // 1. Whitelist field (anti overposting)
  const allowedFields = ["nama", "kategori", "nominal", "tanggal"];
  const incomingFields = Object.keys(req.body);

  const invalidFields = incomingFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: "Field tidak valid",
      fields: invalidFields,
    });
  }

  // 2. Validasi nama
  if (!nama || typeof nama !== "string") {
    return res.status(400).json({
      message: "Nama transaksi wajib diisi",
    });
  }

  if (nama.length < 3 || nama.length > 100) {
    return res.status(400).json({
      message: "Nama transaksi harus 3–100 karakter",
    });
  }

  // 3. Validasi kategori (strict whitelist)
  const allowedKategori = ["Pemasukan", "Pengeluaran"];

  if (!kategori || !allowedKategori.includes(kategori)) {
    return res.status(400).json({
      message: "Kategori tidak valid",
    });
  }

  // 4. Validasi nominal
  if (nominal === undefined || nominal === null) {
    return res.status(400).json({
      message: "Nominal wajib diisi",
    });
  }

  if (typeof nominal !== "number" || isNaN(nominal)) {
    return res.status(400).json({
      message: "Nominal harus berupa angka",
    });
  }

  if (nominal <= 0) {
    return res.status(400).json({
      message: "Nominal harus lebih dari 0",
    });
  }

  // 5. Validasi tanggal
  if (!tanggal) {
    return res.status(400).json({
      message: "Tanggal wajib diisi",
    });
  }

  const date = new Date(tanggal);

  if (isNaN(date.getTime())) {
    return res.status(400).json({
      message: "Format tanggal tidak valid",
    });
  }

  // Optional: cegah tanggal terlalu jauh
  const now = new Date();
  if (date > now) {
    return res.status(400).json({
      message: "Tanggal tidak boleh di masa depan",
    });
  }

  // 6. Sanitasi ringan (defensive)
  req.body.nama = nama.trim();

  next();
};

export default validateTransaksi;
