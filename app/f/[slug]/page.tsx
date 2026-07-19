import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { supabase, Freebie } from "@/lib/supabase";
import { CopyPrompt } from "./CopyPrompt";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data } = await supabase
    .from("freebies")
    .select("title")
    .eq("slug", slug)
    .maybeSingle();

  return {
    title: data?.title ?? "Free Resource — Kingsley Low",
    description: "A free step-by-step guide from Kingsley Low",
  };
}

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={{ color: "#fff", fontWeight: 700 }}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

function Byline() {
  const linkStyle: React.CSSProperties = {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "10px",
    letterSpacing: "0.08em",
    color: "#FBBF24",
    textDecoration: "none",
    opacity: 0.7,
  };
  const textStyle: React.CSSProperties = {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "10px",
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.25)",
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", justifyContent: "center" }}>
      <span style={textStyle}>by</span>
      <span style={{ ...textStyle, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>Kingsley Low</span>
      <a href="https://kingsleylow.com/" target="_blank" rel="noopener noreferrer" style={linkStyle}>@kingsleylow.ai</a>
      <span style={{ ...textStyle, opacity: 0.4 }}>×</span>
      <a href="https://closerking.ai/" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, color: "#FBBF24" }}>closerking.ai</a>
      <a href="https://closerking.ai/" target="_blank" rel="noopener noreferrer" style={linkStyle}>@closerking.ai</a>
    </div>
  );
}

