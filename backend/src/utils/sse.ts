import type { Response } from 'express';

export interface StreamCallbacks {
  onStart?: () => void;
  onChunk?: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export function setupSSE(res: Response): void {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  res.write('\n');
}

export function sendSSEEvent(res: Response, event: string, data: string): void {
  res.write(`event: ${event}\n`);
  res.write(`data: ${data}\n\n`);
}

export function sendSSEMessage(res: Response, data: string): void {
  res.write(`data: ${data}\n\n`);
}

export function closeSSE(res: Response): void {
  res.end();
}

export class SSEStream {
  private res: Response;

  constructor(res: Response) {
    this.res = res;
    setupSSE(res);
  }

  send(event: string, data: unknown): void {
    sendSSEEvent(this.res, event, JSON.stringify(data));
  }

  sendMessage(data: unknown): void {
    sendSSEMessage(this.res, JSON.stringify(data));
  }

  end(): void {
    closeSSE(this.res);
  }
}
