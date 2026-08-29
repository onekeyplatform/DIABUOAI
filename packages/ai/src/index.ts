export type AgentTask = {
  tenantId: string;
  prompt: string;
  context?: string[];
};

export function buildAgentContext(task: AgentTask) {
  return {
    tenantId: task.tenantId,
    prompt: task.prompt,
    context: task.context ?? [],
    model: 'gpt-4o-mini',
  };
}
