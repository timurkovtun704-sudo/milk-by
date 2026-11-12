
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



const router = Router();

router.get('/search', searchProductsController);

// Получить все товары
router.get('/', getAllProductsController);

// Получить категории
router.get('/categories', getCategoriesController);

// Получить товар по ID
router.get('/:id', getProductByIdController);

// Создать товар
router.post('/', createProductController);

// Обновить товар
router.patch('/:id', updateProductController);

// Удалить товар
router.delete('/:id', deleteProductController);

export default router;
