import express from 'express';
import { showPenerimaanBarang, findPenerimaanBarang } from '../controllers/PenerimaanBarangController.js';
import {
  showPenerimaanBarangValidation,
  findPenerimaanBarangValidation
} from '../validations/PenerimaanBarangValidation.js';
import verifyToken from '../middlewares/verifyToken.js';

const PenerimaanBarangRouter = express.Router();

PenerimaanBarangRouter.get(
  '/penerimaan-barang/:id',
  verifyToken,
  showPenerimaanBarangValidation,
  showPenerimaanBarang
);

PenerimaanBarangRouter.get('/penerimaan-barang', verifyToken, findPenerimaanBarangValidation, findPenerimaanBarang);

export default PenerimaanBarangRouter;
