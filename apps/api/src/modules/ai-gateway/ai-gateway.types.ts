export interface AiGatewayConfig {
  provider: 'openai' | 'azure-openai' | 'anthropic';
  model: string;
  apiKeySecret?: string;
  enabled: boolean;
}

export interface AiRequest {
  tenantId: string;
  prompt: string;
  model?: string;
  temperature?: number;
}
