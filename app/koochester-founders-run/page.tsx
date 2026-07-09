'use client'

import { useState, useEffect } from 'react'

// The event team's WhatsApp — the "register" handoff. +60 10-209 9299 → 60102099299.
const WA_TEXT = "Hi! I'm a founder and I want to register for the Koochester Founder's Run 🏃 (via Claude Malaysia)"
const WA_LINK = `https://wa.me/60102099299?text=${encodeURIComponent(WA_TEXT)}`

const TEAM_SIZES = ['Solo', '2–5', '5–10', '10–20', '20–30', '30–50', '50–100', '100–200']
const TOTAL = 9

type View = 'landing' | 'survey' | 'done'

export default function KoochesterFoundersRun() {
  const [view, setView] = useState<View>('landing')
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
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

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const canNext: Record<number, boolean> = {
    1: name.trim().length > 0,
    2: emailOk,
    3: phone.trim().length > 0,
    4: true,
    5: company.trim().length > 0,
    6: teamSize.length > 0,
    7: true,
    8: challenge.trim().length > 0,
    9: dream.trim().length > 0,
  }

  const next = () => setStep(s => Math.min(TOTAL, s + 1))
  const back = () => setStep(s => Math.max(1, s - 1))
  const start = () => { setError(null); setStep(1); setView('survey') }

  // Scroll to top whenever the question or view changes (Typeform-style focus).
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }, [step, view])

  async function submit() {
    setError(null)
    if (!canNext[9]) return
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
        setStatus('idle')
        return
      }
      setRecommendation(data.recommendation || null)
      setView('done')
    } catch {
      setError('Network error — please try again.')
      setStatus('idle')
    }
  }

  // Enter advances on single-line inputs (never on textareas).
  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (canNext[step]) next()
    }
  }

  return (
    <main className="kfr">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {view === 'done' && <Success recommendation={recommendation} firstName={name.trim().split(/\s+/)[0]} />}

      {view === 'landing' && (
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
            <button type="button" onClick={start} className="kfr-btn kfr-btn--primary kfr-hero-cta">Register for the run →</button>
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
              first move with AI in the afternoon. Two minutes → your personalised game plan.
            </p>
            <button type="button" onClick={start} className="kfr-btn kfr-btn--primary kfr-section-cta">Start registration →</button>
          </section>

          <footer className="kfr-footer">
            <p>Koochester Founder&rsquo;s Run · in collaboration with <b>Claude Malaysia</b></p>
          </footer>
        </>
      )}

      {view === 'survey' && (
        <section className="kfr-survey">
          {/* Progress header */}
          <div className="kfr-progress">
            <div className="kfr-progress-inner">
              <button type="button" className="kfr-close" onClick={() => setView('landing')} aria-label="Back to page">←</button>
              <div className="kfr-bar"><div className="kfr-bar-fill" style={{ width: `${Math.round((step / TOTAL) * 100)}%` }} /></div>
              <span className="kfr-count">{step}<span>/{TOTAL}</span></span>
            </div>
          </div>

          <div className="kfr-stage">
            <div className="kfr-q" key={step}>
              {step === 1 && (
                <Q n={1} title="First up — what's your name?">
                  <input className="kfr-qinput" value={name} onChange={e => setName(e.target.value)} onKeyDown={onEnter} placeholder="Your full name" autoComplete="name" autoFocus />
                  <Nav canNext={canNext[1]} onNext={next} showBack={false} onBack={back} />
                </Q>
              )}
              {step === 2 && (
                <Q n={2} title="What's your email?" subtitle="Where we send your confirmation.">
                  <input className="kfr-qinput" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onEnter} placeholder="you@company.com" autoComplete="email" autoFocus />
                  {email.trim().length > 0 && !emailOk && <p className="kfr-qerr">Please enter a valid email.</p>}
                  <Nav canNext={canNext[2]} onNext={next} showBack onBack={back} />
                </Q>
              )}
              {step === 3 && (
                <Q n={3} title="Your WhatsApp number?" subtitle="The run team will reach you here.">
                  <input className="kfr-qinput" type="tel" value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={onEnter} placeholder="e.g. 012 345 6789" autoComplete="tel" autoFocus />
                  <Nav canNext={canNext[3]} onNext={next} showBack onBack={back} />
                </Q>
              )}
              {step === 4 && (
                <Q n={4} title="Are you the founder?">
                  <div className="kfr-select-list">
                    <button type="button" className={`kfr-select-btn ${isFounder ? 'is-on' : ''}`} onClick={() => { setIsFounder(true); setTimeout(next, 240) }}>
                      <span className="kfr-select-key">Y</span> Yes, I&rsquo;m the founder
                    </button>
                    <button type="button" className={`kfr-select-btn ${!isFounder ? 'is-on' : ''}`} onClick={() => setIsFounder(false)}>
                      <span className="kfr-select-key">N</span> No, I&rsquo;m on the team
                    </button>
                  </div>
                  {!isFounder && (
                    <input className="kfr-qinput kfr-role" value={position} onChange={e => setPosition(e.target.value)} onKeyDown={onEnter} placeholder="Your role — e.g. Head of Ops" autoFocus />
                  )}
                  <Nav canNext={canNext[4]} onNext={next} showBack onBack={back} />
                </Q>
              )}
              {step === 5 && (
                <Q n={5} title="What's your company called?">
                  <input className="kfr-qinput" value={company} onChange={e => setCompany(e.target.value)} onKeyDown={onEnter} placeholder="Your company" autoComplete="organization" autoFocus />
                  <Nav canNext={canNext[5]} onNext={next} showBack onBack={back} />
                </Q>
              )}
              {step === 6 && (
                <Q n={6} title="How big is your team?">
                  <div className="kfr-select-grid">
                    {TEAM_SIZES.map(s => (
                      <button key={s} type="button" className={`kfr-select-btn kfr-select-btn--pill ${teamSize === s ? 'is-on' : ''}`} onClick={() => { setTeamSize(s); setTimeout(next, 240) }}>{s}</button>
                    ))}
                  </div>
                  <Nav canNext={canNext[6]} onNext={next} showBack onBack={back} />
                </Q>
              )}
              {step === 7 && (
                <Q n={7} title="What industry are you in?" subtitle="Optional — type it in, or skip.">
                  <input className="kfr-qinput" value={industry} onChange={e => setIndustry(e.target.value)} onKeyDown={onEnter} placeholder="e.g. F&B, SaaS, Property" autoFocus />
                  <Nav canNext={canNext[7]} onNext={next} showBack onBack={back} nextLabel={industry.trim() ? 'Next →' : 'Skip →'} />
                </Q>
              )}
              {step === 8 && (
                <Q n={8} title="What's your biggest challenge in growing your business right now?" subtitle="Be specific — this shapes your recommendation.">
                  <textarea className="kfr-qinput kfr-qtext" value={challenge} onChange={e => setChallenge(e.target.value)} rows={3} maxLength={3000} placeholder="e.g. We can't follow up with leads fast enough…" autoFocus />
                  <Nav canNext={canNext[8]} onNext={next} showBack onBack={back} />
                </Q>
              )}
              {step === 9 && (
                <Q n={9} title="What does a dream 10-out-of-10 look like with AI?" subtitle="If AI worked perfectly for your business — what would it do?">
                  <textarea className="kfr-qinput kfr-qtext" value={dream} onChange={e => setDream(e.target.value)} rows={3} maxLength={3000} placeholder="e.g. Every enquiry gets an instant, personal reply…" autoFocus />
                  {error && <p className="kfr-qerr">{error}</p>}
                  <div className="kfr-survey-nav">
                    <button type="button" className="kfr-back" onClick={back}>← Back</button>
                    <button type="button" className="kfr-btn kfr-btn--primary" onClick={submit} disabled={!canNext[9] || status === 'loading'}>
                      {status === 'loading' ? 'Building your AI game plan…' : 'Get my AI game plan →'}
                    </button>
                  </div>
                </Q>
              )}
            </div>

            {/* honeypot — hidden from humans */}
            <input className="kfr-hp" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} aria-hidden="true" />
          </div>
        </section>
      )}
    </main>
  )
}

