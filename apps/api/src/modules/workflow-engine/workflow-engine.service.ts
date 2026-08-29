import { Injectable, Logger } from '@nestjs/common';
import {
  CreateWorkflowInput,
  ExecuteWorkflowInput,
  StepExecution,
  Workflow,
  WorkflowExecution,
  WorkflowExecutionResult,
  WorkflowTemplate,
} from './workflow.types';

@Injectable()
export class WorkflowEngineService {
  private readonly logger = new Logger(WorkflowEngineService.name);

  private workflows: Map<string, Workflow> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private templates: Map<string, WorkflowTemplate> = new Map();
  private idCounter = 0;

  /**
   * Create a new workflow
   */
  async createWorkflow(input: CreateWorkflowInput): Promise<Workflow> {
    const workflowId = `wf-${++this.idCounter}`;

    const workflow: Workflow = {
      id: workflowId,
      tenantId: input.tenantId,
      name: input.name,
      description: input.description,
      status: 'draft',
      createdBy: input.createdBy,
      trigger: input.trigger,
      steps: input.steps,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.workflows.set(workflowId, workflow);
    return workflow;
  }

  /**
   * Get workflow by ID
   */
  async getWorkflow(workflowId: string, tenantId: string): Promise<Workflow | null> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || workflow.tenantId !== tenantId) return null;
    return workflow;
  }

  /**
   * List workflows for tenant
   */
  async listWorkflows(tenantId: string): Promise<Workflow[]> {
    return Array.from(this.workflows.values()).filter((w) => w.tenantId === tenantId);
  }

  /**
   * Update workflow
   */
  async updateWorkflow(
    workflowId: string,
    tenantId: string,
    updates: Partial<Workflow>,
  ): Promise<Workflow | null> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || workflow.tenantId !== tenantId) return null;

    Object.assign(workflow, updates, { updatedAt: new Date() });
    return workflow;
  }

  /**
   * Activate workflow
   */
  async activateWorkflow(workflowId: string, tenantId: string): Promise<Workflow | null> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || workflow.tenantId !== tenantId) return null;

    workflow.status = 'active';
    workflow.updatedAt = new Date();
    return workflow;
  }

  /**
   * Pause workflow
   */
  async pauseWorkflow(workflowId: string, tenantId: string): Promise<Workflow | null> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || workflow.tenantId !== tenantId) return null;

    workflow.status = 'paused';
    workflow.updatedAt = new Date();
    return workflow;
  }

  /**
   * Delete workflow
   */
  async deleteWorkflow(workflowId: string, tenantId: string): Promise<boolean> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || workflow.tenantId !== tenantId) return false;

    this.workflows.delete(workflowId);

    // Delete associated executions
    for (const [id, exec] of this.executions) {
      if (exec.workflowId === workflowId) {
        this.executions.delete(id);
      }
    }

    return true;
  }

  /**
   * Execute workflow
   */
  async executeWorkflow(input: ExecuteWorkflowInput): Promise<WorkflowExecutionResult> {
    const workflow = this.workflows.get(input.workflowId);
    if (!workflow || workflow.tenantId !== input.tenantId || workflow.status !== 'active') {
      return {
        executionId: 'error',
        status: 'failed',
        duration: 0,
        stepResults: {},
        error: 'Workflow not found or not active',
      };
    }

    const executionId = `exec-${++this.idCounter}`;
    const startTime = Date.now();

    const execution: WorkflowExecution = {
      id: executionId,
      tenantId: input.tenantId,
      workflowId: input.workflowId,
      status: 'running',
      startedAt: new Date(),
      steps: [],
      variables: input.variables || {},
    };

    this.executions.set(executionId, execution);

    try {
      // Execute steps in sequence
      const stepResults: Record<string, any> = {};
      let currentStepId = workflow.steps[0]?.id;

      while (currentStepId && execution.status === 'running') {
        const step = workflow.steps.find((s) => s.id === currentStepId);
        if (!step) break;

        const stepExecution = await this.executeStep(step, execution.variables);
        execution.steps.push(stepExecution);
        stepResults[step.id] = stepExecution;

        // Check step execution result
        if (stepExecution.status === 'failed') {
          if (step.errorHandler) {
            if (step.errorHandler.type === 'retry') {
              // Retry logic
              for (let i = 0; i < (step.errorHandler.maxRetries || 3); i++) {
                await this.sleep(step.errorHandler.retryDelay || 1000);
                const retryExecution = await this.executeStep(step, execution.variables);
                if (retryExecution.status === 'completed') {
                  execution.steps[execution.steps.length - 1] = retryExecution;
                  stepResults[step.id] = retryExecution;
                  break;
                }
              }
            } else if (step.errorHandler.type === 'fallback' && step.errorHandler.fallbackStepId) {
              currentStepId = step.errorHandler.fallbackStepId;
              continue;
            } else if (step.errorHandler.type === 'skip') {
              execution.steps[execution.steps.length - 1].status = 'skipped';
            }
          } else {
            execution.status = 'failed';
            execution.error = `Step ${step.name} failed: ${stepExecution.error}`;
            break;
          }
        }

        // Determine next step
        if (step.nextSteps && step.nextSteps.length > 0) {
          currentStepId = step.nextSteps[0];
        } else {
          break;
        }
      }

      if (execution.status === 'running') {
        execution.status = 'completed';
      }

      execution.completedAt = new Date();
      workflow.lastExecuted = execution.completedAt;

      return {
        executionId,
        status: execution.status as any,
        duration: Date.now() - startTime,
        stepResults,
        output: execution.variables,
      };
    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
      execution.completedAt = new Date();

      return {
        executionId,
        status: 'failed',
        duration: Date.now() - startTime,
        stepResults: {},
        error: error.message,
      };
    }
  }

  /**
   * Execute a single step
   */
  private async executeStep(step: any, variables: Record<string, any>): Promise<StepExecution> {
    const startTime = Date.now();

    try {
      // Simulate step execution based on type
      let output: Record<string, any> = {};

      switch (step.type) {
        case 'trigger':
          output = { triggered: true, timestamp: new Date() };
          break;
        case 'action':
          // Execute action (could be webhook call, email, etc.)
          output = await this.executeAction(step.config, variables);
          break;
        case 'condition':
          // Evaluate condition
          const conditionMet = await this.evaluateCondition(step.config, variables);
          output = { conditionMet };
          break;
        case 'delay':
          await this.sleep(step.config.delayMs || 1000);
          output = { delayed: true };
          break;
        case 'webhook':
          output = await this.callWebhook(step.config, variables);
          break;
        case 'notification':
          output = await this.sendNotification(step.config, variables);
          break;
        default:
          output = {};
      }

      // Update variables
      if (step.config.outputVariable) {
        variables[step.config.outputVariable] = output;
      }

      return {
        id: `step-exec-${Math.random()}`,
        stepId: step.id,
        status: 'completed',
        input: step.config,
        output,
        startedAt: new Date(startTime),
        completedAt: new Date(),
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        id: `step-exec-${Math.random()}`,
        stepId: step.id,
        status: 'failed',
        input: step.config,
        error: error.message,
        startedAt: new Date(startTime),
        completedAt: new Date(),
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Execute action step
   */
  private async executeAction(config: Record<string, any>, variables: Record<string, any>): Promise<any> {
    // Simulate action execution
    return {
      actionType: config.actionType,
      success: true,
      result: `Action ${config.actionType} executed`,
    };
  }

  /**
   * Evaluate condition
   */
  private async evaluateCondition(config: Record<string, any>, variables: Record<string, any>): Promise<boolean> {
    const { field, operator, value } = config;
    const fieldValue = variables[field];

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'contains':
        return String(fieldValue).includes(String(value));
      case 'greater':
        return fieldValue > value;
      case 'less':
        return fieldValue < value;
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      default:
        return false;
    }
  }

  /**
   * Call webhook
   */
  private async callWebhook(config: Record<string, any>, variables: Record<string, any>): Promise<any> {
    // Simulate webhook call
    return {
      url: config.url,
      method: config.method || 'POST',
      status: 200,
      response: { success: true },
    };
  }

  /**
   * Send notification
   */
  private async sendNotification(config: Record<string, any>, variables: Record<string, any>): Promise<any> {
    // Simulate notification
    return {
      type: config.type,
      recipient: config.recipient,
      status: 'sent',
      timestamp: new Date(),
    };
  }

  /**
   * Get execution history
   */
  async getExecutionHistory(
    workflowId: string,
    tenantId: string,
    limit: number = 20,
  ): Promise<WorkflowExecution[]> {
    return Array.from(this.executions.values())
      .filter((e) => e.workflowId === workflowId && e.tenantId === tenantId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get execution details
   */
  async getExecutionDetails(executionId: string, tenantId: string): Promise<WorkflowExecution | null> {
    const execution = this.executions.get(executionId);
    if (!execution || execution.tenantId !== tenantId) return null;
    return execution;
  }

  /**
   * Create workflow template
   */
  async createTemplate(
    tenantId: string,
    name: string,
    category: string,
    workflow: Partial<Workflow>,
  ): Promise<WorkflowTemplate> {
    const templateId = `tmpl-${++this.idCounter}`;

    const template: WorkflowTemplate = {
      id: templateId,
      tenantId,
      name,
      description: workflow.description,
      category,
      workflow,
      createdAt: new Date(),
    };

    this.templates.set(templateId, template);
    return template;
  }

  /**
   * List templates
   */
  async listTemplates(tenantId: string): Promise<WorkflowTemplate[]> {
    return Array.from(this.templates.values()).filter((t) => t.tenantId === tenantId);
  }

  /**
   * Helper: sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
