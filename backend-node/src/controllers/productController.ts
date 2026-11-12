
import { Request, Response } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct
} from '../services/productService.js';


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


export const createProductController = async (req: Request, res: Response) => {
    const { name, description, price, image_url, category, is_active } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Product name is required'
        });
    }

    try {
        const product = await createProduct({
            name: name.trim(),
            description: description ?? null,
            price: price ?? null,
            image_url: image_url ?? null,
            category: category ?? null,
            is_active: is_active ?? true
        });

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Server error'
        });
    }
};

