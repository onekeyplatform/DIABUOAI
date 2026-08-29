export function DocumentUploader() {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Upload Document</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          placeholder="Document title"
          style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }}
        />
        <div
          style={{
            border: '2px dashed #d1d5db',
            borderRadius: 8,
            padding: 40,
            textAlign: 'center',
            cursor: 'pointer',
            background: '#f9fafb',
          }}
        >
          <p style={{ margin: 0, color: '#6b7280' }}>
            Drag and drop files here, or click to select
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>
            PDF, DOCX, TXT supported
          </p>
          <input type="file" style={{ display: 'none' }} />
        </div>
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
          Upload
        </button>
      </div>
    </section>
  );
}
