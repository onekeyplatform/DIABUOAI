export interface AgentDefinition {
  id: string;
  name: string;
  type: 'assistant' | 'workflow' | 'research' | 'support';
  status: 'active' | 'paused' | 'draft';
  tenantId: string;
}

export interface AgentRunRequest {
  tenantId: string;
  agentId: string;
  input: string;
}
