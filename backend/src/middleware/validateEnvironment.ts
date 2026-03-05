import { Request, Response, NextFunction } from 'express';

const requiredEnvVars = ['MONGODB_URI', 'GROQ_API_KEY', 'PORT'];

export function validateEnvironment(req: Request, res: Response, next: NextFunction): void {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server configuration error',
        details: `Missing environment variables: ${missing.join(', ')}`,
      },
    });
    return;
  }

  next();
}
