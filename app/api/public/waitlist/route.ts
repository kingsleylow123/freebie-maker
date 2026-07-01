import { NextRequest, NextResponse } from 'next/server'

// Proxies "Notify me" waitlist signups to the event-ops app (server-to-server).
export const dynamic = 'force-dynamic'

const UPSTREAM = 'https://event-ops-six.vercel.app/api/public/waitlist'

export async function POST(req: NextRequest) {
  const body = await req.text()
  try {
    const r = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    const data = await r.json().catch(() => ({}))
    return NextResponse.json(data, { status: r.status })
  } catch {
    return NextResponse.json({ error: 'Upstream unavailable' }, { status: 502 })
  }
}
