
import { apiRequest } from "./apiClient";

export interface CreateCategoryPayload {
  name: string;
}

interface CategoryCreateResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

// Создание категории через существующий backend API
export async function createCategory(
  payload: CreateCategoryPayload,
  token: string
): Promise<void> {
  const response = await apiRequest<CategoryCreateResponse>(
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
