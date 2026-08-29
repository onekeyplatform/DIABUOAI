export function WorkflowBuilder() {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Create Workflow</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          placeholder="Workflow name"
          style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }}
        />
        <select
          style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }}
        >
          <option>Select trigger type...</option>
          <option>Manual</option>
          <option>Schedule</option>
          <option>Webhook</option>
          <option>Event</option>
        </select>
        <div
          style={{
            border: '2px dashed #d1d5db',
            borderRadius: 8,
            padding: 40,
            textAlign: 'center',
            minHeight: 300,
            background: '#f9fafb',
          }}
        >
          <p style={{ margin: 0, color: '#6b7280' }}>
            Drag and drop steps to build your workflow
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>
            Available steps: Action, Condition, Delay, Webhook, Notification
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
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
            Save Draft
          </button>
          <button
            style={{
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              background: '#10b981',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Activate
          </button>
        </div>
      </div>
    </section>
  );
}
