export type Role = 'SDE' | 'Frontend' | 'Backend' | 'Full-Stack';
export type Topic = 'DSA' | 'System Design' | 'JavaScript' | 'React' | 'Node.js' | 'Behavioral';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Exchange {
  question: string;
  answer: string;
  evaluation: Evaluation;
  timestamp: string;
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
  role: Role;
  topic: Topic;
  difficulty: Difficulty;
  exchanges: Exchange[];
  overallScore: number;
  summary: string;
  duration: number;
  createdAt: string;
}

export interface InterviewConfig {
  role: Role;
  topic: Topic;
  difficulty: Difficulty;
}

export interface DashboardStats {
  totalInterviews: number;
  avgScore: number;
  avgDuration: number;
  topicScores: Array<{
    topic: Topic;
    avgScore: number;
    count: number;
  }>;
  difficultyScores: Array<{
    difficulty: Difficulty;
    avgScore: number;
    count: number;
  }>;
  recentSessions: Array<{
    score: number;
    topic: Topic;
    difficulty: Difficulty;
    date: string;
  }>;
}

export interface Message {
  id: string;
  type: 'question' | 'answer' | 'evaluation' | 'system';
  content: string;
  timestamp: Date;
  evaluation?: Evaluation;
}
