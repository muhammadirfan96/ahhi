import express from 'express';
import {
  showProduct,
  findProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage
} from '../controllers/ProductsController.js';
import {
  showProductValidation,
  findProductsValidation,
  createProductValidation,
  updateProductValidation,
  deleteProductValidation,
  uploadImageValidation
} from '../validations/ProductsValidation.js';
import verifyToken from '../middlewares/verifyToken.js';
const ProductsRouter = express.Router();

ProductsRouter.get(
  '/product/:id',
  	verifyToken,
  showProductValidation,
  showProduct
);
ProductsRouter.get(
  '/products',
  	verifyToken,
  findProductsValidation,
  findProducts
);
ProductsRouter.post(
  '/product',
  verifyToken,
  createProductValidation,
  createProduct
);
ProductsRouter.patch(
  '/product/:id',
  verifyToken,
  updateProductValidation,
  updateProduct
);
ProductsRouter.delete(
  '/product/:id',
  verifyToken,
  deleteProductValidation,
  deleteProduct
);
ProductsRouter.patch(
  '/product/:id/photo',
  verifyToken,
  uploadImageValidation,
  uploadImage
);

export default ProductsRouter;
