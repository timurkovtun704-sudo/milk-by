
import { supabase } from "../config/supabase.js";
import type { B2BContactDto } from "../validators/b2bSchema.js";

// Ошибка B2B-сервиса с HTTP-статусом
export class B2BServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "B2BServiceError";
    this.statusCode = statusCode;
  }
}

// Отправка обращения в отдел продаж
export const createB2BContact = async (
  data: B2BContactDto
): Promise<void> => {
  let subject = data.subject?.trim() || null;

  // Если пользователь указал товар, проверяем его существование
  if (data.product_id !== undefined) {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name")
      .eq("id", data.product_id)
      .eq("is_active", true)
      .maybeSingle();

    if (productError) {
      throw new B2BServiceError(
        "Не удалось проверить товар",
        500
      );
    }

    if (!product) {
      throw new B2BServiceError(
        "Товар не найден или больше не доступен",
        404
      );
    }

    // Добавляем название товара в тему обращения
    subject = subject
      ? `${subject} — товар: ${product.name}`
      : `Запрос по товару: ${product.name}`;
  }

  // Сохраняем обращение в существующую таблицу feedback
  const { error } = await supabase
    .from("feedback")
    .insert({
      name: data.name,
      email: data.email,
      subject,
      message: data.message,
    });

  if (error) {
    throw new B2BServiceError(
      "Не удалось отправить обращение",
      500
    );
  }
};
