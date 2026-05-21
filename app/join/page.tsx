"use client";

import { useState, useEffect } from "react";
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
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

// ─── Step definitions ─────────────────────────────────────────────────────────
type StepKey = '1'|'2'|'3'|'city'|'4'|'ai_level'|'4a'|'4b'|'4c'|'5'|'6'|'7'|'8'|'9'|'10'|'source'

function getVisibleSteps(role: string): StepKey[] {
  const base: StepKey[] = ['1','2','3','city','4','ai_level']
  if (role === 'business_owner' || role === 'freelancer') {
    base.push('4a', '4b')
  }
  if (role === 'marketing_agency') {
    base.push('4c')
  }
  base.push('5','6','7','8','9','10','source')
  return base
}

const CITY_OPTIONS = [
  { value: 'kl', label: 'Kuala Lumpur' },
  { value: 'selangor', label: 'Selangor' },
  { value: 'penang', label: 'Penang' },
  { value: 'johor', label: 'Johor Bahru' },
  { value: 'sabah_sarawak', label: 'Sabah / Sarawak' },
  { value: 'others_city', label: 'Others' },
]

const AI_LEVEL_OPTIONS = [
  { value: 'never', label: '🔰 Never used Claude yet' },
  { value: 'free', label: '🆓 Free plan (claude.ai)' },
  { value: 'pro', label: '⚡ Pro Plan ($17/mo)' },
  { value: 'max', label: '🚀 Max Plan' },
]

const HEARD_FROM_OPTIONS = [
  { value: 'instagram', label: 'Instagram / TikTok' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'friend', label: 'Friend / Colleague' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'google', label: 'Google / Search' },
  { value: 'others_source', label: 'Others' },
]

const INDUSTRY_OPTIONS = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'property', label: 'Property / Real Estate' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'saas', label: 'SaaS / Software' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'fnb', label: 'F&B' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing / Media' },
  { value: 'others', label: 'Others' },
]

const AGENCY_CLIENT_FOCUS_OPTIONS = [
  { value: 'fnb', label: 'F&B / Restaurant' },
  { value: 'property', label: 'Property / Real Estate' },
  { value: 'ecommerce', label: 'E-commerce / Retail' },
  { value: 'healthcare', label: 'Healthcare / Medical' },
  { value: 'education', label: 'Education / Training' },
  { value: 'finance', label: 'Finance / Insurance' },
  { value: 'tech', label: 'Tech / SaaS' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'sme', label: 'SMEs (any industry)' },
  { value: 'corporate', label: 'Corporate / Enterprise' },
  { value: 'others', label: 'Others' },
]

const CLIENT_TYPE_OPTIONS = [
  { value: 'b2b', label: 'B2B — I sell to businesses' },
  { value: 'b2c', label: 'B2C — I sell to consumers' },
  { value: 'both', label: 'Both' },
]

const ROLE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "business_owner", label: "Business Owner" },
  { value: "employee", label: "Employee / Office Worker" },
  { value: "developer", label: "Developer" },
  { value: "freelancer", label: "Freelancer" },
  { value: "creator", label: "Content Creator" },
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
  { value: "b2b_clients", label: "Get more B2B clients (businesses, agencies, corporate)" },
  { value: "b2c_customers", label: "Get more B2C customers (consumers, retail, direct-to-public)" },
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
  { value: "online", label: "Online events & workshops (Zoom)" },
  { value: "offline_kl", label: "Offline events & workshops (KL)" },
];

const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: "📸" },
  { value: "youtube",   label: "YouTube",   icon: "▶️" },
  { value: "tiktok",    label: "TikTok",    icon: "🎵" },
  { value: "facebook",  label: "Facebook",  icon: "👤" },
  { value: "website",   label: "Website",   icon: "🌐" },
];

