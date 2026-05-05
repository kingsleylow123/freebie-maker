"use client";

import { useState, useEffect } from "react";
import { getVisibleSteps, getStepQuestion, SurveyAnswers, StepKey } from "@/lib/survey";

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

export default function SurveyPage() {
  const [step, setStep] = useState<StepKey | null>(null);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [counter, setCounter] = useState<{ count: number; goal: number }>({ count: 0, goal: 1000 });
  const [startTime] = useState(() => Date.now());
  const [ref, setRef] = useState("");
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // On mount: check duplicate, fetch counter, read ?ref=
  useEffect(() => {
    if (localStorage.getItem("malaysia_ai_pulse_done") === "1") {
      setAlreadyDone(true);
    }
    fetch("/api/survey/counter")
      .then((r) => r.json())
      .then((d) => setCounter(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRef(params.get("ref") ?? "");
  }, []);

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const visibleSteps = getVisibleSteps(answers);

  function currentStepIndex(): number {
    return step ? visibleSteps.indexOf(step) : -1;
  }

  function goNext() {
    const idx = currentStepIndex();
    if (idx < visibleSteps.length - 1) {
      setDirection("forward");
      setStep(visibleSteps[idx + 1]);
    } else {
      handleSubmit();
    }
  }

  function goBack() {
    const idx = currentStepIndex();
    setDirection("back");
    if (idx > 0) {
      setStep(visibleSteps[idx - 1]);
    } else {
      setStep(null);
    }
  }

  // ─── Answer helpers ──────────────────────────────────────────────────────────
  function setAnswer(key: StepKey, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [key]: value } as SurveyAnswers));
  }

  function toggleMultiselect(key: StepKey, value: string) {
    const current = (answers[key] as string[] | undefined) ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setAnswer(key, updated);
  }

  function currentAnswerIsValid(): boolean {
    if (!step) return false;
    const val = answers[step];
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  }

  // ─── Submission ──────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          completion_time_seconds: Math.round((Date.now() - startTime) / 1000),
          user_agent: navigator.userAgent,
          referrer: ref,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");

      localStorage.setItem("malaysia_ai_pulse_done", "1");
      localStorage.setItem("malaysia_ai_pulse_respondent", String(json.respondent_number));

      window.location.href = `/survey/thank-you?n=${json.respondent_number}`;
    } catch {
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  // ─── Shared styles ───────────────────────────────────────────────────────────
  const pageStyle: React.CSSProperties = {
    minHeight: "100svh",
    background: "#0a0a0a",
    color: "#ededed",
    fontFamily: "var(--font-geist-sans), sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowX: "hidden",
  };

  const innerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "480px",
    padding: "0 20px",
    boxSizing: "border-box",
    flex: 1,
    display: "flex",
    flexDirection: "column",
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
              borderTopColor: "#E8760A",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "rgba(237,237,237,0.5)", fontSize: "15px" }}>Submitting...</p>
        </div>
      </main>
    );
  }

  // ─── Landing / Already done screen ──────────────────────────────────────────
  if (step === null) {
    const progressPct = Math.min((counter.count / counter.goal) * 100, 100);

    if (alreadyDone) {
      return (
        <main style={pageStyle}>
          <style>{ANIMATION_CSS}</style>
          <div style={{ ...innerStyle, justifyContent: "center", alignItems: "center", textAlign: "center", gap: "16px", paddingTop: "48px", paddingBottom: "48px" }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>🇲🇾</div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#ededed", margin: 0 }}>
              You&apos;ve already taken this survey
            </h1>
            <p style={{ color: "rgba(237,237,237,0.5)", fontSize: "15px", margin: 0 }}>
              Thank you for your response!
            </p>
            <a
              href="/survey/thank-you"
              style={{
                display: "inline-block",
                marginTop: "8px",
                padding: "14px 28px",
                borderRadius: "12px",
                background: "#E8760A",
                color: "#fff",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              View thank-you page →
            </a>
          </div>
        </main>
      );
    }

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
                color: "#ededed",
                marginBottom: "12px",
                lineHeight: 1.15,
              }}
            >
              Malaysia AI Pulse 2026
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(237,237,237,0.5)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Understanding AI adoption across Malaysia.
            </p>
          </div>

          {/* Live counter */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#E8760A",
                  letterSpacing: "-0.02em",
                }}
              >
                {counter.count.toLocaleString()}
              </span>
              <span style={{ fontSize: "13px", color: "rgba(237,237,237,0.4)" }}>
                / {counter.goal.toLocaleString()} Malaysians
              </span>
            </div>
            {/* Progress bar track */}
            <div
              style={{
                height: "6px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  borderRadius: "999px",
                  background: "#E8760A",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(237,237,237,0.35)",
                marginTop: "8px",
                margin: "8px 0 0",
              }}
            >
              Takes about 2 minutes · Anonymous
            </p>
          </div>

          {/* CTA button */}
          <button
            onClick={() => {
              setDirection("forward");
              setStep(visibleSteps[0]);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "18px 24px",
              borderRadius: "14px",
              background: "#E8760A",
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
            Start Survey →
          </button>
        </div>
      </main>
    );
  }

  // ─── Question wizard ─────────────────────────────────────────────────────────
  const idx = currentStepIndex();
  const total = visibleSteps.length;
  const question = getStepQuestion(step, answers);
  const isLastStep = idx === total - 1;
  const progressWidth = `${((idx + 1) / total) * 100}%`;
  const animationName = direction === "forward" ? "slideInFromRight" : "slideInFromLeft";

  // Current answer value
  const currentAnswer = answers[step];

  return (
    <main style={pageStyle}>
      <style>{ANIMATION_CSS}</style>

      {/* Progress bar + step counter */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
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
            Step {idx + 1} of {total}
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(237,237,237,0.3)",
            }}
          >
            {Math.round(((idx + 1) / total) * 100)}%
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
              background: "#E8760A",
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
            color: "#ededed",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {question.label}
        </h2>

        {/* Answer input */}
        <div style={{ flex: 1 }}>
          {question.type === "dropdown" && (
            <select
              value={(currentAnswer as string) ?? ""}
              onChange={(e) => setAnswer(step, e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: currentAnswer ? "#ededed" : "rgba(237,237,237,0.35)",
                fontSize: "16px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                appearance: "none",
                WebkitAppearance: "none",
                cursor: "pointer",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              <option value="" disabled style={{ color: "#666", background: "#1a1a1a" }}>
                Select an option...
              </option>
              {question.options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  style={{ color: "#ededed", background: "#1a1a1a" }}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {question.type === "radio" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {question.options.map((opt) => {
                const selected = currentAnswer === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAnswer(step, opt.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      width: "100%",
                      minHeight: "56px",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      background: selected
                        ? "rgba(232,118,10,0.12)"
                        : "rgba(255,255,255,0.04)",
                      border: selected
                        ? "1.5px solid #E8760A"
                        : "1px solid rgba(255,255,255,0.08)",
                      color: selected ? "#ededed" : "rgba(237,237,237,0.7)",
                      fontSize: "15px",
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      fontWeight: selected ? 600 : 400,
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Radio dot */}
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: selected ? "5px solid #E8760A" : "2px solid rgba(255,255,255,0.2)",
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
          )}

          {question.type === "multiselect" && (
            <div>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(237,237,237,0.4)",
                  marginBottom: "12px",
                  margin: "0 0 12px",
                }}
              >
                Select all that apply
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                {question.options.map((opt) => {
                  const selected = Array.isArray(currentAnswer) && currentAnswer.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleMultiselect(step, opt.value)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "52px",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        background: selected ? "#E8760A" : "rgba(255,255,255,0.04)",
                        border: selected
                          ? "1.5px solid #E8760A"
                          : "1px solid rgba(255,255,255,0.08)",
                        color: selected ? "#fff" : "rgba(237,237,237,0.7)",
                        fontSize: "14px",
                        fontFamily: "var(--font-geist-sans), sans-serif",
                        fontWeight: selected ? 700 : 400,
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        boxSizing: "border-box",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            paddingTop: "8px",
          }}
        >
          {idx > 0 && (
            <button
              onClick={goBack}
              style={{
                minHeight: "52px",
                padding: "14px 20px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
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
          )}
          <button
            onClick={goNext}
            disabled={!currentAnswerIsValid()}
            style={{
              flex: 1,
              minHeight: "52px",
              padding: "14px 24px",
              borderRadius: "12px",
              background: currentAnswerIsValid() ? "#E8760A" : "rgba(255,255,255,0.06)",
              border: "none",
              color: currentAnswerIsValid() ? "#fff" : "rgba(237,237,237,0.25)",
              fontSize: "16px",
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontWeight: 700,
              cursor: currentAnswerIsValid() ? "pointer" : "not-allowed",
              transition: "all 0.15s ease",
              letterSpacing: "-0.01em",
            }}
          >
            {isLastStep ? "Submit →" : "Continue →"}
          </button>
        </div>
      </div>
    </main>
  );
}
