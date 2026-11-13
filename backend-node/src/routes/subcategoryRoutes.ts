
import { Router } from 'express';

import {
    getSubcategoriesController,
    createSubcategoryController,
    updateSubcategoryController,
    deleteSubcategoryController
} from '../controllers/subcategoryController.js';

import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Получить все подкатегории или подкатегории конкретной категории
router.get('/', getSubcategoriesController);

// Создать подкатегорию — admin и editor
router.post(
    '/',
    requireAuth,
    requireRole('admin', 'editor'),
    createSubcategoryController
);

// Изменить подкатегорию — admin и editor
router.patch(
    '/:id',
    requireAuth,
    requireRole('admin', 'editor'),
    updateSubcategoryController
);

// Удалить подкатегорию — только admin
router.delete(
    '/:id',
    requireAuth,
    requireRole('admin'),
    deleteSubcategoryController
);

export default router;
