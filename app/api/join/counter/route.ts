import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export const revalidate = 60;

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { count, error } = await supabase
      .from("community_members")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ count: 0, goal: 1000 });
    }

    return NextResponse.json({
      count: count ?? 0,
      goal: 1000,
    });
  } catch (err) {
    console.error("Join counter error:", err);
    return NextResponse.json({ count: 0, goal: 1000 });
  }
}
