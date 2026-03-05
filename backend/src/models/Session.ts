import mongoose, { Schema, Document } from 'mongoose';
import type { Role, Topic, Difficulty, Exchange } from '../types/index.js';

export interface ISession extends Document {
  userId?: mongoose.Types.ObjectId;
  role: Role;
  topic: Topic;
  difficulty: Difficulty;
  exchanges: Exchange[];
  overallScore: number;
  summary: string;
  duration: number;
  createdAt: Date;
}

const EvaluationSchema = new Schema(
  {
    score: { type: Number, required: true, min: 0, max: 10 },
    technicalAccuracy: { type: String, required: true },
    communication: { type: String, required: true },
    depth: { type: String, required: true },
    followUp: { type: String, required: true },
    moveToNextQuestion: { type: Boolean, required: true },
  },
  { _id: false }
);

const ExchangeSchema = new Schema<Exchange>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    evaluation: { type: EvaluationSchema, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      required: true,
      enum: ['SDE', 'Frontend', 'Backend', 'Full-Stack'],
    },
    topic: {
      type: String,
      required: true,
      enum: ['DSA', 'System Design', 'JavaScript', 'React', 'Node.js', 'Behavioral'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
    },
    exchanges: [ExchangeSchema],
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    summary: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

SessionSchema.index({ createdAt: -1 });
SessionSchema.index({ userId: 1, createdAt: -1 });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
