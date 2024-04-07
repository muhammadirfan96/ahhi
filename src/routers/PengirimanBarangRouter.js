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
  '/PengirimanBarang/:id',
  verifyToken,
  showPengirimanBarangValidation,
  showPengirimanBarang
);

PengirimanBarangRouter.get(
  '/PengirimanBarang',
  verifyToken,
  findPengirimanBarangValidation,
  findPengirimanBarang
);

export default PengirimanBarangRouter;
