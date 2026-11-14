import { z } from "zod";

// Поддерживаемые языки сайта
export const seoLanguageSchema = z.enum(["ru", "be", "en", "zh"]);

// Типы объектов, для которых хранятся SEO-данные
export const seoEntityTypeSchema = z.enum(["page", "product", "news"]);

// Проверка локализованного URL
const isValidLocalizedPath = (path: string, language: string): boolean => {
  const hasLanguagePrefix = new RegExp(`^/${language}(/|$)`).test(path);

  return (
    hasLanguagePrefix &&
    !/[?#\s]/.test(path) &&
    !path.startsWith("//")
  );
};

// Проверка пути для SEO-адреса по одному из поддерживаемых языков
const isSupportedLocalizedPath = (path: string): boolean => {
  return ["ru", "be", "en", "zh"].some((language) =>
    isValidLocalizedPath(path, language)
  );
};

// ---------------------------------------------------------
// Создание SEO-записи
// ---------------------------------------------------------

export const seoEntryCreateSchema = z
  .object({
    entity_type: seoEntityTypeSchema,

    // Для page значение должно быть NULL или отсутствовать.
    // Для product и news обязательно положительное число.
    entity_id: z.number().int().positive().nullable().optional(),

    language_code: seoLanguageSchema,

    // Полный локализованный путь, например /ru/about
    path: z.string().trim().min(2).max(1000),

    // UUID общей группы переводов одной страницы
    translation_group: z.string().uuid().optional(),

    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(500),
    h1: z.string().trim().min(1).max(200),

    // Канонический адрес должен быть абсолютным URL
    canonical_url: z.string().trim().url().nullable().optional(),

    // Open Graph
    og_title: z.string().trim().max(200).nullable().optional(),
    og_description: z.string().trim().max(500).nullable().optional(),
    og_image_url: z.string().trim().max(2000).nullable().optional(),

    is_indexable: z.boolean().optional(),
    is_followable: z.boolean().optional(),
    is_published: z.boolean().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.entity_type === "page" && data.entity_id != null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["entity_id"],
        message: "Для обычной страницы entity_id должен быть NULL",
      });
    }

    if (
      (data.entity_type === "product" || data.entity_type === "news") &&
      (data.entity_id === undefined || data.entity_id === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["entity_id"],
        message: "Для товара или новости необходимо указать entity_id",
      });
    }

    if (!isValidLocalizedPath(data.path, data.language_code)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["path"],
        message: "URL должен начинаться с кода указанного языка",
      });
    }
  });

// ---------------------------------------------------------
// Изменение существующей SEO-записи
// Язык, тип объекта и ID объекта не изменяются через PATCH
// ---------------------------------------------------------

export const seoEntryUpdateSchema = z
  .object({
    path: z.string().trim().min(2).max(1000).optional(),

    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(500).optional(),
    h1: z.string().trim().min(1).max(200).optional(),

    canonical_url: z.string().trim().url().nullable().optional(),

    og_title: z.string().trim().max(200).nullable().optional(),
    og_description: z.string().trim().max(500).nullable().optional(),
    og_image_url: z.string().trim().max(2000).nullable().optional(),

    is_indexable: z.boolean().optional(),
    is_followable: z.boolean().optional(),
    is_published: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Необходимо передать хотя бы одно поле для изменения",
  })
  .superRefine((data, ctx) => {
    if (data.path !== undefined && !isSupportedLocalizedPath(data.path)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["path"],
        message: "URL должен начинаться с /ru, /be, /en или /zh",
      });
    }
  });

// ---------------------------------------------------------
// Создание 301-перенаправления
// ---------------------------------------------------------

export const seoRedirectCreateSchema = z
  .object({
    language_code: seoLanguageSchema,

    source_path: z.string().trim().min(2).max(1000),
    destination_path: z.string().trim().min(2).max(1000),

    is_active: z.boolean().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!isValidLocalizedPath(data.source_path, data.language_code)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["source_path"],
        message: "Исходный URL не соответствует указанному языку",
      });
    }

    if (!isValidLocalizedPath(data.destination_path, data.language_code)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destination_path"],
        message: "Целевой URL не соответствует указанному языку",
      });
    }

    if (data.source_path === data.destination_path) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destination_path"],
        message: "Исходный и целевой URL не могут совпадать",
      });
    }
  });

// ---------------------------------------------------------
// Изменение 301-перенаправления
// Язык и исходный URL остаются неизменными
// ---------------------------------------------------------

export const seoRedirectUpdateSchema = z
  .object({
    destination_path: z.string().trim().min(2).max(1000).optional(),
    is_active: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Необходимо передать хотя бы одно поле для изменения",
  });

// ---------------------------------------------------------
// Получение SEO-метаданных по URL
// ---------------------------------------------------------

export const seoMetadataQuerySchema = z
  .string()
  .trim()
  .min(2)
  .max(1000)
  .refine(isSupportedLocalizedPath, {
    message: "Необходимо передать корректный локализованный URL",
  });

// ---------------------------------------------------------
// Типы данных для сервисов и контроллеров
// ---------------------------------------------------------

export type SeoEntryCreateDto = z.infer<typeof seoEntryCreateSchema>;
export type SeoEntryUpdateDto = z.infer<typeof seoEntryUpdateSchema>;

export type SeoRedirectCreateDto = z.infer<
  typeof seoRedirectCreateSchema
>;

export type SeoRedirectUpdateDto = z.infer<
  typeof seoRedirectUpdateSchema
>;

export type SeoLanguage = z.infer<typeof seoLanguageSchema>;
export type SeoEntityType = z.infer<typeof seoEntityTypeSchema>;
