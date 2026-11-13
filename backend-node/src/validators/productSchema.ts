
import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(1, 'Название товара обязательно'),
    description: z.string().nullable(),
    price: z.number().nonnegative().nullable(),
    image_url: z.string().url().nullable(),
    category: z.string().nullable(),
    fat_content: z.number()
        .min(0, 'Жирность не может быть отрицательной')
        .max(100, 'Жирность не может быть больше 100')
        .nullable()
        .optional(),
    is_active: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: 'Необходимо указать хотя бы одно поле для обновления',
    }
);
