import * as repo from "../repositories/transaksiRepository.js";
import AppError from "../utils/AppError.js";
import db from "../config/db.js";

export const getUserTransaksiPaginated = async (
  userId,
  page = 1,
  limit = 10
) => {
  page = Math.max(parseInt(page), 1);
  limit = Math.min(parseInt(limit), 50);

  const offset = (page - 1) * limit;

  const [data, totalData] = await Promise.all([
    repo.findAllByUserPaginated(userId, limit, offset),
    repo.countByUser(userId),
  ]);

  return {
    meta: {
      page,
      limit,
      totalData,
      totalPage: Math.ceil(totalData / limit),
    },
    data,
  };
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
