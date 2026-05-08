'use client'

import { useState, useMemo } from 'react'

type Member = {
  member_number: number
  founding_member_number: number | null
  name: string
  email: string
  phone: string
  role: string | null
  industry: string | null
  team_size: string | null
  client_type: string | null
  created_at: string
}

type SortKey = 'member_number' | 'name' | 'role' | 'industry' | 'team_size' | 'created_at'
type SortDir = 'asc' | 'desc'

const ROLE_LABELS: Record<string, string> = {
  business_owner: 'Business Owner',
  student: 'Student',
  developer: 'Developer',
  freelancer: 'Freelancer',
  marketing_agency: 'Marketing Agency',
  employee: 'Employee',
}

const TEAM_ORDER = ['solo', '1-5', '5-10', '10-30', '30-100', '100+']

const S = {
  bg: '#0a0a0a', card: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)',
  text: '#ededed', muted: 'rgba(237,237,237,0.45)', accent: '#E8760A', amber: '#F5A623',
} as const

export default function MembersTable({ members }: { members: Member[] }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('member_number')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    let rows = [...members]

    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(m =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.industry?.toLowerCase().includes(q) ||
        m.phone?.includes(q)
      )
    }
    if (roleFilter !== 'all') rows = rows.filter(m => m.role === roleFilter)
    if (teamFilter !== 'all') rows = rows.filter(m => m.team_size === teamFilter)

    rows.sort((a, b) => {
      let av: string | number = a[sortKey] ?? ''
      let bv: string | number = b[sortKey] ?? ''
      if (sortKey === 'member_number') { av = a.member_number; bv = b.member_number }
      if (sortKey === 'team_size') { av = TEAM_ORDER.indexOf(a.team_size ?? ''); bv = TEAM_ORDER.indexOf(b.team_size ?? '') }
      if (sortKey === 'created_at') { av = new Date(a.created_at).getTime(); bv = new Date(b.created_at).getTime() }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return rows
  }, [members, search, roleFilter, teamFilter, sortKey, sortDir])

  const uniqueRoles = Array.from(new Set(members.map(m => m.role).filter(Boolean)))

  function ColHeader({ label, k }: { label: string; k: SortKey }) {
    const active = sortKey === k
    return (
      <th
        onClick={() => handleSort(k)}
        style={{
          textAlign: 'left', padding: '10px 12px', color: active ? S.accent : S.muted,
          fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer',
          userSelect: 'none', letterSpacing: '0.5px',
        }}
      >
        {label} {active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
      </th>
    )
  }

  return (
    <div>
      {/* Filters row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍  Search name, email, phone, industry..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: '9px 14px',
            background: 'rgba(255,255,255,0.06)', border: `1px solid ${S.border}`,
            borderRadius: 8, color: S.text, fontSize: 13, outline: 'none',
          }}
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{
            padding: '9px 14px', background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${S.border}`, borderRadius: 8,
            color: S.text, fontSize: 13, cursor: 'pointer',
          }}
        >
          <option value="all">All roles</option>
          {uniqueRoles.map(r => <option key={r} value={r!}>{ROLE_LABELS[r!] ?? r}</option>)}
        </select>
        <select
          value={teamFilter}
          onChange={e => setTeamFilter(e.target.value)}
          style={{
            padding: '9px 14px', background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${S.border}`, borderRadius: 8,
            color: S.text, fontSize: 13, cursor: 'pointer',
          }}
        >
          <option value="all">All team sizes</option>
          {TEAM_ORDER.map(t => <option key={t} value={t}>{t === 'solo' ? 'Solo' : t}</option>)}
        </select>
        <span style={{ color: S.muted, fontSize: 13, padding: '9px 0', whiteSpace: 'nowrap' }}>
          {filtered.length} of {members.length}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${S.border}` }}>
              <ColHeader label="#" k="member_number" />
              <ColHeader label="Name" k="name" />
              <ColHeader label="Role" k="role" />
              <ColHeader label="Industry" k="industry" />
              <ColHeader label="Team" k="team_size" />
              <th style={{ textAlign: 'left', padding: '10px 12px', color: S.muted, fontWeight: 600, fontSize: 12 }}>B2B/B2C</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: S.muted, fontWeight: 600, fontSize: 12 }}>Phone</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: S.muted, fontWeight: 600, fontSize: 12 }}>Email</th>
              <ColHeader label="Joined" k="created_at" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.member_number} style={{
                borderBottom: `1px solid rgba(255,255,255,0.04)`,
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              }}>
                <td style={{ padding: '10px 12px', color: m.founding_member_number ? S.amber : S.muted, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {m.founding_member_number ? `⭐ FM#${m.founding_member_number}` : `#${m.member_number}`}
                </td>
                <td style={{ padding: '10px 12px', color: S.text, fontWeight: 600, whiteSpace: 'nowrap' }}>{m.name}</td>
                <td style={{ padding: '10px 12px', color: S.muted, whiteSpace: 'nowrap' }}>{ROLE_LABELS[m.role ?? ''] ?? m.role ?? '—'}</td>
                <td style={{ padding: '10px 12px', color: S.muted }}>{m.industry || '—'}</td>
                <td style={{ padding: '10px 12px', color: S.muted, whiteSpace: 'nowrap' }}>{m.team_size ?? '—'}</td>
                <td style={{ padding: '10px 12px', color: S.muted, whiteSpace: 'nowrap' }}>{m.client_type ?? '—'}</td>
                <td style={{ padding: '10px 12px', color: S.muted, whiteSpace: 'nowrap' }}>{m.phone}</td>
                <td style={{ padding: '10px 12px', color: S.muted }}>{m.email}</td>
                <td style={{ padding: '10px 12px', color: S.muted, whiteSpace: 'nowrap' }}>
                  {new Date(m.created_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: S.muted }}>No members match your filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
