'use client'

import { useState } from 'react'

// The event team's WhatsApp — the "register" handoff. +60 10-209 9299 → 60102099299.
const WA_TEXT = "Hi! I'm a founder and I want to register for the Koochester Founder's Run 🏃 (via Claude Malaysia)"
const WA_LINK = `https://wa.me/60102099299?text=${encodeURIComponent(WA_TEXT)}`

const TEAM_SIZES = ['10–20', '20–30', '30–50', '50–100', '100–200']
const INDUSTRIES = [
  'F&B / Restaurants', 'Retail / E-commerce', 'Professional Services', 'Property / Construction',
  'Marketing / Agency', 'Technology / SaaS', 'Finance / Insurance', 'Health / Wellness',
  'Education / Training', 'Manufacturing', 'Logistics', 'Consulting',
]

type Status = 'form' | 'loading' | 'done'

export default function KoochesterFoundersRun() {
  const [status, setStatus] = useState<Status>('form')
  const [error, setError] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isFounder, setIsFounder] = useState<boolean>(true)
  const [position, setPosition] = useState('')
  const [company, setCompany] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [industry, setIndustry] = useState('')
  const [challenge, setChallenge] = useState('')
  const [dream, setDream] = useState('')
  const [website, setWebsite] = useState('') // honeypot

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !email.trim() || !phone.trim() || !challenge.trim() || !dream.trim()) {
      setError('Please fill in your name, email, phone, and the two questions at the bottom.')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/public/koochester-founders-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone,
          is_founder: isFounder,
          position: isFounder ? '' : position,
          company_name: company,
          team_size: teamSize,
          industry,
          biggest_challenge: challenge,
          ai_dream: dream,
          website,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Something went wrong — please try again.')
        setStatus('form')
        return
      }
      setRecommendation(data.recommendation || null)
      setStatus('done')
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('Network error — please try again.')
      setStatus('form')
    }
  }

  return (
    <main className="kfr">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {status === 'done' ? (
        <Success recommendation={recommendation} firstName={name.trim().split(/\s+/)[0]} />
      ) : (
        <>
          {/* ═══ HERO ═══ */}
          <header className="kfr-hero">
            <p className="kfr-eyebrow">Claude Malaysia&nbsp;×&nbsp;Koochester</p>
            <h1 className="kfr-h1">The Founder&rsquo;s <em>Run</em>.</h1>
            <p className="kfr-lead">
              A curated morning run for <b>300 Malaysian founders</b> — meet, learn and make real
              friends the healthy way. Then get your personalised AI game plan with Claude Malaysia.
            </p>
            <div className="kfr-chips">
              <span className="kfr-chip">16 Aug 2026 · 7:00 AM</span>
              <span className="kfr-chip">KLCC Park, KL</span>
              <span className="kfr-chip">300 founders · RM149</span>
            </div>
            <a href="#register" className="kfr-btn kfr-btn--primary kfr-hero-cta">Register for the run →</a>
          </header>

          {/* ═══ POSTERS ═══ */}
          <section className="kfr-posters">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/koochester/poster-1.jpg" alt="Koochester Founder's Run poster" width={1080} height={1080} loading="eager" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/koochester/poster-2.jpg" alt="Koochester Founder's Run — details" width={1080} height={1080} loading="lazy" />
          </section>

          {/* ═══ WHO'S COMING ═══ */}
          <section className="kfr-section">
            <p className="kfr-eyebrow kfr-eyebrow--center">Who&rsquo;s in the room</p>
            <h2 className="kfr-h2">Run beside the people building Malaysia.</h2>
            <p className="kfr-body">
              300 founders, one curated morning. Expect a room that&rsquo;s included names like
              Bryan&nbsp;Loo (Tealive), Harith&nbsp;Iskander, Dr&nbsp;Ong&nbsp;Kian&nbsp;Ming,
              Chen&nbsp;Chow, Jeff&nbsp;Leong and more. Finish the run, then unlock the mystery
              networking afterparty. Limited slots — founders only.
            </p>
            <p className="kfr-why">
              <b>Why the survey?</b> You run with founders in the morning; we hand you a concrete
              first move with AI in the afternoon. Two minutes below → your personalised game plan.
            </p>
          </section>

          {/* ═══ REGISTER / SURVEY ═══ */}
          <section id="register" className="kfr-form-wrap">
            <div className="kfr-form-card">
              <p className="kfr-eyebrow">Register</p>
              <h2 className="kfr-h2 kfr-form-title">Claim your spot.</h2>
              <p className="kfr-form-sub">Founders only. Takes ~2 minutes — you&rsquo;ll get a personalised AI recommendation at the end.</p>

              <form onSubmit={handleSubmit} className="kfr-form" noValidate>
                <Field label="Full name" required>
                  <input className="kfr-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
                </Field>

                <div className="kfr-row">
                  <Field label="Email" required>
                    <input className="kfr-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
                  </Field>
                  <Field label="WhatsApp / phone" required>
                    <input className="kfr-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 012 345 6789" autoComplete="tel" />
                  </Field>
                </div>

                <Field label="Are you the founder?">
                  <div className="kfr-toggle">
                    <button type="button" className={`kfr-toggle-btn ${isFounder ? 'is-on' : ''}`} onClick={() => setIsFounder(true)}>Yes, I&rsquo;m the founder</button>
                    <button type="button" className={`kfr-toggle-btn ${!isFounder ? 'is-on' : ''}`} onClick={() => setIsFounder(false)}>No, I&rsquo;m on the team</button>
                  </div>
                </Field>

                {!isFounder && (
                  <Field label="Your role">
                    <input className="kfr-input" value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g. Head of Ops" />
                  </Field>
                )}

                <div className="kfr-row">
                  <Field label="Company name">
                    <input className="kfr-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company" autoComplete="organization" />
                  </Field>
                  <Field label="Industry">
                    <input className="kfr-input" list="kfr-industries" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Start typing…" />
                    <datalist id="kfr-industries">{INDUSTRIES.map(i => <option key={i} value={i} />)}</datalist>
                  </Field>
                </div>

                <Field label="Team size">
                  <div className="kfr-pills">
                    {TEAM_SIZES.map(s => (
                      <button key={s} type="button" className={`kfr-pill ${teamSize === s ? 'is-on' : ''}`} onClick={() => setTeamSize(s)}>{s}</button>
                    ))}
                  </div>
                </Field>

                <Field label="What's your biggest challenge in growing your business right now?" required>
                  <textarea className="kfr-input kfr-textarea" value={challenge} onChange={e => setChallenge(e.target.value)} rows={3} maxLength={3000} placeholder="Be specific — this shapes your recommendation." />
                </Field>

                <Field label="What does a dream 10-out-of-10 look like with AI?" required>
                  <textarea className="kfr-input kfr-textarea" value={dream} onChange={e => setDream(e.target.value)} rows={3} maxLength={3000} placeholder="If AI worked perfectly for your business — what would it do?" />
                </Field>

                {/* honeypot — hidden from humans */}
                <input className="kfr-hp" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} aria-hidden="true" />

                {error && <p className="kfr-error">{error}</p>}

                <button type="submit" className="kfr-btn kfr-btn--primary kfr-submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Building your AI game plan…' : 'Get my AI game plan →'}
                </button>
                <p className="kfr-fineprint">Founders only · your details go straight to the run team.</p>
              </form>
            </div>
          </section>

          <footer className="kfr-footer">
            <p>Koochester Founder&rsquo;s Run · in collaboration with <b>Claude Malaysia</b></p>
          </footer>
        </>
      )}
    </main>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="kfr-field">
      <span className="kfr-label">{label}{required && <i className="kfr-req">*</i>}</span>
      {children}
    </label>
  )
}

