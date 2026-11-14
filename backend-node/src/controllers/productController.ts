import { Request, Response } from 'express';

import {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    getCategories,
    createCategory,
    renameCategory,
    deleteCategory
} from '../services/productService.js';

import { updateProductSchema } from '../validators/productSchema.js';

// Проверка непустой текстовой строки
const isNonEmptyString = (value: unknown): value is string => {
    return typeof value === 'string' && value.trim().length > 0;
};

// Получение сообщения из ошибки
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
    ) {
        return error.message;
    }

    return 'Ошибка сервера';
};

// Проверка кода ошибки Supabase
const hasErrorCode = (error: unknown, code: string): boolean => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === code
    );
};


export const getAllProductsController = async (
    _req: Request,
    res: Response
) => {
    try {
        const products = await getAllProducts();

        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(error)
        });
    }
};


export const getProductByIdController = async (
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
            message: getErrorMessage(error)
        });
    }
};


// Создание товара
export const createProductController = async (
    req: Request,
    res: Response
) => {
    const {
        name,
        description,
        image_url,
        category,
        is_active,
        fat_procent,
        weight,
        storage_conditions,
        shelf_life,
        energy_value,
        items_per_case
    } = req.body ?? {};

    // Проверка основных полей
    if (!isNonEmptyString(name)) {
        return res.status(400).json({
            success: false,
            message: 'Название товара обязательно'
        });
    }

    if (!isNonEmptyString(description)) {
        return res.status(400).json({
            success: false,
            message: 'Описание товара обязательно'
        });
    }

    if (!isNonEmptyString(image_url)) {
        return res.status(400).json({
            success: false,
            message: 'Изображение товара обязательно'
        });
    }

    // Проверка ссылки на изображение
    try {
        const parsedUrl = new URL(image_url.trim());

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

    if (!isNonEmptyString(category)) {
        return res.status(400).json({
            success: false,
            message: 'Категория товара обязательна'
        });
    }

    // Проверка массовой доли жира
    if (
        typeof fat_procent !== 'number' ||
        !Number.isFinite(fat_procent) ||
        fat_procent < 0 ||
        fat_procent > 100
    ) {
        return res.status(400).json({
            success: false,
            message: 'Массовая доля жира должна быть числом от 0 до 100'
        });
    }

    // Проверка обязательных текстовых характеристик
    const requiredTextFields = [
        {
            field: 'weight',
            value: weight,
            label: 'Масса продукта'
        },
        {
            field: 'storage_conditions',
            value: storage_conditions,
            label: 'Условия хранения'
        },
        {
            field: 'shelf_life',
            value: shelf_life,
            label: 'Срок годности'
        },
        {
            field: 'energy_value',
            value: energy_value,
            label: 'Энергетическая ценность'
        },
        {
            field: 'items_per_case',
            value: items_per_case,
            label: 'Количество товара в транспортной упаковке'
        }
    ];

    for (const field of requiredTextFields) {
        if (!isNonEmptyString(field.value)) {
            return res.status(400).json({
                success: false,
                message: `Поле «${field.label}» обязательно для заполнения`
            });
        }
    }

    try {
        // Отправляем товар в Supabase.
        // Все шесть характеристик передаются без null.
        const product = await createProduct({
            name: name.trim(),
            description: description.trim(),
            image_url: image_url.trim(),
            category: category.trim(),
            is_active,

            fat_procent,

            weight: weight.trim(),

            storage_conditions: storage_conditions.trim(),

            shelf_life: shelf_life.trim(),

            energy_value: energy_value.trim(),

            items_per_case: items_per_case.trim()
        });

        return res.status(201).json({
            success: true,
            message: 'Товар успешно создан',
            data: product
        });
    } catch (error) {
        console.error('[products] Ошибка создания товара:', error);

        if (hasErrorCode(error, '23505')) {
            return res.status(409).json({
                success: false,
                message: 'Товар с таким названием уже существует'
            });
        }

        return res.status(500).json({
            success: false,
            message: getErrorMessage(error)
        });
    }
};


// Удаление товара
export const deleteProductController = async (
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
        if (hasErrorCode(error, '23505')) {
            return res.status(409).json({
                success: false,
                message: 'Товар с таким названием уже существует'
            });
        }

        return res.status(500).json({
            success: false,
            message: getErrorMessage(error)
        });
    }
};


// Обновление товара
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
        const product = await updateProduct(
            id,
            validation.data as import('../validators/productValidator.js').UpdateProductDto
        );

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
            message: getErrorMessage(error)
        });
    }
};


// Получение категорий
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
            message: getErrorMessage(error)
        });
    }
};


// Создание категории
export const createCategoryController = async (
    req: Request,
    res: Response
) => {
    const { name } = req.body ?? {};

    if (!isNonEmptyString(name)) {
        return res.status(400).json({
            success: false,
            message: 'Название категории обязательно'
        });
    }

    try {
        const category = await createCategory(name.trim());

        return res.status(201).json({
            success: true,
            message: 'Категория успешно создана',
            data: category
        });
    } catch (error) {
        if (hasErrorCode(error, '23505')) {
            return res.status(409).json({
                success: false,
                message: 'Такая категория уже существует'
            });
        }

        return res.status(500).json({
            success: false,
            message: getErrorMessage(error)
        });
    }
};


// Переименование категории
export const renameCategoryController = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const { name } = req.body ?? {};

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Некорректный ID категории'
        });
    }

    if (!isNonEmptyString(name)) {
        return res.status(400).json({
            success: false,
            message: 'Название категории обязательно'
        });
    }

    try {
        const category = await renameCategory(id, name.trim());

        return res.status(200).json({
            success: true,
            message: 'Категория успешно обновлена',
            data: category
        });
    } catch (error) {
        if (hasErrorCode(error, '23505')) {
            return res.status(409).json({
                success: false,
                message: 'Такая категория уже существует'
            });
        }

        return res.status(500).json({
            success: false,
            message: getErrorMessage(error)
        });
    }
};


// Удаление категории
export const deleteCategoryController = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Некорректный ID категории'
        });
    }

    try {
        const result = await deleteCategory(id);

        if ('notFound' in result && result.notFound) {
            return res.status(404).json({
                success: false,
                message: 'Категория не найдена'
            });
        }

        if ('inUse' in result && result.inUse) {
            return res.status(409).json({
                success: false,
                message: 'Нельзя удалить категорию, пока в ней есть товары'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Категория успешно удалена'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(error)
        });
    }
};