// ─── State type ───────────────────────────────────────────────────────────────
interface JoinAnswers {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  ai_level: string;
  industry: string;
  client_type: string;
  team_size: string;
  ai_use_cases: string[];
  ai_use_cases_other: string;
  pain_point: string;
  community_value: string[];
  event_preference: string[];
  social_link: string;
  social_platform: string;
  heard_from: string;
  agency_client_focus: string[];
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
  const [step, setStep] = useState<StepKey | null>(null); // null = landing
  const [alreadyJoined] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("claude_malaysia_joined") === "1"
  );
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return ''
    const stored = sessionStorage.getItem('cm_session_id')
    if (stored) return stored
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem('cm_session_id', id)
    return id
  })
  const [ref] = useState(() =>
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('ref') ?? ''
      : ''
  )
  const [answers, setAnswers] = useState<JoinAnswers>({
    name: "",
    email: "",
    phone: "",
    city: "",
    role: "",
    ai_level: "",
    industry: "",
    client_type: "",
    team_size: "",
    ai_use_cases: [],
    ai_use_cases_other: "",
    pain_point: "",
    community_value: [],
    event_preference: [],
    social_link: "",
    social_platform: "",
    heard_from: "",
    agency_client_focus: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // ─── Drop-off tracking ───────────────────────────────────────────────────────
  function track(stepKey: string, eventType: 'enter' | 'complete' | 'abandoned') {
    if (!sessionId) return
    fetch('/api/join/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, step: stepKey, event_type: eventType, referrer: ref || null }),
    }).catch(() => {})
  }

  useEffect(() => {
    const handleUnload = () => {
      if (step !== null && !submitting) {
        navigator.sendBeacon('/api/join/track', JSON.stringify({
          session_id: sessionId,
          step: step ?? 'landing',
          event_type: 'abandoned',
          referrer: ref || null,
        }))
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [step, sessionId, submitting])

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const visibleSteps = getVisibleSteps(answers.role)
  const currentIndex = step ? visibleSteps.indexOf(step) : -1

  function goNext() {
    if (step === null) { setDirection("forward"); setStep(visibleSteps[0]); track(visibleSteps[0], 'enter'); return }
    if (currentIndex < visibleSteps.length - 1) {
      setDirection("forward")
      setStep(visibleSteps[currentIndex + 1])
      track(visibleSteps[currentIndex + 1], 'enter')
    } else {
      handleSubmit()
    }
  }

  function goBack() {
    setDirection("back")
    if (step === null) return
    if (currentIndex > 0) setStep(visibleSteps[currentIndex - 1])
    else setStep(null)
  }

  // ─── Validation ──────────────────────────────────────────────────────────────
  function isStepValid(s: StepKey | null): boolean {
    if (!s) return false
    if (s === '1') return answers.name.trim().length > 0
    if (s === '2') { const e = answers.email.trim(); const at = e.indexOf('@'); return at > 0 && (e.includes('.com') || e.includes('.my') || e.includes('.net') || e.includes('.io') || e.includes('.org') || e.includes('.co')) }
    if (s === '3') { const d = answers.phone.replace(/[^0-9]/g,''); return d.length >= 8 && d.length <= 13 }
    if (s === 'city') return answers.city.length > 0
    if (s === '4') return answers.role.length > 0
    if (s === 'ai_level') return answers.ai_level.length > 0
    if (s === '4a') return answers.industry.length > 0
    if (s === '4b') return answers.client_type.length > 0
    if (s === '5') return answers.team_size.length > 0
    if (s === '6') return answers.ai_use_cases.length > 0
    if (s === '7') return answers.pain_point.trim().length > 0
    if (s === '8') return answers.community_value.length > 0
    if (s === '9') return answers.event_preference.length > 0
    if (s === '4c') return answers.agency_client_focus.length > 0
    if (s === '10') return answers.social_platform.length > 0 && answers.social_link.trim().length > 0
    if (s === 'source') return answers.heard_from.length > 0
    return false
  }

  // ─── Submission ──────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitting(true);
    try {
      const socialLinkCombined =
        answers.social_platform && answers.social_link
          ? `${answers.social_platform}: ${answers.social_link}`
          : answers.social_link || answers.social_platform || "";

      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          social_link: socialLinkCombined,
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
      if (json.founding_member_number) {
        sessionStorage.setItem("cm_founding_number", String(json.founding_member_number));
      }
      localStorage.setItem("claude_malaysia_joined", "1");
      track('complete', 'complete')
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

  // ─── Already joined screen ───────────────────────────────────────────────────
  if (alreadyJoined) {
    return (
      <main style={{ ...pageStyle, justifyContent: "center", alignItems: "center" }}>
        <style>{ANIMATION_CSS}</style>
        <div style={{ maxWidth: "480px", width: "100%", textAlign: "center", padding: "0 20px" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>🇲🇾</div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#ededed", margin: "0 0 8px" }}>
            You&apos;re already a member!
          </h1>
          <p style={{ color: "rgba(237,237,237,0.5)", fontSize: "15px", margin: "0 0 28px" }}>
            Thanks for joining Claude Malaysia.
          </p>
          <a
            href="https://chat.whatsapp.com/EcQP4EzOFSwLWfv8uFirsm?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", width: "100%", padding: "16px",
              backgroundColor: "#25D366", color: "#000",
              textDecoration: "none", fontSize: "16px", fontWeight: 700,
              borderRadius: "12px", boxSizing: "border-box", marginBottom: "12px",
            }}
          >
            Join the WhatsApp Group →
          </a>
          <button
            onClick={() => { localStorage.removeItem("claude_malaysia_joined"); window.location.reload(); }}
            style={{
              background: "none", border: "none", color: "rgba(237,237,237,0.3)",
              fontSize: "13px", cursor: "pointer", textDecoration: "underline",
            }}
          >
            Not you? Fill in again
          </button>
        </div>
      </main>
    );
  }

  // ─── Landing screen ──────────────────────────────────────────────────────────
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
          {/* Radial glow behind flag */}
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
          <div style={{ textAlign: "center", position: "relative" }}>
            {/* Flag */}
            <div
              style={{
                fontSize: "60px",
                marginBottom: "16px",
                animation: "fadeIn 0.6s ease both",
              }}
            >
              🇲🇾
            </div>

            {/* Small caps label */}
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "rgba(232,118,10,0.75)",
                margin: "0 0 10px",
                fontVariant: "small-caps",
              }}
            >
              Claude Malaysia
            </p>

            {/* Main heading */}
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
              Join the AI Community
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "16px",
                color: T.muted,
                lineHeight: 1.6,
                margin: 0,
                maxWidth: "380px",
                marginInline: "auto",
              }}
            >
              {"Malaysia's fastest-growing community of developers, founders, and marketers building real businesses with AI."}
            </p>
          </div>

          {/* Benefits card */}
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: "14px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {[
              "Monthly workshops — online (Zoom) + offline in KL",
              "Network with 100+ developers, founders & marketers",
              "Get your free personalised AI action plan",
              "First access to AI tools, events & opportunities in Malaysia",
            ].map((benefit) => (
              <div
                key={benefit}
                style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
              >
                <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>
                  ✅
                </span>
                <span
                  style={{
                    fontSize: "15px",
                    color: "rgba(237,237,237,0.8)",
                    lineHeight: 1.5,
                  }}
                >
                  {benefit}
                </span>
              </div>
            ))}
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
            Join Now — It&apos;s Free →
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "rgba(237,237,237,0.35)",
              margin: "-12px 0 0",
            }}
          >
            Takes 2 mins · 100% free
          </p>
        </div>
      </main>
    );
  }

  // ─── Question wizard ─────────────────────────────────────────────────────────
  const progressPct = step ? ((currentIndex + 1) / visibleSteps.length) * 100 : 0
  const progressLabel = step ? `Step ${currentIndex + 1} of ${visibleSteps.length}` : ''
  const progressWidth = `${progressPct}%`;
  const animationName =
    direction === "forward" ? "slideInFromRight" : "slideInFromLeft";
  const isLastStep = step !== null && currentIndex === visibleSteps.length - 1;
  const valid = isStepValid(step);

  // ─── Step question helpers ────────────────────────────────────────────────────
  function getQuestion(s: StepKey): string {
    switch (s) {
      case '1': return "What's your name?";
      case '2': return "What's your email address?";
      case '3': return "What's your WhatsApp number?";
      case 'city': return "Which city are you based in?";
      case '4': return "What's your role?";
      case 'ai_level': return "Which Claude plan do you use?";
      case '4a': return "What industry are you in?";
      case '4b': return "Who are your main clients?";
      case '4c': return "What industries do your clients come from?";
      case '5': return "How big is your team?";
      case '6': return "What do you feel AI can help you with, but haven't explored yet?";
      case '7': return "What is your biggest pain point in your life or business right now?";
      case '8': return "What value can you bring to the Claude Malaysia community?";
      case '9': return "Notify me about:";
      case '10': return "Your social media";
      case 'source': return "How did you hear about Claude Malaysia?";
      default: return "";
    }
  }

  // ─── Social link placeholder by platform ─────────────────────────────────────
  function getSocialPlaceholder(platform: string): string {
    switch (platform) {
      case "instagram": return "@yourhandle or instagram.com/you";
      case "youtube":   return "youtube.com/channel or @handle";
      case "tiktok":    return "@yourhandle or tiktok.com/@you";
      case "facebook":  return "facebook.com/yourpage";
      case "website":   return "https://yourwebsite.com";
      default:          return "Your link or handle";
    }
  }

  // ─── Render input for current step ───────────────────────────────────────────
  function renderInput() {
    // Steps 1–3: text inputs
    if (step === '1') {
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

    if (step === '2') {
      return (
        <div>
          <input
            type="email"
            autoFocus
            value={answers.email}
            onChange={(e) => setAnswers((p) => ({ ...p, email: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && valid && goNext()}
            placeholder="you@example.com"
            style={textInputStyle}
          />
          {answers.email.length > 0 && !isStepValid('2') && (
            <p style={{ color: "#ff6b6b", fontSize: "13px", margin: "8px 0 0" }}>
              Please enter a valid email — e.g. you@gmail.com or you@company.com.my
            </p>
          )}
        </div>
      );
    }

    if (step === '3') {
      const phoneDigits = answers.phone.replace(/[^0-9]/g, "");
      return (
        <div>
          <input
            type="tel"
            autoFocus
            value={answers.phone}
            onChange={(e) => setAnswers((p) => ({ ...p, phone: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && valid && goNext()}
            placeholder="e.g. 60123456789 or 6588XXXXXX"
            style={textInputStyle}
          />
          {answers.phone.length > 0 &&
            phoneDigits.length > 0 &&
            !(phoneDigits.length >= 8 && phoneDigits.length <= 13) && (
              <p style={{ color: "#ff6b6b", fontSize: "13px", margin: "8px 0 0" }}>
                Please include your country code (e.g. 60123456789 for MY, 6588XXXXXX for SG)
              </p>
            )}
        </div>
      );
    }

    // City step: radio buttons with auto-advance
    if (step === 'city') {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {CITY_OPTIONS.map((opt) => {
            const selected = answers.city === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setAnswers((p) => ({ ...p, city: opt.value }))
                  setTimeout(() => goNext(), 300)
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

    // Step 4: role radio
    if (step === '4') {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {ROLE_OPTIONS.map((opt) => {
            const selected = answers.role === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setAnswers((p) => ({ ...p, role: opt.value }))
                  setTimeout(() => goNext(), 300)
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

    // AI level step: radio buttons with auto-advance
    if (step === 'ai_level') {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {AI_LEVEL_OPTIONS.map((opt) => {
            const selected = answers.ai_level === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setAnswers((p) => ({ ...p, ai_level: opt.value }))
                  setTimeout(() => goNext(), 300)
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

    // Step 4a: industry text input (business_owner only)
    if (step === '4a') {
      return (
        <input
          type="text"
          autoFocus
          value={answers.industry}
          onChange={(e) => setAnswers((p) => ({ ...p, industry: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && isStepValid(step) && goNext()}
          placeholder="e.g. Insurance, Manufacturing, SaaS..."
          style={textInputStyle}
        />
      );
    }

    // Step 4b: client type radio (business_owner only)
    if (step === '4b') {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {CLIENT_TYPE_OPTIONS.map((opt) => {
            const selected = answers.client_type === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setAnswers((p) => ({ ...p, client_type: opt.value }))
                  setTimeout(() => goNext(), 300)
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

    // Step 4c: agency client focus (marketing_agency only) — multi-select
    if (step === '4c') {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ color: T.muted, fontSize: "13px", margin: "0 0 4px" }}>
            Select all that apply
          </p>
          {AGENCY_CLIENT_FOCUS_OPTIONS.map((opt) => {
            const selected = answers.agency_client_focus.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => {
                  const current = answers.agency_client_focus;
                  const updated = current.includes(opt.value)
                    ? current.filter((v) => v !== opt.value)
                    : [...current, opt.value];
                  setAnswers((p) => ({ ...p, agency_client_focus: updated }));
                }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  width: "100%", minHeight: "48px", padding: "12px 16px",
                  borderRadius: "12px",
                  background: selected ? "rgba(232,118,10,0.12)" : T.surface,
                  border: selected ? "1.5px solid #E8760A" : `1px solid ${T.border}`,
                  color: selected ? T.text : "rgba(237,237,237,0.7)",
                  fontSize: "15px", fontFamily: "var(--font-geist-sans), sans-serif",
                  fontWeight: selected ? 600 : 400, textAlign: "left",
                  cursor: "pointer", transition: "all 0.15s ease", boxSizing: "border-box",
                }}
              >
                <span style={{
                  width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0,
                  border: selected ? "none" : "2px solid rgba(255,255,255,0.2)",
                  background: selected ? "#E8760A" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s ease", boxSizing: "border-box",
                }}>
                  {selected && <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700 }}>✓</span>}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    // Step 5: team size radio
    if (step === '5') {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {TEAM_SIZE_OPTIONS.map((opt) => {
            const selected = answers.team_size === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setAnswers((p) => ({ ...p, team_size: opt.value }))
                  setTimeout(() => goNext(), 300)
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
    if (step === '6') {
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
    if (step === '7') {
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
    if (step === '8') {
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
    if (step === '9') {
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

    // Step 10: social platform chips + conditional link input (optional)
    if (step === '10') {
      return (
        <div>
          {/* Platform chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: answers.social_platform ? "16px" : "0",
            }}
          >
            {SOCIAL_PLATFORMS.map((platform) => {
              const selected = answers.social_platform === platform.value;
              return (
                <button
                  key={platform.value}
                  onClick={() =>
                    setAnswers((p) => ({
                      ...p,
                      social_platform:
                        p.social_platform === platform.value
                          ? ""
                          : platform.value,
                      social_link: p.social_platform === platform.value ? p.social_link : "",
                    }))
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "999px",
                    background: selected
                      ? "rgba(232,118,10,0.15)"
                      : T.surface,
                    border: selected
                      ? "1.5px solid #E8760A"
                      : `1px solid ${T.border}`,
                    color: selected ? T.text : "rgba(237,237,237,0.6)",
                    fontSize: "14px",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontWeight: selected ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{platform.icon}</span>
                  <span>{platform.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conditional link input */}
          {answers.social_platform && (
            <input
              type="text"
              autoFocus
              value={answers.social_link}
              onChange={(e) =>
                setAnswers((p) => ({ ...p, social_link: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && goNext()}
              placeholder={getSocialPlaceholder(answers.social_platform)}
              style={textInputStyle}
            />
          )}
        </div>
      );
    }

    // Source step: radio buttons with auto-advance
    if (step === 'source') {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {HEARD_FROM_OPTIONS.map((opt) => {
            const selected = answers.heard_from === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setAnswers((p) => ({ ...p, heard_from: opt.value }))
                  setTimeout(() => goNext(), 300)
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
            {progressLabel}
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(237,237,237,0.3)",
            }}
          >
            {Math.round(progressPct)}%
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
          {step ? getQuestion(step) : ""}
        </h2>

        {/* Subtitles for conditional steps */}
        {step === '4a' && (
          <p style={{ fontSize: "13px", color: T.muted, margin: "-16px 0 0" }}>
            Helps us match you with the right people and workshops
          </p>
        )}
        {step === '4b' && (
          <p style={{ fontSize: "13px", color: T.muted, margin: "-16px 0 0" }}>
            {"We'll tailor your AI recommendations based on this"}
          </p>
        )}
        {step === 'ai_level' && (
          <p style={{ fontSize: "13px", color: T.muted, margin: "-16px 0 0" }}>
            Helps us tailor workshops to your level
          </p>
        )}

        {/* Required note for step 10 */}
        {step === '10' && (
          <p style={{ fontSize: "13px", color: T.muted, margin: "-16px 0 0" }}>
            Share your most active platform
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
              disabled={!valid || submitting}
              style={{
                flex: 1,
                minHeight: "52px",
                padding: "14px 24px",
                borderRadius: "12px",
                background: valid && !submitting ? T.accent : "rgba(255,255,255,0.06)",
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
        </div>
      </div>
    </main>
  );
}
