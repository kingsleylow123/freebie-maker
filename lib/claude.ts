import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface GeneratedFreebie {
  title: string;
  slug: string;
  sections: { heading: string; content: string; prompts?: string[] }[];
}

export async function generateFreebie(
  reelInput: string,
  userPrompts?: string[]
): Promise<GeneratedFreebie> {

  const promptsBlock = userPrompts && userPrompts.length > 0
    ? `\n\nCOPYABLE PROMPTS TO ASSIGN:\nThe user provided these prompts for viewers to copy and use. Assign each one to the most relevant step by including it in a "prompts" array on that section. A step can have multiple prompts. Only assign prompts where they genuinely fit the step's action.\n${userPrompts.map((p, i) => `Prompt ${i + 1}: ${p}`).join("\n\n")}`
    : "";

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are creating a step-by-step guide (free resource) for Kingsley Low's Instagram audience. His niche: AI tools, business systems, and high-ticket sales for coaches, consultants, and agency owners.

Based on the reel script or topic below, generate a FULL step-by-step tutorial. No teasing, no gatekeeping — give them the complete process so they walk away with real value and know exactly what to do next.

REEL INPUT:
${reelInput}${promptsBlock}

Output ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "title": "Short, punchy headline (max 10 words, feels like a paid course module)",
  "slug": "kebab-case-slug-max-5-words",
  "sections": [
    {
      "heading": "Step 1: [Action verb + what they do]",
      "content": "1 sentence max. Name the **exact tool, button, or action**. Bold the most critical word or phrase using **bold**.",
      "prompts": ["optional prompt text the user can copy — only include if a prompt was assigned to this step"]
    }
  ]
}

Rules:
- 4 to 6 steps total
- Each heading MUST start with "Step [N]:" followed by an action verb
- Each step content is ONE sentence only — the single most important action for that step
- Use **bold** around the key term, button name, or critical phrase in each step (exactly one bold per step)
- Only include "prompts" array on a section if prompts were assigned to it — omit the field entirely if no prompts apply
- Each user prompt must be assigned to EXACTLY ONE step — never duplicate the same prompt across multiple steps
- Keep prompt text exactly as provided by the user, no edits
- Tone: direct, no-BS, like a senior practitioner walking them through it fast
- No filler — just the action
- Title should feel like a premium tutorial, not a blog post headline
- Slug: lowercase, hyphens only, 3-5 words`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Claude did not return valid JSON");

  return JSON.parse(jsonMatch[0]) as GeneratedFreebie;
}
