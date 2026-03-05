import { Router } from 'express';
import { getQuestions, getRandomQuestion, createQuestion, seedQuestions } from '../controllers/index.js';
import { apiLimiter } from '../middleware/index.js';

const router = Router();

router.get('/questions', apiLimiter, getQuestions);
router.get('/questions/random', apiLimiter, getRandomQuestion);
router.post('/questions', apiLimiter, createQuestion);
router.post('/questions/seed', apiLimiter, seedQuestions);

export default router;
