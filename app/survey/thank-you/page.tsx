'use client'

import { useState } from 'react'

export default function ThankYouPage() {
  const [{ respondentNumber, shareUrl }] = useState(() => {
    if (typeof window === 'undefined') return { respondentNumber: null, shareUrl: '' }
    const params = new URLSearchParams(window.location.search)
    const n = parseInt(
      params.get('n') ?? localStorage.getItem('malaysia_ai_pulse_respondent') ?? '0',
      10
    )
    const msg = encodeURIComponent(
      `I just took Malaysia AI Pulse 2026 🇲🇾 — quick survey on AI in Malaysia.\nI'm respondent #${n}. Takes 3 mins → ${window.location.origin}/survey?ref=whatsapp_share`
    )
    return {
      respondentNumber: n > 0 ? n : null,
      shareUrl: `https://wa.me/?text=${msg}`,
    }
  })

  const skoolUrl = process.env.NEXT_PUBLIC_SKOOL_URL ?? '#'
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ?? '#'

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
    numberDisplay: {
      fontSize: 'clamp(36px, 8vw, 56px)',
      fontWeight: 800,
      color: '#E8760A',
      marginBottom: '16px',
      lineHeight: 1.2,
    } as React.CSSProperties,
    subtitle: {
      color: '#ededed',
      fontSize: '16px',
      marginBottom: '32px',
      lineHeight: 1.5,
    } as React.CSSProperties,
    divider: {
      height: '1px',
      backgroundColor: 'rgba(237,237,237,0.2)',
      margin: '32px 0',
    } as React.CSSProperties,
    primaryButton: {
      display: 'block',
      width: '100%',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: '#E8760A',
      color: '#0a0a0a',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'background-color 0.2s',
    } as React.CSSProperties,
    secondaryButton: {
      display: 'block',
      width: '100%',
      padding: '16px',
      marginBottom: '32px',
      backgroundColor: 'transparent',
      color: '#25D366',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: 700,
      border: '2px solid #25D366',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'all 0.2s',
      boxSizing: 'border-box' as const,
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
      border: 'none',
      cursor: 'pointer',
      borderRadius: '6px',
      transition: 'background-color 0.2s',
    } as React.CSSProperties,
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentBox}>
        <div style={styles.flag}>🇲🇾</div>

        <div style={styles.numberDisplay}>
          {respondentNumber ? `You're Malaysian #${respondentNumber}` : 'Thank you!'}
        </div>

        <p style={styles.subtitle}>Thank you for helping map Malaysia&apos;s AI future.</p>

        <div style={styles.divider} />

        <a href={skoolUrl} target="_blank" rel="noopener noreferrer" style={styles.primaryButton}>
          Join the Free AI Training Community →
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.secondaryButton}
        >
          Join Malaysia AI Pulse WhatsApp →
        </a>

        <label style={styles.shareLabel}>Share with a Malaysian friend:</label>
        <a href={shareUrl} target="_blank" rel="noopener noreferrer" style={styles.shareButton}>
          📱 Share on WhatsApp
        </a>
      </div>
    </div>
  )
}
