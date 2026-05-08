'use client'

import { useState, useEffect } from 'react'

export default function FoundingMemberPage() {
  const [counter, setCounter] = useState({ remaining: 164, total: 164, taken: 0 })

  useEffect(() => {
    fetch('/api/join/founding-counter')
      .then(r => r.json())
      .then(d => setCounter(d))
      .catch(() => {})
  }, [])

  const { remaining, total, taken } = counter
  const isFull = remaining === 0
  const spotsGonePct = total > 0 ? (taken / total) * 100 : 0

  const AMBER = '#F5A623'
  const ORANGE = '#E8760A'

  return (
    <main style={{
      minHeight: '100svh',
      background: '#0a0a0a',
      color: '#ededed',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '320px',
        background: `radial-gradient(ellipse 70% 40% at 50% 0%, rgba(245,166,35,0.10) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>

        {/* Flag */}
        <div style={{ textAlign: 'center', fontSize: '56px', marginBottom: '16px' }}>🇲🇾</div>

        {/* Founding badge */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 16px',
            borderRadius: '999px',
            background: 'rgba(245,166,35,0.12)',
            border: `1px solid rgba(245,166,35,0.4)`,
            color: AMBER,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
          }}>
            Founding Member Access
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          textAlign: 'center',
          fontSize: 'clamp(26px, 6vw, 36px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#ededed',
          margin: '0 0 10px',
          lineHeight: 1.15,
        }}>
          You&apos;re one of the first.
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '16px',
          color: 'rgba(237,237,237,0.6)',
          margin: '0 0 24px',
          lineHeight: 1.5,
        }}>
          Join Claude Malaysia as a Founding Member.<br />
          Spots #2–#165 — limited to the first 165.
        </p>

        {/* Spots counter */}
        <div style={{
          background: 'rgba(245,166,35,0.06)',
          border: `1px solid rgba(245,166,35,0.2)`,
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: 'rgba(237,237,237,0.75)' }}>
              {isFull
                ? 'All founding spots have been claimed'
                : `${remaining} of ${total} founding spots remaining`}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: AMBER }}>
              #2–#165
            </span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
            <div style={{
              width: `${spotsGonePct}%`,
              height: '100%',
              background: isFull ? '#ff6b6b' : AMBER,
              borderRadius: '6px',
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>

        {/* Benefits */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          {[
            'Monthly workshops — online (Zoom) + offline in KL',
            'Network with developers, founders & marketers',
            'Get your free personalised AI action plan',
            'Founding Member badge — locked to first 165 only',
            'First access to AI tools, events & opportunities in Malaysia',
          ].map((b, i) => (
            <div key={i} style={{
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              marginBottom: i < 4 ? '12px' : 0,
            }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>✅</span>
              <span style={{ fontSize: '15px', color: 'rgba(237,237,237,0.85)', lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={isFull ? '/join' : '/join?ref=foundingmember'}
          style={{
            display: 'block',
            width: '100%',
            padding: '18px',
            background: isFull ? 'rgba(255,255,255,0.06)' : ORANGE,
            color: isFull ? 'rgba(237,237,237,0.4)' : '#fff',
            textDecoration: 'none',
            fontSize: '17px',
            fontWeight: 800,
            borderRadius: '14px',
            textAlign: 'center',
            boxSizing: 'border-box',
            boxShadow: isFull ? 'none' : '0 0 40px rgba(232,118,10,0.25), 0 2px 8px rgba(0,0,0,0.4)',
            letterSpacing: '-0.01em',
          }}
        >
          {isFull ? 'All Founding Spots Taken — Join as Member →' : 'Claim Your Founding Member Spot →'}
        </a>

        <p style={{
          textAlign: 'center', fontSize: '13px',
          color: 'rgba(237,237,237,0.3)', marginTop: '12px',
        }}>
          {isFull ? 'Still 100% free as a regular member' : 'Spots are filling fast · 100% free'}
        </p>

      </div>
    </main>
  )
}
