
import { apiRequest } from "./apiClient";

// Данные пользователя Supabase
export interface AuthUser {
  id: string;
  email?: string;

  app_metadata?: {
    role?: string;
    [key: string]: unknown;
  };
}

// Данные авторизованной сессии
export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// Проверка обычного объекта
function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

// Проверка и преобразование пользователя
function parseAuthUser(value: unknown): AuthUser {
  if (!isRecord(value) || typeof value.id !== "string") {
    throw new Error(
      "Backend вернул некорректные данные пользователя"
    );
  }

  if (
    value.email !== undefined &&
    typeof value.email !== "string"
  ) {
    throw new Error("Некорректный email пользователя");
  }

  const metadata = isRecord(value.app_metadata)
    ? value.app_metadata
    : undefined;

  return {
    id: value.id,
    email:
      typeof value.email === "string"
        ? value.email
        : undefined,

    app_metadata: metadata as AuthUser["app_metadata"],
  };
}

// Вход пользователя
export async function login(
  email: string,
  password: string
): Promise<AuthSession> {
  const response = await apiRequest<unknown>(
    "/auth/login",
    {
      method: "POST",

      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    }
  );

  if (!isRecord(response) || response.success !== true) {
    throw new Error("Не удалось выполнить авторизацию");
  }

  if (!isRecord(response.data)) {
    throw new Error(
      "Backend вернул некорректный ответ авторизации"
    );
  }

  const user = parseAuthUser(response.data.user);

  const accessToken = response.data.accessToken;
  const refreshToken = response.data.refreshToken;

  if (
    typeof accessToken !== "string" ||
    typeof refreshToken !== "string"
  ) {
    throw new Error(
      "Backend не вернул токены авторизации"
    );
  }

  return {
    user,
    accessToken,
    refreshToken,
  };
}
