import { Injectable } from '@nestjs/common';

@Injectable()
export class AiAgentsService {
  async listAgents(tenantId: string) {
    return [
      { id: 'agent-sales', name: 'Sales Assistant', type: 'assistant', status: 'active', tenantId },
      { id: 'agent-support', name: 'Support Copilot', type: 'support', status: 'active', tenantId },
    ];
  }

  async runAgent(input: { tenantId: string; agentId: string; input: string }) {
    return {
      agentId: input.agentId,
      tenantId: input.tenantId,
      output: `Agent ${input.agentId} processed: ${input.input.slice(0, 120)}`,
      status: 'completed',
    };
  }
}
