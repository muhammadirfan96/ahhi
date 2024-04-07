import express from 'express';
import {
  showStokBarang,
  findStokBarang,
  createStokBarang,
  updateStokBarang,
  deleteStokBarang
} from '../controllers/StokBarangController.js';
import {
  showStokBarangValidation,
  findStokBarangValidation,
  createStokBarangValidation,
  updateStokBarangValidation,
  deleteStokBarangValidation
} from '../validations/StokBarangValidation.js';
import verifyToken from '../middlewares/verifyToken.js';

const StokBarangRouter = express.Router();

StokBarangRouter.get(
  '/stok-barang/:id',
  verifyToken,
  showStokBarangValidation,
  showStokBarang
);

StokBarangRouter.get(
  '/stok-barang',
  verifyToken,
  findStokBarangValidation,
  findStokBarang
);

StokBarangRouter.post(
  '/stok-barang',
  verifyToken,
  createStokBarangValidation,
  createStokBarang
);

StokBarangRouter.patch(
  '/stok-barang/:id',
  verifyToken,
  updateStokBarangValidation,
  updateStokBarang
);

StokBarangRouter.delete(
  '/stok-barang/:id',
  verifyToken,
  deleteStokBarangValidation,
  deleteStokBarang
);

export default StokBarangRouter;
