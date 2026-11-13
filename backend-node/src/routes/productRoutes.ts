
import { Router } from "express";

import {
    getAllProductsController,
    createProductController,
    getProductByIdController,
    updateProductController,
    deleteProductController,
    getCategoriesController
} from '../controllers/productController.js';

import {
  searchProductsController
} from '../controllers/productSearchController.js';

import { requireAuth, requireRole } from '../middleware/authMiddleware.js';



const router = Router();

router.get('/search', searchProductsController);

// Получить все товары
router.get('/', getAllProductsController);

// Получить категории
router.get('/categories', getCategoriesController);

// Получить товар по ID
router.get('/:id', getProductByIdController);

// Создать товар — admin и editor
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'editor'),
  createProductController
);

// Обновить товар — admin и editor
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'editor'),
  updateProductController
);

// Удалить товар — только admin
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  deleteProductController
);

export default router;
