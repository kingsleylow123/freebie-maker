import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!body.phone?.trim()) {
      return NextResponse.json({ error: "phone is required" }, { status: 400 });
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const row = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email.trim(),
      domain: body.domain?.trim() || null,
      telegram_username: body.telegram_username?.trim() || null,
      telegram_id: body.telegram_id?.trim() || null,
      instagram_url: body.instagram_url?.trim() || null,
      github_username: body.github_username?.trim() || null,
      portfolio_url: body.portfolio_url?.trim() || null,
      company_name: body.company_name?.trim() || null,
      bank_holder_name: body.bank_holder_name?.trim() || null,
      bank_name: body.bank_name?.trim() || null,
      bank_name_other: body.bank_name_other?.trim() || null,
      bank_account_number: body.bank_account_number?.trim() || null,
      user_agent: body.user_agent ?? null,
    };

    const supabase = createAdminClient();
    const { error } = await supabase.from("team_members").insert(row);

    if (error) {
      console.error("Team insert error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Team submission error:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
