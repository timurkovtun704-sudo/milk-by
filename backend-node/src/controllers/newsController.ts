
import { Request, Response } from 'express';

import {
    getAllNews,
    getAllNewsForAdmin,
    getNewsById,
    getNewsBySlug,
    createNews,
    updateNews,
    deleteNews,
    publishNews,
    unpublishNews,
    getNewsCategories,
    createNewsCategory,
    deleteNewsCategory
} from '../services/newsService.js';

// Получить опубликованные новости с поиском и фильтрами
export const getAllNewsController = async (
    req: Request,
    res: Response
) => {
    try {
        const searchValue = req.query.search;
        const categoryValue = req.query.categoryId;
        const yearValue = req.query.year;

        if (
            searchValue !== undefined &&
            typeof searchValue !== 'string'
        ) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный поисковый запрос'
            });
        }

        if (
            categoryValue !== undefined &&
            (
                typeof categoryValue !== 'string' ||
                !/^[1-9]\d*$/.test(categoryValue)
            )
        ) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный ID категории'
            });
        }

        if (
            yearValue !== undefined &&
            (
                typeof yearValue !== 'string' ||
                !/^\d{4}$/.test(yearValue) ||
                Number(yearValue) < 1900 ||
                Number(yearValue) > 9999
            )
        ) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный год'
            });
        }

        const search = typeof searchValue === 'string'
            ? searchValue.trim()
            : undefined;

        const categoryId = typeof categoryValue === 'string'
            ? Number(categoryValue)
            : undefined;

        const year = typeof yearValue === 'string'
            ? Number(yearValue)
            : undefined;

        const news = await getAllNews(
            search || undefined,
            categoryId,
            year
        );

        return res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка получения новостей'
        });
    }
};

// Получить все новости для админки
export const getAllNewsForAdminController = async (
    _req: Request,
    res: Response
) => {
    try {
        const news = await getAllNewsForAdmin();
        return res.status(200).json({ success: true, data: news });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка получения новостей'
        });
    }
};

// Получить новость по ID
export const getNewsByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный ID новости'
            });
        }

        const news = await getNewsById(id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Новость не найдена'
            });
        }

        return res.status(200).json({ success: true, data: news });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка получения новости'
        });
    }
};

// Получить опубликованную новость по slug
export const getNewsBySlugController = async (
    req: Request,
    res: Response
) => {
    try {
        const slug = String(req.params.slug);

        const news = await getNewsBySlug(slug);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Новость не найдена'
            });
        }

        return res.status(200).json({ success: true, data: news });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка получения новости'
        });
    }
};

// Создать новость
export const createNewsController = async (
    req: Request,
    res: Response
) => {
    try {
        const news = await createNews(req.body);

        return res.status(201).json({
            success: true,
            message: 'Новость создана',
            data: news
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка создания новости'
        });
    }
};

// Обновить новость
export const updateNewsController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный ID новости'
            });
        }

        const news = await updateNews(id, req.body);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Новость не найдена'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Новость обновлена',
            data: news
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка обновления новости'
        });
    }
};

// Удалить новость
export const deleteNewsController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный ID новости'
            });
        }

        const news = await deleteNews(id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Новость не найдена'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Новость удалена'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка удаления новости'
        });
    }
};

// Опубликовать новость
export const publishNewsController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный ID новости'
            });
        }

        const news = await publishNews(id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Новость не найдена'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Новость опубликована',
            data: news
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка публикации новости'
        });
    }
};

// Снять с публикации
export const unpublishNewsController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный ID новости'
            });
        }

        const news = await unpublishNews(id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Новость не найдена'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Публикация отменена',
            data: news
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка снятия новости с публикации'
        });
    }
};

// Получить категории
export const getNewsCategoriesController = async (
    _req: Request,
    res: Response
) => {
    try {
        const categories = await getNewsCategories();

        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка получения категорий'
        });
    }
};

// Создать категорию
export const createNewsCategoryController = async (
    req: Request,
    res: Response
) => {
    try {
        const name = req.body.name;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Название категории обязательно'
            });
        }

        const category = await createNewsCategory(name.trim());

        return res.status(201).json({
            success: true,
            message: 'Категория создана',
            data: category
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка создания категории'
        });
    }
};

// Удалить категорию
export const deleteNewsCategoryController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный ID категории'
            });
        }

        const category = await deleteNewsCategory(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Категория не найдена'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Категория удалена'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка удаления категории'
        });
    }
};
