import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate minimum required fields
    if (!body.state?.trim()) {
      return NextResponse.json({ error: "state is required" }, { status: 400 });
    }
    if (!body.respondent_type) {
      return NextResponse.json({ error: "respondent_type is required" }, { status: 400 });
    }

    // Build the insert row — only include fields that are present
    const row = {
      state: body.state.trim(),
      respondent_type: body.respondent_type,
      university: body.university ?? null,
      industry: body.industry ?? null,
      company_size: body.company_size ?? null,
      uses_ai: body.uses_ai ?? null,
      ai_tools: Array.isArray(body.ai_tools) ? body.ai_tools : null,
      employer_training: body.employer_training ?? null,
      hours_saved: body.hours_saved ?? null,
      career_impact: body.career_impact ?? null,
      completion_time_seconds: typeof body.completion_time_seconds === 'number'
        ? body.completion_time_seconds : 0,
      user_agent: body.user_agent ?? null,
      referrer: body.referrer ?? null,
      status: 'completed',
    };

    const { data, error } = await supabase
      .from("survey_responses")
      .insert(row)
      .select("respondent_number")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
    }

    const respondent_number = data.respondent_number;

    // Fire Google Sheets webhook non-blocking (Apps Script Web App URL)
    if (process.env.SHEETS_WEBHOOK_URL) {
      fetch(process.env.SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...row, respondent_number }),
      }).catch(() => {}); // silent fail
    }

    return NextResponse.json({ respondent_number });
  } catch (err) {
    console.error("Survey submission error:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
