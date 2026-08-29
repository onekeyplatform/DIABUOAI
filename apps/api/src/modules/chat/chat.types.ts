export interface ChatMessage {
  id: string;
  tenantId: string;
  userId: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  tenantId: string;
  userId: string;
  title?: string;
  createdAt: Date;
}
