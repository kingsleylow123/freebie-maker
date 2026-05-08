import { redirect } from 'next/navigation'
import { isAdmin } from '@/app/admin/actions'
import { createAdminClient } from '@/lib/supabase-admin'
import Link from 'next/link'
import MembersTable from './MembersTable'

const S = {
  bg: '#0a0a0a',
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  text: '#ededed',
  muted: 'rgba(237,237,237,0.45)',
  accent: '#E8760A',
  amber: '#F5A623',
  green: '#25D366',
  red: '#ff6b6b',
} as const

function Bar({ pct, color = S.accent }: { pct: number; color?: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 8, overflow: 'hidden', flex: 1 }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
    </div>
  )
}

function StatCard({ label, value, sub, color = S.accent }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 16, padding: '20px 24px' }}>
      <p style={{ color: S.muted, fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 8px' }}>{label}</p>
      <p style={{ color, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, margin: 0, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ color: S.muted, fontSize: 12, margin: '6px 0 0' }}>{sub}</p>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 16, padding: '24px', marginBottom: 16 }}>
      <h2 style={{ color: S.text, fontSize: 15, fontWeight: 700, margin: '0 0 20px', letterSpacing: '-0.2px' }}>{title}</h2>
      {children}
    </div>
  )
}

function BarRow({ label, count, max, color = S.accent }: { label: string; count: number; max: number; color?: string }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
        <span style={{ color: S.text }}>{label}</span>
        <span style={{ color: S.muted }}>{count}</span>
      </div>
      <Bar pct={pct} color={color} />
    </div>
  )
}

const AI_LABELS: Record<string, string> = {
  ops: 'Automate repetitive tasks',
  social: 'Grow social media following',
  b2b: 'Get targeted B2B leads (legacy)',
  b2b_clients: 'Get more B2B clients',
  b2c_customers: 'Get more B2C customers',
  dashboard: 'Cashflow dashboard',
  invoicing: 'Invoicing & Payments',
  cost: 'Cost savings',
  kpi: 'Streamline team KPI',
  others: 'Others',
}

const VALUE_LABELS: Record<string, string> = {
  connections: 'Connections with top people',
  knowledge: 'Industry knowledge',
  venue: 'Venue',
  sponsors: 'Sponsors',
  volunteer: 'Volunteer time',
  content: 'Content creation',
  facilitator: 'Event facilitator',
}

const FUNNEL_STEPS = [
  { key: '2', label: 'Email' },
  { key: '3', label: 'WhatsApp' },
  { key: '4', label: 'Role' },
  { key: '5', label: 'Team Size' },
  { key: '6', label: 'AI Use Cases' },
  { key: '7', label: 'Pain Point' },
  { key: '8', label: 'Community Value' },
  { key: '9', label: 'Notifications' },
  { key: '10', label: 'Social Link' },
  { key: 'complete', label: '✅ Submitted' },
]

