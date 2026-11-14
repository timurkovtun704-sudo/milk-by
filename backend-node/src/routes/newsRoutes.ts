
import { Router } from 'express';

import {
    getAllNewsController,
    getAllNewsForAdminController,
    getNewsByIdController,
    getNewsBySlugController,
    createNewsController,
    updateNewsController,
    deleteNewsController,
    publishNewsController,
    unpublishNewsController,
    getNewsCategoriesController,
    createNewsCategoryController,
    deleteNewsCategoryController
} from '../controllers/newsController.js';

import {
    requireAuth,
    requireRole
} from '../middleware/authMiddleware.js';

const router = Router();

// Получить опубликованные новости
router.get('/', getAllNewsController);

// Получить все новости для админки
router.get(
    '/admin/all',
    requireAuth,
    requireRole('admin', 'editor'),
    getAllNewsForAdminController
);

// Получить категории
router.get('/categories', getNewsCategoriesController);

// Создать категорию
router.post(
    '/categories',
    requireAuth,
    requireRole('admin', 'editor'),
    createNewsCategoryController
);

// Удалить категорию
router.delete(
    '/categories/:id',
    requireAuth,
    requireRole('admin'),
    deleteNewsCategoryController
);

// Получить новость по slug
router.get('/slug/:slug', getNewsBySlugController);

// Получить новость по ID
router.get('/:id', getNewsByIdController);

// Создать новость
router.post(
    '/',
    requireAuth,
    requireRole('admin', 'editor'),
    createNewsController
);

// Обновить новость
router.patch(
    '/:id',
    requireAuth,
    requireRole('admin', 'editor'),
    updateNewsController
);

// Опубликовать новость
router.patch(
    '/:id/publish',
    requireAuth,
    requireRole('admin', 'editor'),
    publishNewsController
);

// Снять новость с публикации
router.patch(
    '/:id/unpublish',
    requireAuth,
    requireRole('admin', 'editor'),
    unpublishNewsController
);

// Удалить новость
router.delete(
    '/:id',
    requireAuth,
    requireRole('admin'),
    deleteNewsController
);

export default router;
