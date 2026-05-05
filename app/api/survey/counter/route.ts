import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export const revalidate = 60;

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { count, error } = await supabase
      .from("survey_responses")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ count: 0, goal: 1000 });
    }

    const goal = parseInt(
      process.env.NEXT_PUBLIC_SURVEY_GOAL ?? "1000",
      10
    );

    return NextResponse.json({
      count: count ?? 0,
      goal,
    });
  } catch (err) {
    console.error("Survey counter error:", err);
    return NextResponse.json({ count: 0, goal: 1000 });
  }
}
