import { Injectable } from '@nestjs/common';
import { AiRequest } from './ai-gateway.types';

@Injectable()
export class AiGatewayService {
  async generateResponse(input: AiRequest): Promise<{ content: string; model: string }> {
    const model = input.model || 'gpt-4o-mini';
    const content = `AI gateway generated response for tenant ${input.tenantId}: ${input.prompt.slice(0, 120)}`;

    return {
      content,
      model,
    };
  }

  async healthCheck() {
    return { status: 'ok', provider: 'openai' };
  }
}
