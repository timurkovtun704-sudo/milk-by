import type { RequestHandler, Response } from "express";

import {
  SeoServiceError,
  getPublicSeoEntry,
  getSeoEntryById,
  getSeoEntries,
  createSeoEntry as saveSeoEntry,
  updateSeoEntry as saveSeoEntryChanges,
  deleteSeoEntry as removeSeoEntry,
  getSitemapEntries,
  getSeoRedirects,
  createSeoRedirect as saveSeoRedirect,
  updateSeoRedirect as saveSeoRedirectChanges,
  deleteSeoRedirect as removeSeoRedirect,
} from "../services/seoService.js";

import type {
  SeoEntryCreateDto,
  SeoEntryUpdateDto,
  SeoRedirectCreateDto,
  SeoRedirectUpdateDto,
  SeoEntityType,
  SeoLanguage,
} from "../validators/seoSchema.js";

// Единая обработка ошибок SEO API
const handleSeoError = (
  res: Response,
  error: unknown,
  defaultMessage: string
): void => {
  if (error instanceof SeoServiceError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  console.error("SEO API error:", error);

  res.status(500).json({
    success: false,
    message: defaultMessage,
  });
};

// Проверка параметров пагинации
const parsePaginationValue = (
  value: unknown,
  defaultValue: number,
  maxValue: number
): number | null => {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }

  const parsedValue = Number(value);

  if (
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < 1 ||
    parsedValue > maxValue
  ) {
    return null;
  }

  return parsedValue;
};

// ---------------------------------------------------------
// Публичные методы
// ---------------------------------------------------------

