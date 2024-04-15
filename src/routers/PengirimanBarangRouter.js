import express from 'express';
import {
  showPengirimanBarang,
  findPengirimanBarang
} from '../controllers/PengirimanBarangController.js';
import {
  showPengirimanBarangValidation,
  findPengirimanBarangValidation
} from '../validations/PengirimanBarangValidation.js';
import verifyToken from '../middlewares/verifyToken.js';

const PengirimanBarangRouter = express.Router();

PengirimanBarangRouter.get(
  '/pengiriman-barang/:id',
  verifyToken,
  showPengirimanBarangValidation,
  showPengirimanBarang
);

PengirimanBarangRouter.get(
  '/pengiriman-barang',
  verifyToken,
  findPengirimanBarangValidation,
  findPengirimanBarang
);

export default PengirimanBarangRouter;
