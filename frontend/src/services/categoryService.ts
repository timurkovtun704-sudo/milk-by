import { apiRequest } from "./apiClient";

import type { ProductCategory } from "../types/catalog";

export interface CreateCategoryPayload {
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface CategoryApiRecord {
  id: number | string;
  name: string;
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

function validateCategoryId(id: string): number {
  const numericId = Number(id);

  if (
    !Number.isSafeInteger(numericId) ||
    numericId <= 0
  ) {
    throw new Error("Некорректный ID категории");
  }

  return numericId;
}

// Получение категорий с настоящими ID для административной панели
export async function getAdminCategories(
  signal?: AbortSignal
): Promise<ProductCategory[]> {
  const response = await apiRequest<ApiResponse<unknown>>(
    "/products/categories",
    { signal }
  );

  if (
    !response ||
    response.success !== true ||
    !Array.isArray(response.data)
  ) {
    throw new Error(
      response?.message || "Не удалось получить категории"
    );
  }

  return response.data.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.name !== "string"
    ) {
      throw new Error(
        "Backend вернул некорректные данные категории"
      );
    }

    const category = item as unknown as CategoryApiRecord;
    const numericId = Number(category.id);
    const name = category.name.trim();

    if (
      !Number.isSafeInteger(numericId) ||
      numericId <= 0 ||
      !name
    ) {
      throw new Error(
        "Backend вернул некорректный ID или название категории"
      );
    }

    return {
      id: String(numericId),
      slug: name.toLocaleLowerCase().replace(/\s+/g, "-"),
      name,
      parentId: null,
    };
  });
}

// Создание категории
export async function createCategory(
  payload: CreateCategoryPayload,
  token: string
): Promise<void> {
  const response = await apiRequest<ApiResponse<unknown>>(
    "/products/categories",
    {
      method: "POST",
      token,
      body: JSON.stringify({
        name: payload.name.trim(),
      }),
    }
  );

  if (!response || response.success !== true) {
    throw new Error(
      response?.message || "Не удалось создать категорию"
    );
  }
}

// Переименование категории
export async function updateCategory(
  id: string,
  payload: CreateCategoryPayload,
  token: string
): Promise<void> {
  const numericId = validateCategoryId(id);
  const name = payload.name.trim();

  if (!name) {
    throw new Error("Название категории обязательно");
  }

  const response = await apiRequest<ApiResponse<unknown>>(
    `/products/categories/${numericId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify({ name }),
    }
  );

  if (!response || response.success !== true) {
    throw new Error(
      response?.message || "Не удалось изменить категорию"
    );
  }
}

// Удаление категории
export async function deleteCategory(
  id: string,
  token: string
): Promise<void> {
  const numericId = validateCategoryId(id);

  const response = await apiRequest<ApiResponse<unknown>>(
    `/products/categories/${numericId}`,
    {
      method: "DELETE",
      token,
    }
  );

  if (!response || response.success !== true) {
    throw new Error(
      response?.message || "Не удалось удалить категорию"
    );
  }
}