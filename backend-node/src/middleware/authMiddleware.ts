
import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

// Проверка токена пользователя
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Необходима авторизация',
      });
    }

    const token = authHeader.slice(7);

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        message: 'Недействительный или истёкший токен',
      });
    }

    res.locals.user = data.user;

    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Ошибка проверки авторизации',
    });
  }
};

// Проверка роли пользователя
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Необходима авторизация',
      });
    }

    const role = user.app_metadata?.role;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: 'Недостаточно прав',
      });
    }

    next();
  };
};
