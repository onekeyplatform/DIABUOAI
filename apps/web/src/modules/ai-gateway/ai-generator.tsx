export function AiGenerator() {
  return (
    <section style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <h2>AI Gateway</h2>
      <textarea placeholder="Prompt" rows={5} style={{ padding: 12, borderRadius: 8 }} />
      <button type="button" style={{ padding: 12, borderRadius: 8, background: '#7c3aed', color: '#fff' }}>
        Generate
      </button>
    </section>
  );
}
