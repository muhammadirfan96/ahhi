import express from 'express';
import { showPenerimaanBarang, findPenerimaanBarang } from '../controllers/PenerimaanBarangController.js';
import {
  showPenerimaanBarangValidation,
  findPenerimaanBarangValidation
} from '../validations/PenerimaanBarangValidation.js';
import verifyToken from '../middlewares/verifyToken.js';

const PenerimaanBarangRouter = express.Router();

PenerimaanBarangRouter.get(
  '/PenerimaanBarang/:id',
  verifyToken,
  showPenerimaanBarangValidation,
  showPenerimaanBarang
);

PenerimaanBarangRouter.get('/PenerimaanBarang', verifyToken, findPenerimaanBarangValidation, findPenerimaanBarang);

export default PenerimaanBarangRouter;
