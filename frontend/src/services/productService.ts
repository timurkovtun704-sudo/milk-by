import {
  readProductCharacteristics,
} from "../utils/productCharacteristics";

import { apiRequest } from "./apiClient";

import type {
  CatalogProduct,
  ProductCategory,
} from "../types/catalog";

// Типы ответов backend

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ProductApiRecord {
  id: number | string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;

  // Шесть характеристик товара
  fat_procent?: number | string | null;
  weight?: string | null;
  storage_conditions?: string | null;
  shelf_life?: string | null;
  energy_value?: string | null;
  items_per_case?: string | null;
}

interface ProductSearchResponse {
  success: boolean;
  data: ProductApiRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Расширенный тип товара для административной панели
export interface AdminProduct extends CatalogProduct {
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Данные создания товара
// Все шесть характеристик обязательны и не допускают null.
export interface CreateAdminProductDto {
  name: string;
  description: string;
  image_url: string;
  category: string;
  is_active: boolean;

  fat_procent: number;
  weight: string;
  storage_conditions: string;
  shelf_life: string;
  energy_value: string;
  items_per_case: string;
}

// Данные изменения товара
// При частичном обновлении передаются только изменяемые поля.
export interface UpdateAdminProductDto {
  name?: string;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
  is_active?: boolean;

  fat_procent?: number;
  weight?: string;
  storage_conditions?: string;
  shelf_life?: string;
  energy_value?: string;
  items_per_case?: string;
}

// Вспомогательные функции

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

// Преобразование ответа backend в типы frontend

function mapProduct(
  product: ProductApiRecord,
  includeInactive = false
): CatalogProduct | null {
  if (product.is_active === false && !includeInactive) {
    return null;
  }

  const numericId = Number(product.id);

  if (
    !Number.isSafeInteger(numericId) ||
    numericId <= 0
  ) {
    throw new Error("Backend вернул некорректный ID товара");
  }

  if (
    typeof product.name !== "string" ||
    !product.name.trim()
  ) {
    throw new Error("У товара отсутствует название");
  }

  const id = String(numericId);

  const imageUrl =
    typeof product.image_url === "string" &&
    product.image_url.trim()
      ? product.image_url.trim()
      : undefined;

  return {
    id,

    // В текущей БД отдельного slug нет.
    // Используем числовой ID для получения товара.
    slug: id,

    name: product.name.trim(),

    description:
      typeof product.description === "string"
        ? product.description
        : null,

    imageUrl,

    categoryId:
      typeof product.category === "string"
        ? product.category
        : "",

    // Обычный объект, совместимый с CatalogProduct.attributes.
    attributes: {
      ...readProductCharacteristics(product),
    },

    publishedAt:
      typeof product.created_at === "string"
        ? product.created_at
        : null,
  };
}

function mapAdminProduct(
  product: ProductApiRecord
): AdminProduct {
  const mapped = mapProduct(product, true);

  if (!mapped) {
    throw new Error("Не удалось преобразовать товар");
  }

  return {
    ...mapped,
    isActive: product.is_active ?? true,
    createdAt: product.created_at ?? null,
    updatedAt: product.updated_at ?? null,
  };
}

function assertApiSuccess<T>(
  response: ApiResponse<T> | null | undefined,
  errorMessage: string
): T {
  if (
    !response ||
    response.success !== true ||
    response.data === undefined
  ) {
    throw new Error(
      response?.message || errorMessage
    );
  }

  return response.data;
}

// Публичный каталог

async function getProductsPage(
  page: number,
  signal?: AbortSignal
): Promise<ProductSearchResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: "100",
    sortBy: "name",
    order: "asc",
  });

  const response = await apiRequest<ProductSearchResponse>(
    `/products/search?${params.toString()}`,
    { signal }
  );

  if (
    !response ||
    response.success !== true ||
    !Array.isArray(response.data) ||
    !isRecord(response.pagination)
  ) {
    throw new Error(
      "Backend вернул некорректный формат товаров"
    );
  }

  const totalPages = Number(
    response.pagination.totalPages
  );

  if (
    !Number.isSafeInteger(totalPages) ||
    totalPages < 0
  ) {
    throw new Error(
      "Backend вернул некорректную пагинацию товаров"
    );
  }

  return response;
}

// Получение всех активных товаров с пагинацией
export async function getAllProducts(
  signal?: AbortSignal
): Promise<CatalogProduct[]> {
  const firstPage = await getProductsPage(1, signal);

  const productsById = new Map<string, CatalogProduct>();

  function addProducts(items: ProductApiRecord[]) {
    for (const item of items) {
      const product = mapProduct(item);

      if (product) {
        productsById.set(product.id, product);
      }
    }
  }

  addProducts(firstPage.data);

  for (
    let page = 2;
    page <= firstPage.pagination.totalPages;
    page += 1
  ) {
    const response = await getProductsPage(page, signal);
    addProducts(response.data);
  }

  return [...productsById.values()];
}

