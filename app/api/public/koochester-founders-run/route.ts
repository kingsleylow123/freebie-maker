import { NextResponse } from 'next/server'

// Proxies the Koochester Founder's Run registration POST to the event-ops app
// (server-to-server → no browser CORS, no shared secrets). All the real work —
// DB insert, personalised AI recommendation, organiser emails — happens upstream
// in event-ops. Mirrors app/api/public/events/route.ts.
export const dynamic = 'force-dynamic'

const UPSTREAM = 'https://event-ops-six.vercel.app/api/public/koochester-founders-run'
const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' } as const

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const r = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      cache: 'no-store',
    })
    const data = await r.json().catch(() => ({}))
    return NextResponse.json(data, { status: r.status, headers: NO_STORE })
  } catch {
    return NextResponse.json({ error: 'Registration service is unavailable — please try again.' }, { status: 502, headers: NO_STORE })
  }
}
