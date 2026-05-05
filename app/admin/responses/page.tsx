import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase-admin'
import { isAdmin, logout } from '../actions'

type SurveyResponse = {
  id: string
  respondent_number: number
  created_at: string
  state: string | null
  respondent_type: string | null
  university: string | null
  industry: string | null
  company_size: string | null
  uses_ai: string | null
  ai_tools: string[] | null
  employer_training: string | null
  hours_saved: string | null
  career_impact: string | null
  completion_time_seconds: number | null
  user_agent: string | null
  referrer: string | null
  status: string | null
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatType(type: string | null): string {
  if (!type) return '—'
  if (type === 'student') return 'Student'
  if (type === 'professional') return 'Professional'
  if (type === 'business_owner') return 'Business'
  return type
}

function getTopItem(items: (string | null)[]): string {
  const counts: Record<string, number> = {}
  for (const item of items) {
    if (item) counts[item] = (counts[item] ?? 0) + 1
  }
  const entries = Object.entries(counts)
  if (entries.length === 0) return '—'
  entries.sort((a, b) => b[1] - a[1])
  return entries[0][0]
}

function getTopAiTool(rows: SurveyResponse[]): string {
  const counts: Record<string, number> = {}
  for (const row of rows) {
    if (Array.isArray(row.ai_tools)) {
      for (const tool of row.ai_tools) {
        if (tool) counts[tool] = (counts[tool] ?? 0) + 1
      }
    }
  }
  const entries = Object.entries(counts)
  if (entries.length === 0) return '—'
  entries.sort((a, b) => b[1] - a[1])
  return entries[0][0]
}

export default async function AdminResponsesPage() {
  const authed = await isAdmin()
  if (!authed) redirect('/admin')

  const supabase = createAdminClient()

  const { data: responses, error } = await supabase
    .from('survey_responses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    return (
      <div
        style={{
          background: '#0a0a0a',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff6b6b',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        Error loading responses: {error.message}
      </div>
    )
  }

  const rows: SurveyResponse[] = responses ?? []

  // Stats calculations
  const totalCount = rows.length
  const studentCount = rows.filter((r) => r.respondent_type === 'student').length
  const professionalCount = rows.filter((r) => r.respondent_type === 'professional').length
  const businessCount = rows.filter((r) => r.respondent_type === 'business_owner').length
  const topState = getTopItem(rows.map((r) => r.state))
  const aiUsersCount = rows.filter((r) => r.uses_ai && r.uses_ai !== 'never').length
  const topAiTool = getTopAiTool(rows)

  // Referrer breakdown
  const referrerCounts: Record<string, number> = {}
  for (const row of rows) {
    if (row.referrer) {
      referrerCounts[row.referrer] = (referrerCounts[row.referrer] ?? 0) + 1
    }
  }
  const referrerEntries = Object.entries(referrerCounts).sort((a, b) => b[1] - a[1])

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

  const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '20px',
    minWidth: '160px',
  }

  const labelStyle = {
    color: 'rgba(237,237,237,0.4)',
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    fontWeight: 500,
    marginBottom: '8px',
  }

  const valueStyle = {
    color: '#ededed',
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: 1,
  }

  const subValueStyle = {
    color: 'rgba(237,237,237,0.6)',
    fontSize: '13px',
    marginTop: '6px',
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

  const btnDangerStyle = {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(255,100,100,0.3)',
    borderRadius: '6px',
    color: 'rgba(255,120,120,0.8)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
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

  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <h1 style={{ color: '#ededed', fontSize: '16px', fontWeight: 600, margin: 0 }}>
          Malaysia AI Pulse{' '}
          <span style={{ color: 'rgba(237,237,237,0.35)', fontWeight: 400 }}>— Admin</span>
        </h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="/admin/export" style={btnSecondaryStyle}>
            Export CSV
          </a>
          <form action={logout}>
            <button type="submit" style={btnDangerStyle}>
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Summary stats */}
      <div style={sectionStyle}>
        <p style={sectionHeadingStyle}>Summary</p>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {/* Total */}
          <div style={cardStyle}>
            <p style={labelStyle}>Total Responses</p>
            <p style={valueStyle}>{totalCount}</p>
          </div>

          {/* By type */}
          <div style={cardStyle}>
            <p style={labelStyle}>By Type</p>
            <p style={valueStyle}>{studentCount}</p>
            <p style={subValueStyle}>
              Student · {professionalCount} Pro · {businessCount} Biz
            </p>
          </div>

          {/* Top state */}
          <div style={cardStyle}>
            <p style={labelStyle}>Top State</p>
            <p style={{ ...valueStyle, fontSize: '20px' }}>{topState}</p>
          </div>

          {/* AI users */}
          <div style={cardStyle}>
            <p style={labelStyle}>AI Users</p>
            <p style={valueStyle}>{aiUsersCount}</p>
            <p style={subValueStyle}>
              {totalCount > 0 ? Math.round((aiUsersCount / totalCount) * 100) : 0}% of total
            </p>
          </div>

          {/* Top AI tool */}
          <div style={cardStyle}>
            <p style={labelStyle}>Top AI Tool</p>
            <p style={{ ...valueStyle, fontSize: '18px', wordBreak: 'break-word' as const }}>
              {topAiTool}
            </p>
          </div>
        </div>
      </div>

      {/* Referrer breakdown */}
      {referrerEntries.length > 0 && (
        <div style={{ ...sectionStyle, marginTop: '36px' }}>
          <p style={sectionHeadingStyle}>Referrer Breakdown</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ ...tableStyle, maxWidth: '480px' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Source</th>
                  <th style={{ ...thStyle, textAlign: 'right' as const }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {referrerEntries.map(([source, count]) => (
                  <tr key={source}>
                    <td style={tdStyle}>{source}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' as const, color: 'rgba(237,237,237,0.6)' }}>
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Responses table */}
      <div style={{ ...sectionStyle, marginTop: '36px' }}>
        <p style={sectionHeadingStyle}>
          Responses{' '}
          <span style={{ color: 'rgba(237,237,237,0.3)', fontWeight: 400 }}>
            ({rows.length})
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
                <th style={thStyle}>#</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>State</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Uses AI</th>
                <th style={thStyle}>Referrer</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={{ ...tdStyle, color: 'rgba(237,237,237,0.4)', fontSize: '12px' }}>
                    {row.respondent_number ?? '—'}
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontSize: '12px', color: 'rgba(237,237,237,0.6)' }}>
                    {row.created_at ? formatDate(row.created_at) : '—'}
                  </td>
                  <td style={tdStyle}>{row.state ?? '—'}</td>
                  <td style={tdStyle}>{formatType(row.respondent_type)}</td>
                  <td style={{ ...tdStyle, color: row.uses_ai && row.uses_ai !== 'never' ? '#6ee7b7' : 'rgba(237,237,237,0.4)' }}>
                    {row.uses_ai ?? '—'}
                  </td>
                  <td style={{ ...tdStyle, color: 'rgba(237,237,237,0.5)', fontSize: '12px' }}>
                    {row.referrer ?? '—'}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{ ...tdStyle, textAlign: 'center', color: 'rgba(237,237,237,0.3)', padding: '40px' }}
                  >
                    No responses yet
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
