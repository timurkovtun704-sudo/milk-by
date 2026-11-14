import { supabase } from "../config/supabase.js";

import type {
  SeoEntryCreateDto,
  SeoEntryUpdateDto,
  SeoRedirectCreateDto,
  SeoRedirectUpdateDto,
  SeoLanguage,
  SeoEntityType,
} from "../validators/seoSchema.js";

// Ошибка SEO-сервиса с HTTP-статусом
export class SeoServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "SeoServiceError";
    this.statusCode = statusCode;
  }
}

// Проверка соответствия URL языку записи
const isLocalizedPath = (
  path: string,
  languageCode: string
): boolean => {
  return (
    new RegExp(`^/${languageCode}(/|$)`).test(path) &&
    !/[?#\s]/.test(path) &&
    !path.startsWith("//")
  );
};

// Преобразование ошибок Supabase в понятные ошибки API
const handleDatabaseError = (
  error: { code?: string },
  defaultMessage: string
): never => {
  if (error.code === "23505") {
    throw new SeoServiceError(
      "Запись с такими параметрами уже существует",
      409
    );
  }

  if (error.code === "23514" || error.code === "22P02") {
    throw new SeoServiceError(
      "Данные не соответствуют ограничениям базы данных",
      400
    );
  }

  throw new SeoServiceError(defaultMessage, 500);
};

// ---------------------------------------------------------
// SEO-метаданные
// ---------------------------------------------------------

// Получение публичной SEO-записи по URL
export const getPublicSeoEntry = async (path: string) => {
  const { data, error } = await supabase
    .from("seo_entries")
    .select("*")
    .eq("path", path)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    handleDatabaseError(error, "Не удалось получить SEO-данные");
  }

  return data;
};

// Получение SEO-записи по ID
export const getSeoEntryById = async (id: number) => {
  const { data, error } = await supabase
    .from("seo_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    handleDatabaseError(error, "Не удалось получить SEO-запись");
  }

  if (!data) {
    throw new SeoServiceError("SEO-запись не найдена", 404);
  }

  return data;
};

// Получение списка SEO-записей с фильтрами и пагинацией
export const getSeoEntries = async (params: {
  page: number;
  limit: number;
  entityType?: SeoEntityType;
  languageCode?: SeoLanguage;
}) => {
  const offset = (params.page - 1) * params.limit;

  let query = supabase
    .from("seo_entries")
    .select("*", { count: "exact" });

  if (params.entityType) {
    query = query.eq("entity_type", params.entityType);
  }

  if (params.languageCode) {
    query = query.eq("language_code", params.languageCode);
  }

  const { data, error, count } = await query
    .order("updated_at", { ascending: false })
    .range(offset, offset + params.limit - 1);

  if (error) {
    handleDatabaseError(error, "Не удалось получить список SEO-записей");
  }

  return {
    items: data ?? [],
    total: count ?? 0,
  };
};

// Создание SEO-записи
export const createSeoEntry = async (data: SeoEntryCreateDto) => {
  const { data: createdEntry, error } = await supabase
    .from("seo_entries")
    .insert(data)
    .select("*")
    .single();

  if (error) {
    handleDatabaseError(error, "Не удалось создать SEO-запись");
  }

  return createdEntry;
};

// Изменение SEO-записи
export const updateSeoEntry = async (
  id: number,
  data: SeoEntryUpdateDto
) => {
  const currentEntry = await getSeoEntryById(id);

  // Проверяем URL с учётом языка существующей записи
  if (
    data.path !== undefined &&
    !isLocalizedPath(data.path, currentEntry.language_code)
  ) {
    throw new SeoServiceError(
      "Новый URL должен соответствовать языку SEO-записи",
      400
    );
  }

  const { data: updatedEntry, error } = await supabase
    .from("seo_entries")
    .update(data)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    handleDatabaseError(error, "Не удалось обновить SEO-запись");
  }

  if (!updatedEntry) {
    throw new SeoServiceError("SEO-запись не найдена", 404);
  }

  return updatedEntry;
};

