import type { Request, Response } from 'express';

import {
    searchProducts,
    type ProductSearchOptions,
} from '../services/productSearchService.js';

export const searchProductsController = async (
    req: Request,
    res: Response
) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 12);

        // Проверка параметров пагинации
        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: 'Некорректные параметры страницы',
            });
        }

        // Сортировка
        const sortBy =
            req.query.sortBy === 'created_at'
                ? 'created_at'
                : 'name';

        const order =
            req.query.order === 'desc'
                ? 'desc'
                : 'asc';

        // Массовая доля жира
        const fatProcent =
            req.query.fatProcent !== undefined
                ? Number(req.query.fatProcent)
                : undefined;

        if (
            fatProcent !== undefined &&
            (
                !Number.isFinite(fatProcent) ||
                fatProcent < 0 ||
                fatProcent > 100
            )
        ) {
            return res.status(400).json({
                success: false,
                message: 'Некорректное значение массовой доли жира',
            });
        }

        // Получение текстовых параметров поиска
        const readTextQuery = (value: unknown): string => {
            return typeof value === 'string'
                ? value.trim()
                : '';
        };

        // Формирование параметров поиска
        const options: ProductSearchOptions = {
            search: readTextQuery(req.query.search),

            category: readTextQuery(req.query.category),

            fatProcent,

            weight: readTextQuery(req.query.weight),

            storageConditions: readTextQuery(
                req.query.storageConditions
            ),

            shelfLife: readTextQuery(
                req.query.shelfLife
            ),

            energyValue: readTextQuery(
                req.query.energyValue
            ),

            itemsPerCase: readTextQuery(
                req.query.itemsPerCase
            ),

            sortBy,
            order,
            page,
            limit,
        };

        const result = await searchProducts(options);

        return res.status(200).json({
            success: true,
            data: result.products,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
        });
    } catch (error) {
        console.error('[products] Ошибка поиска товаров:', error);

        return res.status(500).json({
            success: false,
            message: 'Ошибка поиска товаров',
        });
    }
};