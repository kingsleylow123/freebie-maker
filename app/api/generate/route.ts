import { NextRequest, NextResponse } from "next/server";
import { generateFreebie } from "@/lib/claude";
import { supabase } from "@/lib/supabase";

function makeUniqueSlug(base: string): string {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const { reelInput, whatsappLink, ctaText, linkUrl, linkLabel, promptsRaw } = await req.json();

    // Split free-form prompts by blank line, trim whitespace, drop empties
    const userPrompts: string[] = promptsRaw
      ? (promptsRaw as string)
          .split(/\n\s*\n/)
          .map((p: string) => p.trim())
          .filter(Boolean)
      : [];

    const DEFAULT_WHATSAPP = "https://whatsapp.com/channel/0029Vb7x3Y7GZNCr8swXnH27";

    if (!reelInput?.trim()) {
      return NextResponse.json(
        { error: "reelInput is required" },
        { status: 400 }
      );
    }

    const generated = await generateFreebie(reelInput.trim(), userPrompts);

    // Ensure slug uniqueness
    const { data: existing } = await supabase
      .from("freebies")
      .select("slug")
      .eq("slug", generated.slug)
      .maybeSingle();

    const slug = existing ? makeUniqueSlug(generated.slug) : generated.slug;

    const { data, error } = await supabase
      .from("freebies")
      .insert({
        slug,
        title: generated.title,
        reel_input: reelInput.trim(),
        sections: generated.sections,
        whatsapp_link: whatsappLink?.trim() || DEFAULT_WHATSAPP,
        cta_text: ctaText?.trim() || "Questions? Join our Claude Whatsapp Group",
        link_url: linkUrl?.trim() || null,
        link_label: linkLabel?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ slug: data.slug, title: data.title });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Generation failed. Check server logs." },
      { status: 500 }
    );
  }
}
