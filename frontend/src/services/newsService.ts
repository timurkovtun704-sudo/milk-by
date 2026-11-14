
import { apiRequest } from "./apiClient";

import type {
  NewsArticle,
  NewsCategory,
} from "../types/news";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface BackendNews {
  id: number | string;
  category_id?: number | string | null;
  title: string;
  slug: string;
  content?: string | null;
  image_url?: string | null;
  published_at?: string | null;
  created_at?: string | null;
}

interface BackendNewsCategory {
  id: number | string;
  name: string;
}

function extractData<T>(response: unknown): T {
  if (
    typeof response !== "object" ||
    response === null ||
    !("success" in response) ||
    response.success !== true ||
    !("data" in response)
  ) {
    throw new Error("Некорректный ответ сервера новостей");
  }

  return response.data as T;
}

function mapNewsArticle(record: BackendNews): NewsArticle {
  const id = String(record.id);
  const title = record.title ?? "";
  const content = record.content?.trim() ?? "";
  const imageUrl = record.image_url?.trim() ?? "";

  const contentBlocks: NewsArticle["content"] = content
    ? [
        {
          id: `paragraph-${id}`,
          type: "paragraph",
          text: content,
        },
      ]
    : [];

  return {
    id,
    slug: record.slug || id,
    title,
    publishedAt:
      record.published_at ??
      record.created_at ??
      "",
    categoryId:
      record.category_id === null ||
      record.category_id === undefined
        ? null
        : String(record.category_id),
    coverImage: imageUrl
      ? {
          url: imageUrl,
          alt: title,
        }
      : null,
    content: contentBlocks,
  };
}

function mapNewsCategory(
  record: BackendNewsCategory
): NewsCategory {
  const id = String(record.id);

  return {
    id,
    slug: id,
    name: record.name,
  };
}

// Получить опубликованные новости
export async function getNewsList(): Promise<NewsArticle[]> {
  const response = await apiRequest<
    ApiResponse<BackendNews[]>
  >("/news");

  const data = extractData<BackendNews[]>(response);

  if (!Array.isArray(data)) {
    throw new Error("Сервер вернул некорректный список новостей");
  }

  return data.map(mapNewsArticle);
}

// Получить категории новостей
export async function getNewsCategories(): Promise<NewsCategory[]> {
  const response = await apiRequest<
    ApiResponse<BackendNewsCategory[]>
  >("/news/categories");

  const data = extractData<BackendNewsCategory[]>(response);

  if (!Array.isArray(data)) {
    throw new Error("Сервер вернул некорректный список категорий");
  }

  return data.map(mapNewsCategory);
}

// Получить опубликованную новость по slug
export async function getNewsArticleBySlug(
  slug: string
): Promise<NewsArticle> {
  const response = await apiRequest<
    ApiResponse<BackendNews>
  >(`/news/slug/${encodeURIComponent(slug)}`);

  const data = extractData<BackendNews>(response);

  if (
    typeof data !== "object" ||
    data === null ||
    data.id === undefined
  ) {
    throw new Error("Сервер вернул некорректную публикацию");
  }

  return mapNewsArticle(data);
}
