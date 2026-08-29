import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiGatewayService } from './ai-gateway.service';

@ApiTags('AI Gateway')
@Controller('ai-gateway')
export class AiGatewayController {
  constructor(private readonly aiGatewayService: AiGatewayService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check AI gateway health' })
  async health() {
    return this.aiGatewayService.healthCheck();
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate a completion using the configured AI provider' })
  async generate(@Body() body: { tenantId: string; prompt: string; model?: string; temperature?: number }) {
    return this.aiGatewayService.generateResponse(body);
  }
}
