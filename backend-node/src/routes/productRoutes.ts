
import { Router } from "express";

import {
    getAllProductsController,
    createProductController,
    getProductByIdController,
    updateProductController,
    deleteProductController,
    getCategoriesController,
    createCategoryController,
    renameCategoryController, 
    deleteCategoryController
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

// Создать категорию — admin и editor
router.post(
    '/categories',
    requireAuth,
    requireRole('admin', 'editor'),
    createCategoryController
);

// Переименовать категорию — admin и editor
router.patch(
    '/categories/:id',
    requireAuth,
    requireRole('admin', 'editor'),
    renameCategoryController
);

// Удалить категорию — только admin
router.delete(
    '/categories/:id',
    requireAuth,
    requireRole('admin'),
    deleteCategoryController
);

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
