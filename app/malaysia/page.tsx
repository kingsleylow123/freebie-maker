'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type LeaderboardEntry = { referrer: string; count: number }

const MEDALS = ['🥇', '🥈', '🥉']

const styles = {
  page: {
    minHeight: '100svh',
    background: '#0a0a0a',
    color: '#ededed',
    padding: '48px 20px 64px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    width: '100%',
    maxWidth: 560,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 32,
  },
  header: {
    textAlign: 'center' as const,
  },
  flag: {
    fontSize: 40,
    marginBottom: 8,
    display: 'block',
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
    margin: '0 0 6px',
    letterSpacing: '-0.5px',
    color: '#ededed',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(237,237,237,0.5)',
    margin: 0,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    margin: 0,
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
    color: 'rgba(237,237,237,0.4)',
    textAlign: 'center' as const,
  },
  surface: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '20px 20px',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  progressCount: {
    fontSize: 22,
    fontWeight: 800,
    color: '#E8760A',
  },
  progressGoal: {
    fontSize: 13,
    color: 'rgba(237,237,237,0.4)',
  },
  progressTrack: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: (pct: number): React.CSSProperties => ({
    width: `${Math.min(pct, 100)}%`,
    height: '100%',
    background: '#E8760A',
    borderRadius: 999,
    transition: 'width 0.8s ease',
  }),
  progressCaption: {
    fontSize: 13,
    color: 'rgba(237,237,237,0.5)',
    margin: 0,
  },
  freebieList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  freebieItem: {
    fontSize: 14,
    color: '#ededed',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  ctaButton: {
    display: 'block',
    width: '100%',
    background: '#E8760A',
    color: '#0a0a0a',
    fontWeight: 800,
    fontSize: 16,
    padding: '16px 24px',
    borderRadius: 12,
    textDecoration: 'none',
    textAlign: 'center' as const,
    letterSpacing: '-0.2px',
    boxSizing: 'border-box' as const,
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  leaderboardEntry: (isFirst: boolean): React.CSSProperties => ({
    background: isFirst ? 'rgba(232,118,10,0.1)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${isFirst ? 'rgba(232,118,10,0.35)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 12,
    padding: '12px 16px',
  }),
  entryRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  entryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  entryMedal: {
    fontSize: 18,
    minWidth: 26,
  },
  entryName: (isFirst: boolean): React.CSSProperties => ({
    fontWeight: 700,
    fontSize: 15,
    color: isFirst ? '#E8760A' : '#ededed',
    letterSpacing: '0.3px',
  }),
  entryCount: (isFirst: boolean): React.CSSProperties => ({
    fontWeight: 700,
    fontSize: 15,
    color: isFirst ? '#E8760A' : '#ededed',
  }),
  barTrack: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    height: 5,
    overflow: 'hidden',
  },
  barFill: (pct: number, isFirst: boolean): React.CSSProperties => ({
    width: `${pct}%`,
    height: '100%',
    background: isFirst ? '#E8760A' : 'rgba(232,118,10,0.45)',
    borderRadius: 6,
    transition: 'width 0.8s ease',
  }),
  emptyState: {
    textAlign: 'center' as const,
    color: 'rgba(237,237,237,0.4)',
    fontSize: 14,
    padding: '20px 0 8px',
  },
  leaderboardLink: {
    textAlign: 'center' as const,
    marginTop: 4,
  },
  leaderboardLinkText: {
    fontSize: 13,
    color: 'rgba(237,237,237,0.4)',
    textDecoration: 'none',
  },
  joinSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  joinHeading: {
    fontSize: 20,
    fontWeight: 800,
    margin: 0,
    letterSpacing: '-0.3px',
    textAlign: 'center' as const,
  },
  joinDescription: {
    fontSize: 14,
    color: 'rgba(237,237,237,0.5)',
    margin: 0,
    textAlign: 'center' as const,
    lineHeight: 1.6,
  },
}

export default function MalaysiaPage() {
  const [count, setCount] = useState(0)
  const [goal, setGoal] = useState(10000)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const fetchCounter = fetch('/api/survey/counter')
      .then((r) => r.json())
      .then((data) => {
        setCount(data.count ?? 0)
        setGoal(data.goal ?? 10000)
      })
      .catch(() => {})

    const fetchLeaderboard = fetch('/api/survey/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        setLeaderboard((data.leaderboard ?? []).slice(0, 5))
      })
      .catch(() => {})

    Promise.all([fetchCounter, fetchLeaderboard])
  }, [])

  const progressPct = goal > 0 ? (count / goal) * 100 : 0
  const maxCount = leaderboard[0]?.count || 1

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.flag}>🇲🇾</span>
          <h1 style={styles.title}>Claude Malaysia</h1>
          <p style={styles.subtitle}>The AI community for Malaysians</p>
        </div>

        <hr style={styles.divider} />

        {/* Survey section */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>Malaysia AI Pulse 2026</p>

          {/* Progress bar */}
          <div style={styles.surface}>
            <div style={styles.progressLabel}>
              <span style={styles.progressCount}>{count.toLocaleString()}</span>
              <span style={styles.progressGoal}>/ {goal.toLocaleString()} goal</span>
            </div>
            <div style={styles.progressTrack}>
              <div style={styles.progressFill(progressPct)} />
            </div>
            <p style={styles.progressCaption}>
              {count.toLocaleString()} Malaysians have shared their AI story.
            </p>
          </div>

          {/* Freebies + CTA */}
          <div>
            <p style={{ fontSize: 14, color: 'rgba(237,237,237,0.7)', margin: '0 0 12px' }}>
              Complete in 2 mins — get free access to:
            </p>
            <ul style={styles.freebieList}>
              <li style={styles.freebieItem}>
                <span>🤖</span>
                <span>How to automate posting across 6 social platforms</span>
              </li>
              <li style={styles.freebieItem}>
                <span>🖼️</span>
                <span>How to turn any link into a beautifully designed IG carousel</span>
              </li>
            </ul>
            <Link href="/survey" style={styles.ctaButton}>
              Start the Survey →
            </Link>
          </div>
        </div>

        <hr style={styles.divider} />

        {/* Leaderboard section */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>Top Communities</p>

          {leaderboard.length === 0 ? (
            <p style={styles.emptyState}>No referrals yet — be the first.</p>
          ) : (
            <div style={styles.leaderboardList}>
              {leaderboard.map((entry, i) => {
                const pct = (entry.count / maxCount) * 100
                const isFirst = i === 0
                return (
                  <div key={entry.referrer} style={styles.leaderboardEntry(isFirst)}>
                    <div style={styles.entryRow}>
                      <div style={styles.entryLeft}>
                        <span style={styles.entryMedal}>
                          {MEDALS[i] ?? `#${i + 1}`}
                        </span>
                        <span style={styles.entryName(isFirst)}>
                          {entry.referrer.toUpperCase()}
                        </span>
                      </div>
                      <span style={styles.entryCount(isFirst)}>
                        {entry.count.toLocaleString()}
                      </span>
                    </div>
                    <div style={styles.barTrack}>
                      <div style={styles.barFill(pct, isFirst)} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div style={styles.leaderboardLink}>
            <Link href="/survey/leaderboard" style={styles.leaderboardLinkText}>
              🏆 See full leaderboard →
            </Link>
          </div>
        </div>

        <hr style={styles.divider} />

        {/* Join section */}
        <div style={styles.joinSection}>
          <h2 style={styles.joinHeading}>Join the Claude Malaysia Community</h2>
          <p style={styles.joinDescription}>
            Connect with developers, business owners, and AI enthusiasts building the future in Malaysia.
          </p>
          <Link href="/join" style={styles.ctaButton}>
            Join Claude Malaysia →
          </Link>
        </div>

      </div>
    </div>
  )
}
