import * as repo from "../repositories/kategoriRepository.js";
import AppError from "../utils/AppError.js";

export const getAllKategori = async (userId) => {
  const rows = await repo.findAllByUser(userId);
  if (!rows) {
    throw new AppError("Kategori tidak ditemukan", 404);
  }
  return rows;
};
