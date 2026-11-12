import { Request, Response } from 'express';
import { getAllProducts, getProductById } from '../services/productService.js';

export const getAllProductsController = async ( req: Request, res: Response) => {
    try {
        const products = await getAllProducts();

        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Server error'
        });
    }
};

export const getProductByIdController = async ( req: Request, res: Response ) => {
    const id = Number(req.params.id)
    
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid product ID'
        });
    }

    try{
        const getId =  await getProductById(id)
        return res.status(200).json({
            success: true,
            data: getId
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Server error'
        })
    }
}