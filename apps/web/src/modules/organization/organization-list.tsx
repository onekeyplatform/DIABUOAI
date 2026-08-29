export function OrganizationList() {
  const organizations = [
    { name: 'Acme Hotels', slug: 'acme-hotels', status: 'active' },
    { name: 'Northwind Travel', slug: 'northwind-travel', status: 'trial' },
  ];

  return (
    <section style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <h2>Organizations</h2>
      {organizations.map((org) => (
        <div key={org.slug} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
          <strong>{org.name}</strong>
          <div style={{ color: '#6b7280' }}>/{org.slug}</div>
          <div style={{ color: '#10b981' }}>{org.status}</div>
        </div>
      ))}
    </section>
  );
}
