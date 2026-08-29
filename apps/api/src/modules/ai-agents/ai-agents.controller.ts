import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiAgentsService } from './ai-agents.service';

@ApiTags('AI Agents')
@Controller('ai-agents')
export class AiAgentsController {
  constructor(private readonly aiAgentsService: AiAgentsService) {}

  @Get(':tenantId')
  @ApiOperation({ summary: 'List AI agents for a tenant' })
  async list(@Param('tenantId') tenantId: string) {
    return this.aiAgentsService.listAgents(tenantId);
  }

  @Post('run')
  @ApiOperation({ summary: 'Run an AI agent' })
  async run(@Body() body: { tenantId: string; agentId: string; input: string }) {
    return this.aiAgentsService.runAgent(body);
  }
}
