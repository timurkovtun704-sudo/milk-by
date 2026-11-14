import { apiRequest } from "./apiClient";

export type SeoLanguage = "ru" | "be" | "en" | "zh";
export type SeoEntityType = "page" | "product" | "news";

export interface SeoEntry {
  id: number;
  entity_type: SeoEntityType;
  entity_id: number | null;
  language_code: SeoLanguage;
  path: string;
  translation_group: string;
  title: string;
  description: string;
  h1: string;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  is_indexable: boolean;
  is_followable: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SeoRedirect {
  id: number;
  language_code: SeoLanguage;
  source_path: string;
  destination_path: string;
  status_code: 301;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SeoEntryCreatePayload {
  entity_type: SeoEntityType;
  entity_id: number | null;
  language_code: SeoLanguage;
  path: string;
  title: string;
  description: string;
  h1: string;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  is_indexable: boolean;
  is_followable: boolean;
  is_published: boolean;
}

export interface SeoEntryUpdatePayload {
  path?: string;
  title?: string;
  description?: string;
  h1?: string;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  is_indexable?: boolean;
  is_followable?: boolean;
  is_published?: boolean;
}

export interface SeoRedirectCreatePayload {
  language_code: SeoLanguage;
  source_path: string;
  destination_path: string;
  is_active: boolean;
}

export interface SeoRedirectUpdatePayload {
  destination_path?: string;
  is_active?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface SeoListResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface SeoPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SeoListResult<T> {
  items: T[];
  pagination: SeoPagination;
}

function buildListResult<T>(
  response: SeoListResponse<T>,
): SeoListResult<T> {
  if (!response.success) {
    throw new Error("The server returned an unsuccessful response.");
  }

  return {
    items: response.data,
    pagination: {
      page: response.pagination.page,
      limit: response.pagination.limit,
      total: response.pagination.total,
      totalPages: response.pagination.total_pages,
    },
  };
}

function buildQuery(params: {
  page: number;
  limit: number;
  entity_type?: SeoEntityType;
  language_code?: SeoLanguage;
}): string {
  const query = new URLSearchParams();

  query.set("page", String(params.page));
  query.set("limit", String(params.limit));

  if (params.entity_type) {
    query.set("entity_type", params.entity_type);
  }

  if (params.language_code) {
    query.set("language_code", params.language_code);
  }

  return query.toString();
}

export async function getSeoEntries(
  token: string,
  params: {
    page: number;
    limit: number;
    entity_type?: SeoEntityType;
    language_code?: SeoLanguage;
  },
  signal?: AbortSignal,
): Promise<SeoListResult<SeoEntry>> {
  const response = await apiRequest<SeoListResponse<SeoEntry>>(
    `/seo/entries?${buildQuery(params)}`,
    { method: "GET", token, signal },
  );

  return buildListResult(response);
}

export async function createSeoEntry(
  token: string,
  payload: SeoEntryCreatePayload,
): Promise<SeoEntry> {
  const response = await apiRequest<ApiResponse<SeoEntry>>(
    "/seo/entries",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to create SEO entry.");
  }

  return response.data;
}

export async function updateSeoEntry(
  token: string,
  id: number,
  payload: SeoEntryUpdatePayload,
): Promise<SeoEntry> {
  const response = await apiRequest<ApiResponse<SeoEntry>>(
    `/seo/entries/${id}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to update SEO entry.");
  }

  return response.data;
}

export async function deleteSeoEntry(
  token: string,
  id: number,
): Promise<void> {
  const response = await apiRequest<{
    success: boolean;
    message?: string;
  }>(`/seo/entries/${id}`, {
    method: "DELETE",
    token,
  });

  if (!response.success) {
    throw new Error(response.message || "Failed to delete SEO entry.");
  }
}

export async function getSeoRedirects(
  token: string,
  page: number,
  limit: number,
  signal?: AbortSignal,
): Promise<SeoListResult<SeoRedirect>> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await apiRequest<SeoListResponse<SeoRedirect>>(
    `/seo/redirects?${query.toString()}`,
    { method: "GET", token, signal },
  );

  return buildListResult(response);
}

export async function createSeoRedirect(
  token: string,
  payload: SeoRedirectCreatePayload,
): Promise<SeoRedirect> {
  const response = await apiRequest<ApiResponse<SeoRedirect>>(
    "/seo/redirects",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to create redirect.");
  }

  return response.data;
}

export async function updateSeoRedirect(
  token: string,
  id: number,
  payload: SeoRedirectUpdatePayload,
): Promise<SeoRedirect> {
  const response = await apiRequest<ApiResponse<SeoRedirect>>(
    `/seo/redirects/${id}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to update redirect.");
  }

  return response.data;
}

export async function deleteSeoRedirect(
  token: string,
  id: number,
): Promise<void> {
  const response = await apiRequest<{
    success: boolean;
    message?: string;
  }>(`/seo/redirects/${id}`, {
    method: "DELETE",
    token,
  });

  if (!response.success) {
    throw new Error(response.message || "Failed to delete redirect.");
  }
}