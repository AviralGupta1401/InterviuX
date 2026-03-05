import mongoose, { Schema, Document } from 'mongoose';
import type { Role, Topic, Difficulty } from '../types/index.js';

export interface IQuestion extends Document {
  role: Role;
  topic: Topic;
  difficulty: Difficulty;
  question: string;
  followUpQuestions: string[];
}

const QuestionSchema = new Schema<IQuestion>(
  {
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
    question: {
      type: String,
      required: true,
    },
    followUpQuestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

QuestionSchema.index({ role: 1, topic: 1, difficulty: 1 });

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
