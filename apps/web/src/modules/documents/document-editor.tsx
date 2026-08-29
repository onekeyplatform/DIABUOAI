export function DocumentEditor() {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Create Document</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          placeholder="Document title"
          style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }}
        />
        <select
          style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }}
        >
          <option>Select type...</option>
          <option>Page</option>
          <option>Wiki</option>
          <option>Guide</option>
          <option>Policy</option>
          <option>Template</option>
        </select>
        <textarea
          placeholder="Document content"
          style={{
            border: '1px solid #d1d5db',
            borderRadius: 8,
            padding: '10px 12px',
            minHeight: 200,
            fontFamily: 'monospace',
          }}
        />
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
            Publish
          </button>
        </div>
      </div>
    </section>
  );
}
