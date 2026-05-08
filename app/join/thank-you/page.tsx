'use client'

import { useState } from 'react'

const ICONS = ['🔥', '⚡', '💡']

export default function JoinThankYouPage() {
  const [memberNumber] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const n = parseInt(params.get('n') ?? '0', 10)
    return n > 0 ? n : null
  })

  const [recommendations] = useState<Array<{ title: string; description: string }>>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = sessionStorage.getItem('cm_recommendations')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const hasRecommendations = recommendations.length > 0

  const shareText = encodeURIComponent(
    'I just joined Claude Malaysia 🇲🇾 — the AI community for Malaysians building with AI. Join here → https://claudemalaysia.com/join?ref=whatsapp'
  )
  const shareUrl = `https://wa.me/?text=${shareText}`

  const styles = {
    container: {
      backgroundColor: '#0a0a0a',
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    } as React.CSSProperties,
    contentBox: {
      maxWidth: '480px',
      width: '100%',
      textAlign: 'center' as const,
    } as React.CSSProperties,
    flag: {
      fontSize: '64px',
      marginBottom: '24px',
    } as React.CSSProperties,
    heading: {
      color: '#ededed',
      fontSize: '22px',
      fontWeight: 700,
      margin: '0 0 16px',
    } as React.CSSProperties,
    numberDisplay: {
      fontSize: 'clamp(36px, 8vw, 56px)',
      fontWeight: 800,
      color: '#E8760A',
      marginBottom: '8px',
      lineHeight: 1.2,
    } as React.CSSProperties,
    divider: {
      height: '1px',
      backgroundColor: 'rgba(237,237,237,0.2)',
      margin: '32px 0',
    } as React.CSSProperties,
    sectionHeading: {
      color: '#ededed',
      fontSize: '16px',
      fontWeight: 700,
      marginBottom: '8px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const,
    } as React.CSSProperties,
    sectionSubtext: {
      color: 'rgba(237,237,237,0.6)',
      fontSize: '14px',
      marginBottom: '20px',
      lineHeight: 1.5,
    } as React.CSSProperties,
    card: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      padding: '20px',
      textAlign: 'left' as const,
      marginBottom: '10px',
    } as React.CSSProperties,
    cardTitle: {
      fontWeight: 700,
      color: '#ededed',
      fontSize: '16px',
      marginBottom: '8px',
      margin: '0 0 8px',
    } as React.CSSProperties,
    cardDescription: {
      color: 'rgba(237,237,237,0.7)',
      fontSize: '14px',
      lineHeight: 1.6,
      margin: 0,
    } as React.CSSProperties,
    implementNote: {
      color: 'rgba(237,237,237,0.5)',
      fontSize: '13px',
      marginTop: '16px',
      marginBottom: '0',
      textAlign: 'center' as const,
    } as React.CSSProperties,
    whatsappButton: {
      display: 'block',
      width: '100%',
      padding: '16px',
      backgroundColor: '#25D366',
      color: '#000',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: 700,
      borderRadius: '8px',
      boxSizing: 'border-box' as const,
      transition: 'background-color 0.2s',
    } as React.CSSProperties,
    shareLabel: {
      color: 'rgba(237,237,237,0.7)',
      fontSize: '14px',
      marginBottom: '12px',
      display: 'block',
    } as React.CSSProperties,
    shareButton: {
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: '#25D366',
      color: '#000',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: 700,
      borderRadius: '6px',
      transition: 'background-color 0.2s',
    } as React.CSSProperties,
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentBox}>
        <div style={styles.flag}>🇲🇾</div>

        <h1 style={styles.heading}>Welcome to Claude Malaysia</h1>

        {memberNumber !== null && (
          <div style={styles.numberDisplay}>You&apos;re member #{memberNumber}</div>
        )}

        {hasRecommendations && (
          <>
            <div style={styles.divider} />

            <p style={styles.sectionHeading}>──── Your AI Action Plan ────</p>
            <p style={styles.sectionSubtext}>
              Based on your profile, here are your top 3 AI moves:
            </p>

            {recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} style={styles.card}>
                <p style={styles.cardTitle}>
                  {ICONS[i]} #{i + 1} — {rec.title}
                </p>
                <p style={styles.cardDescription}>{rec.description}</p>
              </div>
            ))}

            <p style={styles.implementNote}>Claude Malaysia can help you implement all 3.</p>
          </>
        )}

        <div style={styles.divider} />

        <a
          href="https://chat.whatsapp.com/EcQP4EzOFSwLWfv8uFirsm?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.whatsappButton}
        >
          Join the WhatsApp Group — Let&apos;s build →
        </a>

        <div style={{ marginTop: '24px', marginBottom: '8px' }}>
          <label style={styles.shareLabel}>Share with a Malaysian friend:</label>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.shareButton}
          >
            📱 Share on WhatsApp
          </a>
        </div>

        <div style={{ marginTop: '32px' }}>
          <a
            href="/join/leaderboard"
            style={{
              color: 'rgba(237,237,237,0.5)',
              fontSize: 14,
              textDecoration: 'none',
              borderBottom: '1px solid rgba(237,237,237,0.2)',
            }}
          >
            🏆 See which community is leading →
          </a>
        </div>
      </div>
    </div>
  )
}
