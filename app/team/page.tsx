"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const T = {
  bg: "#0a0a0a",
  accent: "#E8760A",
  text: "#ededed",
  muted: "rgba(237,237,237,0.5)",
  surface: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  maxWidth: "480px",
} as const;

const BANK_OPTIONS = [
  "Maybank", "CIMB Bank", "Public Bank", "RHB Bank", "Hong Leong Bank",
  "AmBank", "Bank Islam", "BSN", "Bank Rakyat", "OCBC Bank", "HSBC",
  "Standard Chartered", "UOB", "Affin Bank", "Alliance Bank",
  "Bank Muamalat", "MBSB Bank", "Agrobank", "Citibank", "Other",
];

interface TeamAnswers {
  name: string;
  phone: string;
  email: string;
  domain: string;
  telegram_username: string;
  telegram_id: string;
  instagram_url: string;
  github_username: string;
  portfolio_url: string;
  company_name: string;
  bank_holder_name: string;
  bank_name: string;
  bank_name_other: string;
  bank_account_number: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: T.text,
  fontSize: "16px",
  fontFamily: "var(--font-geist-sans), sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

function emailValid(e: string) {
  const v = e.trim();
  const at = v.indexOf("@");
  return at > 0 && v.indexOf(".", at + 2) > at + 2;
}
function phoneValid(p: string) {
  const d = p.replace(/[^0-9]/g, "");
  return d.length >= 8 && d.length <= 13;
}

export default function TeamPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [a, setA] = useState<TeamAnswers>({
    name: "", phone: "", email: "", domain: "",
    telegram_username: "", telegram_id: "", instagram_url: "",
    github_username: "", portfolio_url: "", company_name: "",
    bank_holder_name: "", bank_name: "", bank_name_other: "",
    bank_account_number: "",
  });

  const set = (k: keyof TeamAnswers, v: string) => setA((p) => ({ ...p, [k]: v }));

  const valid =
    a.name.trim().length > 0 &&
    phoneValid(a.phone) &&
    emailValid(a.email) &&
    a.domain.trim().length > 0 &&
    a.telegram_username.trim().length > 0 &&
    a.telegram_id.trim().length > 0 &&
    a.bank_holder_name.trim().length > 0 &&
    a.bank_name.length > 0 &&
    (a.bank_name !== "Other" || a.bank_name_other.trim().length > 0) &&
    a.bank_account_number.replace(/[^0-9]/g, "").length >= 6;

