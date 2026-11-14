// Адрес backend API из переменных окружения
const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = (
  configuredApiUrl || "http://localhost:3000/api"
).replace(/\/+$/, "");

// Ошибка HTTP-запроса
export class ApiError extends Error {
  public readonly status: number;
  public readonly responseData: unknown;

  constructor(
    message: string,
    status: number,
    responseData?: unknown
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.responseData = responseData;
  }
}

// Параметры HTTP-запроса
export interface ApiRequestOptions
  extends Omit<RequestInit, "headers"> {
  headers?: HeadersInit;
  token?: string | null;
}

// Преобразование ответа сервера в понятное сообщение
function getErrorMessage(
  data: unknown,
  status: number
): string {
  if (typeof data === "string" && data.trim()) {
    return `${data.trim()} (HTTP ${status})`;
  }

  if (typeof data !== "object" || data === null) {
    return `Ошибка запроса. HTTP ${status}`;
  }

  const response = data as Record<string, unknown>;

  const message =
    typeof response.message === "string"
      ? response.message
      : "";

  const detailFields = [
    "error",
    "details",
    "hint",
    "code",
  ];

  const details = detailFields
    .filter((field) => {
      const value = response[field];

      return (
        typeof value === "string" ||
        typeof value === "number"
      );
    })
    .map((field) => `${field}: ${String(response[field])}`);

  // Если сервер вернул только общее сообщение,
  // дополнительно показываем остальные данные ответа.
  const isGenericMessage =
    /^(ошибка сервера|internal server error|server error)$/i.test(
      message.trim()
    );

  if (isGenericMessage && details.length === 0) {
    const otherFields = { ...response };
    delete otherFields.message;

    if (Object.keys(otherFields).length > 0) {
      details.push(JSON.stringify(otherFields));
    }
  }

  if (message && details.length > 0) {
    return `${message} (HTTP ${status}). Подробности: ${details.join("; ")}`;
  }

  if (message) {
    return `${message} (HTTP ${status})`;
  }

  if (details.length > 0) {
    return `Ошибка сервера (HTTP ${status}). ${details.join("; ")}`;
  }

  return `Ошибка запроса. HTTP ${status}`;
}

// Универсальный HTTP-запрос
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    token,
    headers: customHeaders,
    ...requestOptions
  } = options;

  const headers = new Headers(customHeaders);

  // Формат ответа по умолчанию
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // Авторизация через Bearer Token
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Определяем, нужно ли устанавливать Content-Type
  const hasBody =
    requestOptions.body !== undefined &&
    requestOptions.body !== null;

  const isFormData =
    typeof FormData !== "undefined" &&
    requestOptions.body instanceof FormData;

  if (
    hasBody &&
    !isFormData &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Формируем адрес запроса
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const url = `${API_BASE_URL}${normalizedPath}`;

  // Отправляем запрос
  const response = await fetch(url, {
    ...requestOptions,
    headers,
  });

  // Получаем тело ответа
  const responseText = await response.text();

  let responseData: unknown = undefined;

  if (responseText.trim().length > 0) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
  }

  // Обрабатываем HTTP-ошибки
  if (!response.ok) {
    console.error("[API] Ошибка HTTP-запроса:", {
      url,
      method: requestOptions.method || "GET",
      status: response.status,
      responseData,
    });

    throw new ApiError(
      getErrorMessage(responseData, response.status),
      response.status,
      responseData
    );
  }

  // Запрос без содержимого
  if (
    response.status === 204 ||
    responseText.trim().length === 0
  ) {
    return undefined as T;
  }

  return responseData as T;
}