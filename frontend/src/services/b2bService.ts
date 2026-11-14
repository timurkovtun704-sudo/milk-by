
import { apiRequest } from "./apiClient";

// Данные формы обращения в отдел продаж
export interface B2BContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  product_id?: number;
}

// Формат ответа backend
interface B2BContactResponse {
  success: boolean;
  message: string;
}

// Отправка обращения в отдел продаж
export async function submitB2BContact(
  payload: B2BContactPayload,
  signal?: AbortSignal
): Promise<B2BContactResponse> {
  const response = await apiRequest<B2BContactResponse>(
    "/b2b/contact",
    {
      method: "POST",
      body: JSON.stringify(payload),
      signal,
    }
  );

  if (!response || response.success !== true) {
    throw new Error(
      response?.message || "Не удалось отправить обращение"
    );
  }

  return response;
}
