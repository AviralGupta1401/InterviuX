import { z } from 'zod';

export const roleSchema = z.enum(['SDE', 'Frontend', 'Backend', 'Full-Stack']);

export const topicSchema = z.enum(['DSA', 'System Design', 'JavaScript', 'React', 'Node.js', 'Behavioral']);

export const difficultySchema = z.enum(['Easy', 'Medium', 'Hard']);

export const interviewConfigSchema = z.object({
  role: roleSchema,
  topic: topicSchema,
  difficulty: difficultySchema,
});

export const evaluationSchema = z.object({
  score: z.number().min(0).max(10),
  technicalAccuracy: z.string().min(1),
  communication: z.string().min(1),
  depth: z.string().min(1),
  followUp: z.string().min(1),
  moveToNextQuestion: z.boolean(),
});

export const createSessionSchema = z.object({
  role: roleSchema,
  topic: topicSchema,
  difficulty: difficultySchema,
});

export const updateSessionSchema = z.object({
  exchanges: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
      evaluation: evaluationSchema,
    })
  ).optional(),
  overallScore: z.number().min(0).max(10).optional(),
  summary: z.string().optional(),
  duration: z.number().min(0).optional(),
});

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export type Role = z.infer<typeof roleSchema>;
export type Topic = z.infer<typeof topicSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type InterviewConfig = z.infer<typeof interviewConfigSchema>;
export type Evaluation = z.infer<typeof evaluationSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type UserInput = z.infer<typeof userSchema>;
