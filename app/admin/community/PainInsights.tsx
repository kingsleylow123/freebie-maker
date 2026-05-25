'use client'

import { useEffect, useState } from 'react'

type PainTheme = {
  theme: string
  intent: string
  teams: string
  quote: string
  opportunity: string
}

const S = {
  text: '#ededed',
  muted: 'rgba(237,237,237,0.45)',
  accent: '#E8760A',
  border: 'rgba(255,255,255,0.08)',
}

const ICONS = ['🔥', '⚡', '💡', '🎯', '🏗️']

export default function PainInsights() {
  const [themes, setThemes] = useState<PainTheme[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/admin/pain-insights', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (Array.isArray(data)) setThemes(data)
        else setError(true)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ padding: '28px 0', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        color: S.muted, fontSize: 13,
      }}>
        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
        Claude is analysing 500+ pain points weighted by team size…
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (error || !themes) return (
    <p style={{ color: 'rgba(255,107,107,0.7)', fontSize: 13, padding: '8px 0' }}>
      Analysis failed — refresh to retry
    </p>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
      {themes.map((t, i) => (
        <div key={i} style={{
          background: 'rgba(232,118,10,0.04)',
          border: '1px solid rgba(232,118,10,0.18)',
          borderLeft: `3px solid rgba(232,118,10,${0.4 + (5 - i) * 0.12})`,
          borderRadius: '0 12px 12px 0',
          padding: '18px 20px',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', gap: 12, marginBottom: 8,
          }}>
            <p style={{ color: S.text, fontWeight: 800, fontSize: 15, margin: 0, lineHeight: 1.35 }}>
              {ICONS[i]} {t.theme}
            </p>
            <span style={{
              color: S.muted, fontSize: 11, fontWeight: 600, letterSpacing: '1px',
              background: 'rgba(255,255,255,0.05)', borderRadius: 4,
              padding: '3px 8px', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {t.teams}
            </span>
          </div>

          <p style={{ color: 'rgba(237,237,237,0.7)', fontSize: 13, margin: '0 0 10px', lineHeight: 1.65 }}>
            {t.intent}
          </p>

          <blockquote style={{
            color: 'rgba(237,237,237,0.45)', fontSize: 12, fontStyle: 'italic',
            margin: '0 0 10px', padding: '8px 12px',
            background: 'rgba(255,255,255,0.025)', borderRadius: 6,
            borderLeft: '2px solid rgba(255,255,255,0.1)',
          }}>
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          <p style={{ color: S.accent, fontSize: 12, fontWeight: 700, margin: 0 }}>
            💰 {t.opportunity}
          </p>
        </div>
      ))}
    </div>
  )
}
