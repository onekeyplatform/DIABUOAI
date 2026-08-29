import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('sessions')
  listSessions(@Query('tenantId') tenantId: string, @Query('userId') userId: string) {
    return this.chatService.listSessions(tenantId, userId);
  }

  @Post('sessions/:sessionId/messages')
  sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() body: { tenantId: string; userId: string; content: string },
  ) {
    return this.chatService.sendMessage({
      tenantId: body.tenantId,
      userId: body.userId,
      sessionId,
      content: body.content,
    });
  }
}
