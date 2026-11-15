import { Router } from "express";
import { createB2BContact } from "../controllers/b2bController.js";
import { validateB2BContact } from "../validators/b2bValidator.js";
import { createRateLimit } from "../middleware/rateLimit.js";

const router = Router();

// Отправка обращения в отдел продаж
router.post(
  "/contact",
  createRateLimit(5, 15 * 60 * 1000),
  validateB2BContact,
  createB2BContact
);

export default router;
