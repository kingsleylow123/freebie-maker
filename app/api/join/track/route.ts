import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session_id, step, event_type, referrer } = body
    if (!session_id || !step) return NextResponse.json({ ok: false })

    const supabase = createAdminClient()
    await supabase.from('join_funnel_events').insert({
      session_id,
      step,
      event_type: event_type ?? 'enter',
      referrer: referrer ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
