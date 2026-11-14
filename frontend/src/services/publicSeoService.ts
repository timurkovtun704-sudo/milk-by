
import { apiRequest, ApiError } from "./apiClient";

import type { NewsSeoMetadata } from "../types/news";

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

interface BackendSeoMetadata {
  title: string;
  description: string;
  h1: string;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  is_indexable: boolean;
  is_followable: boolean;
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

function mapSeoMetadata(value: unknown): NewsSeoMetadata {
  if (!isRecord(value)) {
    throw new Error("Некорректный ответ SEO API");
  }

  if (
    typeof value.title !== "string" ||
    typeof value.description !== "string" ||
    typeof value.h1 !== "string"
  ) {
    throw new Error("SEO-запись содержит некорректные данные");
  }

  return {
    title: value.title,
    description: value.description,
    h1: value.h1,

    canonicalUrl:
      typeof value.canonical_url === "string"
        ? value.canonical_url
        : null,

    ogTitle:
      typeof value.og_title === "string"
        ? value.og_title
        : null,

    ogDescription:
      typeof value.og_description === "string"
        ? value.og_description
        : null,

    ogImageUrl:
      typeof value.og_image_url === "string"
        ? value.og_image_url
        : null,

    isIndexable:
      typeof value.is_indexable === "boolean"
        ? value.is_indexable
        : true,

    isFollowable:
      typeof value.is_followable === "boolean"
        ? value.is_followable
        : true,
  };
}

// Получение публичных SEO-метаданных по полному URL страницы
export async function getPublicSeoMetadata(
  path: string,
  signal?: AbortSignal
): Promise<NewsSeoMetadata | null> {
  const query = new URLSearchParams({ path });

  let response: ApiResponse;

  try {
    response = await apiRequest<ApiResponse>(
      `/seo/metadata?${query.toString()}`,
      {
        method: "GET",
        signal,
      }
    );
  } catch (error) {
    // Отсутствие SEO-записи не является ошибкой загрузки новости
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }

  if (!response.success || response.data === undefined) {
    throw new Error(
      response.message || "Не удалось получить SEO-метаданные"
    );
  }

  return mapSeoMetadata(response.data);
}
