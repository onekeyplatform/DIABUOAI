import { Module } from '@nestjs/common';
import { WorkflowEngineController } from './workflow-engine.controller';
import { WorkflowEngineService } from './workflow-engine.service';
import { WorkflowEngineResolver } from './workflow-engine.resolver';

@Module({
  controllers: [WorkflowEngineController],
  providers: [WorkflowEngineService, WorkflowEngineResolver],
  exports: [WorkflowEngineService],
})
export class WorkflowEngineModule {}
