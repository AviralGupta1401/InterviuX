import { Router } from 'express';
import sessionRoutes from './sessionRoutes.js';
import questionRoutes from './questionRoutes.js';

const router = Router();

router.use('/api', sessionRoutes);
router.use('/api', questionRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
