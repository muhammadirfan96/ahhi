import express from 'express';
import {
  showPergeseranBarang,
  findPergeseranBarang
} from '../controllers/PergeseranBarangController.js';
import {
  showPergeseranBarangValidation,
  findPergeseranBarangValidation
} from '../validations/PergeseranBarangValidation.js';
import verifyToken from '../middlewares/verifyToken.js';

const PergeseranBarangRouter = express.Router();

PergeseranBarangRouter.get(
  '/pergeseran-barang/:id',
  verifyToken,
  showPergeseranBarangValidation,
  showPergeseranBarang
);

PergeseranBarangRouter.get(
  '/pergeseran-barang',
  verifyToken,
  findPergeseranBarangValidation,
  findPergeseranBarang
);

export default PergeseranBarangRouter;
