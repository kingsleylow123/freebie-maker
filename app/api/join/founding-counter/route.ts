import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const revalidate = 0

export async function GET() {
  const supabase = createAdminClient()
  const { count } = await supabase
    .from('community_members')
    .select('*', { count: 'exact', head: true })
    .not('founding_member_number', 'is', null)

  const taken = count ?? 0
  const total = 164 // spots #2–#165
  const remaining = Math.max(0, total - taken)
  return NextResponse.json({ remaining, total, taken })
}
