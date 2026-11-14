import { RequestHandler } from "express";
import { b2bContactSchema } from "./b2bSchema";

// Проверка данных перед передачей в контроллер
export const validateB2BContact: RequestHandler = (
  req,
  res,
  next
) => {
  const result = b2bContactSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Некорректные данные обращения",
      errors: result.error.flatten().fieldErrors,
    });

    return;
  }

  // Передаём дальше уже проверенные данные
  req.body = result.data;

  next();
};
