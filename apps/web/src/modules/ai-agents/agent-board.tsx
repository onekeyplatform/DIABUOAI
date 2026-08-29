export function AgentBoard() {
  const agents = [
    { name: 'Sales Assistant', status: 'active' },
    { name: 'Support Copilot', status: 'active' },
  ];

  return (
    <section style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <h2>AI Agents</h2>
      {agents.map((agent) => (
        <div key={agent.name} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
          <div><strong>{agent.name}</strong></div>
          <div style={{ color: '#10b981' }}>{agent.status}</div>
        </div>
      ))}
    </section>
  );
}
