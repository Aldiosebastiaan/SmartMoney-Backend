import * as service from "../services/transaksiService.js";

export const getTransaksi = async (req, res, next) => {
  try {
    const data = await service.getUserTransaksi(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createTransaksi = async (req, res, next) => {
  try {
    const userId = req.user.id; // dari authMiddleware
    const transaksiId = await service.createTransaksi(userId, req.body);

    res.status(201).json({
      message: "Transaksi berhasil ditambahkan",
      data: { id: transaksiId },
    });
  } catch (err) {
    next(err);
  }
};

export const updateTransaksi = async (req, res, next) => {
  try {
    await service.updateTransaksi(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({ message: "Transaksi berhasil diperbarui" });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaksi = async (req, res, next) => {
  try {
    await service.deleteTransaksi(
      req.params.id,
      req.user.id
    );
    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};
