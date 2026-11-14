import { z } from "zod";

// Схема проверки обращения в отдел продаж
export const b2bContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(150, "Имя не должно превышать 150 символов"),

  email: z
    .string()
    .trim()
    .email("Указан некорректный email")
    .max(254, "Email слишком длинный"),

  subject: z
    .string()
    .trim()
    .max(200, "Тема не должна превышать 200 символов")
    .optional(),

  message: z
    .string()
    .trim()
    .min(10, "Сообщение должно содержать минимум 10 символов")
    .max(5000, "Сообщение не должно превышать 5000 символов"),

  // Необязательный ID товара, по которому отправлено обращение
  product_id: z
    .number()
    .int("ID товара должен быть целым числом")
    .positive("ID товара должен быть положительным")
    .optional(),
}).strict();

// Тип данных для B2B-обращения
export type B2BContactDto = z.infer<typeof b2bContactSchema>;
