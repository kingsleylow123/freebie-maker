"use client";

import { useState, useEffect } from "react";

const ANIMATION_CSS = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

const ICONS = ["🔥", "⚡", "💡"];

function animated(
  delay: number,
  extra?: React.CSSProperties
): React.CSSProperties {
  return {
    animation: `fadeUp 0.55s ease both`,
    animationDelay: `${delay}ms`,
    ...extra,
  };
}

const FAQ_ITEMS = [
  {
    q: "Can you find LinkedIn leads for me?",
    a: "Yes — fully custom. Tell us: Location, Job title/seniority, Company size, Industry. We'll build the list.",
  },
  {
    q: "What does the dashboard actually do?",
    a: "It tells your team who to contact today, who's going cold, and which leads are most likely to convert.",
  },
  {
    q: "Do I need to change my CRM?",
    a: "No. We integrate with what you already use, or set up a lightweight one if you don't have anything yet.",
  },
  {
    q: "How much does it cost?",
    a: "We'll discuss after understanding your team size and volume. Not one-size-fits-all — we scope to your situation.",
  },
];

export default function B2BThankYouPage() {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [deal, setDeal] = useState("");
  const [grade, setGrade] = useState("");
  const [insights, setInsights] = useState<
    Array<{ title: string; insight: string }>
  >([]);

  useEffect(() => {
    setName(sessionStorage.getItem("b2b_name") ?? "");
    setTeam(sessionStorage.getItem("b2b_team") ?? "");
    setDeal(sessionStorage.getItem("b2b_deal") ?? "");
    setGrade(sessionStorage.getItem("b2b_grade") ?? "cold");
    try {
      const s = sessionStorage.getItem("b2b_insights");
      if (s) setInsights(JSON.parse(s));
    } catch {}
  }, []);

  const isHotOrWarm = grade !== "cold";

  const waMsg = encodeURIComponent(
    `Hi Kingsley, B2B Dashboard DONE - ${name}, team of ${team}, ${deal}/year deals`
  );
  const waUrl = `https://wa.me/60122850125?text=${waMsg}`;

  const displayInsights = isHotOrWarm ? insights.slice(0, 3) : insights.slice(0, 1);

  const fallbackInsight = {
    title: "Your follow-up gaps are costing you",
    insight:
      "Most B2B teams lose 40-60% of deals in the follow-up phase — not because the prospect said no, but because no one followed up at the right time.",
  };

  return (
    <main
      style={{
        minHeight: "100svh",
        background: "#0a0a0a",
        color: "#ededed",
        fontFamily: "var(--font-geist-sans), sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 20px 64px",
        overflowX: "hidden",
      }}
    >
      <style>{ANIMATION_CSS}</style>

      <div style={{ width: "100%", maxWidth: "480px" }}>
        {/* Icon */}
        <div
          style={{
            textAlign: "center",
            fontSize: "56px",
            marginBottom: "20px",
            animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          🎯
        </div>

        {/* Heading */}
        {isHotOrWarm ? (
          <h1
            style={{
              textAlign: "center",
              fontSize: "clamp(28px, 7vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#ededed",
              margin: "0 0 28px",
              ...animated(100),
            }}
          >
            You qualify.
          </h1>
        ) : (
          <h1
            style={{
              textAlign: "center",
              fontSize: "clamp(24px, 6vw, 32px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#ededed",
              margin: "0 0 28px",
              ...animated(100),
            }}
          >
            Thanks for sharing{name ? `, ${name}` : ""}.
          </h1>
        )}

        {/* Insights section */}
        <div style={animated(250)}>
          {/* Section label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(237,237,237,0.12)",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "2px",
                color: "rgba(237,237,237,0.5)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {isHotOrWarm
                ? "DEALS YOUR TEAM IS LOSING"
                : "ONE THING TO START WITH"}
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(237,237,237,0.12)",
              }}
            />
          </div>

          {isHotOrWarm && (
            <p
              style={{
                textAlign: "center",
                color: "rgba(237,237,237,0.45)",
                fontSize: "13px",
                margin: "0 0 20px",
              }}
            >
              Based on what you shared:
            </p>
          )}

          {/* Insight cards */}
          <div style={{ marginTop: isHotOrWarm ? "0" : "20px" }}>
            {displayInsights.length > 0
              ? displayInsights.map((ins, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "14px",
                      padding: "18px 20px",
                      marginBottom: "10px",
                      ...animated(300 + i * 130),
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "15px",
                        color: "#ededed",
                        margin: "0 0 8px",
                        lineHeight: 1.4,
                      }}
                    >
                      {ICONS[i] ?? "💡"} {ins.title}
                    </p>
                    <p
                      style={{
                        color: "rgba(237,237,237,0.65)",
                        fontSize: "13px",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {ins.insight}
                    </p>
                  </div>
                ))
              : (
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                    padding: "18px 20px",
                    marginBottom: "10px",
                    ...animated(300),
                  }}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#ededed",
                      margin: "0 0 8px",
                      lineHeight: 1.4,
                    }}
                  >
                    💡 {fallbackInsight.title}
                  </p>
                  <p
                    style={{
                      color: "rgba(237,237,237,0.65)",
                      fontSize: "13px",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {fallbackInsight.insight}
                  </p>
                </div>
              )}
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "rgba(237,237,237,0.08)",
              margin: "24px 0",
            }}
          />
        </div>

        {/* WhatsApp CTA */}
        <div style={animated(isHotOrWarm ? 620 : 450)}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              width: "100%",
              padding: "17px",
              backgroundColor: "#25D366",
              color: "#000",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 700,
              borderRadius: "14px",
              textAlign: "center",
              boxSizing: "border-box",
              marginBottom: "32px",
              letterSpacing: "0.2px",
            }}
          >
            📱 WhatsApp Kingsley — B2B Dashboard DONE →
          </a>
        </div>

        {/* FAQ */}
        <div style={animated(isHotOrWarm ? 680 : 500)}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(237,237,237,0.12)",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "2px",
                color: "rgba(237,237,237,0.4)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              FAQ
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(237,237,237,0.12)",
              }}
            />
          </div>

          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "16px 18px",
                marginBottom: "10px",
                ...animated(700 + i * 80),
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#ededed",
                  margin: "0 0 8px",
                  lineHeight: 1.4,
                }}
              >
                {item.q}
              </p>
              <p
                style={{
                  color: "rgba(237,237,237,0.55)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
