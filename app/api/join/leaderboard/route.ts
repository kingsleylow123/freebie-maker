import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export const revalidate = 60;

const EXCLUDED = new Set(["whatsapp_share", "test"]);

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("community_members")
    .select("referrer")
    .not("referrer", "is", null);

  if (error || !data) {
    return NextResponse.json({ leaderboard: [], total: 0 });
  }

  const counts: Record<string, number> = {};
  let total = 0;

  for (const { referrer } of data) {
    if (!referrer || EXCLUDED.has(referrer)) continue;
    counts[referrer] = (counts[referrer] || 0) + 1;
    total++;
  }

  const leaderboard = Object.entries(counts)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return NextResponse.json({ leaderboard, total });
}
