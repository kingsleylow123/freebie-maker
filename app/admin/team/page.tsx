import { redirect } from 'next/navigation'
import { isAdmin } from '@/app/admin/actions'
import { createAdminClient } from '@/lib/supabase-admin'

const S = {
  bg: '#0a0a0a', card: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)',
  text: '#ededed', muted: 'rgba(237,237,237,0.45)', accent: '#E8760A',
} as const

type TeamMember = {
  name: string; phone: string; email: string; domain: string | null
  telegram_username: string | null; telegram_id: string | null
  instagram_url: string | null; github_username: string | null
  portfolio_url: string | null; company_name: string | null
  bank_holder_name: string | null; bank_name: string | null
  bank_name_other: string | null; bank_account_number: string | null
  created_at: string
}

export default async function AdminTeamPage() {
  const ok = await isAdmin()
  if (!ok) redirect('/admin?from=/admin/team')

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .order('created_at', { ascending: false })

  const members = (data ?? []) as TeamMember[]

  const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', color: S.muted, fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { padding: '10px 12px', color: S.text, fontSize: 13, whiteSpace: 'nowrap' }
  const tdMuted: React.CSSProperties = { ...td, color: S.muted }

  return (
    <div style={{
      background: S.bg, color: S.text, minHeight: '100vh', padding: '32px 20px 80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ color: S.muted, fontSize: 12, margin: '0 0 4px', letterSpacing: '1px', textTransform: 'uppercase' }}>Admin · 🔒 Private</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 24px' }}>Team Roster ({members.length})</h1>

        <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 16, padding: 20, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${S.border}` }}>
                <th style={th}>Name</th>
                <th style={th}>Domain</th>
                <th style={th}>Phone</th>
                <th style={th}>Email</th>
                <th style={th}>Telegram</th>
                <th style={th}>TG ID</th>
                <th style={th}>Bank Holder</th>
                <th style={th}>Bank</th>
                <th style={th}>Account No.</th>
                <th style={th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                  <td style={{ ...td, fontWeight: 600 }}>{m.name}</td>
                  <td style={tdMuted}>{m.domain || '—'}</td>
                  <td style={tdMuted}>{m.phone}</td>
                  <td style={tdMuted}>{m.email}</td>
                  <td style={tdMuted}>{m.telegram_username || '—'}</td>
                  <td style={tdMuted}>{m.telegram_id || '—'}</td>
                  <td style={tdMuted}>{m.bank_holder_name || '—'}</td>
                  <td style={tdMuted}>{m.bank_name === 'Other' ? m.bank_name_other : m.bank_name || '—'}</td>
                  <td style={tdMuted}>{m.bank_account_number || '—'}</td>
                  <td style={tdMuted}>{new Date(m.created_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr><td colSpan={10} style={{ padding: 32, textAlign: 'center', color: S.muted }}>No team members yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
