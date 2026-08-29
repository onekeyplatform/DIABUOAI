export function KnowledgeBaseSearch() {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Search Knowledge Base</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Ask a question or search documents..."
          style={{
            flex: 1,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            padding: '10px 12px',
          }}
        />
        <button
          style={{
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            background: '#4f46e5',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input type="radio" name="search-type" defaultChecked />
          <span>Hybrid Search (Recommended)</span>
        </label>
        <label style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input type="radio" name="search-type" />
          <span>Vector Search (Semantic)</span>
        </label>
        <label style={{ display: 'flex', gap: 8 }}>
          <input type="radio" name="search-type" />
          <span>Full-Text Search (Keyword)</span>
        </label>
      </div>

      <div style={{ marginTop: 16 }}>
        <h4 style={{ marginBottom: 12 }}>Search Results</h4>
        <div style={{ display: 'grid', gap: 8 }}>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 12,
              background: '#f9fafb',
            }}
          >
            <p style={{ margin: 0, fontWeight: 500 }}>Document Title</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
              Relevant excerpt with matching content...
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
              Similarity: 87% • Chunk 3
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
