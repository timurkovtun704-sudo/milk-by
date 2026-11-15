import "dotenv/config";

import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";

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

// The production topology has one Nginx reverse proxy in front of this service.
app.set("trust proxy", 1);

// Основные middleware
const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header (health checks/server-to-server) are allowed.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
  })
);

// Basic security headers. TLS should be terminated by the hosting platform/reverse proxy.
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

app.use(express.json({ limit: "1mb" }));

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

// Централизованная обработка ошибок должна идти после всех маршрутов.
app.use(errorHandler);

const PORT = Number(process.env.SERVER_PORT || process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});