function Success({ recommendation, firstName }: { recommendation: string | null; firstName: string }) {
  return (
    <section className="kfr-success">
      <div className="kfr-success-card">
        <div className="kfr-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <p className="kfr-eyebrow kfr-eyebrow--center">You&rsquo;re on the list{firstName ? `, ${firstName}` : ''}</p>
        <h1 className="kfr-h1 kfr-success-h1">One last step — <em>message the team</em>.</h1>

        {recommendation && (
          <div className="kfr-rec">
            <p className="kfr-rec-label">Your personalised AI game plan</p>
            <p className="kfr-rec-body">{recommendation}</p>
          </div>
        )}

        <p className="kfr-body kfr-success-body">
          Tap below to confirm your spot with the run team on WhatsApp — that locks in your
          registration for the Koochester Founder&rsquo;s Run.
        </p>

        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="kfr-btn kfr-btn--wa">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.15-1.77-.87-2-.97-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.63.07-.3-.15-1.26-.46-2.4-1.48-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.14.3-.34.44-.5.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.4A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.16l-.3-.18-2.85.83.76-2.78-.2-.32A8.2 8.2 0 1 1 12 20.2z" /></svg>
          WhatsApp our team now
        </a>
        <p className="kfr-fineprint">Opens WhatsApp to the run team · +60 10-209 9299</p>
      </div>
    </section>
  )
}

