import { Router } from "express";

import {
  getSeoMetadata,
  listSeoEntries,
  getSeoEntry,
  createSeoEntry,
  updateSeoEntry,
  deleteSeoEntry,
  listSeoRedirects,
  createSeoRedirect,
  updateSeoRedirect,
  deleteSeoRedirect,
} from "../controllers/seoController.js";

import {
  validateSeoEntryCreate,
  validateSeoEntryUpdate,
  validateSeoRedirectCreate,
  validateSeoRedirectUpdate,
  validateSeoIdParam,
  validateSeoMetadataQuery,
} from "../validators/seoValidator.js";

import {
  requireAuth,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = Router();

// ---------------------------------------------------------
// Публичные маршруты
// ---------------------------------------------------------

// Получение SEO-метаданных страницы по локализованному URL
router.get(
  "/metadata",
  validateSeoMetadataQuery,
  getSeoMetadata
);

// ---------------------------------------------------------
// Административные маршруты
// Все маршруты ниже требуют авторизации и роли admin
// ---------------------------------------------------------

router.use(requireAuth, requireRole("admin"));

// SEO-записи

// Получение списка SEO-записей
router.get("/entries", listSeoEntries);

// Создание SEO-записи
router.post(
  "/entries",
  validateSeoEntryCreate,
  createSeoEntry
);

// Получение SEO-записи по ID
router.get(
  "/entries/:id",
  validateSeoIdParam,
  getSeoEntry
);

// Изменение SEO-записи
router.patch(
  "/entries/:id",
  validateSeoIdParam,
  validateSeoEntryUpdate,
  updateSeoEntry
);

// Удаление SEO-записи
router.delete(
  "/entries/:id",
  validateSeoIdParam,
  deleteSeoEntry
);

// 301-перенаправления

// Получение списка перенаправлений
router.get("/redirects", listSeoRedirects);

// Создание перенаправления
router.post(
  "/redirects",
  validateSeoRedirectCreate,
  createSeoRedirect
);

// Изменение перенаправления
router.patch(
  "/redirects/:id",
  validateSeoIdParam,
  validateSeoRedirectUpdate,
  updateSeoRedirect
);

// Удаление перенаправления
router.delete(
  "/redirects/:id",
  validateSeoIdParam,
  deleteSeoRedirect
);

export default router;
