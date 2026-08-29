import { WorkflowBuilder } from './workflow-builder';
import { WorkflowList } from './workflow-list';
import { ExecutionMonitor } from './execution-monitor';

export function WorkflowEngineBoard() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <WorkflowBuilder />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <WorkflowList />
        <ExecutionMonitor />
      </div>
    </div>
  );
}