  async function handleSubmit() {
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, user_agent: navigator.userAgent }),
      });
      if (!res.ok) { alert("Something went wrong. Please try again."); setSubmitting(false); return; }
      router.push("/team/thank-you");
    } catch {
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const Label = ({ children, optional }: { children: React.ReactNode; optional?: boolean }) => (
    <label style={{ display: "block", color: T.text, fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
      {children}{optional && <span style={{ color: T.muted, fontWeight: 400 }}> (optional)</span>}
    </label>
  );
  const Section = ({ title }: { title: string }) => (
    <div style={{
      color: T.accent, fontSize: "12px", fontWeight: 700, letterSpacing: "2px",
      textTransform: "uppercase", margin: "28px 0 14px",
    }}>{title}</div>
  );
  const Field = ({ children }: { children: React.ReactNode }) => (
    <div style={{ marginBottom: "16px" }}>{children}</div>
  );

  return (
    <main style={{
      minHeight: "100svh", background: T.bg, color: T.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 20px 64px",
    }}>
      <div style={{ width: "100%", maxWidth: T.maxWidth }}>
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div style={{ fontSize: "44px", marginBottom: "12px" }}>🇲🇾</div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            Claude Malaysia — Team Details
          </h1>
          <p style={{ color: T.muted, fontSize: "14px", margin: 0, lineHeight: 1.5 }}>
            Fill this once so we can reach you, share files, and pay you smoothly.
          </p>
        </div>

        <Section title="Contact" />
        <Field>
          <Label>Full name</Label>
          <input style={inputStyle} value={a.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" />
        </Field>
        <Field>
          <Label>WhatsApp number</Label>
          <input style={inputStyle} inputMode="numeric" value={a.phone}
            onChange={(e) => set("phone", e.target.value)} placeholder="e.g. 60123456789" />
          {a.phone.length > 0 && !phoneValid(a.phone) && (
            <p style={{ color: "#ff6b6b", fontSize: "13px", margin: "6px 0 0" }}>Include country code (8–13 digits)</p>
          )}
        </Field>
        <Field>
          <Label>Email (Gmail / Google Workspace)</Label>
          <input style={inputStyle} type="email" value={a.email}
            onChange={(e) => set("email", e.target.value)} placeholder="you@gmail.com" />
          <p style={{ color: T.muted, fontSize: "12px", margin: "6px 0 0" }}>
            Use a Google-compatible email — we&apos;ll share Drive files &amp; folders with you here.
          </p>
          {a.email.length > 0 && !emailValid(a.email) && (
            <p style={{ color: "#ff6b6b", fontSize: "13px", margin: "6px 0 0" }}>Enter a valid email (e.g. you@gmail.com)</p>
          )}
        </Field>

        <Section title="Your Superpower" />
        <Field>
          <Label>What&apos;s your domain of expertise?</Label>
          <input style={inputStyle} value={a.domain} onChange={(e) => set("domain", e.target.value)}
            placeholder="e.g. Sales, Marketing, Content, Design, Dev, Finance, HR..." />
        </Field>

        <Section title="Handles" />
        <Field>
          <Label>Telegram username</Label>
          <input style={inputStyle} value={a.telegram_username}
            onChange={(e) => set("telegram_username", e.target.value)} placeholder="@yourhandle" />
        </Field>
        <Field>
          <Label>Telegram numeric ID</Label>
          <input style={inputStyle} inputMode="numeric" value={a.telegram_id}
            onChange={(e) => set("telegram_id", e.target.value)} placeholder="e.g. 472281887" />
          <p style={{ color: T.muted, fontSize: "12px", margin: "6px 0 0" }}>
            DM <strong>@userinfobot</strong> on Telegram → it replies with your numeric ID.
          </p>
        </Field>
        <Field>
          <Label optional>Instagram URL</Label>
          <input style={inputStyle} value={a.instagram_url}
            onChange={(e) => set("instagram_url", e.target.value)} placeholder="instagram.com/you" />
        </Field>
        <Field>
          <Label optional>GitHub username</Label>
          <input style={inputStyle} value={a.github_username}
            onChange={(e) => set("github_username", e.target.value)} placeholder="your-github" />
        </Field>
        <Field>
          <Label optional>Portfolio URL</Label>
          <input style={inputStyle} value={a.portfolio_url}
            onChange={(e) => set("portfolio_url", e.target.value)} placeholder="https://..." />
        </Field>
        <Field>
          <Label optional>Company name</Label>
          <input style={inputStyle} value={a.company_name}
            onChange={(e) => set("company_name", e.target.value)} placeholder="Your company (if any)" />
        </Field>

        <Section title="Payout Details 🔒" />
        <p style={{ color: T.muted, fontSize: "12px", margin: "-6px 0 14px", lineHeight: 1.5 }}>
          Private &amp; secure — only the admin can see this. Used to pay you.
        </p>
        <Field>
          <Label>Account holder name</Label>
          <input style={inputStyle} value={a.bank_holder_name}
            onChange={(e) => set("bank_holder_name", e.target.value)} placeholder="Exactly as per bank account" />
        </Field>
        <Field>
          <Label>Bank</Label>
          <select style={{ ...inputStyle, cursor: "pointer", appearance: "none" }} value={a.bank_name}
            onChange={(e) => set("bank_name", e.target.value)}>
            <option value="" style={{ background: "#1a1a1a" }}>Select your bank</option>
            {BANK_OPTIONS.map((b) => (
              <option key={b} value={b} style={{ background: "#1a1a1a" }}>{b}</option>
            ))}
          </select>
        </Field>
        {a.bank_name === "Other" && (
          <Field>
            <Label>Bank name (other)</Label>
            <input style={inputStyle} value={a.bank_name_other}
              onChange={(e) => set("bank_name_other", e.target.value)} placeholder="Type your bank name" />
          </Field>
        )}
        <Field>
          <Label>Account number</Label>
          <input style={inputStyle} inputMode="numeric" value={a.bank_account_number}
            onChange={(e) => set("bank_account_number", e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="Account number" />
        </Field>

        <button
          onClick={handleSubmit}
          disabled={!valid || submitting}
          style={{
            width: "100%", padding: "16px", marginTop: "20px",
            borderRadius: "12px", border: "none",
            background: valid && !submitting ? T.accent : "rgba(255,255,255,0.06)",
            color: valid && !submitting ? "#fff" : T.muted,
            fontSize: "16px", fontWeight: 700,
            cursor: valid && !submitting ? "pointer" : "not-allowed",
            boxShadow: valid && !submitting ? "0 0 28px rgba(232,118,10,0.25)" : "none",
          }}
        >
          {submitting ? "Saving..." : "Submit My Details →"}
        </button>
      </div>
    </main>
  );
}
