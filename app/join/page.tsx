"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Keyframe styles injected once ────────────────────────────────────────────
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
`;

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const TOTAL_STEPS = 10;

const ROLE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "business_owner", label: "Business Owner" },
  { value: "developer", label: "Developer" },
  { value: "freelancer", label: "Freelancer (non-marketing)" },
  { value: "marketing_agency", label: "Marketing Agency" },
];

const TEAM_SIZE_OPTIONS = [
  { value: "solo", label: "Solo (just me)" },
  { value: "1-5", label: "1–5" },
  { value: "5-10", label: "5–10" },
  { value: "10-30", label: "10–30" },
  { value: "30-100", label: "30–100" },
  { value: "100+", label: "100+" },
];

const AI_USE_CASE_OPTIONS = [
  { value: "social", label: "Grow a following on social media" },
  { value: "b2b", label: "Getting targeted B2B leads" },
  { value: "invoicing", label: "Invoicing, Payment & Receipts" },
  { value: "kpi", label: "Streamline team KPI" },
  { value: "ops", label: "Automate repetitive tasks & operations" },
  { value: "cost", label: "Cost savings" },
  { value: "dashboard", label: "Dashboard cashflow & operations overview" },
  { value: "others", label: "Others" },
];

const COMMUNITY_VALUE_OPTIONS = [
  { value: "connections", label: "Connections with top people" },
  { value: "knowledge", label: "Industry knowledge" },
  { value: "venue", label: "Venue" },
  { value: "sponsors", label: "Sponsors" },
  { value: "volunteer", label: "Volunteer time" },
  { value: "content", label: "Content creation" },
  { value: "facilitator", label: "Event facilitator" },
];

const EVENT_PREFERENCE_OPTIONS = [
  { value: "online", label: "Online events & workshops" },
  { value: "offline_kl", label: "Offline events & workshops (KL)" },
];

// ─── State type ───────────────────────────────────────────────────────────────
interface JoinAnswers {
  name: string;
  email: string;
  phone: string;
  role: string;
  team_size: string;
  ai_use_cases: string[];
  ai_use_cases_other: string;
  pain_point: string;
  community_value: string[];
  event_preference: string[];
  social_link: string;
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#0a0a0a",
  accent: "#E8760A",
  text: "#ededed",
  muted: "rgba(237,237,237,0.5)",
  surface: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  maxWidth: "480px",
} as const;

export default function JoinPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = landing, 1–10 = steps
  const [answers, setAnswers] = useState<JoinAnswers>({
    name: "",
    email: "",
    phone: "",
    role: "",
    team_size: "",
    ai_use_cases: [],
    ai_use_cases_other: "",
    pain_point: "",
    community_value: [],
    event_preference: [],
    social_link: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // ─── Navigation ─────────────────────────────────────────────────────────────
  function goNext() {
    if (step < TOTAL_STEPS) {
      setDirection("forward");
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  }

  function goBack() {
    setDirection("back");
    if (step > 1) {
      setStep(step - 1);
    } else {
      setStep(0);
    }
  }

  // ─── Validation ──────────────────────────────────────────────────────────────
  function isStepValid(s: number): boolean {
    if (s === 10) return true; // optional
    if (s === 1) return answers.name.trim().length > 0;
    if (s === 2) return answers.email.trim().length > 0;
    if (s === 3) return answers.phone.trim().length > 0;
    if (s === 4) return answers.role.length > 0;
    if (s === 5) return answers.team_size.length > 0;
    if (s === 6) return answers.ai_use_cases.length > 0;
    if (s === 7) return answers.pain_point.trim().length > 0;
    if (s === 8) return answers.community_value.length > 0;
    if (s === 9) return answers.event_preference.length > 0;
    return false;
  }

  // ─── Submission ──────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitting(true);
    const ref =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("ref") ?? ""
        : "";
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          referrer: ref,
          user_agent: navigator.userAgent,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert("Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      if (json.recommendations) {
        sessionStorage.setItem(
          "cm_recommendations",
          JSON.stringify(json.recommendations)
        );
      }
      // Store phone for referral link on thank-you page
      sessionStorage.setItem("cm_phone", answers.phone.replace(/[^0-9]/g, ""));
      router.push(`/join/thank-you?n=${json.member_number}`);
    } catch {
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  // ─── Shared styles ───────────────────────────────────────────────────────────
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

  // ─── Submitting screen ───────────────────────────────────────────────────────
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
            Building your AI action plan...
          </p>
        </div>
      </main>
    );
  }

  // ─── Landing screen ──────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <main style={pageStyle}>
        <style>{ANIMATION_CSS}</style>
        <div
          style={{
            ...innerStyle,
            justifyContent: "center",
            paddingTop: "48px",
            paddingBottom: "48px",
            gap: "32px",
          }}
        >
          {/* Hero */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>🇲🇾</div>
            <h1
              style={{
                fontSize: "clamp(24px, 6vw, 32px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: T.text,
                marginBottom: "12px",
                lineHeight: 1.15,
              }}
            >
              Join Claude Malaysia
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: T.muted,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              The AI community for Malaysians building with AI
            </p>
          </div>

          {/* CTA button */}
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
              boxShadow: "0 0 32px rgba(232,118,10,0.25), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            Join Now — It&apos;s Free →
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "rgba(237,237,237,0.35)",
              margin: "-16px 0 0",
            }}
          >
            Takes 2 mins · Get your personalised AI action plan
          </p>
        </div>
      </main>
    );
  }

  // ─── Question wizard ─────────────────────────────────────────────────────────
  const progressWidth = `${(step / TOTAL_STEPS) * 100}%`;
  const animationName =
    direction === "forward" ? "slideInFromRight" : "slideInFromLeft";
  const isLastStep = step === TOTAL_STEPS;
  const valid = isStepValid(step);

  // ─── Step question helpers ────────────────────────────────────────────────────
  function getQuestion(s: number): string {
    switch (s) {
      case 1: return "What's your name?";
      case 2: return "What's your email address?";
      case 3: return "What's your WhatsApp number?";
      case 4: return "What's your role?";
      case 5: return "How big is your team?";
      case 6: return "What do you feel AI can help you with, but haven't explored yet?";
      case 7: return "What is your biggest pain point in your life or business right now?";
      case 8: return "What value can you bring to the Claude Malaysia community?";
      case 9: return "Notify me about:";
      case 10: return "Your best social media link";
      default: return "";
    }
  }

  // ─── Render input for current step ───────────────────────────────────────────
  function renderInput() {
    // Steps 1–3: text inputs
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

    if (step === 2) {
      return (
        <input
          type="email"
          autoFocus
          value={answers.email}
          onChange={(e) => setAnswers((p) => ({ ...p, email: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && valid && goNext()}
          placeholder="you@example.com"
          style={textInputStyle}
        />
      );
    }

    if (step === 3) {
      return (
        <input
          type="tel"
          autoFocus
          value={answers.phone}
          onChange={(e) => setAnswers((p) => ({ ...p, phone: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && valid && goNext()}
          placeholder="+60 12-345 6789"
          style={textInputStyle}
        />
      );
    }

    // Step 4: role radio
    if (step === 4) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {ROLE_OPTIONS.map((opt) => {
            const selected = answers.role === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setAnswers((p) => ({ ...p, role: opt.value }))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  minHeight: "56px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: selected ? "rgba(232,118,10,0.12)" : T.surface,
                  border: selected
                    ? "1.5px solid #E8760A"
                    : `1px solid ${T.border}`,
                  color: selected ? T.text : "rgba(237,237,237,0.7)",
                  fontSize: "15px",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontWeight: selected ? 600 : 400,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: selected
                      ? "5px solid #E8760A"
                      : "2px solid rgba(255,255,255,0.2)",
                    flexShrink: 0,
                    background: selected ? "#E8760A22" : "transparent",
                    transition: "all 0.15s ease",
                    boxSizing: "border-box",
                  }}
                />
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    // Step 5: team size radio
    if (step === 5) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {TEAM_SIZE_OPTIONS.map((opt) => {
            const selected = answers.team_size === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() =>
                  setAnswers((p) => ({ ...p, team_size: opt.value }))
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  minHeight: "56px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: selected ? "rgba(232,118,10,0.12)" : T.surface,
                  border: selected
                    ? "1.5px solid #E8760A"
                    : `1px solid ${T.border}`,
                  color: selected ? T.text : "rgba(237,237,237,0.7)",
                  fontSize: "15px",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontWeight: selected ? 600 : 400,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: selected
                      ? "5px solid #E8760A"
                      : "2px solid rgba(255,255,255,0.2)",
                    flexShrink: 0,
                    background: selected ? "#E8760A22" : "transparent",
                    transition: "all 0.15s ease",
                    boxSizing: "border-box",
                  }}
                />
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    // Step 6: AI use cases multi-select (max 3) + others text
    if (step === 6) {
      const maxReached = answers.ai_use_cases.length >= 3;
      return (
        <div>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(237,237,237,0.4)",
              margin: "0 0 12px",
            }}
          >
            Pick up to 3
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {AI_USE_CASE_OPTIONS.map((opt) => {
              const selected = answers.ai_use_cases.includes(opt.value);
              const disabled = maxReached && !selected;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (disabled) return;
                    const current = answers.ai_use_cases;
                    const updated = current.includes(opt.value)
                      ? current.filter((v) => v !== opt.value)
                      : [...current, opt.value];
                    // If deselecting "others", clear the other text
                    const nextOther =
                      opt.value === "others" && !updated.includes("others")
                        ? ""
                        : answers.ai_use_cases_other;
                    setAnswers((p) => ({
                      ...p,
                      ai_use_cases: updated,
                      ai_use_cases_other: nextOther,
                    }));
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    minHeight: "52px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: selected ? "rgba(232,118,10,0.12)" : T.surface,
                    border: selected
                      ? "1.5px solid #E8760A"
                      : `1px solid ${T.border}`,
                    color: selected ? T.text : "rgba(237,237,237,0.7)",
                    fontSize: "15px",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontWeight: selected ? 600 : 400,
                    textAlign: "left",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.35 : 1,
                    transition: "all 0.15s ease",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Checkbox indicator */}
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      border: selected
                        ? "none"
                        : "2px solid rgba(255,255,255,0.2)",
                      flexShrink: 0,
                      background: selected ? T.accent : "transparent",
                      transition: "all 0.15s ease",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selected && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                      >
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
          {/* Others free text */}
          {answers.ai_use_cases.includes("others") && (
            <input
              type="text"
              autoFocus
              value={answers.ai_use_cases_other}
              onChange={(e) =>
                setAnswers((p) => ({
                  ...p,
                  ai_use_cases_other: e.target.value,
                }))
              }
              placeholder="Tell us more..."
              style={{ ...textInputStyle, marginTop: "12px" }}
            />
          )}
        </div>
      );
    }

    // Step 7: pain point textarea
    if (step === 7) {
      return (
        <textarea
          autoFocus
          value={answers.pain_point}
          onChange={(e) =>
            setAnswers((p) => ({ ...p, pain_point: e.target.value }))
          }
          placeholder="Tell us what's been on your mind..."
          style={{
            ...textInputStyle,
            minHeight: "120px",
            resize: "vertical",
          }}
        />
      );
    }

    // Step 8: community value multi-select (no max)
    if (step === 8) {
      return (
        <div>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(237,237,237,0.4)",
              margin: "0 0 12px",
            }}
          >
            Select all that apply
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {COMMUNITY_VALUE_OPTIONS.map((opt) => {
              const selected = answers.community_value.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    const updated = selected
                      ? answers.community_value.filter((v) => v !== opt.value)
                      : [...answers.community_value, opt.value];
                    setAnswers((p) => ({ ...p, community_value: updated }));
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    minHeight: "52px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: selected ? "rgba(232,118,10,0.12)" : T.surface,
                    border: selected
                      ? "1.5px solid #E8760A"
                      : `1px solid ${T.border}`,
                    color: selected ? T.text : "rgba(237,237,237,0.7)",
                    fontSize: "15px",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontWeight: selected ? 600 : 400,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      border: selected
                        ? "none"
                        : "2px solid rgba(255,255,255,0.2)",
                      flexShrink: 0,
                      background: selected ? T.accent : "transparent",
                      transition: "all 0.15s ease",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selected && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                      >
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

    // Step 9: event preference multi-select (no max)
    if (step === 9) {
      return (
        <div>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(237,237,237,0.4)",
              margin: "0 0 12px",
            }}
          >
            Select all that apply
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {EVENT_PREFERENCE_OPTIONS.map((opt) => {
              const selected = answers.event_preference.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    const updated = selected
                      ? answers.event_preference.filter((v) => v !== opt.value)
                      : [...answers.event_preference, opt.value];
                    setAnswers((p) => ({ ...p, event_preference: updated }));
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    minHeight: "56px",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    background: selected ? "rgba(232,118,10,0.12)" : T.surface,
                    border: selected
                      ? "1.5px solid #E8760A"
                      : `1px solid ${T.border}`,
                    color: selected ? T.text : "rgba(237,237,237,0.7)",
                    fontSize: "15px",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontWeight: selected ? 600 : 400,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      border: selected
                        ? "none"
                        : "2px solid rgba(255,255,255,0.2)",
                      flexShrink: 0,
                      background: selected ? T.accent : "transparent",
                      transition: "all 0.15s ease",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selected && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                      >
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

    // Step 10: social link (optional)
    if (step === 10) {
      return (
        <input
          type="url"
          autoFocus
          value={answers.social_link}
          onChange={(e) =>
            setAnswers((p) => ({ ...p, social_link: e.target.value }))
          }
          onKeyDown={(e) => e.key === "Enter" && goNext()}
          placeholder="FB / IG / TikTok / YouTube / Website URL"
          style={textInputStyle}
        />
      );
    }

    return null;
  }

  return (
    <main style={pageStyle}>
      <style>{ANIMATION_CSS}</style>

      {/* Progress bar + step counter */}
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
            Step {step} of {TOTAL_STEPS}
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(237,237,237,0.3)",
            }}
          >
            {Math.round((step / TOTAL_STEPS) * 100)}%
          </span>
        </div>
        {/* Track */}
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
        {/* Question label */}
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

        {/* Optional note for step 10 */}
        {step === 10 && (
          <p style={{ fontSize: "13px", color: T.muted, margin: "-16px 0 0" }}>
            Optional — you can skip this step
          </p>
        )}

        {/* Answer input */}
        <div style={{ flex: 1 }}>{renderInput()}</div>

        {/* Navigation buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
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
              disabled={!valid}
              style={{
                flex: 1,
                minHeight: "52px",
                padding: "14px 24px",
                borderRadius: "12px",
                background: valid ? T.accent : "rgba(255,255,255,0.06)",
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
          {/* Step 10 skip link */}
          {step === 10 && (
            <button
              onClick={goNext}
              style={{
                background: "none",
                border: "none",
                color: "rgba(237,237,237,0.4)",
                fontSize: "14px",
                cursor: "pointer",
                padding: "4px 0",
                fontFamily: "var(--font-geist-sans), sans-serif",
                textAlign: "center",
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
