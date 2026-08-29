export type ButtonVariant = 'primary' | 'secondary';

export function Button({
  children,
  variant = 'primary',
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
}) {
  const styles = {
    primary: { background: '#8b5cf6', color: '#fff' },
    secondary: { background: '#1f2937', color: '#e5e7eb' },
  };

  return (
    <button
      style={{
        ...styles[variant],
        border: 'none',
        borderRadius: 999,
        padding: '0.75rem 1.25rem',
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}
