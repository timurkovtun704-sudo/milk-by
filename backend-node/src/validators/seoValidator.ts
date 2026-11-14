import type { RequestHandler } from "express";
import { z } from "zod";

import {
  seoEntryCreateSchema,
  seoEntryUpdateSchema,
  seoRedirectCreateSchema,
  seoRedirectUpdateSchema,
  seoMetadataQuerySchema,
} from "./seoSchema.js";

// Универсальная проверка тела HTTP-запроса
const createBodyValidator = (
  schema: z.ZodTypeAny
): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Некорректные данные запроса",
        errors: result.error.flatten().fieldErrors,
      });

      return;
    }

    // Передаём контроллеру только проверенные данные
    req.body = result.data;

    next();
  };
};

// Проверка данных для создания SEO-записи
export const validateSeoEntryCreate = createBodyValidator(
  seoEntryCreateSchema
);

// Проверка данных для изменения SEO-записи
export const validateSeoEntryUpdate = createBodyValidator(
  seoEntryUpdateSchema
);

// Проверка данных для создания перенаправления
export const validateSeoRedirectCreate = createBodyValidator(
  seoRedirectCreateSchema
);

// Проверка данных для изменения перенаправления
export const validateSeoRedirectUpdate = createBodyValidator(
  seoRedirectUpdateSchema
);

// Проверка ID SEO-записи или перенаправления
export const validateSeoIdParam: RequestHandler = (
  req,
  res,
  next
) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    res.status(400).json({
      success: false,
      message: "Некорректный ID",
    });

    return;
  }

  // Передаём проверенный ID следующим обработчикам
  res.locals.seoId = id;

  next();
};

// Проверка URL для получения SEO-метаданных
export const validateSeoMetadataQuery: RequestHandler = (
  req,
  res,
  next
) => {
  const result = seoMetadataQuerySchema.safeParse(
    req.query.path
  );

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Необходимо передать корректный параметр path",
      errors: result.error.flatten(),
    });

    return;
  }

  // Сохраняем проверенный путь для контроллера
  res.locals.seoPath = result.data;

  next();
};
