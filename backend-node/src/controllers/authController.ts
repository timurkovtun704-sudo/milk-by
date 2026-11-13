
import type { Request, Response } from 'express';
import { z } from 'zod';
import { loginUser } from '../services/authService.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginController = async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Некорректный email или пароль',
    });
  }

  try {
    const result = await loginUser(
      validation.data.email,
      validation.data.password
    );

    return res.status(200).json({
      success: true,
      message: 'Авторизация успешна',
      data: result,
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Неверный email или пароль',
    });
  }
};
