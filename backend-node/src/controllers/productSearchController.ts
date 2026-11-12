
import { Request, Response } from 'express';
import {
  searchProducts,
  ProductSearchOptions,
} from '../services/productSearchService.js';

export const searchProductsController = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 12);

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

    const sortBy = req.query.sortBy === 'created_at'
      ? 'created_at'
      : 'name';

    const order = req.query.order === 'desc'
      ? 'desc'
      : 'asc';

    const options: ProductSearchOptions = {
      search: String(req.query.search ?? ''),
      category: String(req.query.category ?? ''),
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
    return res.status(500).json({
      success: false,
      message: 'Ошибка поиска товаров',
    });
  }
};