export default async function CommunityDashboard() {
  const ok = await isAdmin()
  if (!ok) redirect('/admin')

  const supabase = createAdminClient()

  const [
    { data: members },
    { data: recentMembers },
    { data: funnelEvents },
  ] = await Promise.all([
    supabase.from('community_members').select('role, team_size, ai_use_cases, community_value, event_preference, founding_member_number, created_at'),
    supabase.from('community_members').select('member_number, founding_member_number, name, email, phone, role, industry, team_size, client_type, created_at').order('created_at', { ascending: false }),
    supabase.from('join_funnel_events').select('step, event_type').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  const all = members ?? []
  const total = all.length
  const founding = all.filter(m => m.founding_member_number).length
  const today = all.filter(m => new Date(m.created_at) > new Date(Date.now() - 86400000)).length
  const thisWeek = all.filter(m => new Date(m.created_at) > new Date(Date.now() - 7 * 86400000)).length

  // Roles
  const roles: Record<string, number> = {}
  for (const m of all) if (m.role) roles[m.role] = (roles[m.role] ?? 0) + 1
  const maxRole = Math.max(...Object.values(roles), 1)
  const roleLabels: Record<string, string> = {
    business_owner: 'Business Owner', student: 'Student', developer: 'Developer',
    freelancer: 'Freelancer', marketing_agency: 'Marketing Agency',
  }

  // Team sizes
  const teams: Record<string, number> = {}
  for (const m of all) if (m.team_size) teams[m.team_size] = (teams[m.team_size] ?? 0) + 1
  const teamOrder = ['solo', '1-5', '5-10', '10-30', '30-100', '100+']
  const maxTeam = Math.max(...Object.values(teams), 1)

  // AI use cases
  const aiCounts: Record<string, number> = {}
  for (const m of all) for (const uc of m.ai_use_cases ?? []) aiCounts[uc] = (aiCounts[uc] ?? 0) + 1
  const aiSorted = Object.entries(aiCounts).sort((a, b) => b[1] - a[1])
  const maxAI = aiSorted[0]?.[1] ?? 1

  // Community value
  const valCounts: Record<string, number> = {}
  for (const m of all) for (const v of m.community_value ?? []) valCounts[v] = (valCounts[v] ?? 0) + 1
  const valSorted = Object.entries(valCounts).sort((a, b) => b[1] - a[1])
  const maxVal = valSorted[0]?.[1] ?? 1

  // Event prefs
  const onlineCount = all.filter(m => m.event_preference?.includes('online')).length
  const offlineCount = all.filter(m => m.event_preference?.includes('offline_kl')).length

  // Funnel
  const funnelCounts: Record<string, number> = {}
  for (const e of funnelEvents ?? []) {
    if (e.event_type === 'enter' || e.event_type === 'complete') {
      funnelCounts[e.step] = (funnelCounts[e.step] ?? 0) + 1
    }
  }
  const abandonedCounts: Record<string, number> = {}
  for (const e of funnelEvents ?? []) {
    if (e.event_type === 'abandoned') abandonedCounts[e.step] = (abandonedCounts[e.step] ?? 0) + 1
  }
  const funnelMax = Math.max(...Object.values(funnelCounts), 1)
  const completionRate = funnelCounts['2'] > 0 ? Math.round((funnelCounts['complete'] ?? 0) / funnelCounts['2'] * 100) : 0

  const PAGE: React.CSSProperties = {
    background: S.bg, color: S.text, minHeight: '100vh', padding: '32px 20px 80px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }
  const CONTAINER: React.CSSProperties = { maxWidth: 860, margin: '0 auto' }
  const GRID2: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }

  return (
    <div style={PAGE}>
      <div style={CONTAINER}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <p style={{ color: S.muted, fontSize: 12, margin: '0 0 4px', letterSpacing: '1px', textTransform: 'uppercase' }}>Admin</p>
            <h1 style={{ color: S.text, fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Claude Malaysia Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/admin/responses" style={{ color: S.muted, fontSize: 13, textDecoration: 'none', padding: '8px 14px', border: `1px solid ${S.border}`, borderRadius: 8 }}>Survey data →</Link>
            <Link href="/admin/export" style={{ color: S.accent, fontSize: 13, textDecoration: 'none', padding: '8px 14px', border: `1px solid rgba(232,118,10,0.3)`, borderRadius: 8 }}>Export CSV</Link>
          </div>
        </div>

        {/* Hero stats */}
        <div style={GRID2}>
          <StatCard label="Total Members" value={total} sub={`${thisWeek} this week`} />
          <StatCard label="Founding Members" value={founding} sub={`${164 - founding} spots left`} color={S.amber} />
          <StatCard label="Today" value={today} sub="new signups" color={S.green} />
          <StatCard label="Completion Rate" value={`${completionRate}%`} sub="start → submit" color={completionRate >= 70 ? S.green : S.red} />
        </div>

        {/* Founding progress */}
        <div style={{ background: `rgba(245,166,35,0.06)`, border: `1px solid rgba(245,166,35,0.2)`, borderRadius: 16, padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: S.amber, fontWeight: 700, fontSize: 14 }}>⭐ Founding Member Spots — #2 to #165</span>
            <span style={{ color: S.muted, fontSize: 13 }}>{founding} / 164 claimed</span>
          </div>
          <Bar pct={(founding / 164) * 100} color={S.amber} />
          <p style={{ color: S.muted, fontSize: 12, margin: '8px 0 0' }}>{164 - founding} spots remaining · share claudemalaysia.com/foundingmember</p>
        </div>

        {/* Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16, marginBottom: 16 }}>

          {/* Roles */}
          <Section title="👤 Member Roles">
            {Object.entries(roleLabels).map(([key, label]) => (
              <BarRow key={key} label={label} count={roles[key] ?? 0} max={maxRole} />
            ))}
          </Section>

          {/* Team sizes */}
          <Section title="👥 Team Sizes">
            {teamOrder.map(key => (
              <BarRow key={key} label={key === 'solo' ? 'Solo (just me)' : key} count={teams[key] ?? 0} max={maxTeam} color="rgba(232,118,10,0.6)" />
            ))}
          </Section>

          {/* AI use cases */}
          <Section title="🤖 What They Want AI to Help With (Top picks)">
            {aiSorted.map(([key, count]) => (
              <BarRow key={key} label={AI_LABELS[key] ?? key} count={count} max={maxAI} />
            ))}
          </Section>

          {/* Community value */}
          <Section title="🤝 What They Bring to the Community">
            {valSorted.map(([key, count]) => (
              <BarRow key={key} label={VALUE_LABELS[key] ?? key} count={count} max={maxVal} color="rgba(37,211,102,0.7)" />
            ))}
          </Section>

        </div>

        {/* Drop-off funnel */}
        <Section title="📉 Drop-off Funnel (last 7 days)">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: S.muted, fontSize: 13 }}>{funnelCounts['2'] ?? 0} started → {funnelCounts['complete'] ?? 0} completed</span>
            <span style={{ color: completionRate >= 70 ? S.green : S.red, fontWeight: 700, fontSize: 13 }}>{completionRate}% completion rate</span>
          </div>
          {FUNNEL_STEPS.map((s, i) => {
            const count = funnelCounts[s.key] ?? 0
            const prev = i > 0 ? (funnelCounts[FUNNEL_STEPS[i - 1].key] ?? 0) : count
            const dropPct = prev > 0 && i > 0 && count < prev ? Math.round(((prev - count) / prev) * 100) : 0
            const abandoned = abandonedCounts[s.key] ?? 0
            const isComplete = s.key === 'complete'
            return (
              <div key={s.key} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                  <span style={{ color: isComplete ? S.accent : S.text }}>{s.label}</span>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {abandoned > 0 && <span style={{ color: S.red, fontSize: 11 }}>🚪 {abandoned} left here</span>}
                    {dropPct > 0 && <span style={{ color: S.red, fontSize: 11 }}>-{dropPct}%</span>}
                    <span style={{ color: S.muted }}>{count}</span>
                  </div>
                </div>
                <Bar pct={(count / funnelMax) * 100} color={isComplete ? S.accent : dropPct > 10 ? 'rgba(255,107,107,0.6)' : 'rgba(232,118,10,0.45)'} />
              </div>
            )
          })}
        </Section>

        {/* Event prefs */}
        <Section title="📅 Event Preferences">
          <BarRow label="Online (Zoom)" count={onlineCount} max={Math.max(onlineCount, offlineCount, 1)} color="rgba(232,118,10,0.6)" />
          <BarRow label="Offline (KL)" count={offlineCount} max={Math.max(onlineCount, offlineCount, 1)} color="rgba(37,211,102,0.6)" />
        </Section>

        {/* All members — sortable + filterable */}
        <Section title={`🧑‍💻 All Members (${recentMembers?.length ?? 0})`}>
          <MembersTable members={(recentMembers ?? []) as Parameters<typeof MembersTable>[0]['members']} />
        </Section>

        {/* Top 5 Insights */}
        {(() => {
          const topRole = Object.entries(roles).sort((a,b) => b[1]-a[1])[0]
          const topAI = aiSorted[0]
          const smallTeamPct = Math.round(((teams['solo']??0) + (teams['1-5']??0)) / Math.max(total,1) * 100)
          const agencyCount = (roles['marketing_agency']??0) + (roles['freelancer']??0)
          const insights: {icon:string; title:string; body:string}[] = [
            {
              icon: '🏆',
              title: `${topRole?.[0].replace('_',' ')} is your biggest segment (${topRole?.[1]} of ${total})`,
              body: `At ${Math.round((topRole?.[1]??0)/Math.max(total,1)*100)}% of members, this is your core audience. Every workshop, event, and offer should speak to them first.`,
            },
            {
              icon: '🤖',
              title: `"${AI_LABELS[topAI?.[0] ?? ''] || topAI?.[0]}" is the #1 AI need (${topAI?.[1]} picks)`,
              body: `More than social media or lead gen — your community wants operational efficiency. A workshop on "AI for Business Operations" would fill fast.`,
            },
            {
              icon: '👤',
              title: `${smallTeamPct}% are solo or small teams (≤5 people)`,
              body: `These members can't afford to hire — they need AI to do the work of 3 people. High willingness to pay for done-for-you setups and templates.`,
            },
            {
              icon: '📣',
              title: `${agencyCount} marketers & agencies — a high-value niche`,
              body: `Marketing agencies + freelancers make up ${Math.round(agencyCount/Math.max(total,1)*100)}% of members. They bill clients monthly, meaning any AI tool that saves them time = direct profit. Strong upsell segment.`,
            },
            {
              icon: '📈',
              title: `${completionRate}% form completion — high intent audience`,
              body: `A 12-step form with 75%+ completion means these aren't casual sign-ups. They invested time. They're motivated. Expect high event attendance and paid offer conversion.`,
            },
          ]
          return (
            <Section title="💡 Top 5 Insights">
              {insights.map((ins, i) => (
                <div key={i} style={{
                  background: 'rgba(232,118,10,0.05)',
                  border: '1px solid rgba(232,118,10,0.15)',
                  borderRadius: 12, padding: '16px 18px',
                  marginBottom: i < 4 ? 10 : 0,
                }}>
                  <p style={{ color: S.text, fontWeight: 700, fontSize: 14, margin: '0 0 6px' }}>
                    {ins.icon} {ins.title}
                  </p>
                  <p style={{ color: S.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>{ins.body}</p>
                </div>
              ))}
            </Section>
          )
        })()}

        {/* Monetisation Recommendations */}
        <Section title="💰 Monetisation Recommendations">
          {[
            {
              tag: 'HIGHEST PRIORITY',
              tagColor: S.accent,
              title: 'AI for Business Operations — Paid Workshop (RM 197–397)',
              body: '"Automate repetitive tasks" is the #1 AI interest with 21 picks. Run a 2-hour paid Zoom workshop showing exactly how to automate ops, reporting, and client work with AI. Sell to your 75%+ solo/small team segment first.',
            },
            {
              tag: 'QUICK WIN',
              tagColor: S.green,
              title: 'Agency AI Accelerator — Group Programme (RM 997–1,997)',
              body: `You have ${(roles['marketing_agency']??0) + (roles['freelancer']??0)} marketers/agencies/freelancers. These people charge clients monthly — an AI workflow that saves them 10 hours a week is easily worth RM 1K+. Run a 4-week cohort.`,
            },
            {
              tag: 'RECURRING REVENUE',
              tagColor: S.amber,
              title: 'Claude Malaysia Pro — Monthly Membership (RM 47–97/mo)',
              body: 'Monthly workshops (online + offline), AI tool reviews, templates, and a private members chat. With 165 founding members as a base, RM 67/mo = RM 11K MRR if 50% convert. Start with a founding member rate.',
            },
            {
              tag: 'HIGH TICKET',
              tagColor: '#a78bfa',
              title: 'Done-For-You AI Setup — 1:1 or Small Group (RM 2,000–5,000)',
              body: `${teams['solo']??0} solo operators can't afford staff but desperately need AI systems. Offer a "set it up for you" service: 1 day, audit their workflow, build their AI stack. Each client = 1 day's work.`,
            },
            {
              tag: 'LONG TERM',
              tagColor: S.muted,
              title: 'B2B Lead Gen with AI — Masterclass (RM 297–497)',
              body: '16 members flagged B2B leads as their top AI interest. Bundle a lead scraping + AI outreach masterclass. Partner with a B2B tool (Clay, Apollo, etc.) for affiliate revenue on top.',
            },
          ].map((rec, i) => (
            <div key={i} style={{
              background: S.card,
              border: `1px solid ${S.border}`,
              borderRadius: 12, padding: '18px 20px',
              marginBottom: i < 4 ? 10 : 0,
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '1.5px',
                  color: rec.tagColor, border: `1px solid ${rec.tagColor}`,
                  borderRadius: 4, padding: '2px 8px',
                  background: `${rec.tagColor}18`,
                }}>
                  {rec.tag}
                </span>
              </div>
              <p style={{ color: S.text, fontWeight: 700, fontSize: 14, margin: '0 0 6px' }}>{rec.title}</p>
              <p style={{ color: S.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>{rec.body}</p>
            </div>
          ))}
        </Section>

      </div>
    </div>
  )
}
