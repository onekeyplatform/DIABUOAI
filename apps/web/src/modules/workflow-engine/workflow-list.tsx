export function WorkflowList() {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Workflows</h3>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: 16,
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 600 }}>Name</th>
            <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 600 }}>Trigger</th>
            <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 600 }}>Status</th>
            <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 600 }}>Executions</th>
            <th style={{ textAlign: 'right', padding: '12px 0', fontWeight: 600 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <td style={{ padding: '12px 0' }}>Approval Request</td>
            <td style={{ padding: '12px 0' }}>Manual</td>
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
                Active
              </span>
            </td>
            <td style={{ padding: '12px 0', color: '#6b7280', fontSize: '0.875rem' }}>
              127 runs
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
