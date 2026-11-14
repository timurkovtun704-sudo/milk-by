import { RequestHandler } from "express";
import {
  createB2BContact as saveB2BContact,
  B2BServiceError,
} from "../services/b2bService.js";
import type { B2BContactDto } from "../validators/b2bSchema.js";

// Обработка отправки обращения в отдел продаж
export const createB2BContact: RequestHandler = async (
  req,
  res
) => {
  try {
    const contactData = req.body as B2BContactDto;

    await saveB2BContact(contactData);

    res.status(201).json({
      success: true,
      message: "Обращение успешно отправлено",
    });
  } catch (error) {
    if (error instanceof B2BServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера",
    });
  }
};
