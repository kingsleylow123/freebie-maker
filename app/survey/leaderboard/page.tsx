'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Entry = { referrer: string; count: number }

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<Entry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/survey/leaderboard')
      const data = await res.json()
      setLeaderboard(data.leaderboard ?? [])
      setTotal(data.total ?? 0)
      setLastUpdated(new Date())
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 60_000)
    return () => clearInterval(id)
  }, [])

  const max = leaderboard[0]?.count || 1

  return (
    <div style={{
      minHeight: '100svh',
      background: '#0a0a0a',
      color: '#ededed',
      padding: '48px 20px 64px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🏆</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Malaysia AI Pulse 2026
          </h1>
          <p style={{ color: 'rgba(237,237,237,0.5)', margin: '0 0 12px', fontSize: 15 }}>
            Which community is leading the charge?
          </p>
          {total > 0 && (
            <span style={{
              display: 'inline-block',
              background: 'rgba(232,118,10,0.15)',
              border: '1px solid rgba(232,118,10,0.3)',
              color: '#E8760A',
              fontWeight: 700,
              fontSize: 14,
              padding: '4px 14px',
              borderRadius: 999,
            }}>
              {total.toLocaleString()} referral responses
            </span>
          )}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(237,237,237,0.3)', padding: 40 }}>
            Loading...
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 40,
            color: 'rgba(237,237,237,0.5)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
            <p style={{ margin: 0 }}>No referrals yet. Be the first to get your community on the board!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {leaderboard.map((entry, i) => {
              const pct = (entry.count / max) * 100
              const isFirst = i === 0
              return (
                <div key={entry.referrer} style={{
                  background: isFirst ? 'rgba(232,118,10,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isFirst ? 'rgba(232,118,10,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14,
                  padding: '16px 20px',
                  transition: 'transform 0.2s',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 22, minWidth: 30 }}>
                        {MEDALS[i] ?? `#${i + 1}`}
                      </span>
                      <span style={{
                        fontWeight: 800,
                        fontSize: 18,
                        letterSpacing: '0.5px',
                        color: isFirst ? '#E8760A' : '#ededed',
                      }}>
                        {entry.referrer.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: isFirst ? '#E8760A' : '#ededed',
                      }}>
                        {entry.count.toLocaleString()}
                      </span>
                      <span style={{ color: 'rgba(237,237,237,0.4)', fontSize: 13, marginLeft: 4 }}>
                        {entry.count === 1 ? 'response' : 'responses'}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 6,
                    height: 6,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: isFirst ? '#E8760A' : 'rgba(232,118,10,0.45)',
                      borderRadius: 6,
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        {lastUpdated && (
          <p style={{
            textAlign: 'center',
            color: 'rgba(237,237,237,0.25)',
            fontSize: 12,
            marginTop: 20,
            marginBottom: 0,
          }}>
            Refreshes every 60s · {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/survey" style={{
            display: 'inline-block',
            background: '#E8760A',
            color: '#fff',
            fontWeight: 700,
            padding: '14px 36px',
            borderRadius: 12,
            textDecoration: 'none',
            fontSize: 16,
          }}>
            Take the Survey 🇲🇾
          </Link>
        </div>

      </div>
    </div>
  )
}