// Получение SEO-метаданных по URL страницы
export const getSeoMetadata: RequestHandler = async (
  _req,
  res
) => {
  try {
    const path = res.locals.seoPath as string;

    const entry = await getPublicSeoEntry(path);

    if (!entry) {
      res.status(404).json({
        success: false,
        message: "SEO-данные для указанной страницы не найдены",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    handleSeoError(
      res,
      error,
      "Не удалось получить SEO-метаданные"
    );
  }
};

// Динамическое формирование sitemap.xml
export const getSeoSitemap: RequestHandler = async (
  _req,
  res
) => {
  try {
    const configuredSiteUrl = process.env.SITE_URL;

    if (!configuredSiteUrl) {
      throw new SeoServiceError(
        "Не настроена переменная окружения SITE_URL",
        500
      );
    }

    let siteOrigin: string;

    try {
      const parsedUrl = new URL(configuredSiteUrl);

      if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
      ) {
        throw new Error("Недопустимый протокол");
      }

      siteOrigin = parsedUrl.origin;
    } catch {
      throw new SeoServiceError(
        "Переменная SITE_URL содержит некорректный адрес",
        500
      );
    }

    const entries = await getSitemapEntries();

    // Экранирование специальных XML-символов
    const escapeXml = (value: string): string => {
      return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };

    const urls = entries.map((entry) => {
      const location = new URL(entry.path, siteOrigin).toString();
      const lastModified = new Date(entry.updated_at);

      const lastmod = Number.isNaN(lastModified.getTime())
        ? ""
        : `<lastmod>${lastModified.toISOString()}</lastmod>`;

      return `
        <url>
          <loc>${escapeXml(location)}</loc>
          ${lastmod}
        </url>
      `;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(200).send(xml);
  } catch (error) {
    handleSeoError(
      res,
      error,
      "Не удалось сформировать sitemap"
    );
  }
};

// ---------------------------------------------------------
// Административные методы SEO-записей
// Эти обработчики должны быть доступны только администраторам
// ---------------------------------------------------------

// Получение списка SEO-записей
export const listSeoEntries: RequestHandler = async (
  req,
  res
) => {
  try {
    const page = parsePaginationValue(req.query.page, 1, 100000);
    const limit = parsePaginationValue(req.query.limit, 50, 100);

    if (page === null || limit === null) {
      res.status(400).json({
        success: false,
        message: "Некорректные параметры пагинации",
      });

      return;
    }

    let entityType: SeoEntityType | undefined;
    let languageCode: SeoLanguage | undefined;

    if (req.query.entity_type !== undefined) {
      const value = req.query.entity_type;

      if (
        typeof value !== "string" ||
        !["page", "product", "news"].includes(value)
      ) {
        res.status(400).json({
          success: false,
          message: "Некорректный тип SEO-объекта",
        });

        return;
      }

      entityType = value as SeoEntityType;
    }

    if (req.query.language_code !== undefined) {
      const value = req.query.language_code;

      if (
        typeof value !== "string" ||
        !["ru", "be", "en", "zh"].includes(value)
      ) {
        res.status(400).json({
          success: false,
          message: "Некорректный язык",
        });

        return;
      }

      languageCode = value as SeoLanguage;
    }

    const result = await getSeoEntries({
      page,
      limit,
      entityType,
      languageCode,
    });

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        total_pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    handleSeoError(
      res,
      error,
      "Не удалось получить список SEO-записей"
    );
  }
};

// Получение SEO-записи по ID
export const getSeoEntry: RequestHandler = async (
  _req,
  res
) => {
  try {
    const id = res.locals.seoId as number;
    const entry = await getSeoEntryById(id);

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    handleSeoError(
      res,
      error,
      "Не удалось получить SEO-запись"
    );
  }
};

// Создание SEO-записи
export const createSeoEntry: RequestHandler = async (
  req,
  res
) => {
  try {
    const entryData = req.body as SeoEntryCreateDto;
    const entry = await saveSeoEntry(entryData);

    res.status(201).json({
      success: true,
      message: "SEO-запись успешно создана",
      data: entry,
    });
  } catch (error) {
    handleSeoError(
      res,
      error,
      "Не удалось создать SEO-запись"
    );
  }
};

// Изменение SEO-записи
export const updateSeoEntry: RequestHandler = async (
  req,
  res
) => {
  try {
    const id = res.locals.seoId as number;
    const updateData = req.body as SeoEntryUpdateDto;

    const entry = await saveSeoEntryChanges(id, updateData);

    res.status(200).json({
      success: true,
      message: "SEO-запись успешно обновлена",
      data: entry,
    });
  } catch (error) {
    handleSeoError(
      res,
      error,
      "Не удалось обновить SEO-запись"
    );
  }
};

// Удаление SEO-записи
export const deleteSeoEntry: RequestHandler = async (
  _req,
  res
) => {
  try {
    const id = res.locals.seoId as number;

    await removeSeoEntry(id);

    res.status(200).json({
      success: true,
      message: "SEO-запись успешно удалена",
    });
  } catch (error) {
    handleSeoError(
      res,
      error,
      "Не удалось удалить SEO-запись"
    );
  }
};

// ---------------------------------------------------------
// Административные методы 301-перенаправлений
// Эти обработчики должны быть доступны только администраторам
// ---------------------------------------------------------

// Получение списка перенаправлений
export const listSeoRedirects: RequestHandler = async (
  req,
  res
) => {
  try {
    const page = parsePaginationValue(req.query.page, 1, 100000);
    const limit = parsePaginationValue(req.query.limit, 50, 100);

    if (page === null || limit === null) {
      res.status(400).json({
        success: false,
        message: "Некорректные параметры пагинации",
      });

      return;
    }

    const result = await getSeoRedirects({ page, limit });

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        total_pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    handleSeoError(
      res,
      error,
      "Не удалось получить список перенаправлений"
    );
  }
};

// Создание 301-перенаправления
export const createSeoRedirect: RequestHandler = async (
  req,
  res
) => {
  try {
    const redirectData = req.body as SeoRedirectCreateDto;
    const redirect = await saveSeoRedirect(redirectData);

    res.status(201).json({
      success: true,
      message: "Перенаправление успешно создано",
      data: redirect,
    });
  } catch (error) {
    handleSeoError(
      res,
      error,
      "Не удалось создать перенаправление"
    );
  }
};

// Изменение 301-перенаправления
export const updateSeoRedirect: RequestHandler = async (
  req,
  res
) => {
  try {
    const id = res.locals.seoId as number;
    const updateData = req.body as SeoRedirectUpdateDto;

    const redirect = await saveSeoRedirectChanges(id, updateData);

    res.status(200).json({
      success: true,
      message: "Перенаправление успешно обновлено",
      data: redirect,
    });
  } catch (error) {
    handleSeoError(
      res,
      error,
      "Не удалось обновить перенаправление"
    );
  }
};

// Удаление 301-перенаправления
export const deleteSeoRedirect: RequestHandler = async (
  _req,
  res
) => {
  try {
    const id = res.locals.seoId as number;

    await removeSeoRedirect(id);

    res.status(200).json({
      success: true,
      message: "Перенаправление успешно удалено",
    });
  } catch (error) {
    handleSeoError(
      res,
      error,
      "Не удалось удалить перенаправление"
    );
  }
};
