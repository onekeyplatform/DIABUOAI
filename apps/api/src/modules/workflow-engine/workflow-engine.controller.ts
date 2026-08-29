import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkflowEngineService } from './workflow-engine.service';
import { CreateWorkflowInput, ExecuteWorkflowInput } from './workflow.types';

@Controller('workflows')
@ApiTags('Workflow Engine')
export class WorkflowEngineController {
  constructor(private readonly workflowService: WorkflowEngineService) {}

  @Post()
  async createWorkflow(@Body() input: CreateWorkflowInput) {
    return this.workflowService.createWorkflow(input);
  }

  @Get()
  async listWorkflows(@Query('tenantId') tenantId: string) {
    return this.workflowService.listWorkflows(tenantId);
  }

  @Get(':workflowId')
  async getWorkflow(@Param('workflowId') workflowId: string, @Query('tenantId') tenantId: string) {
    return this.workflowService.getWorkflow(workflowId, tenantId);
  }

  @Put(':workflowId')
  async updateWorkflow(
    @Param('workflowId') workflowId: string,
    @Query('tenantId') tenantId: string,
    @Body() updates: any,
  ) {
    return this.workflowService.updateWorkflow(workflowId, tenantId, updates);
  }

  @Post(':workflowId/activate')
  async activateWorkflow(
    @Param('workflowId') workflowId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.workflowService.activateWorkflow(workflowId, tenantId);
  }

  @Post(':workflowId/pause')
  async pauseWorkflow(
    @Param('workflowId') workflowId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.workflowService.pauseWorkflow(workflowId, tenantId);
  }

  @Delete(':workflowId')
  async deleteWorkflow(
    @Param('workflowId') workflowId: string,
    @Query('tenantId') tenantId: string,
  ) {
    const success = await this.workflowService.deleteWorkflow(workflowId, tenantId);
    return { success, workflowId };
  }

  @Post(':workflowId/execute')
  async executeWorkflow(
    @Param('workflowId') workflowId: string,
    @Query('tenantId') tenantId: string,
    @Body() body: { variables?: Record<string, any> },
  ) {
    return this.workflowService.executeWorkflow({
      tenantId,
      workflowId,
      variables: body.variables,
    });
  }

  @Get(':workflowId/executions')
  async getExecutionHistory(
    @Param('workflowId') workflowId: string,
    @Query('tenantId') tenantId: string,
    @Query('limit') limit?: number,
  ) {
    return this.workflowService.getExecutionHistory(workflowId, tenantId, limit);
  }

  @Get('executions/:executionId')
  async getExecutionDetails(
    @Param('executionId') executionId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.workflowService.getExecutionDetails(executionId, tenantId);
  }

  @Post('templates')
  async createTemplate(
    @Query('tenantId') tenantId: string,
    @Body() body: { name: string; category: string; workflow: any },
  ) {
    return this.workflowService.createTemplate(tenantId, body.name, body.category, body.workflow);
  }

  @Get('templates/list')
  async listTemplates(@Query('tenantId') tenantId: string) {
    return this.workflowService.listTemplates(tenantId);
  }
}