const CSS = `
.kfr{
  --paper:#FAF7F2; --paper-2:#F2EBDF; --card:#FFFDF9; --ink:#211C16; --ink-soft:#5F564B; --ink-faint:#978C7B;
  --clay:#D97757; --clay-deep:#BE5C3B; --clay-tint:rgba(217,119,87,.12); --clay-tint-2:rgba(217,119,87,.20);
  --line:rgba(33,28,22,.10); --line-2:rgba(33,28,22,.18);
  --sans:var(--font-hanken),-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  --serif:var(--font-fraunces),Georgia,'Times New Roman',serif;
  --mono:var(--font-mono),ui-monospace,SFMono-Regular,Menlo,monospace;
  background:var(--paper); color:var(--ink); font-family:var(--sans);
  min-height:100vh; -webkit-font-smoothing:antialiased;
  background-image:radial-gradient(1200px 600px at 50% -10%, rgba(217,119,87,.08), transparent 60%);
}
.kfr *{box-sizing:border-box}
.kfr ::selection{background:var(--clay-tint-2)}
.kfr-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--clay-deep);font-weight:500;margin:0}
.kfr-eyebrow--center{text-align:center}

/* HERO */
.kfr-hero{max-width:760px;margin:0 auto;padding:64px 22px 8px;text-align:center;animation:kfrRise .7s cubic-bezier(.2,.7,.2,1) both}
.kfr-h1{font-family:var(--serif);font-weight:340;line-height:1.04;letter-spacing:-.02em;font-size:clamp(37px,8.5vw,84px);margin:16px 0 0;color:var(--ink)}
.kfr-h1 em{font-style:italic;color:var(--clay-deep);font-weight:440}
.kfr-lead{max-width:620px;margin:20px auto 0;font-size:clamp(16px,2.1vw,20px);line-height:1.55;color:var(--ink-soft)}
.kfr-chips{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin:26px 0 0}
.kfr-chip{font-family:var(--mono);font-size:12.5px;letter-spacing:.02em;padding:8px 14px;border:1px solid var(--line-2);border-radius:999px;color:var(--ink);background:var(--card)}
.kfr-hero-cta{margin-top:30px}

/* BUTTONS */
.kfr-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-family:var(--sans);font-size:16px;font-weight:600;padding:15px 26px;border-radius:999px;border:1px solid transparent;cursor:pointer;text-decoration:none;transition:transform .15s ease,background .2s ease,box-shadow .2s ease}
.kfr-btn--primary{background:var(--clay);color:#fff;box-shadow:0 1px 0 rgba(255,255,255,.4) inset,0 8px 20px -10px rgba(190,92,59,.7)}
.kfr-btn--primary:hover{background:var(--clay-deep);box-shadow:0 12px 28px -10px rgba(190,92,59,.85);transform:translateY(-1px)}
.kfr-btn--primary:disabled{opacity:.65;cursor:default;transform:none}
.kfr-btn--wa{background:#1FA855;color:#fff;box-shadow:0 8px 20px -10px rgba(31,168,85,.8);font-size:17px;padding:17px 30px}
.kfr-btn--wa:hover{background:#178a45;transform:translateY(-1px)}

/* POSTERS */
.kfr-posters{max-width:840px;margin:44px auto 0;padding:0 22px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
.kfr-posters img{width:100%;height:auto;border-radius:16px;border:1px solid var(--line);box-shadow:0 20px 50px -28px rgba(33,28,22,.5);display:block}

/* SECTIONS */
.kfr-section{max-width:680px;margin:0 auto;padding:60px 22px 0;text-align:center}
.kfr-h2{font-family:var(--serif);font-weight:380;letter-spacing:-.01em;font-size:clamp(26px,4.2vw,40px);line-height:1.1;margin:12px 0 0;color:var(--ink)}
.kfr-body{margin:18px auto 0;max-width:600px;font-size:16.5px;line-height:1.62;color:var(--ink-soft)}
.kfr-why{margin:22px auto 0;max-width:600px;font-size:15px;line-height:1.6;color:var(--ink);background:var(--clay-tint);border:1px solid var(--line);border-radius:14px;padding:16px 18px}
.kfr-why b{color:var(--clay-deep)}

/* FORM */
.kfr-form-wrap{max-width:640px;margin:56px auto 0;padding:0 22px}
.kfr-form-card{background:var(--card);border:1px solid var(--line-2);border-radius:24px;padding:34px clamp(20px,4vw,38px);box-shadow:0 30px 70px -40px rgba(33,28,22,.45)}
.kfr-form-title{margin-top:8px}
.kfr-form-sub{margin:12px 0 0;font-size:15px;line-height:1.55;color:var(--ink-soft)}
.kfr-form{margin-top:26px;display:flex;flex-direction:column;gap:18px}
.kfr-field{display:flex;flex-direction:column;gap:8px}
.kfr-label{font-size:13.5px;font-weight:600;color:var(--ink);line-height:1.35}
.kfr-req{color:var(--clay-deep);font-style:normal;margin-left:3px}
.kfr-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.kfr-input{width:100%;font-family:var(--sans);font-size:16px;color:var(--ink);background:var(--paper);border:1px solid var(--line-2);border-radius:12px;padding:13px 14px;transition:border-color .15s ease,box-shadow .15s ease;outline:none}
.kfr-input::placeholder{color:var(--ink-faint)}
.kfr-input:focus{border-color:var(--clay);box-shadow:0 0 0 3px var(--clay-tint)}
.kfr-textarea{resize:vertical;min-height:84px;line-height:1.5}
.kfr-toggle{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.kfr-toggle-btn{font-family:var(--sans);font-size:14.5px;font-weight:600;padding:12px 10px;border:1px solid var(--line-2);border-radius:12px;background:var(--paper);color:var(--ink-soft);cursor:pointer;transition:all .15s ease}
.kfr-toggle-btn.is-on{background:var(--clay-tint);border-color:var(--clay);color:var(--clay-deep)}
.kfr-pills{display:flex;flex-wrap:wrap;gap:9px}
.kfr-pill{font-family:var(--mono);font-size:13px;padding:9px 15px;border:1px solid var(--line-2);border-radius:999px;background:var(--paper);color:var(--ink-soft);cursor:pointer;transition:all .15s ease}
.kfr-pill.is-on{background:var(--clay);border-color:var(--clay);color:#fff}
.kfr-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none}
.kfr-error{margin:2px 0 0;font-size:14px;color:var(--clay-deep);font-weight:500}
.kfr-submit{margin-top:6px;width:100%}
.kfr-fineprint{margin:12px 0 0;text-align:center;font-size:12.5px;color:var(--ink-faint)}

/* SUCCESS */
.kfr-success{max-width:640px;margin:0 auto;padding:70px 22px 40px;animation:kfrRise .6s cubic-bezier(.2,.7,.2,1) both}
.kfr-success-card{background:var(--card);border:1px solid var(--line-2);border-radius:26px;padding:44px clamp(22px,4vw,42px);text-align:center;box-shadow:0 30px 70px -40px rgba(33,28,22,.45)}
.kfr-check{width:58px;height:58px;margin:0 auto 20px;border-radius:50%;background:var(--clay);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px -10px rgba(190,92,59,.8);animation:kfrPop .5s cubic-bezier(.2,1.4,.4,1) .1s both}
.kfr-success-h1{font-size:clamp(32px,6vw,54px);margin-top:12px}
.kfr-rec{margin:26px 0 0;text-align:left;background:var(--clay-tint);border:1px solid var(--clay);border-radius:18px;padding:20px 22px}
.kfr-rec-label{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--clay-deep);margin:0 0 8px;font-weight:500}
.kfr-rec-body{margin:0;font-size:17px;line-height:1.6;color:var(--ink);font-family:var(--serif);font-weight:360}
.kfr-success-body{margin-top:24px}
.kfr-btn--wa{margin-top:26px}

/* MOTION */
@keyframes kfrRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes kfrPop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}

/* FOOTER */
.kfr-footer{max-width:680px;margin:64px auto 0;padding:26px 22px 48px;border-top:1px solid var(--line);text-align:center;font-size:13.5px;color:var(--ink-faint)}
.kfr-footer b{color:var(--ink-soft)}

@media(max-width:560px){
  .kfr-hero{padding:44px 20px 4px}
  .kfr-lead{font-size:16px}
  .kfr-chips{gap:7px}
  .kfr-chip{font-size:12px;padding:8px 12px}
  .kfr-posters{grid-template-columns:1fr;max-width:440px;gap:14px;margin-top:36px}
  .kfr-section{padding:48px 20px 0}
  .kfr-form-wrap{margin-top:44px;padding:0 16px}
  .kfr-form-card{padding:28px 18px}
  .kfr-row{grid-template-columns:1fr}
  .kfr-toggle{grid-template-columns:1fr}
  /* Bigger, easier touch targets on phones (min 44px). */
  .kfr-pills{gap:8px}
  .kfr-pill{padding:12px 16px;font-size:14px;min-height:44px;display:inline-flex;align-items:center}
  .kfr-toggle-btn{min-height:48px}
  .kfr-input{padding:14px}
  .kfr-btn{width:100%}
  .kfr-hero-cta{width:auto;align-self:center}
}
@media(max-width:380px){
  .kfr-chip{font-size:11.5px;padding:7px 11px}
  .kfr-form-card{padding:24px 15px}
}
@media(prefers-reduced-motion:reduce){
  .kfr-hero,.kfr-success,.kfr-check{animation:none}
  .kfr-btn{transition:none}
}
`
