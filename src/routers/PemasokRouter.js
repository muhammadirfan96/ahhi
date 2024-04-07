import express from 'express';
import {
  showPemasok,
  findPemasok,
  createPemasok,
  updatePemasok,
  deletePemasok
} from '../controllers/PemasokController.js';
import {
  showPemasokValidation,
  findPemasokValidation,
  createPemasokValidation,
  updatePemasokValidation,
  deletePemasokValidation
} from '../validations/PemasokValidation.js';
import verifyToken from '../middlewares/verifyToken.js';

const PemasokRouter = express.Router();

PemasokRouter.get(
  '/pemasok/:id',
  verifyToken,
  showPemasokValidation,
  showPemasok
);

PemasokRouter.get(
  '/pemasok',
  verifyToken,
  findPemasokValidation,
  findPemasok
);

PemasokRouter.post(
  '/pemasok',
  verifyToken,
  createPemasokValidation,
  createPemasok
);

PemasokRouter.patch(
  '/pemasok/:id',
  verifyToken,
  updatePemasokValidation,
  updatePemasok
);

PemasokRouter.delete(
  '/pemasok/:id',
  verifyToken,
  deletePemasokValidation,
  deletePemasok
);

export default PemasokRouter;
