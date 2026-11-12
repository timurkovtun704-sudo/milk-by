import { Request, Response } from 'express';
import { checkSupabaseConnection } from '../services/supabaseService.js';

export const getSystemStatus = async (_req: Request, res: Response) => {
  try {
    await checkSupabaseConnection();

    return res.status(200).json({
      status: 'ok',
      server: 'running',
      database: 'connected',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      server: 'running',
      database: 'disconnected',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};