export default async function FreebiePage({ params }: Props) {
  const { slug } = await params;

  const { data } = await supabase
    .from("freebies")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<Freebie>();

  if (!data) notFound();

  const DEFAULT_WHATSAPP = "https://chat.whatsapp.com/DVcakxARHGgJloz9x3odXt?s=cl&p=i&ilr=4";
  const ctaText = data.cta_text || "Join Claude Malaysia Free WhatsApp Group →";
  const whatsappHref = data.whatsapp_link || DEFAULT_WHATSAPP;
  const totalSteps = data.sections.length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#fff",
        fontFamily: "var(--font-geist-sans), sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Scanline texture overlay */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Radial glow — top centre */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse at center, rgba(251,191,36,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Top bar ── */}
        <header
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          <Byline />
        </header>

        <div
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            padding: "40px 20px 80px",
          }}
        >
          {/* ── Hero ── */}
          <div style={{ marginBottom: "48px" }}>
            {/* Label */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "20px",
                padding: "5px 12px",
                border: "1px solid rgba(251,191,36,0.25)",
                borderRadius: "999px",
                background: "rgba(251,191,36,0.06)",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#FBBF24",
                  display: "inline-block",
                  boxShadow: "0 0 6px #FBBF24",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  color: "#FBBF24",
                  textTransform: "uppercase",
                }}
              >
                Step-by-Step Playbook
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "clamp(26px, 6vw, 38px)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#fff",
                marginBottom: "16px",
              }}
            >
              {data.title}
            </h1>

            {/* Subtitle line */}
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.6,
              }}
            >
              Follow in order — this takes less than 10 minutes.
            </p>

            {/* Thin amber divider */}
            <div
              style={{
                marginTop: "24px",
                height: "1px",
                background:
                  "linear-gradient(90deg, #FBBF24 0%, rgba(251,191,36,0.1) 60%, transparent 100%)",
              }}
            />
          </div>

          {/* ── Steps ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {data.sections.map((section, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  borderLeft: "3px solid #FBBF24",
                  borderRadius: "0 16px 16px 0",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderLeftWidth: "3px",
                  borderLeftColor: "#FBBF24",
                  padding: "20px 20px 20px 22px",
                  overflow: "hidden",
                }}
              >
                {/* Ghost step number — background watermark */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: "-8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "80px",
                    fontWeight: 900,
                    color: "rgba(251,191,36,0.04)",
                    lineHeight: 1,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Step number chip */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: "#FBBF24",
                      textTransform: "uppercase",
                    }}
                  >
                    Step {i + 1}
                  </span>
                  {i === totalSteps - 1 && (
                    <span
                      style={{
                        fontSize: "9px",
                        padding: "1px 7px",
                        borderRadius: "999px",
                        background: "rgba(251,191,36,0.12)",
                        color: "rgba(251,191,36,0.7)",
                        fontFamily: "var(--font-geist-mono), monospace",
                        letterSpacing: "0.1em",
                      }}
                    >
                      FINAL
                    </span>
                  )}
                </div>

                {/* Heading */}
                <h2
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.3,
                    marginBottom: "8px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {section.heading.replace(/^Step \d+:\s*/i, "")}
                </h2>

                {/* Content */}
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.7,
                  }}
                >
                  {renderBold(section.content)}
                </p>

                {/* Copyable prompts */}
                {section.prompts && section.prompts.length > 0 && (
                  <div style={{ marginTop: "4px" }}>
                    {section.prompts.map((prompt, pi) => (
                      <CopyPrompt key={pi} text={prompt} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Completion bar ── */}
          <div
            style={{
              marginTop: "32px",
              padding: "16px 20px",
              borderRadius: "12px",
              background: "rgba(251,191,36,0.05)",
              border: "1px solid rgba(251,191,36,0.12)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#FBBF24",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "13px",
                fontWeight: 800,
                color: "#000",
              }}
            >
              ✓
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.5,
              }}
            >
              Done. You now have a live system running — not just a theory.
            </p>
          </div>

          {/* ── Optional resource link ── */}
          {data.link_url && (
            <div style={{ marginTop: "20px" }}>
              {/* Label above */}
              <p
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  color: "rgba(251,191,36,0.5)",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  paddingLeft: "2px",
                }}
              >
                📎 Resource
              </p>
              <a
                href={data.link_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "18px 20px",
                  borderRadius: "14px",
                  border: "2px solid rgba(251,191,36,0.45)",
                  background: "rgba(251,191,36,0.08)",
                  textDecoration: "none",
                  boxShadow: "0 0 24px rgba(251,191,36,0.1), inset 0 1px 0 rgba(251,191,36,0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: "#FBBF24",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      flexShrink: 0,
                    }}
                  >
                    🔗
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: 800,
                        color: "#fff",
                        marginBottom: "3px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {data.link_label || "Resource"}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: "10px",
                        color: "rgba(251,191,36,0.5)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "220px",
                      }}
                    >
                      {data.link_url.replace(/^https?:\/\//, "")}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "22px",
                    color: "#FBBF24",
                    flexShrink: 0,
                    fontWeight: 700,
                  }}
                >
                  ↗
                </span>
              </a>
            </div>
          )}

          {/* ── Divider ── */}
          <div
            style={{
              margin: "40px 0 32px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)",
            }}
          />

          {/* ── Creator Profile ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            {/* Profile image with Instagram-style gradient ring */}
            <div
              style={{
                padding: "3px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              }}
            >
              <div
                style={{
                  padding: "2px",
                  borderRadius: "50%",
                  background: "#080808",
                }}
              >
                <Image
                  src="/kingsley-profile.jpg"
                  alt="Kingsley Low"
                  width={72}
                  height={72}
                  style={{ borderRadius: "50%", display: "block" }}
                />
              </div>
            </div>

            {/* Name */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                  marginBottom: "4px",
                }}
              >
                @kingsleylow.ai
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "10px",
                }}
              >
                Building AI systems that close for you
              </p>

              {/* Link pill */}
              <a
                href="https://closerking.ai/1h"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 14px",
                  borderRadius: "999px",
                  border: "1px solid rgba(251,191,36,0.25)",
                  background: "rgba(251,191,36,0.06)",
                  fontSize: "11px",
                  fontFamily: "var(--font-geist-mono), monospace",
                  color: "#FBBF24",
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
              >
                <span style={{ opacity: 0.6 }}>↗</span>
                closerking.ai/1h
              </a>
            </div>
          </div>

          {/* ── CTA ── */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              width: "100%",
              padding: "16px 24px",
              borderRadius: "14px",
              background: "#FBBF24",
              color: "#000",
              fontSize: "15px",
              fontWeight: 800,
              textAlign: "center",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 0 32px rgba(251,191,36,0.2), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {ctaText}
          </a>

          {/* Footer */}
          <div
            style={{
              marginTop: "32px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Byline />
          </div>
        </div>
      </div>
    </main>
  );
}