function Q({ n, title, subtitle, children }: { n: number; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="kfr-qbox">
      <p className="kfr-qnum">{String(n).padStart(2, '0')} <span>—</span> Question {n} of {TOTAL}</p>
      <h1 className="kfr-qtitle">{title}</h1>
      {subtitle && <p className="kfr-qsub">{subtitle}</p>}
      {children}
    </div>
  )
}

function Nav({ canNext, onNext, showBack, onBack, nextLabel = 'Next →' }: { canNext: boolean; onNext: () => void; showBack: boolean; onBack: () => void; nextLabel?: string }) {
  return (
    <div className={`kfr-survey-nav ${showBack ? '' : 'kfr-survey-nav--end'}`}>
      {showBack && <button type="button" className="kfr-back" onClick={onBack}>← Back</button>}
      <button type="button" className="kfr-btn kfr-btn--primary" onClick={onNext} disabled={!canNext}>{nextLabel}</button>
    </div>
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
.kfr-section-cta{margin-top:30px}

/* BUTTONS */
.kfr-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-family:var(--sans);font-size:16px;font-weight:600;padding:15px 26px;border-radius:999px;border:1px solid transparent;cursor:pointer;text-decoration:none;transition:transform .15s ease,background .2s ease,box-shadow .2s ease}
.kfr-btn--primary{background:var(--clay);color:#fff;box-shadow:0 1px 0 rgba(255,255,255,.4) inset,0 8px 20px -10px rgba(190,92,59,.7)}
.kfr-btn--primary:hover{background:var(--clay-deep);box-shadow:0 12px 28px -10px rgba(190,92,59,.85);transform:translateY(-1px)}
.kfr-btn--primary:disabled{opacity:.5;cursor:default;transform:none;box-shadow:none}
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

/* ── TYPEFORM-STYLE SURVEY ───────────────────────────────────────── */
.kfr-survey{min-height:100vh;display:flex;flex-direction:column}
.kfr-progress{position:sticky;top:0;z-index:10;background:rgba(250,247,242,.86);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.kfr-progress-inner{max-width:640px;margin:0 auto;padding:14px 22px;display:flex;align-items:center;gap:14px}
.kfr-close{flex:0 0 auto;width:34px;height:34px;border-radius:50%;border:1px solid var(--line-2);background:var(--card);color:var(--ink-soft);font-size:17px;cursor:pointer;line-height:1;transition:all .15s ease}
.kfr-close:hover{border-color:var(--ink);color:var(--ink)}
.kfr-bar{flex:1;height:5px;background:var(--paper-2);border-radius:999px;overflow:hidden}
.kfr-bar-fill{height:100%;background:var(--clay);border-radius:999px;transition:width .45s cubic-bezier(.2,.7,.2,1)}
.kfr-count{flex:0 0 auto;font-family:var(--mono);font-size:13px;color:var(--ink-soft);font-weight:500}
.kfr-count span{color:var(--ink-faint)}
.kfr-stage{flex:1;display:flex;align-items:flex-start;justify-content:center;padding:clamp(36px,9vh,90px) 22px 60px}
.kfr-q{width:100%;max-width:600px;animation:kfrQ .4s cubic-bezier(.2,.7,.2,1) both}
.kfr-qbox{display:flex;flex-direction:column}
.kfr-qnum{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--clay-deep);font-weight:500;margin:0 0 14px;display:flex;align-items:center;gap:8px}
.kfr-qnum span{color:var(--ink-faint)}
.kfr-qtitle{font-family:var(--serif);font-weight:360;letter-spacing:-.01em;font-size:clamp(26px,4.6vw,40px);line-height:1.14;margin:0;color:var(--ink)}
.kfr-qsub{margin:14px 0 0;font-size:16px;line-height:1.55;color:var(--ink-soft)}
.kfr-qinput{width:100%;margin-top:26px;font-family:var(--sans);font-size:18px;color:var(--ink);background:transparent;border:none;border-bottom:2px solid var(--line-2);border-radius:0;padding:10px 2px;transition:border-color .15s ease;outline:none}
.kfr-qinput::placeholder{color:var(--ink-faint)}
.kfr-qinput:focus{border-color:var(--clay)}
.kfr-qtext{border:1px solid var(--line-2);border-radius:14px;background:var(--card);padding:14px 16px;resize:vertical;min-height:96px;line-height:1.5;font-size:17px}
.kfr-qtext:focus{border-color:var(--clay);box-shadow:0 0 0 3px var(--clay-tint)}
.kfr-role{margin-top:16px}
.kfr-qerr{margin:10px 0 0;font-size:14px;color:var(--clay-deep);font-weight:500}
.kfr-select-list{display:flex;flex-direction:column;gap:11px;margin-top:26px}
.kfr-select-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:26px}
.kfr-select-btn{display:flex;align-items:center;gap:12px;width:100%;text-align:left;font-family:var(--sans);font-size:16px;font-weight:500;color:var(--ink);background:var(--card);border:1.5px solid var(--line-2);border-radius:14px;padding:16px 18px;cursor:pointer;transition:all .15s ease;min-height:56px}
.kfr-select-btn:hover{border-color:var(--clay);background:#fff}
.kfr-select-btn.is-on{border-color:var(--clay);background:var(--clay-tint);box-shadow:0 0 0 3px var(--clay-tint)}
.kfr-select-btn--pill{justify-content:center;text-align:center;min-height:58px;font-family:var(--mono);font-size:15px;font-weight:500}
.kfr-select-key{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:7px;background:var(--paper-2);color:var(--ink-soft);font-family:var(--mono);font-size:12px;font-weight:600}
.kfr-select-btn.is-on .kfr-select-key{background:var(--clay);color:#fff}
.kfr-survey-nav{margin-top:32px;display:flex;justify-content:space-between;align-items:center;gap:12px}
.kfr-survey-nav--end{justify-content:flex-end}
.kfr-back{font-family:var(--sans);font-size:15px;font-weight:500;color:var(--ink-soft);background:transparent;border:none;cursor:pointer;padding:10px 4px}
.kfr-back:hover{color:var(--ink)}
.kfr-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none}

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
@keyframes kfrQ{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

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
  .kfr-btn{width:100%}
  .kfr-hero-cta,.kfr-section-cta{width:auto;align-self:center}
  .kfr-progress-inner{padding:12px 18px;gap:10px}
  .kfr-stage{padding:32px 20px 48px}
  .kfr-qtext{font-size:16px}
  .kfr-select-grid{grid-template-columns:1fr 1fr}
  .kfr-survey-nav .kfr-btn{width:auto}
}
@media(max-width:380px){
  .kfr-chip{font-size:11.5px;padding:7px 11px}
  .kfr-select-grid{gap:9px}
}
@media(prefers-reduced-motion:reduce){
  .kfr-hero,.kfr-success,.kfr-check,.kfr-q{animation:none}
  .kfr-btn,.kfr-bar-fill{transition:none}
}
`
