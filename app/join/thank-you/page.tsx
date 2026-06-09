'use client'

import { useState, useEffect } from 'react'

const ANIMATION_CSS = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232,118,10,0); border-color: rgba(232,118,10,0.35); }
  50%       { box-shadow: 0 0 32px 4px rgba(232,118,10,0.18); border-color: rgba(232,118,10,0.7); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`

const ICONS = ['🔥', '⚡', '💡']

function animated(delay: number, extra?: React.CSSProperties): React.CSSProperties {
  return {
    animation: `fadeUp 0.55s ease both`,
    animationDelay: `${delay}ms`,
    ...extra,
  }
}

export default function JoinThankYouPage() {
  const [memberNumber, setMemberNumber] = useState<number | null>(null)
  const [recommendations, setRecommendations] = useState<Array<{ title: string; description: string }>>([])
  const [phone, setPhone] = useState<string>('')
  const [foundingNumber, setFoundingNumber] = useState<number | null>(null)

  useEffect(() => {
    const n = parseInt(new URLSearchParams(window.location.search).get('n') ?? '0', 10)
    if (n > 0) setMemberNumber(n)

    try {
      const stored = sessionStorage.getItem('cm_recommendations')
      if (stored) setRecommendations(JSON.parse(stored))
    } catch {}

    setPhone(sessionStorage.getItem('cm_phone') ?? '')

    const fm = sessionStorage.getItem('cm_founding_number')
    if (fm) setFoundingNumber(parseInt(fm))
  }, [])

  const refParam = phone || (memberNumber ? `member_${memberNumber}` : 'share')
  const shareMsg = `I just joined Claude Malaysia (Malaysia) — member #${memberNumber ?? '?'} of the AI community for Malaysians building with AI. Join here → https://claudemalaysia.com/join?ref=${refParam}`

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareMsg)}`

  return (
    <main style={{
      minHeight: '100svh',
      background: '#0a0a0a',
      color: '#ededed',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 20px 64px',
      overflowX: 'hidden',
    }}>
      <style>{ANIMATION_CSS}</style>

      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Flag */}
        <div style={{
          textAlign: 'center',
          fontSize: '56px',
          marginBottom: '20px',
          animation: 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          🇲🇾
        </div>

        {/* Heading */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(237,237,237,0.6)',
          fontSize: '15px',
          margin: '0 0 20px',
          letterSpacing: '0.3px',
          ...animated(100),
        }}>
          Welcome to Claude Malaysia
        </p>

        {/* Screenshot prompt */}
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#E8760A',
          fontWeight: 600,
          margin: '0 0 10px',
          letterSpacing: '0.3px',
          ...animated(150),
        }}>
          📸 Screenshot this — you&apos;ll only see it once!
        </p>

        {/* Shareable member card */}
        <div style={{
          background: foundingNumber
            ? 'linear-gradient(135deg, rgba(245,166,35,0.12) 0%, rgba(0,0,0,0) 80%)'
            : 'linear-gradient(135deg, rgba(232,118,10,0.10) 0%, rgba(0,0,0,0) 80%)',
          border: foundingNumber ? '1px solid rgba(245,166,35,0.5)' : '1px solid rgba(232,118,10,0.4)',
          borderRadius: '20px',
          padding: '28px 24px 24px',
          textAlign: 'center',
          marginBottom: '36px',
          animation: `glowPulse 2.8s ease-in-out infinite, fadeUp 0.55s ease both`,
          animationDelay: '0ms, 200ms',
        }}>
          <p style={{
            fontSize: '11px',
            letterSpacing: '3px',
            color: foundingNumber ? 'rgba(245,166,35,0.8)' : 'rgba(232,118,10,0.7)',
            textTransform: 'uppercase',
            margin: '0 0 6px',
            fontWeight: 600,
          }}>
            {foundingNumber ? '⭐ Founding Member' : 'Claude Malaysia'}
          </p>
          <p style={{
            fontSize: '13px',
            color: 'rgba(237,237,237,0.5)',
            margin: '0 0 6px',
            letterSpacing: '1px',
            textTransform: 'uppercase' as const,
            fontWeight: 600,
          }}>Welcome</p>
          <div style={{
            fontSize: 'clamp(44px, 11vw, 68px)',
            fontWeight: 900,
            color: foundingNumber ? '#F5A623' : '#E8760A',
            lineHeight: 1.05,
            marginBottom: '10px',
            letterSpacing: '-1px',
          }}>
            {foundingNumber ? `#${foundingNumber}` : `Member #${memberNumber ?? '—'}`}
          </div>
          {foundingNumber && (
            <p style={{ fontSize: '12px', color: 'rgba(245,166,35,0.5)', margin: '0 0 6px' }}>
              of the first 165 founding members
            </p>
          )}
          <p style={{
            fontSize: '12px',
            color: 'rgba(237,237,237,0.3)',
            margin: 0,
            letterSpacing: '0.5px',
          }}>
            claudemalaysia.com/join
          </p>
        </div>

        {/* WhatsApp join button — ABOVE THE FOLD */}
        <div style={animated(300)}>
          <a
            href="https://chat.whatsapp.com/GSONh9iwgvPIYDV16fOALM?s=cl&p=i&ilr=1&amv=1"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              width: '100%',
              padding: '17px',
              backgroundColor: '#25D366',
              color: '#000',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '14px',
              textAlign: 'center',
              boxSizing: 'border-box',
              marginBottom: '8px',
              letterSpacing: '0.2px',
            }}
          >
            Join Claude Malaysia WhatsApp →
          </a>
          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: 'rgba(237,237,237,0.5)',
            margin: '0 0 28px',
          }}>
            👋 Make an intro in the group once you&apos;re in!
          </p>
        </div>

        {/* AI Action Plan */}
        {recommendations.length > 0 && (
          <div style={animated(350)}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '6px',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(237,237,237,0.12)' }} />
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                color: 'rgba(237,237,237,0.5)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                Your AI Action Plan
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(237,237,237,0.12)' }} />
            </div>

            <p style={{
              textAlign: 'center',
              color: 'rgba(237,237,237,0.45)',
              fontSize: '13px',
              margin: '0 0 20px',
            }}>
              Based on your profile — 3 moves to start now
            </p>

            {recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                padding: '18px 20px',
                marginBottom: '10px',
                ...animated(400 + i * 130),
              }}>
                <p style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: '#ededed',
                  margin: '0 0 8px',
                  lineHeight: 1.4,
                }}>
                  {ICONS[i]} #{i + 1} — {rec.title}
                </p>
                <p style={{
                  color: 'rgba(237,237,237,0.65)',
                  fontSize: '13px',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {rec.description}
                </p>
              </div>
            ))}

            <p style={{
              textAlign: 'center',
              color: 'rgba(237,237,237,0.35)',
              fontSize: '12px',
              margin: '14px 0 28px',
              fontStyle: 'italic',
            }}>
              Claude Malaysia can help you implement all 3.
            </p>
          </div>
        )}


        {/* Share button */}
        <div style={{ textAlign: 'center', ...animated(recommendations.length > 0 ? 860 : 450) }}>
          <p style={{
            color: 'rgba(237,237,237,0.4)',
            fontSize: '13px',
            margin: '0 0 10px',
          }}>
            Share your results with a friend
          </p>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              background: 'rgba(37,211,102,0.12)',
              border: '1px solid rgba(37,211,102,0.3)',
              color: '#25D366',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '10px',
            }}
          >
            📱 Share on WhatsApp
          </a>
        </div>

        {/* Leaderboard link */}
        <div style={{ textAlign: 'center', marginTop: '32px', ...animated(recommendations.length > 0 ? 920 : 500) }}>
          <a href="/join/leaderboard" style={{
            color: 'rgba(237,237,237,0.35)',
            fontSize: '13px',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(237,237,237,0.15)',
            paddingBottom: '2px',
          }}>
            🏆 See which community is leading →
          </a>
        </div>

      </div>
    </main>
  )
}
