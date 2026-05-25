import { redirect } from 'next/navigation'
import { isAdmin } from '@/app/admin/actions'
import { createAdminClient } from '@/lib/supabase-admin'
import Link from 'next/link'
import MembersTable from './MembersTable'
import PainInsights from './PainInsights'

type StripeCharge = {
  id: string
  amount: number
  currency: string
  paid: boolean
  amount_refunded: number
  failure_code: string | null
  created: number
  billing_details: { name: string | null; email: string | null }
}

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

// Steps added recently — don't show misleading drop % for these
const NEW_STEPS = new Set(['city', 'ai_level', 'source'])

const FUNNEL_STEPS = [
  { key: '2', label: 'Email' },
  { key: 'city', label: 'City 🆕' },
  { key: '3', label: 'WhatsApp' },
  { key: '4', label: 'Role' },
  { key: 'ai_level', label: 'Claude Plan 🆕' },
  { key: '5', label: 'Team Size' },
  { key: '6', label: 'AI Use Cases' },
  { key: '7', label: 'Pain Point' },
  { key: '8', label: 'Community Value' },
  { key: '9', label: 'Notifications' },
  { key: '10', label: 'Social Link' },
  { key: 'source', label: 'Heard From 🆕' },
  { key: 'complete', label: '✅ Submitted' },
]

