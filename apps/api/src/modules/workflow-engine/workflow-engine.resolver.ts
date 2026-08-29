import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WorkflowEngineService } from './workflow-engine.service';
import { CreateWorkflowInput } from './workflow.types';

@Resolver()
export class WorkflowEngineResolver {
  constructor(private readonly workflowService: WorkflowEngineService) {}

  @Mutation()
  async createWorkflow(@Args() input: CreateWorkflowInput) {
    return this.workflowService.createWorkflow(input);
  }

  @Query()
  async workflow(@Args('workflowId') workflowId: string, @Args('tenantId') tenantId: string) {
    return this.workflowService.getWorkflow(workflowId, tenantId);
  }

  @Query()
  async workflows(@Args('tenantId') tenantId: string) {
    return this.workflowService.listWorkflows(tenantId);
  }

  @Mutation()
  async updateWorkflow(
    @Args('workflowId') workflowId: string,
    @Args('tenantId') tenantId: string,
    @Args() updates: any,
  ) {
    return this.workflowService.updateWorkflow(workflowId, tenantId, updates);
  }

  @Mutation()
  async activateWorkflow(@Args('workflowId') workflowId: string, @Args('tenantId') tenantId: string) {
    return this.workflowService.activateWorkflow(workflowId, tenantId);
  }

  @Mutation()
  async pauseWorkflow(@Args('workflowId') workflowId: string, @Args('tenantId') tenantId: string) {
    return this.workflowService.pauseWorkflow(workflowId, tenantId);
  }

  @Mutation()
  async deleteWorkflow(@Args('workflowId') workflowId: string, @Args('tenantId') tenantId: string) {
    const success = await this.workflowService.deleteWorkflow(workflowId, tenantId);
    return { success, workflowId };
  }

  @Mutation()
  async executeWorkflow(
    @Args('workflowId') workflowId: string,
    @Args('tenantId') tenantId: string,
    @Args('variables', { nullable: true }) variables?: Record<string, any>,
  ) {
    return this.workflowService.executeWorkflow({
      tenantId,
      workflowId,
      variables,
    });
  }

  @Query()
  async workflowExecutions(
    @Args('workflowId') workflowId: string,
    @Args('tenantId') tenantId: string,
    @Args('limit', { nullable: true }) limit?: number,
  ) {
    return this.workflowService.getExecutionHistory(workflowId, tenantId, limit);
  }

  @Query()
  async workflowExecution(
    @Args('executionId') executionId: string,
    @Args('tenantId') tenantId: string,
  ) {
    return this.workflowService.getExecutionDetails(executionId, tenantId);
  }
}