// Удаление SEO-записи
export const deleteSeoEntry = async (id: number): Promise<void> => {
  const { data, error } = await supabase
    .from("seo_entries")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    handleDatabaseError(error, "Не удалось удалить SEO-запись");
  }

  if (!data) {
    throw new SeoServiceError("SEO-запись не найдена", 404);
  }
};

// ---------------------------------------------------------
// Данные для sitemap.xml
// ---------------------------------------------------------

// Получение всех опубликованных и индексируемых URL
// Используем постраничное чтение, чтобы не упираться в лимит Supabase
export const getSitemapEntries = async (): Promise<
  Array<{ path: string; updated_at: string }>
> => {
  const entries: Array<{ path: string; updated_at: string }> = [];
  const batchSize = 1000;

  for (let offset = 0; ; offset += batchSize) {
    const { data, error } = await supabase
      .from("seo_entries")
      .select("path, updated_at")
      .eq("is_published", true)
      .eq("is_indexable", true)
      .order("path", { ascending: true })
      .range(offset, offset + batchSize - 1);

    if (error) {
      handleDatabaseError(error, "Не удалось сформировать sitemap");
    }

    const batch = data ?? [];
    entries.push(...batch);

    if (batch.length < batchSize) {
      break;
    }
  }

  return entries;
};

// ---------------------------------------------------------
// 301-перенаправления
// ---------------------------------------------------------

// Поиск активного перенаправления по старому URL
export const getActiveSeoRedirect = async (sourcePath: string) => {
  const { data, error } = await supabase
    .from("seo_redirects")
    .select("*")
    .eq("source_path", sourcePath)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    handleDatabaseError(error, "Не удалось проверить перенаправление");
  }

  return data;
};

// Получение списка перенаправлений с пагинацией
export const getSeoRedirects = async (params: {
  page: number;
  limit: number;
}) => {
  const offset = (params.page - 1) * params.limit;

  const { data, error, count } = await supabase
    .from("seo_redirects")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + params.limit - 1);

  if (error) {
    handleDatabaseError(
      error,
      "Не удалось получить список перенаправлений"
    );
  }

  return {
    items: data ?? [],
    total: count ?? 0,
  };
};

// Создание 301-перенаправления
export const createSeoRedirect = async (
  data: SeoRedirectCreateDto
) => {
  const { data: createdRedirect, error } = await supabase
    .from("seo_redirects")
    .insert({
      ...data,
      status_code: 301,
    })
    .select("*")
    .single();

  if (error) {
    handleDatabaseError(
      error,
      "Не удалось создать перенаправление"
    );
  }

  return createdRedirect;
};

// Изменение 301-перенаправления
export const updateSeoRedirect = async (
  id: number,
  data: SeoRedirectUpdateDto
) => {
  // Получаем существующую запись, чтобы проверить язык
  const { data: currentRedirect, error: findError } = await supabase
    .from("seo_redirects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (findError) {
    handleDatabaseError(
      findError,
      "Не удалось получить перенаправление"
    );
  }

  if (!currentRedirect) {
    throw new SeoServiceError("Перенаправление не найдено", 404);
  }

  if (data.destination_path !== undefined) {
    if (
      !isLocalizedPath(
        data.destination_path,
        currentRedirect.language_code
      )
    ) {
      throw new SeoServiceError(
        "Целевой URL должен соответствовать языку перенаправления",
        400
      );
    }

    if (data.destination_path === currentRedirect.source_path) {
      throw new SeoServiceError(
        "Исходный и целевой URL не могут совпадать",
        400
      );
    }
  }

  const { data: updatedRedirect, error } = await supabase
    .from("seo_redirects")
    .update(data)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    handleDatabaseError(
      error,
      "Не удалось обновить перенаправление"
    );
  }

  if (!updatedRedirect) {
    throw new SeoServiceError("Перенаправление не найдено", 404);
  }

  return updatedRedirect;
};

// Удаление 301-перенаправления
export const deleteSeoRedirect = async (
  id: number
): Promise<void> => {
  const { data, error } = await supabase
    .from("seo_redirects")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    handleDatabaseError(
      error,
      "Не удалось удалить перенаправление"
    );
  }

  if (!data) {
    throw new SeoServiceError("Перенаправление не найдено", 404);
  }
};
