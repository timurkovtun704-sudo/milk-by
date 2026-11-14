import type { RequestHandler } from "express";
import { getActiveSeoRedirect } from "../services/seoService.js";

// Выполнение активных 301-перенаправлений
export const seoRedirectMiddleware: RequestHandler = async (
  req,
  res,
  next
) => {
  // Перенаправления обрабатываем только для GET и HEAD
  if (req.method !== "GET" && req.method !== "HEAD") {
    next();
    return;
  }

  // Проверяем, относится ли путь к поддерживаемым языкам
  const languagePathPattern = /^\/(ru|be|en|zh)(\/|$)/;

  if (!languagePathPattern.test(req.path)) {
    next();
    return;
  }

  try {
    // Ищем активное перенаправление по старому пути
    const redirect = await getActiveSeoRedirect(req.path);

    if (!redirect) {
      next();
      return;
    }

    // Сохраняем исходные query-параметры
    const queryIndex = req.originalUrl.indexOf("?");

    const queryString =
      queryIndex >= 0
        ? req.originalUrl.slice(queryIndex)
        : "";

    // Выполняем постоянное перенаправление
    res.redirect(
      301,
      `${redirect.destination_path}${queryString}`
    );
  } catch (error) {
    // Ошибка SEO-таблицы не должна блокировать работу сайта
    console.error("SEO redirect error:", error);

    next();
  }
};
