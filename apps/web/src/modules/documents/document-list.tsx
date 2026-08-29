export function DocumentList() {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Documents</h3>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Search documents..."
          style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }}
        />
        <select
          style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }}
        >
          <option>All statuses</option>
          <option>Draft</option>
          <option>Published</option>
          <option>Archived</option>
        </select>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 600 }}>Title</th>
            <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 600 }}>Type</th>
            <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 600 }}>Status</th>
            <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 600 }}>Modified</th>
            <th style={{ textAlign: 'right', padding: '12px 0', fontWeight: 600 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <td style={{ padding: '12px 0' }}>Company Policy</td>
            <td style={{ padding: '12px 0' }}>Policy</td>
            <td style={{ padding: '12px 0' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: '0.875rem',
                }}
              >
                Published
              </span>
            </td>
            <td style={{ padding: '12px 0', color: '#6b7280', fontSize: '0.875rem' }}>
              2 hours ago
            </td>
            <td style={{ padding: '12px 0', textAlign: 'right' }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4f46e5',
                  cursor: 'pointer',
                  marginRight: 12,
                  fontSize: '0.875rem',
                }}
              >
                Edit
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
