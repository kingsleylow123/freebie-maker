import { NextResponse } from 'next/server'
import { isAdmin } from '@/app/admin/actions'
import { createAdminClient } from '@/lib/supabase-admin'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

const TEAM_WEIGHT: Record<string, number> = {
  'solo': 1, '1-5': 3, '5-10': 7, '10-30': 20, '30-100': 65, '100+': 150,
}

export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Check cache (6h TTL)
  const { data: cached } = await supabase
    .from('admin_cache')
    .select('value, updated_at')
    .eq('key', 'pain_themes')
    .single()

  if (cached && new Date(cached.updated_at) > new Date(Date.now() - 6 * 60 * 60 * 1000)) {
    return NextResponse.json(cached.value, { headers: { 'X-Cache': 'HIT' } })
  }

  // Fetch pain points with team sizes
  const { data: members } = await supabase
    .from('community_members')
    .select('pain_point, team_size')

  const painByTeam: Record<string, string[]> = {
    'solo': [], '1-5': [], '5-10': [], '10-30': [], '30-100': [], '100+': [],
  }
  for (const m of members ?? []) {
    if (!m.pain_point?.trim()) continue
    const ts = m.team_size as string | null
    if (ts && painByTeam[ts]) painByTeam[ts].push(m.pain_point.trim())
  }

  const teamSections = Object.entries(painByTeam)
    .filter(([, pts]) => pts.length > 0)
    .map(([ts, pts]) => {
      const w = TEAM_WEIGHT[ts] ?? 1
      const label =
        ts === 'solo' ? 'Solo operators (1 person)' :
        ts === '1-5' ? 'Small teams (1–5 people)' :
        ts === '5-10' ? 'Growing teams (5–10 people)' :
        ts === '10-30' ? 'Mid-size teams (10–30 people)' :
        ts === '30-100' ? 'Larger teams (30–100 people)' : 'Enterprise (100+ people)'
      return `\n### ${label} — weight ×${w} (${pts.length} responses)\n${pts.slice(0, 25).map(p => `- "${p}"`).join('\n')}`
    }).join('\n')

  const totalCount = Object.values(painByTeam).flat().length

  const prompt = `You are a business analyst for Claude Malaysia — a Malaysian AI community with ${totalCount} members (business owners, developers, freelancers, employees, students).

Analyse these pain points. IMPORTANT: Give significantly more weight to pain points from larger teams — they represent more revenue, more employees, and higher willingness to pay. Solo operators want convenience; larger teams want systems that scale.

${teamSections}

Identify exactly 5 pain themes that matter most (weighted toward larger teams).

For each theme:
- theme: 6–10 words, name the SPECIFIC problem (e.g. "B2B teams lose deals because follow-up is manual" — not generic like "sales problems")
- intent: What do they REALLY want underneath the surface? (2–3 sentences. Speak to the desire, not the symptom.)
- teams: Which team sizes feel this most acutely? (e.g. "Solo & small teams", "Growing teams 5–30", "All sizes")
- quote: Single most representative verbatim quote from the data above
- opportunity: One sentence — what specific product/workshop/service can Claude Malaysia sell to solve this?

Return ONLY valid JSON array, no markdown, no explanation:
[{"theme":"...","intent":"...","teams":"...","quote":"...","opportunity":"..."}]`

  try {
    const client = new Anthropic()
    const result = await Promise.race([
      client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 45000)),
    ]) as Anthropic.Message

    const text = result.content[0]?.type === 'text' ? result.content[0].text : ''
    const themes = JSON.parse(text)

    if (!Array.isArray(themes)) throw new Error('invalid response')

    // Save to cache
    await supabase
      .from('admin_cache')
      .upsert({ key: 'pain_themes', value: themes, updated_at: new Date().toISOString() })

    return NextResponse.json(themes)
  } catch (err) {
    console.error('Pain insights error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