// Получение отдельного активного товара по числовому ID
export async function getProductById(
  id: string,
  signal?: AbortSignal
): Promise<CatalogProduct | null> {
  const numericId = Number(id);

  if (
    !Number.isSafeInteger(numericId) ||
    numericId <= 0
  ) {
    return null;
  }

  const response = await apiRequest<
    ApiResponse<ProductApiRecord>
  >(`/products/${numericId}`, { signal });

  const product = assertApiSuccess(
    response,
    "Не удалось получить товар"
  );

  if (!isRecord(product)) {
    throw new Error(
      "Некорректный ответ при получении товара"
    );
  }

  return mapProduct(product as unknown as ProductApiRecord);
}

// Получение категорий для публичного каталога
export async function getProductCategories(
  signal?: AbortSignal
): Promise<ProductCategory[]> {
  const response = await apiRequest<
    ApiResponse<unknown>
  >("/products/categories", { signal });

  const data = assertApiSuccess(
    response,
    "Не удалось получить категории"
  );

  if (!Array.isArray(data)) {
    throw new Error(
      "Backend вернул некорректный список категорий"
    );
  }

  return data
    .filter(
      (item): item is { id: number; name: string } =>
        isRecord(item) &&
        Number.isSafeInteger(Number(item.id)) &&
        Number(item.id) > 0 &&
        typeof item.name === "string" &&
        item.name.trim().length > 0
    )
    .map((item) => ({
      // ID оставляем названием категории,
      // чтобы не нарушить связь с существующими товарами.
      id: item.name.trim(),
      slug: item.name
        .trim()
        .toLocaleLowerCase()
        .replace(/\s+/g, "-"),
      name: item.name.trim(),
      parentId: null,
    }));
}

// Одновременная загрузка товаров и категорий
export async function getCatalogData(
  signal?: AbortSignal
): Promise<{
  products: CatalogProduct[];
  categories: ProductCategory[];
}> {
  const [products, categories] = await Promise.all([
    getAllProducts(signal),
    getProductCategories(signal),
  ]);

  return {
    products,
    categories,
  };
}

// Административное управление товарами

// Получение всех товаров, включая неактивные
export async function getAdminProducts(
  token: string,
  signal?: AbortSignal
): Promise<AdminProduct[]> {
  const response = await apiRequest<
    ApiResponse<ProductApiRecord[]>
  >("/products", {
    token,
    signal,
  });

  const data = assertApiSuccess(
    response,
    "Не удалось получить список товаров"
  );

  if (!Array.isArray(data)) {
    throw new Error(
      "Backend вернул некорректный список товаров"
    );
  }

  return data.map(mapAdminProduct);
}

// Создание товара
export async function createAdminProduct(
  payload: CreateAdminProductDto,
  token: string
): Promise<AdminProduct> {
  const response = await apiRequest<
    ApiResponse<ProductApiRecord>
  >("/products", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

  const data = assertApiSuccess(
    response,
    "Не удалось создать товар"
  );

  if (!isRecord(data)) {
    throw new Error(
      "Backend вернул некорректный товар"
    );
  }

  return mapAdminProduct(data as unknown as ProductApiRecord);
}

// Изменение товара
export async function updateAdminProduct(
  id: string,
  payload: UpdateAdminProductDto,
  token: string
): Promise<AdminProduct> {
  const numericId = Number(id);

  if (
    !Number.isSafeInteger(numericId) ||
    numericId <= 0
  ) {
    throw new Error("Некорректный ID товара");
  }

  if (Object.keys(payload).length === 0) {
    throw new Error(
      "Не указаны данные для обновления товара"
    );
  }

  const response = await apiRequest<
    ApiResponse<ProductApiRecord>
  >(`/products/${numericId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

  const data = assertApiSuccess(
    response,
    "Не удалось обновить товар"
  );

  if (!isRecord(data)) {
    throw new Error(
      "Backend вернул некорректный товар"
    );
  }

  return mapAdminProduct(data as unknown as ProductApiRecord);
}

// Удаление товара
export async function deleteAdminProduct(
  id: string,
  token: string
): Promise<void> {
  const numericId = Number(id);

  if (
    !Number.isSafeInteger(numericId) ||
    numericId <= 0
  ) {
    throw new Error("Некорректный ID товара");
  }

  await apiRequest<ApiResponse<unknown>>(
    `/products/${numericId}`,
    {
      method: "DELETE",
      token,
    }
  );
}