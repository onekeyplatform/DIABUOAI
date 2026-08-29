-- Create Workflow table
CREATE TABLE IF NOT EXISTS "Workflow" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "createdBy" TEXT NOT NULL,
  "trigger" JSONB NOT NULL,
  "steps" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastExecuted" TIMESTAMP(3),

  CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- Create WorkflowExecution table
CREATE TABLE IF NOT EXISTS "WorkflowExecution" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "workflowId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'running',
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "steps" JSONB NOT NULL DEFAULT '[]',
  "variables" JSONB NOT NULL DEFAULT '{}',
  "error" TEXT,

  CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow" ("id") ON DELETE CASCADE
);

-- Create WorkflowTemplate table
CREATE TABLE IF NOT EXISTS "WorkflowTemplate" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT NOT NULL,
  "workflow" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "WorkflowTemplate_pkey" PRIMARY KEY ("id")
);

-- Create WorkflowAuditLog table
CREATE TABLE IF NOT EXISTS "WorkflowAuditLog" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "workflowId" TEXT NOT NULL,
  "executionId" TEXT,
  "action" TEXT NOT NULL,
  "details" JSONB,
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "WorkflowAuditLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "WorkflowAuditLog_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow" ("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Workflow_tenantId_idx" ON "Workflow"("tenantId");
CREATE INDEX IF NOT EXISTS "Workflow_status_idx" ON "Workflow"("status");
CREATE INDEX IF NOT EXISTS "Workflow_createdBy_idx" ON "Workflow"("createdBy");
CREATE INDEX IF NOT EXISTS "WorkflowExecution_tenantId_idx" ON "WorkflowExecution"("tenantId");
CREATE INDEX IF NOT EXISTS "WorkflowExecution_workflowId_idx" ON "WorkflowExecution"("workflowId");
CREATE INDEX IF NOT EXISTS "WorkflowExecution_status_idx" ON "WorkflowExecution"("status");
CREATE INDEX IF NOT EXISTS "WorkflowTemplate_tenantId_idx" ON "WorkflowTemplate"("tenantId");
CREATE INDEX IF NOT EXISTS "WorkflowAuditLog_tenantId_idx" ON "WorkflowAuditLog"("tenantId");
CREATE INDEX IF NOT EXISTS "WorkflowAuditLog_workflowId_idx" ON "WorkflowAuditLog"("workflowId");
CREATE INDEX IF NOT EXISTS "WorkflowAuditLog_executionId_idx" ON "WorkflowAuditLog"("executionId");
