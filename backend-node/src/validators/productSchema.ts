import { z } from "zod";

// Схема создания товара
export const createProductSchema = z.object({
  name: z.string().min(1, "Название товара обязательно"),

  description: z.string().nullable(),

  // Цена пока не передаётся текущей формой frontend
  price: z.number().nonnegative().nullable().optional(),

  image_url: z.string().url().nullable(),

  category: z.string().nullable(),

  // Массовая доля жира
  fat_procent: z.number()
    .min(0, "Массовая доля жира не может быть отрицательной")
    .max(100, "Массовая доля жира не может быть больше 100"),

  // Обязательные текстовые характеристики
  weight: z.string()
    .trim()
    .min(1, "Масса продукта обязательна"),

  storage_conditions: z.string()
    .trim()
    .min(1, "Условия хранения обязательны"),

  shelf_life: z.string()
    .trim()
    .min(1, "Срок годности обязателен"),

  energy_value: z.string()
    .trim()
    .min(1, "Энергетическая ценность обязательна"),

  items_per_case: z.string()
    .trim()
    .min(1, "Количество товара в транспортной упаковке обязательно"),

  is_active: z.boolean().optional(),
});

// Схема частичного обновления товара
export const updateProductSchema = createProductSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Необходимо указать хотя бы одно поле для обновления",
    }
  );