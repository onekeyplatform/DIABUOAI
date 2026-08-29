export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'archived';
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
export type StepType = 'trigger' | 'action' | 'condition' | 'delay' | 'webhook' | 'notification';
export type TriggerType = 'manual' | 'schedule' | 'webhook' | 'event';
export type ConditionOperator = 'equals' | 'contains' | 'greater' | 'less' | 'in' | 'exists';

export interface Workflow {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  createdBy: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
  lastExecuted?: Date;
}

export interface WorkflowTrigger {
  type: TriggerType;
  config: Record<string, any>;
  enabled: boolean;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  position: number;
  config: Record<string, any>;
  nextSteps?: string[];
  errorHandler?: ErrorHandler;
}

export interface ErrorHandler {
  type: 'retry' | 'skip' | 'fallback';
  maxRetries?: number;
  retryDelay?: number;
  fallbackStepId?: string;
}

export interface WorkflowExecution {
  id: string;
  tenantId: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  steps: StepExecution[];
  variables: Record<string, any>;
  error?: string;
}

export interface StepExecution {
  id: string;
  stepId: string;
  status: StepStatus;
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  required: boolean;
  default?: any;
  description?: string;
}

export interface WorkflowTemplate {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  category: string;
  workflow: Partial<Workflow>;
  createdAt: Date;
}

export interface CreateWorkflowInput {
  tenantId: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  createdBy: string;
}

export interface ExecuteWorkflowInput {
  tenantId: string;
  workflowId: string;
  variables?: Record<string, any>;
}

export interface WorkflowExecutionResult {
  executionId: string;
  status: 'running' | 'completed' | 'failed';
  duration: number;
  stepResults: Record<string, StepExecutionResult>;
  output?: Record<string, any>;
  error?: string;
}

export interface StepExecutionResult {
  status: StepStatus;
  output?: any;
  error?: string;
  duration: number;
}
