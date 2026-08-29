export function DocumentVersions() {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Document Versions</h3>
      <div style={{ display: 'grid', gap: 8 }}>
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 12,
            background: '#f9fafb',
            cursor: 'pointer',
          }}
        >
          <p style={{ margin: 0, fontWeight: 500 }}>Version 3 (current)</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
            Updated content and formatting
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
            By User Name • 1 hour ago
          </p>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <p style={{ margin: 0, fontWeight: 500 }}>Version 2</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
            Initial draft
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
            By User Name • 5 hours ago
          </p>
          <button
            style={{
              marginTop: 8,
              background: 'none',
              border: 'none',
              color: '#4f46e5',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Restore
          </button>
        </div>
      </div>
    </section>
  );
}
