import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import Anthropic from "@anthropic-ai/sdk";

function buildGHLTags(body: {
  role?: string;
  team_size?: string;
  ai_use_cases?: string[];
  event_preference?: string[];
}): string[] {
  const tags: string[] = ["claude-malaysia"];

  // Role
  const roleMap: Record<string, string> = {
    student: "cm:student",
    business_owner: "cm:business_owner",
    developer: "cm:developer",
    freelancer: "cm:freelancer",
    marketing_agency: "cm:marketing_agency",
  };
  if (body.role && roleMap[body.role]) tags.push(roleMap[body.role]);

  // Team
  if (body.team_size)
    tags.push(`cm:team:${body.team_size.replace(/[^a-z0-9]/g, "-")}`);

  // AI use cases
  const aiMap: Record<string, string> = {
    "Grow social media following": "cm:ai:social",
    "B2B leads": "cm:ai:b2b",
    "Invoicing & Payments": "cm:ai:invoicing",
    "Streamline team KPI": "cm:ai:kpi",
    "Automate repetitive tasks": "cm:ai:ops",
    "Cost savings": "cm:ai:cost",
    "Cashflow dashboard": "cm:ai:dashboard",
    Others: "cm:ai:other",
  };
  for (const uc of body.ai_use_cases ?? []) {
    if (aiMap[uc]) tags.push(aiMap[uc]);
  }

  // Events
  for (const ev of body.event_preference ?? []) {
    tags.push(ev === "online" ? "cm:events:online" : "cm:events:offline_kl");
  }

  return tags;
}

async function generateRecommendations(body: {
  role?: string;
  team_size?: string;
  pain_point?: string;
  ai_use_cases?: string[];
}): Promise<Array<{ title: string; description: string }>> {
  const roleLabel = body.role?.replace(/_/g, " ") ?? "professional";
  const useCases = (body.ai_use_cases ?? []).join(", ");
  const prompt = `You are an AI strategy advisor for Malaysian entrepreneurs and professionals.

Based on this person's profile:
- Role: ${roleLabel}
- Team size: ${body.team_size ?? "unknown"}
- Pain point: ${body.pain_point ?? "not specified"}
- AI areas they want to explore: ${useCases || "general AI productivity"}

Write exactly 3 short, specific AI recommendations tailored to their situation.
Each recommendation must have:
- title: 5-8 words, punchy and specific (not generic)
- description: 2-3 sentences, practical, references their actual situation

Return ONLY valid JSON array, no markdown, no explanation:
[{"title":"...","description":"..."},{"title":"...","description":"..."},{"title":"...","description":"..."}]`;

  try {
    const client = new Anthropic();
    const result = await Promise.race([
      client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 8000)
      ),
    ]);
    const firstBlock = (result as Anthropic.Message).content[0];
    const text =
      firstBlock.type === "text" ? firstBlock.text : "";
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length === 3) return parsed;
    throw new Error("invalid response");
  } catch {
    return fallbackRecommendations(body.role ?? "");
  }
}

function fallbackRecommendations(
  role: string
): Array<{ title: string; description: string }> {
  const defaults: Record<
    string,
    Array<{ title: string; description: string }>
  > = {
    student: [
      {
        title: "Automate Your Study Notes with AI",
        description:
          "Use Claude to summarise lecture recordings and generate revision flashcards in seconds. Students who use AI note-taking tools save 5+ hours per week on revision prep.",
      },
      {
        title: "Build AI Projects for Your Portfolio",
        description:
          "Employers now expect AI literacy. Build 1-2 small projects using Claude API and put them on GitHub — this alone sets you apart from 90% of fresh graduates.",
      },
      {
        title: "Turn Your Assignments Into Content",
        description:
          "Your research and case studies are content gold. Use AI to repurpose them into LinkedIn posts and build your professional brand before you even graduate.",
      },
    ],
    business_owner: [
      {
        title: "Automate Your Lead Follow-Up Sequences",
        description:
          "Most sales are lost in the follow-up. Use AI to generate personalised follow-up messages for each prospect based on their industry and pain point — without spending hours writing.",
      },
      {
        title: "Build a 24/7 AI Customer Support Agent",
        description:
          "Train a simple AI on your FAQs and product info. It handles common questions instantly so your team focuses on deals, not repetitive queries.",
      },
      {
        title: "Turn Every Meeting Into Actionable Summaries",
        description:
          "Record your sales calls and team meetings, then use AI to extract action items, follow-ups, and key decisions automatically. No more missed commitments.",
      },
    ],
    developer: [
      {
        title: "Ship Features 3x Faster with AI Pair Programming",
        description:
          "Use Claude as a senior code reviewer and pair programmer. It catches bugs, suggests better patterns, and generates boilerplate so you stay in flow state longer.",
      },
      {
        title: "Automate Your Code Review Workflow",
        description:
          "Set up AI-powered PR reviews that check for security issues, performance problems, and style inconsistencies before a human ever looks at the code.",
      },
      {
        title: "Build Internal Tools Your Team Actually Uses",
        description:
          "Most teams waste hours on manual data work. Build lightweight AI-powered internal tools — dashboards, report generators, data cleaners — in days instead of weeks.",
      },
    ],
  };
  return defaults[role] ?? defaults["business_owner"];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }
    if (!body.phone?.trim()) {
      return NextResponse.json({ error: "phone is required" }, { status: 400 });
    }
    if (!body.role) {
      return NextResponse.json({ error: "role is required" }, { status: 400 });
    }

    // Build insert row
    const row = {
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      role: body.role,
      team_size: body.team_size ?? null,
      ai_use_cases: Array.isArray(body.ai_use_cases)
        ? body.ai_use_cases
        : null,
      ai_use_cases_other: body.ai_use_cases_other ?? null,
      pain_point: body.pain_point ?? null,
      community_value: Array.isArray(body.community_value)
        ? body.community_value
        : null,
      event_preference: Array.isArray(body.event_preference)
        ? body.event_preference
        : null,
      social_link: body.social_link ?? null,
      industry: body.industry ?? null,
      client_type: body.client_type ?? null,
      referrer: body.referrer ?? null,
      user_agent: body.user_agent ?? null,
    };

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("community_members")
      .insert(row)
      .select("member_number")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save response" },
        { status: 500 }
      );
    }

    const member_number = data.member_number;

    // Fire-and-forget GHL push
    if (process.env.GHL_API_KEY) {
      const nameParts = body.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";
      const tags = buildGHLTags(body);
      fetch("https://rest.gohighlevel.com/v1/contacts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GHL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: body.email,
          phone: body.phone,
          tags,
        }),
      }).catch(() => {}); // silent fail
    }

    // Generate AI recommendations
    const recommendations = await generateRecommendations(body);

    return NextResponse.json({ member_number, recommendations });
  } catch (err) {
    console.error("Join submission error:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
