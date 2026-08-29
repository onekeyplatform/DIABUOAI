import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  async listSessions(tenantId: string, userId: string) {
    return [
      { id: 'chat-1', tenantId, userId, title: 'Welcome', createdAt: new Date() },
    ];
  }

  async sendMessage(input: { tenantId: string; userId: string; sessionId: string; content: string }) {
    return {
      id: 'msg-1',
      tenantId: input.tenantId,
      userId: input.userId,
      sessionId: input.sessionId,
      role: 'assistant',
      content: `Replying to: ${input.content.slice(0, 90)}`,
      createdAt: new Date(),
    };
  }
}
