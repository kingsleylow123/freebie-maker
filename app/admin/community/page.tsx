import { redirect } from 'next/navigation'
import { isAdmin } from '@/app/admin/actions'
import { createAdminClient } from '@/lib/supabase-admin'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function countBy(items: (string | null | undefined)[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const item of items) {
    if (item) counts[item] = (counts[item] ?? 0) + 1
  }
  return counts
}

function flattenArrayField(
  rows: { [key: string]: unknown }[],
  field: string,
): string[] {
  const result: string[] = []
  for (const row of rows) {
    const val = row[field]
    if (Array.isArray(val)) {
      for (const item of val) {
        if (typeof item === 'string') result.push(item)
      }
    }
  }
  return result
}

function topN(counts: Record<string, number>, n: number): [string, number][] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
}

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 4,
          fontSize: 13,
          color: '#ededed',
        }}
      >
        <span>{label}</span>
        <span style={{ color: 'rgba(237,237,237,0.5)' }}>{count}</span>
      </div>
      <div
        style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 4,
          height: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: '#E8760A',
            borderRadius: 4,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  )
}

type MemberAnalytics = {
  role: string | null
  team_size: string | null
  ai_use_cases: string[] | null
  community_value: string[] | null
  event_preference: string[] | null
  created_at: string
}

type RecentMember = {
  name: string | null
  email: string | null
  phone: string | null
  role: string | null
  team_size: string | null
  created_at: string
}

