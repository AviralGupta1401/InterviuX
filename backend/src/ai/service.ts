import { generateObject } from 'ai';
import Groq from 'groq-sdk';
import { z } from 'zod';
import type { Role, Topic, Difficulty, AIEvaluationResponse } from '../types/index.js';

const evaluationSchema = z.object({
  score: z.number().min(0).max(10),
  technicalAccuracy: z.string(),
  communication: z.string(),
  depth: z.string(),
  followUp: z.string(),
  moveToNextQuestion: z.boolean(),
});

const SYSTEM_PROMPT = `You are a senior software engineer with 10+ years of experience conducting technical interviews at top tech companies (Google, Meta, Amazon, etc.). Your role is to evaluate candidates thoroughly and help them improve their interview skills.

## Your Persona
- Professional, encouraging, yet rigorous
- Ask follow-up questions to probe deeper into candidates' understanding
- Provide constructive feedback that helps candidates improve
- Focus on understanding the candidate's thought process, not just getting the "right" answer

## Interview Style
1. Start with the main question based on the selected topic and difficulty
2. Listen carefully to the candidate's answer
3. Ask follow-up questions to test depth of understanding
4. Evaluate based on: technical accuracy, communication clarity, and depth of understanding
5. Know when to move on (if candidate demonstrates strong understanding or gets stuck for too long)

## Evaluation Criteria
- Technical Accuracy: How correct is the technical content?
- Communication: How clearly does the candidate explain their thoughts?
- Depth: How deeply do they understand the underlying concepts?

## Output Format
You must ALWAYS respond with valid JSON in this exact format:
{
  "score": number (0-10),
  "technicalAccuracy": "brief evaluation",
  "communication": "brief evaluation", 
  "depth": "brief evaluation",
  "followUp": "the follow-up question to ask (or empty string if moving to next question)",
  "moveToNextQuestion": boolean
}

IMPORTANT: Always output valid JSON. No explanations outside the JSON structure.`;

function getTopicPrompt(topic: Topic, difficulty: Difficulty): string {
  const prompts: Record<Topic, Record<Difficulty, string>> = {
    'DSA': {
      'Easy': 'Ask a simple array/string manipulation question like finding the sum of elements or checking for duplicates.',
      'Medium': 'Ask a moderate difficulty algorithm question like two-pointer technique, sliding window, or basic tree traversal.',
      'Hard': 'Ask a challenging algorithm question involving dynamic programming, graphs, or complex data structures.',
    },
    'System Design': {
      'Easy': 'Ask to design a simple system like a URL shortener or counter.',
      'Medium': 'Ask to design a scalable system like a notification system or caching layer.',
      'Hard': 'Ask to design a complex distributed system like a ride-sharing app or real-time collaboration tool.',
    },
    'JavaScript': {
      'Easy': 'Ask about JavaScript fundamentals like variables, data types, or basic DOM manipulation.',
      'Medium': 'Ask about closures, prototypes, async/await, or event loop.',
      'Hard': 'Ask about advanced JavaScript concepts like memory management, performance optimization, or complex async patterns.',
    },
    'React': {
      'Easy': 'Ask about React basics like components, props, or state.',
      'Medium': 'Ask about React patterns like hooks usage, context, or performance optimization.',
      'Hard': 'Ask about advanced React concepts like reconciliation, concurrent mode, or building custom hooks.',
    },
    'Node.js': {
      'Easy': 'Ask about Node.js basics like modules, npm, or simple Express routes.',
      'Medium': 'Ask about Node.js internals, streams, or building REST APIs.',
      'Hard': 'Ask about advanced Node.js topics like clustering, microservices architecture, or performance tuning.',
    },
    'Behavioral': {
      'Easy': 'Ask simple behavioral questions like strengths, weaknesses, or why this role.',
      'Medium': 'Ask about past projects, conflict resolution, or leadership experiences.',
      'Hard': 'Ask complex behavioral questions about handling ambiguous situations, pivoting projects, or dealing with failures.',
    },
  };
  return prompts[topic][difficulty];
}

function getInitialQuestion(role: Role, topic: Topic, difficulty: Difficulty): string {
  const topicPrompt = getTopicPrompt(topic, difficulty);
  
  const roleContext: Record<Role, string> = {
    'SDE': 'As a Software Development Engineer, ',
    'Frontend': 'As a Frontend Developer, ',
    'Backend': 'As a Backend Developer, ',
    'Full-Stack': 'As a Full-Stack Developer, ',
  };
  
  return `${roleContext[role]}${topicPrompt}\n\nProvide your first interview question now. Just output the question, nothing else.`;
}

export class AIService {
  private client: Groq;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

  async generateQuestion(
    role: Role,
    topic: Topic,
    difficulty: Difficulty,
    conversationHistory: Array<{ question: string; answer: string; evaluation: AIEvaluationResponse }>
  ): Promise<string> {
    let historyContext = '';
    
    if (conversationHistory.length > 0) {
      historyContext = '\n\nConversation history:\n';
      for (const exchange of conversationHistory) {
        historyContext += `Q: ${exchange.question}\nA: ${exchange.answer}\n`;
        historyContext += `Evaluation: Score ${exchange.evaluation.score}/10 - ${exchange.evaluation.followUp}\n\n`;
      }
    }
    
    const prompt = conversationHistory.length === 0
      ? getInitialQuestion(role, topic, difficulty)
      : `Based on the conversation so far, either ask a follow-up question to probe deeper into the previous answer, or move to a new related question. ${historyContext}

Respond with just your next question.`;

    const response = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Could you please elaborate on that?';
  }

  async evaluateAnswer(
    question: string,
    answer: string,
    role: Role,
    topic: Topic
  ): Promise<AIEvaluationResponse> {
    const prompt = `Evaluate this interview answer.

Question: ${question}
Candidate's Answer: ${answer}

Role: ${role}
Topic: ${topic}

Provide your evaluation in JSON format.`;

    try {
      const result = await generateObject({
        model: this.client as never,
        schema: evaluationSchema,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      });

      return result.object;
    } catch (error) {
      console.error('AI evaluation error:', error);
      return {
        score: 5,
        technicalAccuracy: 'Unable to evaluate',
        communication: 'Unable to evaluate',
        depth: 'Unable to evaluate',
        followUp: 'Could you please explain that in more detail?',
        moveToNextQuestion: false,
      };
    }
  }

  async generateSummary(
    exchanges: Array<{ question: string; answer: string; evaluation: AIEvaluationResponse }>,
    role: Role,
    topic: Topic
  ): Promise<string> {
    let summaryPrompt = `Generate a comprehensive interview summary.\n\n`;
    summaryPrompt += `Role: ${role}\nTopic: ${topic}\n\n`;
    summaryPrompt += `Interview exchanges:\n`;

    for (let i = 0; i < exchanges.length; i++) {
      const ex = exchanges[i];
      summaryPrompt += `\nQuestion ${i + 1}: ${ex.question}\n`;
      summaryPrompt += `Answer: ${ex.answer}\n`;
      summaryPrompt += `Score: ${ex.evaluation.score}/10\n`;
      summaryPrompt += `Feedback: ${ex.evaluation.technicalAccuracy}\n`;
    }

    summaryPrompt += `\nProvide a summary that includes:
1. Overall performance assessment
2. Strengths demonstrated
3. Areas for improvement
4. Specific recommendations for preparation
5. Topics to focus on`;

    const response = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: summaryPrompt },
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'Interview completed. Great effort!';
  }
}

let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(apiKey);
  }

  return aiServiceInstance;
}
