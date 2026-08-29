export function UsersTable() {
  const users = [
    { id: 'u1', email: 'admin@acme.com', name: 'Alice', isActive: true },
    { id: 'u2', email: 'ops@acme.com', name: 'Ben', isActive: true },
  ];

  return (
    <section style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <h2>Users</h2>
      {users.map((user) => (
        <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
          <div>
            <strong>{user.name}</strong>
            <div style={{ color: '#6b7280' }}>{user.email}</div>
          </div>
          <span style={{ color: user.isActive ? '#10b981' : '#ef4444' }}>{user.isActive ? 'active' : 'inactive'}</span>
        </div>
      ))}
    </section>
  );
}