export default async function CommunityDashboard() {
  const ok = await isAdmin()
  if (!ok) redirect('/admin?from=/admin/community')

  const supabase = createAdminClient()

  // Fetch Stripe charges (MYR only, paid, no refunds)
  async function fetchStripeCharges() {
    try {
      const key = process.env.STRIPE_SECRET_KEY
      if (!key) return []
      const res = await fetch('https://api.stripe.com/v1/charges?limit=100', {
        headers: { Authorization: `Basic ${Buffer.from(key + ':').toString('base64')}` },
        next: { revalidate: 300 },
      })
      const json = await res.json()
      return (json.data ?? []) as StripeCharge[]
    } catch { return [] }
  }

  const [
    { data: members },
    { data: recentMembers },
    { data: funnelEvents },
    stripeRaw,
  ] = await Promise.all([
    supabase.from('community_members').select('role, team_size, ai_use_cases, community_value, event_preference, founding_member_number, created_at, industry, city, ai_level, heard_from, pain_point'),
    supabase.from('community_members').select('member_number, founding_member_number, name, email, phone, role, industry, team_size, client_type, created_at').order('created_at', { ascending: false }),
    supabase.from('join_funnel_events').select('step, event_type, referrer').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    fetchStripeCharges(),
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

  // Industry counts
  const industryCounts: Record<string, number> = {}
  for (const m of all) {
    const ind = (m as any).industry
    if (ind) {
      const key = (ind as string).trim().toLowerCase()
      if (key) industryCounts[key] = (industryCounts[key] ?? 0) + 1
    }
  }
  const industrySorted = Object.entries(industryCounts).sort((a, b) => b[1] - a[1]).slice(0, 12)
  const maxIndustry = industrySorted[0]?.[1] ?? 1

  // Pain points — grouped by team size for weighted analysis
  const TEAM_WEIGHT: Record<string, number> = {
    'solo': 1, '1-5': 3, '5-10': 7, '10-30': 20, '30-100': 65, '100+': 150,
  }
  const rawPainPoints: string[] = []
  const painByTeam: Record<string, string[]> = {
    'solo': [], '1-5': [], '5-10': [], '10-30': [], '30-100': [], '100+': [],
  }
  for (const m of all) {
    const pt = (m as any).pain_point as string | null
    if (!pt?.trim()) continue
    rawPainPoints.push(pt.trim())
    const ts = (m as any).team_size as string | null
    if (ts && painByTeam[ts]) painByTeam[ts].push(pt.trim())
  }


  // Stripe: filter to MYR paid charges only
  const stripeCharges = stripeRaw.filter(
    c => c.currency === 'myr' && c.paid && c.amount_refunded === 0 && !c.failure_code
  )
  const stripeRevenue = stripeCharges.reduce((s, c) => s + c.amount, 0) / 100
  const stripePriceTiers: Record<number, number> = {}
  for (const c of stripeCharges) {
    const p = c.amount / 100
    stripePriceTiers[p] = (stripePriceTiers[p] ?? 0) + 1
  }
  const maxTierCount = Math.max(...Object.values(stripePriceTiers), 1)
  // Unique buyers by email
  const buyerEmailSet = new Set(stripeCharges.map(c => c.billing_details.email?.toLowerCase() ?? '').filter(Boolean))
  const uniqueBuyerCount = buyerEmailSet.size
  // Community member lookup map (email → member)
  const memberEmailMap = new Map(
    (recentMembers ?? []).filter(m => m.email).map(m => [m.email.toLowerCase(), m])
  )
  const membersWhoConverted = [...buyerEmailSet].filter(e => memberEmailMap.has(e)).length
  const conversionRate = total > 0 ? Math.round(membersWhoConverted / total * 100) : 0
  // Build buyer rows (dedup same email, keep highest amount)
  const buyerMap = new Map<string, { name: string; email: string; amount: number; date: string }>()
  for (const c of stripeCharges.sort((a, b) => b.amount - a.amount)) {
    const email = c.billing_details.email?.toLowerCase() ?? ''
    if (!email) continue
    if (!buyerMap.has(email)) {
      buyerMap.set(email, {
        name: c.billing_details.name ?? '—',
        email,
        amount: c.amount / 100,
        date: new Date(c.created * 1000).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' }),
      })
    }
  }
  const buyerRows = [...buyerMap.values()].sort((a, b) => b.amount - a.amount)

  // Funnel — split by referrer
  const fmEvents = (funnelEvents ?? []).filter(e => (e as any).referrer === 'foundingmember')
  const regEvents = (funnelEvents ?? []).filter(e => (e as any).referrer !== 'foundingmember')

  function computeFunnel(events: typeof funnelEvents) {
    const counts: Record<string, number> = {}
    const abandoned: Record<string, number> = {}
    for (const e of events ?? []) {
      if (e.event_type === 'enter' || e.event_type === 'complete') counts[e.step] = (counts[e.step] ?? 0) + 1
      if (e.event_type === 'abandoned') abandoned[e.step] = (abandoned[e.step] ?? 0) + 1
    }
    return { counts, abandoned }
  }

  const { counts: fmCounts, abandoned: fmAbandoned } = computeFunnel(fmEvents)
  const { counts: regCounts, abandoned: regAbandoned } = computeFunnel(regEvents)

  const fmCompletionRate = (fmCounts['2'] ?? 0) > 0 ? Math.round((fmCounts['complete'] ?? 0) / fmCounts['2'] * 100) : 0
  const regCompletionRate = (regCounts['2'] ?? 0) > 0 ? Math.round((regCounts['complete'] ?? 0) / regCounts['2'] * 100) : 0

  const fmFunnelMax = Math.max(...Object.values(fmCounts), 1)
  const regFunnelMax = Math.max(...Object.values(regCounts), 1)

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
          <StatCard label="FM Completion" value={`${fmCompletionRate}%`} sub={`${fmCounts['complete'] ?? 0} FM submitted`} color={S.amber} />
          <StatCard label="Regular Completion" value={`${regCompletionRate}%`} sub={`${regCounts['complete'] ?? 0} regular submitted`} color={regCompletionRate >= 70 ? S.green : S.red} />
        </div>

        {/* Stripe Workshop Revenue */}
        {stripeCharges.length > 0 && (
          <>
            {/* Revenue stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
              <StatCard label="Workshop Revenue" value={`RM ${stripeRevenue.toLocaleString()}`} sub={`${stripeCharges.length} tickets sold`} color={S.green} />
              <StatCard label="Unique Buyers" value={uniqueBuyerCount} sub={`${membersWhoConverted} already in community`} color={S.accent} />
              <StatCard label="Conversion Rate" value={`${conversionRate}%`} sub="members → paying" color={conversionRate >= 10 ? S.green : S.amber} />
              <StatCard label="Not in Community" value={uniqueBuyerCount - membersWhoConverted} sub="paid but not joined yet" color={S.red} />
            </div>

            {/* Two-col: price tiers + buyer list */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16, marginBottom: 16 }}>
              <Section title="💳 Price Tier Breakdown">
                {Object.entries(stripePriceTiers).sort((a,b) => Number(b[0])-Number(a[0])).map(([price, count]) => (
                  <BarRow key={price} label={`RM ${price}`} count={count} max={maxTierCount} color={S.green} />
                ))}
                <p style={{ color: S.muted, fontSize: 12, margin: '14px 0 0' }}>
                  Avg ticket: <strong style={{ color: S.text }}>RM {Math.round(stripeRevenue / uniqueBuyerCount)}</strong> · Highest: <strong style={{ color: S.text }}>RM {Math.max(...Object.keys(stripePriceTiers).map(Number))}</strong>
                </p>
              </Section>

              <Section title="🧑‍💼 Workshop Buyers">
                <div style={{ maxHeight: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {buyerRows.map((b) => {
                    const member = memberEmailMap.get(b.email)
                    return (
                      <div key={b.email} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        background: member ? 'rgba(37,211,102,0.05)' : 'rgba(255,255,255,0.025)',
                        border: `1px solid ${member ? 'rgba(37,211,102,0.15)' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: 8, padding: '8px 12px', gap: 8,
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: S.text, fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</p>
                          <p style={{ color: S.muted, fontSize: 11, margin: 0 }}>{b.date} · {b.email}</p>
                          {member && (
                            <p style={{ color: 'rgba(37,211,102,0.7)', fontSize: 11, margin: '2px 0 0' }}>
                              ✅ #{(member as any).member_number} · {(member as any).role?.replace('_',' ')} · {(member as any).pain_point?.slice(0,45) || '—'}
                            </p>
                          )}
                          {!member && (
                            <p style={{ color: 'rgba(255,107,107,0.6)', fontSize: 11, margin: '2px 0 0' }}>⚠️ Not in community yet</p>
                          )}
                        </div>
                        <span style={{ color: S.green, fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap' }}>RM {b.amount}</span>
                      </div>
                    )
                  })}
                </div>
              </Section>
            </div>
          </>
        )}

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

          {/* Industries */}
          <Section title="🏭 Industries">
            {industrySorted.length === 0
              ? <p style={{ color: S.muted, fontSize: 13 }}>No industry data yet</p>
              : industrySorted.map(([key, count]) => (
                  <BarRow key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} count={count} max={maxIndustry} color="rgba(232,118,10,0.55)" />
                ))
            }
          </Section>

        </div>

        {/* Pain Point Deep Analysis */}
        <Section title={`💭 What Your Community Really Wants (${rawPainPoints.length} responses)`}>
          <p style={{ color: S.muted, fontSize: 13, margin: '0 0 24px' }}>
            Analysed by Claude — weighted toward larger teams (higher business impact). Each theme represents real intent, not just symptoms.
          </p>

          {/* Claude-generated themes — loads async */}
          <PainInsights />

          {/* By team size breakdown */}
          <p style={{ color: S.muted, fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 12px' }}>
            By Team Size — Raw Voices
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10, marginBottom: 24 }}>
            {[
              { key: 'solo', label: 'Solo', weight: '×1', color: 'rgba(232,118,10,0.5)' },
              { key: '1-5', label: '1–5 people', weight: '×3', color: 'rgba(232,118,10,0.65)' },
              { key: '5-10', label: '5–10 people', weight: '×7', color: 'rgba(232,118,10,0.8)' },
              { key: '10-30', label: '10–30 people', weight: '×20', color: S.accent },
              { key: '30-100', label: '30–100 people', weight: '×65', color: S.amber },
              { key: '100+', label: '100+ people', weight: '×150', color: '#F5A623' },
            ].filter(seg => (painByTeam[seg.key] ?? []).length > 0).map(seg => {
              const pts = painByTeam[seg.key] ?? []
              return (
                <div key={seg.key} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderRadius: 12, padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ color: seg.color, fontWeight: 700, fontSize: 13 }}>{seg.label}</span>
                    <span style={{ color: S.muted, fontSize: 11 }}>{pts.length} · weight {seg.weight}</span>
                  </div>
                  {pts.slice(0, 4).map((pt, i) => (
                    <p key={i} style={{
                      color: 'rgba(237,237,237,0.55)', fontSize: 12, margin: '0 0 6px',
                      padding: '6px 10px', background: 'rgba(255,255,255,0.02)',
                      borderRadius: 6, lineHeight: 1.5, fontStyle: 'italic',
                    }}>
                      &ldquo;{pt.length > 80 ? pt.slice(0, 80) + '…' : pt}&rdquo;
                    </p>
                  ))}
                  {pts.length > 4 && (
                    <p style={{ color: S.muted, fontSize: 11, margin: 0 }}>+{pts.length - 4} more</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Full raw list */}
          <p style={{ color: S.muted, fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 10px' }}>
            All {rawPainPoints.length} responses
          </p>
          <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {rawPainPoints.map((pt, i) => (
              <p key={i} style={{
                color: 'rgba(237,237,237,0.55)', fontSize: 13, margin: 0,
                padding: '10px 14px', background: 'rgba(255,255,255,0.025)',
                borderRadius: 8, lineHeight: 1.55,
              }}>
                &ldquo;{pt}&rdquo;
              </p>
            ))}
          </div>
        </Section>

        {/* FM Funnel */}
        <Section title="📉 Founding Member Funnel (last 7 days)">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: S.muted, fontSize: 13 }}>{fmCounts['2'] ?? 0} started → {fmCounts['complete'] ?? 0} completed</span>
            <span style={{ color: fmCompletionRate >= 70 ? S.green : S.red, fontWeight: 700, fontSize: 13 }}>{fmCompletionRate}% completion rate</span>
          </div>
          {FUNNEL_STEPS.map((s, i) => {
            const isNew = NEW_STEPS.has(s.key)
            const count = fmCounts[s.key] ?? 0
            const prev = i > 0 ? (fmCounts[FUNNEL_STEPS[i - 1].key] ?? 0) : count
            const dropPct = !isNew && prev > 0 && i > 0 && count < prev ? Math.round(((prev - count) / prev) * 100) : 0
            const abandoned = fmAbandoned[s.key] ?? 0
            const isComplete = s.key === 'complete'
            return (
              <div key={s.key} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                  <span style={{ color: isComplete ? S.accent : isNew ? 'rgba(237,237,237,0.5)' : S.text }}>{s.label}</span>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {isNew && <span style={{ color: 'rgba(237,237,237,0.3)', fontSize: 11 }}>building data...</span>}
                    {!isNew && abandoned > 0 && <span style={{ color: S.red, fontSize: 11 }}>🚪 {abandoned} left here</span>}
                    {!isNew && dropPct > 0 && <span style={{ color: S.red, fontSize: 11 }}>-{dropPct}%</span>}
                    <span style={{ color: isNew ? 'rgba(237,237,237,0.3)' : S.muted }}>{count}</span>
                  </div>
                </div>
                <Bar pct={isNew ? (count / Math.max(fmFunnelMax, 1)) * 100 : (count / fmFunnelMax) * 100} color={isComplete ? S.accent : isNew ? 'rgba(255,255,255,0.12)' : dropPct > 10 ? 'rgba(255,107,107,0.6)' : 'rgba(232,118,10,0.45)'} />
              </div>
            )
          })}
        </Section>

        {/* Regular Funnel */}
        <Section title="📉 Regular /join Funnel (last 7 days)">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: S.muted, fontSize: 13 }}>{regCounts['2'] ?? 0} started → {regCounts['complete'] ?? 0} completed</span>
            <span style={{ color: regCompletionRate >= 70 ? S.green : S.red, fontWeight: 700, fontSize: 13 }}>{regCompletionRate}% completion rate</span>
          </div>
          {FUNNEL_STEPS.map((s, i) => {
            const isNew = NEW_STEPS.has(s.key)
            const count = regCounts[s.key] ?? 0
            const prev = i > 0 ? (regCounts[FUNNEL_STEPS[i - 1].key] ?? 0) : count
            const dropPct = !isNew && prev > 0 && i > 0 && count < prev ? Math.round(((prev - count) / prev) * 100) : 0
            const abandoned = regAbandoned[s.key] ?? 0
            const isComplete = s.key === 'complete'
            return (
              <div key={s.key} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                  <span style={{ color: isComplete ? S.accent : isNew ? 'rgba(237,237,237,0.5)' : S.text }}>{s.label}</span>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {isNew && <span style={{ color: 'rgba(237,237,237,0.3)', fontSize: 11 }}>building data...</span>}
                    {!isNew && abandoned > 0 && <span style={{ color: S.red, fontSize: 11 }}>🚪 {abandoned} left here</span>}
                    {!isNew && dropPct > 0 && <span style={{ color: S.red, fontSize: 11 }}>-{dropPct}%</span>}
                    <span style={{ color: isNew ? 'rgba(237,237,237,0.3)' : S.muted }}>{count}</span>
                  </div>
                </div>
                <Bar pct={isNew ? (count / Math.max(regFunnelMax, 1)) * 100 : (count / regFunnelMax) * 100} color={isComplete ? S.accent : isNew ? 'rgba(255,255,255,0.12)' : dropPct > 10 ? 'rgba(255,107,107,0.6)' : 'rgba(232,118,10,0.45)'} />
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
          const overallCompletionRate = (fmCounts['2'] ?? 0) + (regCounts['2'] ?? 0) > 0
            ? Math.round(((fmCounts['complete'] ?? 0) + (regCounts['complete'] ?? 0)) / ((fmCounts['2'] ?? 0) + (regCounts['2'] ?? 0)) * 100)
            : 0

          // City data
          const cityCounts: Record<string, number> = {}
          for (const m of all) if ((m as any).city) cityCounts[(m as any).city] = (cityCounts[(m as any).city] ?? 0) + 1
          const klCount = (cityCounts['kl'] ?? 0) + (cityCounts['selangor'] ?? 0)
          const klPct = total > 0 ? Math.round(klCount / total * 100) : 0

          // AI level data
          const aiLevelCounts: Record<string, number> = {}
          for (const m of all) if ((m as any).ai_level) aiLevelCounts[(m as any).ai_level] = (aiLevelCounts[(m as any).ai_level] ?? 0) + 1
          const neverCount = aiLevelCounts['never'] ?? 0
          const freeCount = aiLevelCounts['free'] ?? 0
          const beginnerCount = neverCount + freeCount
          const beginnerPct = total > 0 ? Math.round(beginnerCount / total * 100) : 0

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
              title: `${overallCompletionRate}% form completion — high intent audience`,
              body: `A 12-step form with 75%+ completion means these aren't casual sign-ups. They invested time. They're motivated. Expect high event attendance and paid offer conversion.`,
            },
            {
              icon: '📍',
              title: `${klPct}% are in KL/Selangor — your offline event can fill a room`,
              body: `${klCount} members are within driving distance of a KL venue. An offline workshop at capacity (30–40 pax) can realistically be sold out from this community alone. You already have the audience.`,
            },
            {
              icon: '🆓',
              title: `${beginnerPct}% are beginners (Free plan or never used Claude)`,
              body: `${beginnerCount} members are on the free tier or haven't started yet. A "Claude for Beginners" half-day workshop at RM 97–197 is your lowest-friction paid offer — they have the highest urgency to learn and the lowest bar to convert.`,
            },
            {
              icon: '📉',
              title: `Pain Point step loses 8% — your biggest real drop-off`,
              body: `70 of 76 who reach AI Use Cases continue to Pain Point. The 8% who drop here likely hit "free text" fatigue. Consider pre-filling an example or adding a "Skip" option to recover these leads — they've already answered 7 questions.`,
            },
            {
              icon: '🤝',
              title: `Industry Knowledge (50 picks) is your #1 community asset`,
              body: `Half your community wants to share industry expertise. You have founders across Finance, SaaS, F&B, Logistics, Property, and more. Run a "Meet the Members" panel — free event, maximum networking value, costs you nothing to host.`,
            },
            {
              icon: '🏟️',
              title: `You already have 3 venues + 5 sponsors — zero venue cost for first event`,
              body: `Duncan Tsen, philip (Construction KL), and Branson Chin all offered venues. Ellery Nicol and Duncan flagged themselves as sponsors. Your first offline event can be zero-cost on the venue and partially sponsored. No excuses not to run it.`,
            },
          ]
          return (
            <Section title="💡 Top Insights">
              {insights.map((ins, i) => (
                <div key={i} style={{
                  background: 'rgba(232,118,10,0.05)',
                  border: '1px solid rgba(232,118,10,0.15)',
                  borderRadius: 12, padding: '16px 18px',
                  marginBottom: i < insights.length - 1 ? 10 : 0,
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
