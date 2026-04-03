const footerStyles: Record<string, React.CSSProperties> = {
  footer: {
    borderTop: '1px solid var(--border)',
    padding: '40px 24px',
    textAlign: 'center' as const,
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  inner: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px',
  },
  line: {
    width: '60px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
    borderRadius: '1px',
  },
  text: {
    color: 'var(--text-secondary)',
  },
  accent: {
    color: 'var(--accent)',
    fontWeight: 600,
  },
};

export default function Footer() {
  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.inner}>
        <div style={footerStyles.line} />
        <p style={footerStyles.text}>
          <span style={footerStyles.accent}>OJT Journal</span> — On-the-Job Training Weekly Reports
        </p>
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
