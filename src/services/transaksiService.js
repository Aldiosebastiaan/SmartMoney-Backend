import * as repo from "../repositories/transaksiRepository.js";
import AppError from "../utils/AppError.js";
import db from "../config/db.js";

export const getUserTransaksi = async (userId) => {
  const [rows] = await db.query(
    "SELECT id, nama, kategori, nominal, tanggal FROM transaksi WHERE user_id = ? ORDER BY tanggal DESC",
    [userId]
  );
  return rows;
};

export const createTransaksi = async (userId, data) => {
  const { nama, kategori, nominal, tanggal } = data;

  if (!nama || !kategori || nominal === undefined || nominal === null || !tanggal) {
    throw new AppError("Semua field transaksi harus diisi", 400);
  }

  if (isNaN(nominal)) {
    throw new AppError("Nominal harus berupa angka", 400);
  }

  return repo.insert(userId, data);
};

export const updateTransaksi = async (id, userId, data) => {
  const { nama, kategori, nominal, tanggal } = data;

  if (!nama || !kategori || nominal == null || !tanggal) {
    throw new AppError("Field transaksi tidak lengkap", 400);
  }

  if (isNaN(nominal)) {
    throw new AppError("Nominal harus berupa angka", 400);
  }

  const affected = await repo.updateById(id, userId, {
    nama,
    kategori,
    nominal: Number(nominal),
    tanggal,
  });

  if (affected === 0) {
    throw new AppError("Transaksi tidak ditemukan", 404);
  }
};


export const deleteTransaksi = async (id, userId) => {
  const affected = await repo.deleteById(id, userId);

  if (affected === 0) {
    throw new AppError("Transaksi tidak ditemukan", 404);
  }
};
