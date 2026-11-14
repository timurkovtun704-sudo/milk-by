
import { apiRequest } from "./apiClient";

// Новость из административного API
export interface AdminNewsArticle {
  id: string;
  categoryId: string | null;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  publishedAt: string | null;
  isPublished: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

// Категория новостей
export interface AdminNewsCategory {
  id: string;
  name: string;
}

// Данные создания и обновления публикации
export interface AdminNewsPayload {
  category_id: number | null;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  published_at: string | null;
  is_published: boolean;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function extractData<T>(
  response: unknown,
  fallback: string
): T {
  if (!isRecord(response) || response.success !== true) {
    const message =
      isRecord(response) &&
      typeof response.message === "string"
        ? response.message
        : fallback;

    throw new Error(message);
  }

  if (!("data" in response)) {
    throw new Error(fallback);
  }

  return response.data as T;
}

function assertSuccess(
  response: unknown,
  fallback: string
): void {
  if (!isRecord(response) || response.success !== true) {
    const message =
      isRecord(response) &&
      typeof response.message === "string"
        ? response.message
        : fallback;

    throw new Error(message);
  }
}

function parseId(value: unknown, entity: string): string {
  const numericId = Number(value);

  if (
    !Number.isSafeInteger(numericId) ||
    numericId <= 0
  ) {
    throw new Error(`Backend вернул некорректный ID: ${entity}`);
  }

  return String(numericId);
}

function mapNewsRecord(value: unknown): AdminNewsArticle {
  if (!isRecord(value)) {
    throw new Error("Backend вернул некорректную публикацию");
  }

  const id = parseId(value.id, "новости");

  if (
    typeof value.title !== "string" ||
    typeof value.slug !== "string" ||
    typeof value.content !== "string"
  ) {
    throw new Error("У публикации отсутствуют обязательные поля");
  }

  if (typeof value.is_published !== "boolean") {
    throw new Error("Backend вернул некорректный статус публикации");
  }

  const categoryId =
    value.category_id === null ||
    value.category_id === undefined
      ? null
      : parseId(value.category_id, "категории");

  return {
    id,
    categoryId,
    title: value.title,
    slug: value.slug,
    content: value.content,
    imageUrl:
      typeof value.image_url === "string"
        ? value.image_url
        : null,
    publishedAt:
      typeof value.published_at === "string"
        ? value.published_at
        : null,
    isPublished: value.is_published,
    createdAt:
      typeof value.created_at === "string"
        ? value.created_at
        : null,
    updatedAt:
      typeof value.updated_at === "string"
        ? value.updated_at
        : null,
  };
}

function mapCategoryRecord(value: unknown): AdminNewsCategory {
  if (!isRecord(value)) {
    throw new Error("Backend вернул некорректную категорию");
  }

  if (typeof value.name !== "string") {
    throw new Error("У категории отсутствует название");
  }

  return {
    id: parseId(value.id, "категории"),
    name: value.name,
  };
}

// Получить все новости, включая черновики
export async function getAdminNews(
  token: string,
  signal?: AbortSignal
): Promise<AdminNewsArticle[]> {
  const response = await apiRequest<ApiResponse<unknown>>(
    "/news/admin/all",
    {
      token,
      signal,
    }
  );

  const data = extractData<unknown>(
    response,
    "Не удалось получить список новостей"
  );

  if (!Array.isArray(data)) {
    throw new Error("Backend вернул некорректный список новостей");
  }

  return data.map(mapNewsRecord);
}

// Получить категории новостей
export async function getAdminNewsCategories(
  signal?: AbortSignal
): Promise<AdminNewsCategory[]> {
  const response = await apiRequest<ApiResponse<unknown>>(
    "/news/categories",
    { signal }
  );

  const data = extractData<unknown>(
    response,
    "Не удалось получить категории новостей"
  );

  if (!Array.isArray(data)) {
    throw new Error("Backend вернул некорректный список категорий");
  }

  return data.map(mapCategoryRecord);
}

// Создать новость
export async function createAdminNews(
  payload: AdminNewsPayload,
  token: string
): Promise<AdminNewsArticle> {
  const response = await apiRequest<ApiResponse<unknown>>(
    "/news",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );

  const data = extractData<unknown>(
    response,
    "Не удалось создать публикацию"
  );

  return mapNewsRecord(data);
}

// Обновить новость
export async function updateAdminNews(
  id: string,
  payload: AdminNewsPayload,
  token: string
): Promise<AdminNewsArticle> {
  const numericId = parseId(id, "новости");

  const response = await apiRequest<ApiResponse<unknown>>(
    `/news/${numericId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }
  );

  const data = extractData<unknown>(
    response,
    "Не удалось обновить публикацию"
  );

  return mapNewsRecord(data);
}

// Удалить новость
export async function deleteAdminNews(
  id: string,
  token: string
): Promise<void> {
  const numericId = parseId(id, "новости");

  const response = await apiRequest<ApiResponse>(
    `/news/${numericId}`,
    {
      method: "DELETE",
      token,
    }
  );

  assertSuccess(response, "Не удалось удалить публикацию");
}

// Опубликовать новость
export async function publishAdminNews(
  id: string,
  token: string
): Promise<void> {
  const numericId = parseId(id, "новости");

  const response = await apiRequest<ApiResponse>(
    `/news/${numericId}/publish`,
    {
      method: "PATCH",
      token,
    }
  );

  assertSuccess(response, "Не удалось опубликовать новость");
}

// Снять новость с публикации
export async function unpublishAdminNews(
  id: string,
  token: string
): Promise<void> {
  const numericId = parseId(id, "новости");

  const response = await apiRequest<ApiResponse>(
    `/news/${numericId}/unpublish`,
    {
      method: "PATCH",
      token,
    }
  );

  assertSuccess(response, "Не удалось снять новость с публикации");
}

// Создать категорию новостей
export async function createAdminNewsCategory(
  name: string,
  token: string
): Promise<AdminNewsCategory> {
  const response = await apiRequest<ApiResponse<unknown>>(
    "/news/categories",
    {
      method: "POST",
      token,
      body: JSON.stringify({
        name: name.trim(),
      }),
    }
  );

  const data = extractData<unknown>(
    response,
    "Не удалось создать категорию"
  );

  return mapCategoryRecord(data);
}

// Удалить категорию новостей
export async function deleteAdminNewsCategory(
  id: string,
  token: string
): Promise<void> {
  const numericId = parseId(id, "категории");

  const response = await apiRequest<ApiResponse>(
    `/news/categories/${numericId}`,
    {
      method: "DELETE",
      token,
    }
  );

  assertSuccess(response, "Не удалось удалить категорию");
}
