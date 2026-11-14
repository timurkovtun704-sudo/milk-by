import "dotenv/config";

import express from "express";
import cors from "cors";

import systemRoutes from "./routes/systemRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import b2bRoutes from "./routes/b2bRoutes.js";
import seoRoutes from "./routes/seoRoutes.js";
import subcategoryRoutes from "./routes/subcategoryRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";

import { getSeoSitemap } from "./controllers/seoController.js";
import { seoRedirectMiddleware } from "./middleware/seoRedirectMiddleware.js";

const app = express();

// Основные middleware
app.use(cors());
app.use(express.json());

// Проверка 301-перенаправлений
app.use(seoRedirectMiddleware);

// Проверка работоспособности сервера
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Milk World API is running",
  });
});

// Карта сайта
app.get("/sitemap.xml", getSeoSitemap);

// Авторизация
app.use("/api/auth", authRoutes);

// Каталог товаров
app.use("/api/products", productRoutes);

// Подкатегории
app.use("/api/subcategories", subcategoryRoutes);

// Новости
app.use("/api/news", newsRoutes);

// B2B
app.use("/api/b2b", b2bRoutes);

// SEO
app.use("/api/seo", seoRoutes);

// Системные маршруты
app.use("/api", systemRoutes);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});