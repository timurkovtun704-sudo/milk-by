
import { z } from 'zod';

// Схема проверки данных при создании товара
export const createProductSchema = z.object({
    name: z.string().min(1, 'Название товара обязательно'),

    description: z.string().nullable(),

    price: z.number().nonnegative().nullable(),

    image_url: z.string().url().nullable(),

    category: z.string().nullable(),

    is_active: z.boolean().optional(),
});

// Схема проверки данных при обновлении товара
export const updateProductSchema = createProductSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: 'Необходимо указать хотя бы одно поле для обновления',
    }
);