import * as service from "../services/kategoriService.js";

export const getAllKategori = async (req, res, next) => {
  try {
    const data = await service.getAllKategori(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
