import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import Anthropic from '@anthropic-ai/sdk'

// ─── Lead qualification ────────────────────────────────────────────────────────
function gradeLead(body: {
  deal_size?: string
  team_size?: string
  pays_comms?: string
}): 'hot' | 'warm' | 'cold' {
  const highValue = ['50k_200k', '200k_plus'].includes(body.deal_size ?? '')
  const midValue = body.deal_size === '10k_50k'
  const hasTeam = body.team_size !== 'just_me'
  const paysComms = body.pays_comms === 'yes' || body.pays_comms === 'open'

  if (hasTeam && paysComms && (highValue || midValue)) return 'hot'
  if (highValue || (paysComms && midValue)) return 'warm'
  return 'cold'
}

// ─── Insights generation (hot/warm only) ──────────────────────────────────────
async function generateInsights(body: {
  team_size?: string
  deal_size?: string
  acquisition?: string[]
  pays_comms?: string
}): Promise<Array<{ title: string; insight: string }>> {
  const teamLabel =
    ({ just_me: 'solo', '2_5': '2–5 people', '6_15': '6–15 people', '16_plus': '16+ people' } as Record<string, string>)[body.team_size ?? ''] ?? body.team_size
  const dealLabel =
    ({ below_10k: 'below RM 10K', '10k_50k': 'RM 10K–50K', '50k_200k': 'RM 50K–200K', '200k_plus': 'RM 200K+' } as Record<string, string>)[body.deal_size ?? ''] ?? body.deal_size

  const prompt = `You are a B2B sales consultant. Be direct and specific.

Profile:
- Team size: ${teamLabel}
- Client value per year: ${dealLabel}
- How they get clients: ${(body.acquisition ?? []).join(', ')}
- Pays referral commissions: ${body.pays_comms}

Write 2-3 specific insights about the deals this team is likely losing right now, and how a prioritised outreach dashboard would fix it. Reference their actual numbers and methods.

Return ONLY valid JSON: [{"title":"...","insight":"..."},{"title":"...","insight":"..."},{"title":"...","insight":"..."}]`

  try {
    const client = new Anthropic()
    const result = await Promise.race([
      client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 8000)
      ),
    ])
    const firstBlock = (result as Anthropic.Message).content[0]
    const text = firstBlock.type === 'text' ? firstBlock.text : ''
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) return parsed.slice(0, 3)
  } catch {
    // fall through to default
  }
  return [
    {
      title: 'Your follow-up gaps are costing you',
      insight:
        'Most B2B teams lose 40-60% of deals in the follow-up phase — not because the prospect said no, but because no one followed up at the right time.',
    },
  ]
}

// ─── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.name?.trim() || !body.phone?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const lead_grade = gradeLead(body)

    // Only generate insights for hot/warm
    const insights = lead_grade !== 'cold' ? await generateInsights(body) : []

    const supabase = createAdminClient()
    await supabase.from('b2b_leads').insert({
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email.trim(),
      team_size: body.team_size ?? null,
      deal_size: body.deal_size ?? null,
      acquisition: Array.isArray(body.acquisition) ? body.acquisition : null,
      pays_comms: body.pays_comms ?? null,
      special_requests: body.special_requests ?? null,
      lead_grade,
      referrer: body.referrer ?? null,
      user_agent: body.user_agent ?? null,
    })

    return NextResponse.json({ lead_grade, insights })
  } catch (err) {
    console.error('B2B submission error:', err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
