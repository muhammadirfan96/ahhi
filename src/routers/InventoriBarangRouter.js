import express from 'express';
import {
  showInventoriBarang,
  findInventoriBarang
} from '../controllers/InventoriBarangController.js';
import {
  showInventoriBarangValidation,
  findInventoriBarangValidation
} from '../validations/InventoriBarangValidation.js';
import verifyToken from '../middlewares/verifyToken.js';

const InventoriBarangRouter = express.Router();

InventoriBarangRouter.get(
  '/inventori-barang/:id',
  verifyToken,
  showInventoriBarangValidation,
  showInventoriBarang
);

InventoriBarangRouter.get(
  '/inventori-barang',
  verifyToken,
  findInventoriBarangValidation,
  findInventoriBarang
);

export default InventoriBarangRouter;
