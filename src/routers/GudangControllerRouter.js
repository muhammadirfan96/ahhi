import express from 'express';
import {
  penerimaanBarang,
  penambahanBarang,
  pengirimanBarang,
  pergeseranBarang
} from '../controllers/GudangController.js';
import {
  penerimaanBarangValidation,
  penambahanBarangValidation,
  pengirimanBarangValidation,
  pergeseranBarangValidation
} from '../validations/GudangControllerValidation.js';
import verifyToken from '../middlewares/verifyToken.js';

const GudangControllerRouter = express.Router();

GudangControllerRouter.post(
  '/penerimaan-barang',
  verifyToken,
  penerimaanBarangValidation,
  penerimaanBarang
);

GudangControllerRouter.patch(
  '/penambahan-barang/:id',
  verifyToken,
  penambahanBarangValidation,
  penambahanBarang
);

GudangControllerRouter.patch(
  '/pengiriman-barang/:id',
  verifyToken,
  pengirimanBarangValidation,
  pengirimanBarang
);

GudangControllerRouter.patch(
  '/pergeseran-barang/:id',
  verifyToken,
  pergeseranBarangValidation,
  pergeseranBarang
);

export default GudangControllerRouter;
