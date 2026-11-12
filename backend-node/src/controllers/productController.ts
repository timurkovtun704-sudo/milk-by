
import { Request, Response } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    getCategories
} from '../services/productService.js';

import { updateProductSchema } from '../validators/productSchema.js';


export const getAllProductsController = async (req: Request,res: Response) => {
    try {
        const products = await getAllProducts();

        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Server error'
        });
    }
};


export const getProductByIdController = async ( req: Request,res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid product ID'
        });
    }

    try {
        const product = await getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error? error.message: 'Server error'
        });
    }
};


export const createProductController = async ( req: Request, res: Response) => {
    const {name, description, image_url, category, is_active } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Название товара обязательно'
        });
    }   

    if (typeof description !== 'string' || !description.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Описание товара обязательно'
        });
    }

    if (typeof image_url !== 'string' || !image_url.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Изображение товара обязательно'
        });
    }

    try {
        const parsedUrl = new URL(image_url);

        if (
            parsedUrl.protocol !== 'http:' &&
            parsedUrl.protocol !== 'https:'
        ) {
            throw new Error('Invalid URL');
        }
    } catch {
        return res.status(400).json({
            success: false,
            message: 'Некорректная ссылка на изображение'
        });
    }

    if (typeof is_active !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'Статус товара должен быть true или false'
        });
    }

    if (typeof category !== 'string' || !category.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Категория товара обязательна'
        });
    }

    try {
        const product = await createProduct({
            name: name.trim(),
            description: description.trim(),
            image_url: image_url.trim(),
            category: category.trim(),
            is_active: is_active
        });
        

        return res.status(201).json({
            success: true,
            message: 'Товар успешно создан',
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Ошибка сервера'
        });
    };
}

export const deleteProductController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid product ID'
        });
    }

    try {
        const deleteId = await deleteProduct(id);

        if (!deleteId) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Товар успешно удалён'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Server error'
        });
    }
};


export const updateProductController = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid product ID'
        });
    }

    const validation = updateProductSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid product data',
            errors: validation.error.issues
        });
    }

    try {
        const product = await updateProduct(id, validation.data as import('../validators/productValidator.js').UpdateProductDto);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Server error'
        });
    }
};


export const getCategoriesController = async (
    _req: Request,
    res: Response
) => {
    try {
        const categories = await getCategories();

        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Server error'
        });
    }
};
