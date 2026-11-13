
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import systemRoutes from './routes/systemRoutes.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Проверка работоспособности сервера
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Milk World API is running',
  });
});

const PORT = Number(process.env.PORT) || 3000;

// Подключение маршрутов
app.use('/api', systemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
