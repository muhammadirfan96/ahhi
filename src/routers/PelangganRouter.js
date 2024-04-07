import express from 'express';
import {
  showPelanggan,
  findPelanggan,
  createPelanggan,
  updatePelanggan,
  deletePelanggan
} from '../controllers/PelangganController.js';
import {
  showPelangganValidation,
  findPelangganValidation,
  createPelangganValidation,
  updatePelangganValidation,
  deletePelangganValidation
} from '../validations/PelangganValidation.js';
import verifyToken from '../middlewares/verifyToken.js';

const PelangganRouter = express.Router();

PelangganRouter.get(
  '/pelanggan/:id',
  verifyToken,
  showPelangganValidation,
  showPelanggan
);

PelangganRouter.get(
  '/pelanggan',
  verifyToken,
  findPelangganValidation,
  findPelanggan
);

PelangganRouter.post(
  '/pelanggan',
  verifyToken,
  createPelangganValidation,
  createPelanggan
);

PelangganRouter.patch(
  '/pelanggan/:id',
  verifyToken,
  updatePelangganValidation,
  updatePelanggan
);

PelangganRouter.delete(
  '/pelanggan/:id',
  verifyToken,
  deletePelangganValidation,
  deletePelanggan
);

export default PelangganRouter;
