'use client'

export default function JoinPage() {
  return (
    <main
      style={{
        minHeight: '100svh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🇲🇾</div>

        <h1
          style={{
            fontSize: 'clamp(28px, 6vw, 40px)',
            fontWeight: 800,
            color: '#ededed',
            margin: '0 0 12px',
            letterSpacing: '-0.5px',
          }}
        >
          Claude Malaysia
        </h1>

        <p
          style={{
            color: 'rgba(237,237,237,0.6)',
            fontSize: '16px',
            margin: '0 0 40px',
            lineHeight: 1.5,
          }}
        >
          The AI community for Malaysians building with AI
        </p>

        <a
          href="https://chat.whatsapp.com/EcQP4EzOFSwLWfv8uFirsm?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            width: '100%',
            padding: '18px',
            backgroundColor: '#25D366',
            color: '#000',
            textDecoration: 'none',
            fontSize: '17px',
            fontWeight: 700,
            borderRadius: '12px',
            boxSizing: 'border-box',
          }}
        >
          Join Claude Malaysia WhatsApp →
        </a>
      </div>
    </main>
  )
}
