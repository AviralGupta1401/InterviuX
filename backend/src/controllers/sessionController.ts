import { Response } from 'express';
import { Session } from '../models/index.js';
import { getAIService } from '../ai/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createSessionSchema, updateSessionSchema } from '../validators/index.js';
import { SSEStream } from '../utils/sse.js';
import type { Role, Topic, Difficulty, Exchange, AIEvaluationResponse } from '../types/index.js';

export const createSession = asyncHandler(async (req, res: Response) => {
  const validatedData = createSessionSchema.parse(req.body);

  const session = new Session({
    role: validatedData.role,
    topic: validatedData.topic,
    difficulty: validatedData.difficulty,
    exchanges: [],
    overallScore: 0,
    summary: '',
    duration: 0,
  });

  await session.save();

  res.status(201).json({
    success: true,
    data: session,
  });
});

export const getSession = asyncHandler(async (req, res: Response) => {
  const { id } = req.params;

  const session = await Session.findById(id);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: { message: 'Session not found' },
    });
  }

  res.json({
    success: true,
    data: session,
  });
});

export const getAllSessions = asyncHandler(async (req, res: Response) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const [sessions, total] = await Promise.all([
    Session.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Session.countDocuments(),
  ]);

  res.json({
    success: true,
    data: {
      sessions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const updateSession = asyncHandler(async (req, res: Response) => {
  const { id } = req.params;
  const validatedData = updateSessionSchema.parse(req.body);

  const session = await Session.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true }
  );

  if (!session) {
    return res.status(404).json({
      success: false,
      error: { message: 'Session not found' },
    });
  }

  res.json({
    success: true,
    data: session,
  });
});

export const deleteSession = asyncHandler(async (req, res: Response) => {
  const { id } = req.params;

  const session = await Session.findByIdAndDelete(id);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: { message: 'Session not found' },
    });
  }

  res.json({
    success: true,
    data: { message: 'Session deleted successfully' },
  });
});

export const startInterview = asyncHandler(async (req, res: Response) => {
  const { role, topic, difficulty } = req.body as {
    role: Role;
    topic: Topic;
    difficulty: Difficulty;
  };

  const session = new Session({
    role,
    topic,
    difficulty,
    exchanges: [],
    overallScore: 0,
    summary: '',
    duration: 0,
    createdAt: new Date(),
  });

  await session.save();

  const aiService = getAIService();
  const question = await aiService.generateQuestion(role, topic, difficulty, []);

  await Session.findByIdAndUpdate(session._id, {
    $push: {
      exchanges: {
        question,
        answer: '',
        evaluation: {
          score: 0,
          technicalAccuracy: '',
          communication: '',
          depth: '',
          followUp: '',
          moveToNextQuestion: false,
        },
        timestamp: new Date(),
      },
    },
  });

  res.json({
    success: true,
    data: {
      question,
      sessionId: session._id.toString(),
    },
  });
});

export const submitAnswer = asyncHandler(async (req, res: Response) => {
  const { sessionId, answer } = req.body as {
    sessionId: string;
    answer: string;
  };

  const session = await Session.findById(sessionId);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: { message: 'Session not found' },
    });
  }

  const lastExchange = session.exchanges[session.exchanges.length - 1];
  
  if (!lastExchange) {
    return res.status(400).json({
      success: false,
      error: { message: 'No active question found' },
    });
  }

  const aiService = getAIService();
  const evaluation = await aiService.evaluateAnswer(
    lastExchange.question,
    answer,
    session.role,
    session.topic
  );

  lastExchange.answer = answer;
  lastExchange.evaluation = evaluation;

  await session.save();

  const stream = new SSEStream(res);

  stream.send('evaluation', evaluation);

  if (evaluation.moveToNextQuestion || session.exchanges.length >= 5) {
    const newQuestion = await aiService.generateQuestion(
      session.role,
      session.topic,
      session.difficulty,
      session.exchanges as unknown as Array<{ question: string; answer: string; evaluation: AIEvaluationResponse }>
    );

    session.exchanges.push({
      question: newQuestion,
      answer: '',
      evaluation: {
        score: 0,
        technicalAccuracy: '',
        communication: '',
        depth: '',
        followUp: '',
        moveToNextQuestion: false,
      },
      timestamp: new Date(),
    });

    await session.save();

    stream.send('question', { question: newQuestion });
  }

  stream.end();
});

export const endInterview = asyncHandler(async (req, res: Response) => {
  const { sessionId } = req.body as { sessionId: string };

  const session = await Session.findById(sessionId);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: { message: 'Session not found' },
    });
  }

  const completedExchanges = session.exchanges.filter(e => e.answer && e.evaluation.score > 0);
  
  const overallScore = completedExchanges.length > 0
    ? completedExchanges.reduce((sum, e) => sum + e.evaluation.score, 0) / completedExchanges.length
    : 0;

  const aiService = getAIService();
  const summary = await aiService.generateSummary(
    completedExchanges as unknown as Array<{ question: string; answer: string; evaluation: AIEvaluationResponse }>,
    session.role,
    session.topic
  );

  const duration = Date.now() - session.createdAt.getTime();

  session.overallScore = overallScore;
  session.summary = summary;
  session.duration = duration;

  await session.save();

  res.json({
    success: true,
    data: {
      sessionId: session._id,
      overallScore,
      summary,
      duration,
      exchanges: session.exchanges,
    },
  });
});

export const getDashboardStats = asyncHandler(async (req, res: Response) => {
  const totalInterviews = await Session.countDocuments();
  
  const scoreAggregation = await Session.aggregate([
    {
      $group: {
        _id: null,
        avgScore: { $avg: '$overallScore' },
        avgDuration: { $avg: '$duration' },
      },
    },
  ]);

  const topicScores = await Session.aggregate([
    {
      $group: {
        _id: '$topic',
        avgScore: { $avg: '$overallScore' },
        count: { $sum: 1 },
      },
    },
  ]);

  const difficultyScores = await Session.aggregate([
    {
      $group: {
        _id: '$difficulty',
        avgScore: { $avg: '$overallScore' },
        count: { $sum: 1 },
      },
    },
  ]);

  const recentSessions = await Session.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('overallScore topic difficulty createdAt');

  res.json({
    success: true,
    data: {
      totalInterviews,
      avgScore: scoreAggregation[0]?.avgScore || 0,
      avgDuration: scoreAggregation[0]?.avgDuration || 0,
      topicScores: topicScores.map(t => ({
        topic: t._id,
        avgScore: t.avgScore,
        count: t.count,
      })),
      difficultyScores: difficultyScores.map(d => ({
        difficulty: d._id,
        avgScore: d.avgScore,
        count: d.count,
      })),
      recentSessions: recentSessions.map(s => ({
        score: s.overallScore,
        topic: s.topic,
        difficulty: s.difficulty,
        date: s.createdAt,
      })),
    },
  });
});
