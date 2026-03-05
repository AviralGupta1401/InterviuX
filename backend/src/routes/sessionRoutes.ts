import { Router } from 'express';
import {
  createSession,
  getSession,
  getAllSessions,
  updateSession,
  deleteSession,
  startInterview,
  submitAnswer,
  endInterview,
  getDashboardStats,
} from '../controllers/index.js';
import { apiLimiter, interviewLimiter } from '../middleware/index.js';

const router = Router();

router.post('/sessions', apiLimiter, createSession);
router.get('/sessions', apiLimiter, getAllSessions);
router.get('/sessions/:id', apiLimiter, getSession);
router.put('/sessions/:id', apiLimiter, updateSession);
router.delete('/sessions/:id', apiLimiter, deleteSession);

router.post('/interview/start', interviewLimiter, startInterview);
router.post('/interview/answer', interviewLimiter, submitAnswer);
router.post('/interview/end', interviewLimiter, endInterview);

router.get('/dashboard/stats', apiLimiter, getDashboardStats);

export default router;
