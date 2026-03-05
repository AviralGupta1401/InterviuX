import type { Session, InterviewConfig, DashboardStats } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
    throw new Error(error.error?.message || 'Request failed');
  }
  return response.json();
}

export const api = {
  async createSession(config: InterviewConfig): Promise<Session> {
    const res = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return handleResponse<{ success: boolean; data: Session }>(res).then(d => d.data);
  },

  async getSession(id: string): Promise<Session> {
    const res = await fetch(`${API_URL}/sessions/${id}`);
    return handleResponse<{ success: boolean; data: Session }>(res).then(d => d.data);
  },

  async getAllSessions(page = 1, limit = 10): Promise<{ sessions: Session[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const res = await fetch(`${API_URL}/sessions?page=${page}&limit=${limit}`);
    return handleResponse<{ success: boolean; data: { sessions: Session[]; pagination: { page: number; limit: number; total: number; pages: number } } }>(res).then(d => d.data);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_URL}/dashboard/stats`);
    return handleResponse<{ success: boolean; data: DashboardStats }>(res).then(d => d.data);
  },
};

export const interviewApi = {
  async start(config: InterviewConfig): Promise<{ question: string; sessionId: string }> {
    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(`${API_URL}/interview/start?role=${config.role}&topic=${config.topic}&difficulty=${config.difficulty}`, {
        withCredentials: true,
      });

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        eventSource.close();
        resolve(data);
      };

      eventSource.onerror = () => {
        eventSource.close();
        reject(new Error('Failed to start interview'));
      };
    });
  },

  async startWithFetch(config: InterviewConfig): Promise<{ question: string; sessionId: string }> {
    const res = await fetch(`${API_URL}/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return handleResponse<{ success: boolean; data: { question: string; sessionId: string } }>(res).then(d => d.data);
  },

  async submitAnswer(sessionId: string, answer: string): Promise<void> {
    const res = await fetch(`${API_URL}/interview/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, answer }),
    });
    return handleResponse<{ success: boolean }>(res).then(() => undefined);
  },

  async submitAnswerStreaming(
    sessionId: string,
    answer: string,
    onEvaluation: (evaluation: unknown) => void,
    onQuestion?: (question: { question: string }) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const eventSource = new EventSource(
        `${API_URL}/interview/answer?sessionId=${encodeURIComponent(sessionId)}&answer=${encodeURIComponent(answer)}`,
        { withCredentials: true }
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.evaluation) {
          onEvaluation(data.evaluation);
        }
        if (data.question) {
          onQuestion?.(data);
        }
      };

      eventSource.addEventListener('evaluation', (event) => {
        const data = JSON.parse(event.data);
        onEvaluation(data);
      });

      eventSource.addEventListener('question', (event) => {
        const data = JSON.parse(event.data);
        onQuestion?.(data);
        eventSource.close();
        resolve();
      });

      eventSource.onerror = () => {
        eventSource.close();
        resolve();
      };
    });
  },

  async endInterview(sessionId: string): Promise<{
    sessionId: string;
    overallScore: number;
    summary: string;
    duration: number;
  }> {
    const res = await fetch(`${API_URL}/interview/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    return handleResponse<{ success: boolean; data: { sessionId: string; overallScore: number; summary: string; duration: number } }>(res).then(d => d.data);
  },
};
