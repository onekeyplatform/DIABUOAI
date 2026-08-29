export function LoginForm() {
  return (
    <form style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <h2>Sign in</h2>
      <input type="email" placeholder="Email" style={{ padding: 12, borderRadius: 8 }} />
      <input type="password" placeholder="Password" style={{ padding: 12, borderRadius: 8 }} />
      <button type="submit" style={{ padding: 12, borderRadius: 8, background: '#111827', color: '#fff' }}>
        Continue
      </button>
    </form>
  );
}
