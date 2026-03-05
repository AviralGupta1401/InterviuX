import { Response } from 'express';
import { Question } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { Role, Topic, Difficulty } from '../types/index.js';

export const getQuestions = asyncHandler(async (req, res: Response) => {
  const { role, topic, difficulty } = req.query;

  const filter: Record<string, unknown> = {};
  
  if (role) filter.role = role;
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficulty = difficulty;

  const questions = await Question.find(filter).limit(50);

  res.json({
    success: true,
    data: questions,
  });
});

export const getRandomQuestion = asyncHandler(async (req, res: Response) => {
  const { role, topic, difficulty } = req.query as {
    role?: Role;
    topic?: Topic;
    difficulty?: Difficulty;
  };

  const filter: Record<string, unknown> = {};
  
  if (role) filter.role = role;
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficulty = difficulty;

  const count = await Question.countDocuments(filter);
  
  if (count === 0) {
    return res.status(404).json({
      success: false,
      error: { message: 'No questions found for the specified criteria' },
    });
  }

  const random = Math.floor(Math.random() * count);
  const question = await Question.findOne(filter).skip(random);

  res.json({
    success: true,
    data: question,
  });
});

export const createQuestion = asyncHandler(async (req, res: Response) => {
  const { role, topic, difficulty, question, followUpQuestions } = req.body;

  const newQuestion = new Question({
    role,
    topic,
    difficulty,
    question,
    followUpQuestions: followUpQuestions || [],
  });

  await newQuestion.save();

  res.status(201).json({
    success: true,
    data: newQuestion,
  });
});

export const seedQuestions = asyncHandler(async (req, res: Response) => {
  const questions = [
    {
      role: 'SDE' as Role,
      topic: 'DSA' as Topic,
      difficulty: 'Easy' as Difficulty,
      question: 'Given an array of integers, write a function to find the sum of all elements.',
      followUpQuestions: ['What is the time complexity?', 'Can you optimize it further?'],
    },
    {
      role: 'SDE' as Role,
      topic: 'DSA' as Topic,
      difficulty: 'Medium' as Difficulty,
      question: 'Implement a function to reverse a linked list.',
      followUpQuestions: ['What are the edge cases?', 'Can you do it in-place?'],
    },
    {
      role: 'SDE' as Role,
      topic: 'System Design' as Topic,
      difficulty: 'Medium' as Difficulty,
      question: 'Design a URL shortening service like bit.ly.',
      followUpQuestions: ['How would you handle high traffic?', 'What database would you use?'],
    },
    {
      role: 'Frontend' as Role,
      topic: 'React' as Topic,
      difficulty: 'Easy' as Difficulty,
      question: 'What is the difference between state and props in React?',
      followUpQuestions: ['When should you use each?'],
    },
    {
      role: 'Frontend' as Role,
      topic: 'React' as Topic,
      difficulty: 'Medium' as Difficulty,
      question: 'Explain the useEffect hook and its dependency array.',
      followUpQuestions: ['What is the cleanup function?', 'When does it run?'],
    },
    {
      role: 'Frontend' as Role,
      topic: 'JavaScript' as Topic,
      difficulty: 'Medium' as Difficulty,
      question: 'Explain closures in JavaScript with an example.',
      followUpQuestions: ['What are practical use cases?'],
    },
    {
      role: 'Backend' as Role,
      topic: 'Node.js' as Topic,
      difficulty: 'Easy' as Difficulty,
      question: 'What is Express.js and how does it compare to other Node.js frameworks?',
      followUpQuestions: ['What are middlewares?'],
    },
    {
      role: 'Backend' as Role,
      topic: 'Node.js' as Topic,
      difficulty: 'Medium' as Difficulty,
      question: 'Explain the event loop in Node.js.',
      followUpQuestions: ['What is the difference between microtasks and macrotasks?'],
    },
    {
      role: 'Full-Stack' as Role,
      topic: 'Behavioral' as Topic,
      difficulty: 'Easy' as Difficulty,
      question: 'Tell me about yourself and why you want to work here.',
      followUpQuestions: ['What are your strengths?'],
    },
    {
      role: 'SDE' as Role,
      topic: 'Behavioral' as Topic,
      difficulty: 'Medium' as Difficulty,
      question: 'Describe a challenging project you worked on and how you overcame the obstacles.',
      followUpQuestions: ['What would you do differently?'],
    },
  ];

  await Question.insertMany(questions, { ordered: false });

  res.status(201).json({
    success: true,
    data: { message: `${questions.length} questions seeded successfully` },
  });
});
