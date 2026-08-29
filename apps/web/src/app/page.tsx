import { Button } from '@diabuoai/ui';
import { LoginForm } from '../modules/auth/login-form';
import { AgentBoard } from '../modules/ai-agents/agent-board';
import { AiGenerator } from '../modules/ai-gateway/ai-generator';
import { ChatPanel } from '../modules/chat/chat-panel';
import { DocumentsBoard } from '../modules/documents/documents-board';
import { KnowledgeBaseBoard } from '../modules/knowledge-base/kb-board';
import { OrganizationList } from '../modules/organization/organization-list';
import { RolesPanel } from '../modules/rbac/roles-panel';
import { UsersTable } from '../modules/users/users-table';

export default function HomePage() {
  return (
    <main style={{ padding: '4rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7c3aed' }}>
          Multi-tenant AI platform
        </p>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>DIABUOAI</h1>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 720 }}>
          A production-ready enterprise architecture for AI agents, workflow automation, customer
          operations, and secure multi-tenant SaaS delivery.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <Button variant="primary">Launch workspace</Button>
          <Button variant="secondary">View architecture</Button>
        </div>
        <div style={{ marginTop: '3rem', display: 'grid', gap: '2rem' }}>
          <LoginForm />
          <RolesPanel />
          <OrganizationList />
          <UsersTable />
          <AiGenerator />
          <AgentBoard />
          <ChatPanel />
          <KnowledgeBaseBoard />
          <DocumentsBoard />
        </div>
      </div>
    </main>
  );

