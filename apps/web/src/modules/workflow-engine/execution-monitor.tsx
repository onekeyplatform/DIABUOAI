export function ExecutionMonitor() {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Recent Executions</h3>
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
            <p style={{ margin: 0, fontWeight: 500 }}>Approval Request #1234</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
              Completed in 2.3s
            </p>
          </div>
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
            Success
          </span>
        </div>
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
            <p style={{ margin: 0, fontWeight: 500 }}>Email Notification #1233</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
              Failed - Webhook timeout
            </p>
          </div>
          <span
            style={{
              display: 'inline-block',
              background: '#fee2e2',
              color: '#991b1b',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: '0.875rem',
            }}
          >
            Failed
          </span>
        </div>
      </div>
    </section>
  );
}
