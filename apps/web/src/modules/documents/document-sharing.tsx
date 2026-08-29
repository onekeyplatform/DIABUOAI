export function DocumentSharing() {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Share Document</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          placeholder="Email or user ID"
          style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }}
        />
        <select
          style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }}
        >
          <option>View only</option>
          <option>Comment</option>
          <option>Edit</option>
          <option>Admin</option>
        </select>
        <button
          style={{
            border: 'none',
            borderRadius: 8,
            padding: '10px 16px',
            background: '#4f46e5',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Share
        </button>

        <div style={{ marginTop: 16 }}>
          <h4 style={{ marginBottom: 12 }}>Shared with</h4>
          <div style={{ display: 'grid', gap: 8 }}>
            <div
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 500 }}>user@example.com</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Can edit</p>
              </div>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
