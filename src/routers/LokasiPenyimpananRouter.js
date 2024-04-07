import express from 'express';
import {
  showLokasiPenyimpanan,
  findLokasiPenyimpanan
} from '../controllers/LokasiPenyimpananController.js';
import {
  showLokasiPenyimpananValidation,
  findLokasiPenyimpananValidation
} from '../validations/LokasiPenyimpananValidation.js';
import verifyToken from '../middlewares/verifyToken.js';

const LokasiPenyimpananRouter = express.Router();

LokasiPenyimpananRouter.get(
  '/lokasi-penyimpanan/:id',
  verifyToken,
  showLokasiPenyimpananValidation,
  showLokasiPenyimpanan
);

LokasiPenyimpananRouter.get(
  '/lokasi-penyimpanan',
  verifyToken,
  findLokasiPenyimpananValidation,
  findLokasiPenyimpanan
);

export default LokasiPenyimpananRouter;
