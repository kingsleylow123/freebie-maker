"use client";

import { useState, useEffect, useCallback } from "react";

interface PastFreebie {
  id: string;
  slug: string;
  title: string;
  whatsapp_link: string;
  cta_text: string;
  created_at: string;
}

export default function GeneratePage() {
  const [reelInput, setReelInput] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [promptsRaw, setPromptsRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ slug: string; title: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [past, setPast] = useState<PastFreebie[]>([]);
  const [copiedSlug, setCopiedSlug] = useState("");

  const fetchPast = useCallback(async () => {
    const res = await fetch("/api/freebies");
    const json = await res.json();
    if (json.freebies) setPast(json.freebies);
  }, []);

  useEffect(() => {
    fetchPast();
  }, [fetchPast]);

  async function handleGenerate() {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelInput, whatsappLink, ctaText, linkUrl, linkLabel, promptsRaw }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed");
      setResult(json);
      fetchPast();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/f/`
      : "/f/";

  async function copyToClipboard(text: string, key?: string) {
    await navigator.clipboard.writeText(text);
    if (key) {
      setCopiedSlug(key);
      setTimeout(() => setCopiedSlug(""), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const canGenerate = reelInput.trim() && !loading;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/10 px-6 py-4">
        <p className="text-center text-xs font-semibold tracking-widest text-white/30 uppercase">
          Kingsley Low · Freebie Maker
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-10 space-y-8">

        {/* Generator Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-7 space-y-5">
          <div>
            <h1 className="text-xl font-bold text-white">Generate a Freebie</h1>
            <p className="mt-1 text-sm text-white/40">
              Paste your reel → get a shareable step-by-step guide in ~5 seconds.
            </p>
          </div>

          {/* Reel Input */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/40">
              Reel Script or Topic <span className="text-amber-400">*</span>
            </label>
            <textarea
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-white/20 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30 resize-none"
              rows={6}
              placeholder="Paste your reel script here, or describe the topic…"
              value={reelInput}
              onChange={(e) => setReelInput(e.target.value)}
            />
          </div>

          {/* WhatsApp Link */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/40">
              WhatsApp Link{" "}
              <span className="normal-case font-normal text-white/25">
                (optional — defaults to your Claude group)
              </span>
            </label>
            <input
              type="url"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-white/20 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
              placeholder="https://chat.whatsapp.com/EcQP4EzOFSwLWfv8uFirsm?mode=gi_t"
              value={whatsappLink}
              onChange={(e) => setWhatsappLink(e.target.value)}
            />
          </div>

          {/* CTA Button Text */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/40">
              CTA Button Text{" "}
              <span className="normal-case font-normal text-white/25">
                (optional — defaults to &ldquo;Questions? Join our Claude Whatsapp Group&rdquo;)
              </span>
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-white/20 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
              placeholder="e.g. Questions? Join our Claude Whatsapp Group"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
            />
          </div>

          {/* Copyable Prompts */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "16px",
            }}
          >
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-white/40">
              Copyable Prompts{" "}
              <span className="normal-case font-normal text-white/25">
                (optional — paste prompts separated by a blank line, AI assigns them to the right steps)
              </span>
            </label>
            <textarea
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-white/20 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30 resize-none"
              rows={5}
              placeholder={`Prompt 1:\nmake me an MCP server for manychat, this is my API key: xxxxxxxxx\n\nPrompt 2:\nok now help me set this up for my IG`}
              value={promptsRaw}
              onChange={(e) => setPromptsRaw(e.target.value)}
            />
          </div>

          {/* Optional Link */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "16px",
            }}
          >
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-white/40">
              Optional Link{" "}
              <span className="normal-case font-normal text-white/25">
                (shows as a resource button in the guide)
              </span>
            </label>
            <div className="flex gap-2 mt-2">
              <input
                type="url"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-white/20 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                placeholder="https://claude.ai/cowork"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <input
                type="text"
                className="w-36 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-white/20 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                placeholder="Label"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full rounded-xl bg-amber-400 px-8 py-4 text-base font-bold text-black transition hover:bg-amber-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Generating…" : "Generate Freebie →"}
          </button>

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {result && (
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Freebie Created ✓
              </p>
              <p className="font-semibold text-white">{result.title}</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-xs text-white/70 truncate">
                  {baseUrl}{result.slug}
                </code>
                <button
                  onClick={() => copyToClipboard(`${baseUrl}${result.slug}`)}
                  className="shrink-0 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-black hover:bg-amber-300 transition"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <a
                href={`/f/${result.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs text-amber-400/70 hover:text-amber-400 underline underline-offset-2"
              >
                Preview freebie →
              </a>
            </div>
          )}
        </div>

        {/* Past Freebies */}
        {past.length > 0 && (
          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-white/30">
              Past Freebies ({past.length})
            </h2>
            <div className="space-y-2">
              {past.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {f.title}
                    </p>
                    <p className="text-xs text-white/25 mt-0.5">
                      {new Date(f.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(`${baseUrl}${f.slug}`, f.slug)
                    }
                    className="shrink-0 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition"
                  >
                    {copiedSlug === f.slug ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
