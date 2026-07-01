import { NextResponse } from 'next/server'

// Proxies the public events feed from the event-ops app (server-to-server, so no
// CORS and no shared secrets). Powers the /events calendar on claudemalaysia.com.
export const dynamic = 'force-dynamic'

const UPSTREAM = 'https://event-ops-six.vercel.app/api/public/events'
const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' } as const

export async function GET() {
  try {
    const r = await fetch(UPSTREAM, { cache: 'no-store' })
    const data = await r.json().catch(() => [])
    return NextResponse.json(Array.isArray(data) ? data : [], { headers: NO_STORE })
  } catch {
    return NextResponse.json([], { headers: NO_STORE })
  }
}
