"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Keyframe styles ───────────────────────────────────────────────────────────
const ANIMATION_CSS = `
@keyframes slideInFromRight {
  from { transform: translateX(60px); opacity: 0; }
  to   { transform: translateX(0);   opacity: 1; }
}
@keyframes slideInFromLeft {
  from { transform: translateX(-60px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

// ─── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg: "#0a0a0a",
  accent: "#E8760A",
  text: "#ededed",
  muted: "rgba(237,237,237,0.5)",
  surface: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  maxWidth: "480px",
} as const;

// ─── Options ───────────────────────────────────────────────────────────────────
const TEAM_SIZE_OPTIONS = [
  { value: "just_me", label: "Just me" },
  { value: "2_5", label: "2–5 people" },
  { value: "6_15", label: "6–15 people" },
  { value: "16_plus", label: "16+ people" },
];

const DEAL_SIZE_OPTIONS = [
  { value: "below_10k", label: "Below RM 10K" },
  { value: "10k_50k", label: "RM 10K–50K" },
  { value: "50k_200k", label: "RM 50K–200K" },
  { value: "200k_plus", label: "RM 200K+" },
];

const ACQUISITION_OPTIONS = [
  { value: "cold_outreach", label: "Cold outreach (email/LinkedIn/WhatsApp)" },
  { value: "referrals", label: "Referrals from existing clients" },
  { value: "inbound", label: "Inbound (ads, content, SEO)" },
  { value: "events", label: "Events & networking" },
  { value: "partnerships", label: "Partnerships" },
];

const PAYS_COMMS_OPTIONS = [
  { value: "yes", label: "Yes, I pay commissions" },
  { value: "open", label: "No, but I'm open to it" },
  { value: "no", label: "No, not my model" },
];

// ─── State type ────────────────────────────────────────────────────────────────
interface B2BAnswers {
  name: string;
  phone: string;
  email: string;
  team_size: string;
  deal_size: string;
  acquisition: string[];
  pays_comms: string;
  special_requests: string;
}

const TOTAL_STEPS = 8;

export default function B2BPage() {
  const router = useRouter();
  const [step, setStep] = useState<number | null>(null); // null = landing
  const [answers, setAnswers] = useState<B2BAnswers>({
    name: "",
    phone: "",
    email: "",
    team_size: "",
    deal_size: "",
    acquisition: [],
    pays_comms: "",
    special_requests: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // ─── Navigation ──────────────────────────────────────────────────────────────
  function goNext() {
    if (step === null) {
      setDirection("forward");
      setStep(1);
      return;
    }
    if (step < TOTAL_STEPS) {
      setDirection("forward");
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  }

  function goBack() {
    setDirection("back");
    if (step === null) return;
    if (step > 1) setStep(step - 1);
    else setStep(null);
  }

  // ─── Validation ──────────────────────────────────────────────────────────────
  function isStepValid(s: number | null): boolean {
    if (!s) return false;
    if (s === 1) return answers.name.trim().length > 0;
    if (s === 2) {
      const d = answers.phone.replace(/[^0-9]/g, "");
      return d.length === 10 || d.length === 11;
    }
    if (s === 3) {
      const e = answers.email.trim();
      const at = e.indexOf("@");
      return at > 0 && e.slice(at).includes(".");
    }
    if (s === 4) return answers.team_size.length > 0;
    if (s === 5) return answers.deal_size.length > 0;
    if (s === 6) return answers.acquisition.length > 0;
    if (s === 7) return answers.pays_comms.length > 0;
    if (s === 8) return true; // optional
    return false;
  }

  // ─── Submission ──────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/b2b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          referrer:
            new URLSearchParams(window.location.search).get("ref") ?? null,
          user_agent: navigator.userAgent,
        }),
      });
      const json = await res.json();
      if (json.insights) {
        sessionStorage.setItem("b2b_insights", JSON.stringify(json.insights));
      }
      sessionStorage.setItem("b2b_name", answers.name);
      sessionStorage.setItem("b2b_team", answers.team_size);
      sessionStorage.setItem("b2b_deal", answers.deal_size);
      sessionStorage.setItem("b2b_grade", json.lead_grade ?? "cold");
      router.push("/b2b/thank-you");
    } catch {
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  // ─── Shared styles ────────────────────────────────────────────────────────────
  const pageStyle: React.CSSProperties = {
    minHeight: "100svh",
    background: T.bg,
    color: T.text,
    fontFamily: "var(--font-geist-sans), sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowX: "hidden",
  };

  const innerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: T.maxWidth,
    padding: "0 20px",
    boxSizing: "border-box",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const textInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: T.text,
    fontSize: "16px",
    fontFamily: "var(--font-geist-sans), sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease",
  };

  // ─── Submitting screen ────────────────────────────────────────────────────────
  if (submitting) {
    return (
      <main style={pageStyle}>
        <style>{ANIMATION_CSS}</style>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.1)",
              borderTopColor: T.accent,
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: T.muted, fontSize: "15px" }}>
            Analysing your sales gaps...
          </p>
        </div>
      </main>
    );
  }

  // ─── Landing screen ───────────────────────────────────────────────────────────
  if (step === null) {
    return (
      <main style={pageStyle}>
        <style>{ANIMATION_CSS}</style>
        <div
          style={{
            ...innerStyle,
            justifyContent: "center",
            paddingTop: "48px",
            paddingBottom: "48px",
            gap: "28px",
            position: "relative",
          }}
        >
          {/* Radial glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "300px",
              background:
                "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(232,118,10,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Hero */}
          <div
            style={{ textAlign: "center", position: "relative" }}
          >
            <div
              style={{
                fontSize: "60px",
                marginBottom: "16px",
                animation: "fadeIn 0.6s ease both",
              }}
            >
              🎯
            </div>

            <h1
              style={{
                fontSize: "clamp(28px, 7vw, 36px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: T.text,
                marginBottom: "14px",
                lineHeight: 1.15,
              }}
            >
              Is Your Sales Team Missing Deals?
            </h1>

            <p
              style={{
                fontSize: "16px",
                color: T.muted,
                lineHeight: 1.7,
                margin: 0,
                maxWidth: "380px",
                marginInline: "auto",
                fontStyle: "italic",
              }}
            >
              &ldquo;If your team doesn&apos;t know who to prioritise, when to
              follow up, and which leads are going cold — you&apos;re losing
              clients every week.&rdquo;
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              setDirection("forward");
              setStep(1);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "18px 24px",
              borderRadius: "14px",
              background: T.accent,
              color: "#fff",
              fontSize: "17px",
              fontWeight: 800,
              textAlign: "center",
              border: "none",
              cursor: "pointer",
              letterSpacing: "-0.01em",
              boxShadow:
                "0 0 40px rgba(232,118,10,0.3), 0 0 80px rgba(232,118,10,0.1), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            See If You Qualify →
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "rgba(237,237,237,0.35)",
              margin: "-12px 0 0",
            }}
          >
            Takes 90 seconds · 100% free
          </p>
        </div>
      </main>
    );
  }

  // ─── Wizard ───────────────────────────────────────────────────────────────────
  const progressPct = ((step) / TOTAL_STEPS) * 100;
  const progressLabel = `Step ${step} of ${TOTAL_STEPS}`;
  const progressWidth = `${progressPct}%`;
  const animationName =
    direction === "forward" ? "slideInFromRight" : "slideInFromLeft";
  const isLastStep = step === TOTAL_STEPS;
  const valid = isStepValid(step);

  function getQuestion(s: number): string {
    switch (s) {
      case 1: return "What's your name?";
      case 2: return "Your WhatsApp number";
      case 3: return "Your email address";
      case 4: return "How big is your team right now?";
      case 5: return "How much is one client worth to you over a year?";
      case 6: return "How do you usually get clients?";
      case 7: return "Do you offer referral commissions?";
      case 8: return "Any special requests for your dashboard?";
      default: return "";
    }
  }

  function renderInput() {
    // Step 1: name
    if (step === 1) {
      return (
        <input
          type="text"
          autoFocus
          value={answers.name}
          onChange={(e) => setAnswers((p) => ({ ...p, name: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && valid && goNext()}
          placeholder="Your full name"
          style={textInputStyle}
        />
      );
    }

    // Step 2: phone
    if (step === 2) {
      const phoneDigits = answers.phone.replace(/[^0-9]/g, "");
      return (
        <div>
          <input
            type="tel"
            autoFocus
            value={answers.phone}
            onChange={(e) =>
              setAnswers((p) => ({ ...p, phone: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && valid && goNext()}
            placeholder="e.g. 0122850125"
            style={textInputStyle}
          />
          {answers.phone.length > 0 &&
            phoneDigits.length > 0 &&
            phoneDigits.length !== 10 &&
            phoneDigits.length !== 11 && (
              <p style={{ color: "#ff6b6b", fontSize: "13px", margin: "8px 0 0" }}>
                Please enter a valid Malaysian number (10 or 11 digits)
              </p>
            )}
        </div>
      );
    }

    // Step 3: email
    if (step === 3) {
      return (
        <div>
          <input
            type="email"
            autoFocus
            value={answers.email}
            onChange={(e) =>
              setAnswers((p) => ({ ...p, email: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && valid && goNext()}
            placeholder="you@company.com"
            style={textInputStyle}
          />
          {answers.email.length > 0 && !isStepValid(3) && (
            <p style={{ color: "#ff6b6b", fontSize: "13px", margin: "8px 0 0" }}>
              Please enter a valid email — e.g. you@company.com
            </p>
          )}
        </div>
      );
    }

    // Step 4: team size (radio, auto-advance)
    if (step === 4) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {TEAM_SIZE_OPTIONS.map((opt) => {
            const selected = answers.team_size === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setAnswers((p) => ({ ...p, team_size: opt.value }));
                  setTimeout(() => goNext(), 300);
                }}
                style={radioButtonStyle(selected)}
              >
                <span style={radioIndicatorStyle(selected)} />
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    // Step 5: deal size (radio, auto-advance)
    if (step === 5) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {DEAL_SIZE_OPTIONS.map((opt) => {
            const selected = answers.deal_size === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setAnswers((p) => ({ ...p, deal_size: opt.value }));
                  setTimeout(() => goNext(), 300);
                }}
                style={radioButtonStyle(selected)}
              >
                <span style={radioIndicatorStyle(selected)} />
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    // Step 6: acquisition multi-select
    if (step === 6) {
      return (
        <div>
          <p style={{ fontSize: "12px", color: "rgba(237,237,237,0.4)", margin: "0 0 12px" }}>
            Select all that apply
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {ACQUISITION_OPTIONS.map((opt) => {
              const selected = answers.acquisition.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    const updated = selected
                      ? answers.acquisition.filter((v) => v !== opt.value)
                      : [...answers.acquisition, opt.value];
                    setAnswers((p) => ({ ...p, acquisition: updated }));
                  }}
                  style={checkboxButtonStyle(selected)}
                >
                  <span style={checkboxIndicatorStyle(selected)}>
                    {selected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="#fff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // Step 7: pays comms (radio, auto-advance)
    if (step === 7) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {PAYS_COMMS_OPTIONS.map((opt) => {
            const selected = answers.pays_comms === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setAnswers((p) => ({ ...p, pays_comms: opt.value }));
                  setTimeout(() => goNext(), 300);
                }}
                style={radioButtonStyle(selected)}
              >
                <span style={radioIndicatorStyle(selected)} />
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    // Step 8: special requests (optional textarea)
    if (step === 8) {
      return (
        <div>
          <textarea
            autoFocus
            value={answers.special_requests}
            onChange={(e) =>
              setAnswers((p) => ({ ...p, special_requests: e.target.value }))
            }
            placeholder="e.g. I want to track LinkedIn + WhatsApp outreach, team of 5..."
            style={{
              ...textInputStyle,
              minHeight: "120px",
              resize: "vertical",
            }}
          />
        </div>
      );
    }

    return null;
  }

  return (
    <main style={pageStyle}>
      <style>{ANIMATION_CSS}</style>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          maxWidth: T.maxWidth,
          padding: "20px 20px 0",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "rgba(237,237,237,0.4)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {progressLabel}
          </span>
          <span style={{ fontSize: "11px", color: "rgba(237,237,237,0.3)" }}>
            {Math.round(progressPct)}%
          </span>
        </div>
        <div
          style={{
            height: "4px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: progressWidth,
              borderRadius: "999px",
              background: T.accent,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Animated question card */}
      <div
        key={step}
        style={{
          ...innerStyle,
          paddingTop: "32px",
          paddingBottom: "32px",
          gap: "24px",
          animation: `${animationName} 0.3s ease-in-out both`,
        }}
      >
        <h2
          style={{
            fontSize: "clamp(20px, 5vw, 26px)",
            fontWeight: 700,
            color: T.text,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {getQuestion(step)}
        </h2>

        <div style={{ flex: 1 }}>{renderInput()}</div>

        {/* Nav buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={goBack}
              style={{
                minHeight: "52px",
                padding: "14px 20px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${T.border}`,
                color: "rgba(237,237,237,0.5)",
                fontSize: "15px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 500,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ← Back
            </button>
            <button
              onClick={goNext}
              disabled={!valid || submitting}
              style={{
                flex: 1,
                minHeight: "52px",
                padding: "14px 24px",
                borderRadius: "12px",
                background:
                  valid && !submitting
                    ? T.accent
                    : "rgba(255,255,255,0.06)",
                border: "none",
                color: valid ? "#fff" : "rgba(237,237,237,0.25)",
                fontSize: "16px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 700,
                cursor: valid ? "pointer" : "not-allowed",
                transition: "all 0.15s ease",
                letterSpacing: "-0.01em",
              }}
            >
              {isLastStep ? "Submit →" : "Continue →"}
            </button>
          </div>

          {/* Skip link for step 8 */}
          {step === 8 && (
            <button
              onClick={handleSubmit}
              style={{
                background: "none",
                border: "none",
                color: "rgba(237,237,237,0.35)",
                fontSize: "13px",
                cursor: "pointer",
                textDecoration: "underline",
                textAlign: "center",
                padding: "4px",
              }}
            >
              Skip →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

// ─── Shared button style helpers ──────────────────────────────────────────────
function radioButtonStyle(selected: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    minHeight: "56px",
    padding: "14px 16px",
    borderRadius: "12px",
    background: selected ? "rgba(232,118,10,0.12)" : "rgba(255,255,255,0.04)",
    border: selected ? "1.5px solid #E8760A" : "1px solid rgba(255,255,255,0.08)",
    color: selected ? "#ededed" : "rgba(237,237,237,0.7)",
    fontSize: "15px",
    fontFamily: "var(--font-geist-sans), sans-serif",
    fontWeight: selected ? 600 : 400,
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.15s ease",
    boxSizing: "border-box",
  };
}

function radioIndicatorStyle(selected: boolean): React.CSSProperties {
  return {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: selected ? "5px solid #E8760A" : "2px solid rgba(255,255,255,0.2)",
    flexShrink: 0,
    background: selected ? "#E8760A22" : "transparent",
    transition: "all 0.15s ease",
    boxSizing: "border-box",
  };
}

function checkboxButtonStyle(selected: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    minHeight: "52px",
    padding: "12px 16px",
    borderRadius: "12px",
    background: selected ? "rgba(232,118,10,0.12)" : "rgba(255,255,255,0.04)",
    border: selected ? "1.5px solid #E8760A" : "1px solid rgba(255,255,255,0.08)",
    color: selected ? "#ededed" : "rgba(237,237,237,0.7)",
    fontSize: "15px",
    fontFamily: "var(--font-geist-sans), sans-serif",
    fontWeight: selected ? 600 : 400,
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.15s ease",
    boxSizing: "border-box",
  };
}

function checkboxIndicatorStyle(selected: boolean): React.CSSProperties {
  return {
    width: "18px",
    height: "18px",
    borderRadius: "4px",
    border: selected ? "none" : "2px solid rgba(255,255,255,0.2)",
    flexShrink: 0,
    background: selected ? "#E8760A" : "transparent",
    transition: "all 0.15s ease",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}
