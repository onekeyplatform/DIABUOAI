export function ChatPanel() {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Chat</h3>
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ background: '#f3f4f6', borderRadius: 8, padding: 12 }}>Welcome! Ask me anything.</div>
        <div style={{ background: '#eef2ff', borderRadius: 8, padding: 12 }}>How can I help you today?</div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <input
          placeholder="Type your message"
          style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px' }}
        />
        <button style={{ border: 'none', borderRadius: 8, padding: '10px 16px', background: '#4f46e5', color: '#fff' }}>
          Send
        </button>
      </div>
    </section>
  );
}
