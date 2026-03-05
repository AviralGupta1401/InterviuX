export type Role = 'SDE' | 'Frontend' | 'Backend' | 'Full-Stack';
export type Topic = 'DSA' | 'System Design' | 'JavaScript' | 'React' | 'Node.js' | 'Behavioral';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Exchange {
  question: string;
  answer: string;
  evaluation: Evaluation;
  timestamp: Date;
}

export interface Evaluation {
  score: number;
  technicalAccuracy: string;
  communication: string;
  depth: string;
  followUp: string;
  moveToNextQuestion: boolean;
}

export interface Session {
  _id: string;
  userId?: string;
  role: Role;
  topic: Topic;
  difficulty: Difficulty;
  exchanges: Exchange[];
  overallScore: number;
  summary: string;
  duration: number;
  createdAt: Date;
}

export interface User {
  _id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface Question {
  _id: string;
  role: Role;
  topic: Topic;
  difficulty: Difficulty;
  question: string;
 UpQuestions: string[];
}

export interface InterviewConfig {
  role: Role;
  topic: Topic;
  difficulty: Difficulty;
}

export interface AIEvaluationResponse {
  score: number;
  technicalAccuracy: string;
  communication: string;
  depth: string;
  followUp: string;
  moveToNextQuestion: boolean;
}
