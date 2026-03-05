import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: {
      message: 'Too many requests',
      details: 'Please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests',
        details: 'Please try again later',
      },
    });
  },
});

export const interviewLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: {
      message: 'Too many interview requests',
      details: 'Please wait before starting a new interview',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
