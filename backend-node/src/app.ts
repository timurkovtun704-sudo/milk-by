import "dotenv/config";

import express from "express";
import cors from "cors";


import systemRoutes from "./routes/systemRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import b2bRoutes from "./routes/b2bRoutes.js";
import seoRoutes from "./routes/seoRoutes.js";
import systemRoutes from './routes/systemRoutes.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import subcategoryRoutes from './routes/subcategoryRoutes.js';
import newsRoutes from './routes/newsRoutes.js';


import { getSeoSitemap } from "./controllers/seoController.js";
import { seoRedirectMiddleware } from "./middleware/seoRedirectMiddleware.js";

const app = express();

// ---------------------------------------------------------
// Основные middleware
// ---------------------------------------------------------

app.use(cors());
app.use(express.json());

// Проверка 301-перенаправлений для локализованных URL
app.use(seoRedirectMiddleware);

// ---------------------------------------------------------
// Публичные системные маршруты
// ---------------------------------------------------------

// Проверка работоспособности сервера
<<<<<<< HEAD
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Milk World API is running",
  });
=======
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Milk World API is running',
    });
>>>>>>> 52c8380c522818272d6df6e5176ef95b56e520f3
});

// XML-карта сайта
app.get("/sitemap.xml", getSeoSitemap);

// ---------------------------------------------------------
// API-маршруты
// ---------------------------------------------------------

// Авторизация
app.use("/api/auth", authRoutes);

// Каталог товаров
app.use("/api/products", productRoutes);

// B2B
app.use("/api/b2b", b2bRoutes);

// SEO
app.use("/api/seo", seoRoutes);

// Общие системные маршруты подключаем последними
app.use("/api", systemRoutes);

// ---------------------------------------------------------
// Запуск сервера
// ---------------------------------------------------------

const PORT = Number(process.env.PORT) || 3000;

<<<<<<< HEAD
=======
// Подключение маршрутов
app.use('/api', systemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/news', newsRoutes);

// Запуск сервера
>>>>>>> 52c8380c522818272d6df6e5176ef95b56e520f3
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
