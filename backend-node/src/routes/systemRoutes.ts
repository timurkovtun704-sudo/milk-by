import { Router } from 'express';
import { getSystemStatus } from '../controllers/systemController.js';

const router = Router();

router.get('/system/status', getSystemStatus);

export default router;