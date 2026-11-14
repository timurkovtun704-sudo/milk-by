
import { Request, Response, NextFunction } from 'express';
import {
    getSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory
} from '../services/productService.js';

export const getSubcategoriesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoryId = req.query.categoryId
            ? Number(req.query.categoryId)
            : undefined;

        if (categoryId !== undefined && !Number.isInteger(categoryId)) {
            return res.status(400).json({ message: 'Некорректный categoryId' });
        }

        const data = await getSubcategories(categoryId);
        return res.json(data);
    } catch (error) {
        next(error);
    }
};

export const createSubcategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, categoryId } = req.body;

        if (
            typeof name !== 'string' ||
            !name.trim() ||
            !Number.isInteger(Number(categoryId)) ||
            Number(categoryId) <= 0
        ) {
            return res.status(400).json({
                message: 'Укажите название и корректный categoryId'
            });
        }

        const data = await createSubcategory(name.trim(), Number(categoryId));
        return res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

export const updateSubcategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);
        const { name, categoryId } = req.body;

        if (
            !Number.isInteger(id) || id <= 0 ||
            typeof name !== 'string' || !name.trim() ||
            !Number.isInteger(Number(categoryId)) || Number(categoryId) <= 0
        ) {
            return res.status(400).json({
                message: 'Укажите корректные id, название и categoryId'
            });
        }

        const data = await updateSubcategory(id, name.trim(), Number(categoryId));

        if (!data) {
            return res.status(404).json({ message: 'Подкатегория не найдена' });
        }

        return res.json(data);
    } catch (error) {
        next(error);
    }
};

export const deleteSubcategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Некорректный id' });
        }

        const data = await deleteSubcategory(id);

        if (!data) {
            return res.status(404).json({ message: 'Подкатегория не найдена' });
        }

        return res.json({ message: 'Подкатегория удалена', data });
    } catch (error) {
        next(error);
    }
};
