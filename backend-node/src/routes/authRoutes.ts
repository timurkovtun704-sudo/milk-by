
import { Router } from 'express';
import { loginController } from '../controllers/authController.js';
import { createRateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.post('/login', createRateLimit(10, 15 * 60 * 1000), loginController);

export default router;