export default async function CommunityAdminPage() {
  const ok = await isAdmin()
  if (!ok) redirect('/admin')

  const supabase = createAdminClient()

  const [
    { count: totalMembers },
    { data: allMembersRaw },
    { data: recentMembersRaw },
  ] = await Promise.all([
    supabase.from('community_members').select('*', { count: 'exact', head: true }),
    supabase
      .from('community_members')
      .select('role, team_size, ai_use_cases, community_value, event_preference, created_at'),
    supabase
      .from('community_members')
      .select('name, email, phone, role, team_size, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const allMembers: MemberAnalytics[] = (allMembersRaw ?? []) as MemberAnalytics[]
  const recentMembers: RecentMember[] = (recentMembersRaw ?? []) as RecentMember[]

  // Derived stats
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )

  const thisWeek = allMembers.filter(
    (m) => m.created_at && new Date(m.created_at) > sevenDaysAgo,
  ).length

  const today = allMembers.filter(
    (m) => m.created_at && new Date(m.created_at) >= todayUTC,
  ).length

  const roleBreakdown = countBy(allMembers.map((m) => m.role))
  const teamBreakdown = countBy(allMembers.map((m) => m.team_size))
  const aiUseCaseCounts = countBy(
    flattenArrayField(allMembers as unknown as { [key: string]: unknown }[], 'ai_use_cases'),
  )
  const communityValueCounts = countBy(
    flattenArrayField(allMembers as unknown as { [key: string]: unknown }[], 'community_value'),
  )
  const eventPrefCounts = countBy(
    flattenArrayField(allMembers as unknown as { [key: string]: unknown }[], 'event_preference'),
  )

  const roleLabels: Record<string, string> = {
    student: 'Student',
    business_owner: 'Business Owner',
    developer: 'Developer',
    freelancer: 'Freelancer',
    marketing_agency: 'Marketing Agency',
  }

  const teamLabels: Record<string, string> = {
    solo: 'Solo',
    '1-5': '1–5',
    '5-10': '5–10',
    '10-30': '10–30',
    '30-100': '30–100',
    '100+': '100+',
  }

  const roleRows: [string, number][] = [
    'student',
    'business_owner',
    'developer',
    'freelancer',
    'marketing_agency',
  ].map((key) => [roleLabels[key] ?? key, roleBreakdown[key] ?? 0])

  const teamRows: [string, number][] = ['solo', '1-5', '5-10', '10-30', '30-100', '100+'].map(
    (key) => [teamLabels[key] ?? key, teamBreakdown[key] ?? 0],
  )

  const topAiUseCases = topN(aiUseCaseCounts, 7)
  const topCommunityValues = topN(communityValueCounts, 7)

  const eventOnline = eventPrefCounts['online'] ?? 0
  const eventOffline = eventPrefCounts['offline_kl'] ?? eventPrefCounts['offline'] ?? 0
  const eventMax = Math.max(eventOnline, eventOffline, 1)

  const maxRole = Math.max(...roleRows.map(([, c]) => c), 1)
  const maxTeam = Math.max(...teamRows.map(([, c]) => c), 1)
  const maxAi = topAiUseCases.length > 0 ? topAiUseCases[0][1] : 1
  const maxValue = topCommunityValues.length > 0 ? topCommunityValues[0][1] : 1

  // Styles
  const pageStyle = {
    background: '#0a0a0a',
    color: '#ededed',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    padding: '0 0 60px 0',
  }

  const headerStyle = {
    background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap' as const,
  }

  const sectionStyle = {
    padding: '32px 24px 0 24px',
    maxWidth: '1200px',
    margin: '0 auto',
  }

  const sectionHeadingStyle = {
    color: 'rgba(237,237,237,0.5)',
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    fontWeight: 600,
    marginBottom: '16px',
    marginTop: '0',
  }

  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '24px',
  }

  const btnSecondaryStyle = {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: '#ededed',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  }

  const btnDisabledStyle = {
    ...btnSecondaryStyle,
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const,
  }

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  }

  const thStyle = {
    padding: '10px 12px',
    textAlign: 'left' as const,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(237,237,237,0.5)',
    fontWeight: 500,
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap' as const,
  }

  const tdStyle = {
    padding: '10px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#ededed',
    verticalAlign: 'top' as const,
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="/admin/responses"
            style={{
              color: 'rgba(237,237,237,0.5)',
              fontSize: '13px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Back to Admin
          </a>
          <h1 style={{ color: '#ededed', fontSize: '16px', fontWeight: 600, margin: 0 }}>
            Community Analytics
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={btnDisabledStyle}>Export CSV</span>
        </div>
      </header>

      {/* Summary */}
      <div style={sectionStyle}>
        <p style={{ color: 'rgba(237,237,237,0.5)', fontSize: '14px', margin: '0 0 24px 0' }}>
          <span style={{ color: '#ededed', fontWeight: 600, fontSize: '28px' }}>
            {totalMembers ?? 0}
          </span>{' '}
          total members &middot;{' '}
          <span style={{ color: '#E8760A', fontWeight: 600 }}>{thisWeek}</span> this week &middot;{' '}
          <span style={{ color: '#E8760A', fontWeight: 600 }}>{today}</span> today
        </p>
      </div>

      {/* Member Roles */}
      <div style={{ ...sectionStyle, marginTop: '8px' }}>
        <p style={sectionHeadingStyle}>Member Roles</p>
        <div style={cardStyle}>
          {roleRows.map(([label, count]) => (
            <BarRow key={label} label={label} count={count} max={maxRole} />
          ))}
        </div>
      </div>

      {/* Team Size */}
      <div style={{ ...sectionStyle, marginTop: '32px' }}>
        <p style={sectionHeadingStyle}>Team Size</p>
        <div style={cardStyle}>
          {teamRows.map(([label, count]) => (
            <BarRow key={label} label={label} count={count} max={maxTeam} />
          ))}
        </div>
      </div>

      {/* AI Interests */}
      <div style={{ ...sectionStyle, marginTop: '32px' }}>
        <p style={sectionHeadingStyle}>Top AI Interests (what they want to explore)</p>
        <div style={cardStyle}>
          {topAiUseCases.length === 0 ? (
            <p style={{ color: 'rgba(237,237,237,0.3)', fontSize: 13, margin: 0 }}>No data yet</p>
          ) : (
            topAiUseCases.map(([label, count]) => (
              <BarRow key={label} label={label} count={count} max={maxAi} />
            ))
          )}
        </div>
      </div>

      {/* Community Value */}
      <div style={{ ...sectionStyle, marginTop: '32px' }}>
        <p style={sectionHeadingStyle}>Community Value Providers</p>
        <div style={cardStyle}>
          {topCommunityValues.length === 0 ? (
            <p style={{ color: 'rgba(237,237,237,0.3)', fontSize: 13, margin: 0 }}>No data yet</p>
          ) : (
            topCommunityValues.map(([label, count]) => (
              <BarRow key={label} label={label} count={count} max={maxValue} />
            ))
          )}
        </div>
      </div>

      {/* Event Preferences */}
      <div style={{ ...sectionStyle, marginTop: '32px' }}>
        <p style={sectionHeadingStyle}>Event Preferences</p>
        <div style={cardStyle}>
          <BarRow label="Online" count={eventOnline} max={eventMax} />
          <BarRow label="Offline (KL)" count={eventOffline} max={eventMax} />
        </div>
      </div>

      {/* Recent Members */}
      <div style={{ ...sectionStyle, marginTop: '32px' }}>
        <p style={sectionHeadingStyle}>
          Recent Members{' '}
          <span style={{ color: 'rgba(237,237,237,0.3)', fontWeight: 400 }}>
            (last 20)
          </span>
        </p>
        <div
          style={{
            overflowX: 'auto',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px',
          }}
        >
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Team</th>
                <th style={thStyle}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentMembers.map((member, i) => (
                <tr key={i}>
                  <td style={tdStyle}>
                    <div>{member.name ?? '—'}</div>
                    {member.email && (
                      <div style={{ fontSize: 11, color: 'rgba(237,237,237,0.4)', marginTop: 2 }}>
                        {member.email}
                      </div>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: 'rgba(237,237,237,0.7)' }}>
                    {member.role
                      ? member.role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                      : '—'}
                  </td>
                  <td style={{ ...tdStyle, color: 'rgba(237,237,237,0.7)' }}>
                    {member.team_size ?? '—'}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      color: 'rgba(237,237,237,0.5)',
                      fontSize: 12,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {member.created_at ? formatDate(member.created_at) : '—'}
                  </td>
                </tr>
              ))}
              {recentMembers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      ...tdStyle,
                      textAlign: 'center',
                      color: 'rgba(237,237,237,0.3)',
                      padding: '40px',
                    }}
                  >
                    No members yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
