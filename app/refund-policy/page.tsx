import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from 'next/font/google'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', style: ['normal', 'italic'], display: 'swap' })
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono', display: 'swap' })

const UPDATED = '11 July 2026'
const SUPPORT_EMAIL = 'support@cmoaiconsulting.com'
const WA = '+60 17-263 9019'

export const metadata: Metadata = {
  title: 'Refund Policy — Claude Malaysia',
  description:
    'Refund, transfer and cancellation policy for Claude Malaysia paid workshops, challenges and programs. Operated by CMO Consulting Sdn. Bhd.',
  alternates: { canonical: 'https://www.claudemalaysia.com/refund-policy' },
  openGraph: { title: 'Refund Policy — Claude Malaysia', type: 'website', url: 'https://www.claudemalaysia.com/refund-policy' },
}

export default function RefundPolicyPage() {
  return (
    <main className={`lgl-page ${fraunces.variable} ${hanken.variable} ${plexMono.variable}`}>
      <header className="lgl-head">
        <a className="lgl-brand" href="/join">Claude Malaysia</a>
        <a className="lgl-back" href="/join">Home</a>
      </header>

      <div className="lgl-wrap">
        <p className="lgl-eyebrow">Legal</p>
        <h1 className="lgl-h1">Refund Policy</h1>
        <p className="lgl-lead">
          How refunds, transfers and cancellations work for Claude Malaysia paid workshops, challenges
          and programs.
        </p>
        <p className="lgl-meta">Operated by CMO Consulting Sdn. Bhd. (202601024007) · Last updated {UPDATED}</p>
      </div>

      <article className="lgl">
        <h2>1. All bookings are final</h2>
        <p>
          Once your booking for a workshop, challenge or paid program is confirmed and payment is
          received, the fee is <strong>non-refundable</strong>. Please make sure the date and details
          work for you before you pay.
        </p>
        <p>
          Refunds will not be provided for reasons including, but not limited to, change of mind,
          non-attendance, scheduling conflicts, or personal circumstances.
        </p>

        <h2>2. If we cancel or can&rsquo;t deliver</h2>
        <p>
          The one time we issue a refund is if <strong>we cancel an event, or are unable to deliver
          the program as described</strong>. In that case you&rsquo;ll receive a <strong>full refund
          to your original payment method</strong>.
        </p>

        <h2>3. Transfers and reselling your seat</h2>
        <p>
          Tickets are <strong>non-refundable and non-transferable to a future date</strong>. However,{' '}
          <strong>reselling or passing your ticket to someone else is perfectly fine</strong> — just
          inform the organisers beforehand so we can update the registration details:
        </p>
        <ul>
          <li>WhatsApp: {WA}</li>
          <li>Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></li>
        </ul>
        <p>The new attendee will need to complete registration before the event.</p>

        <h2>4. How approved refunds are processed</h2>
        <p>
          Where a refund is due (see section 2), it&rsquo;s returned to your <strong>original payment
          method</strong>. Processing times vary by bank and payment provider, but we aim to complete
          approved refunds within <strong>14 business days</strong>.
        </p>

        <h2>5. Digital content and recordings</h2>
        <p>
          Access to digital materials, recordings or downloadable resources is <strong>non-refundable
          once access has been granted</strong>, as these can&rsquo;t be returned.
        </p>

        <h2>6. No-shows</h2>
        <p>
          If you don&rsquo;t attend and didn&rsquo;t resell or pass on your seat beforehand, the fee is{' '}
          <strong>non-refundable</strong>.
        </p>

        <h2>7. Questions</h2>
        <p>
          For anything about refunds, transfers or cancellations, contact us at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or WhatsApp {WA}.
        </p>

        <p className="lgl-updated">
          Claude Malaysia is operated by CMO Consulting Sdn. Bhd. (Reg. No. 202601024007 / 1686104-X),
          a company registered in Malaysia. Last updated {UPDATED}.
        </p>
      </article>

      <footer className="lgl-footer">
        <span>© 2026 Claude Malaysia · CMO Consulting Sdn. Bhd.</span>
        <nav>
          <a href="/terms">Terms</a>
          <a href="/refund-policy">Refund Policy</a>
          <a href="/privacy">Privacy</a>
          <a href="/join">Join</a>
        </nav>
      </footer>

      <style>{LEGAL_CSS}</style>
    </main>
  )
}

const LEGAL_CSS = `
.lgl-page{
  --paper:#FAF7F2; --paper-2:#F2EBDF; --card:#FFFDF9; --ink:#211C16; --ink-soft:#5F564B; --ink-faint:#978C7B;
  --clay:#D97757; --clay-deep:#BE5C3B; --clay-tint:rgba(217,119,87,.12); --line:rgba(33,28,22,.10); --line-2:rgba(33,28,22,.18);
  --sans:var(--font-hanken),-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  --serif:var(--font-fraunces),Georgia,'Times New Roman',serif;
  --mono:var(--font-mono),ui-monospace,SFMono-Regular,Menlo,monospace;
  background:var(--paper); color:var(--ink); font-family:var(--sans); min-height:100vh; -webkit-font-smoothing:antialiased;
  background-image:radial-gradient(1100px 520px at 50% -10%, rgba(217,119,87,.08), transparent 60%);
}
.lgl-page *{box-sizing:border-box}
.lgl-page ::selection{background:var(--clay-tint)}
.lgl-head{max-width:820px;margin:0 auto;padding:22px;display:flex;align-items:center;justify-content:space-between}
.lgl-brand{text-decoration:none;color:var(--ink);font-family:var(--serif);font-weight:500;font-size:19px;letter-spacing:-.01em}
.lgl-back{font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--clay-deep);text-decoration:none}
.lgl-back:hover{color:var(--clay)}
.lgl-wrap{max-width:760px;margin:0 auto;padding:clamp(16px,3vw,30px) 22px 14px}
.lgl-eyebrow{font-family:var(--mono);font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--clay-deep);font-weight:500;margin:0}
.lgl-h1{font-family:var(--serif);font-weight:360;line-height:1.05;letter-spacing:-.02em;font-size:clamp(34px,6vw,60px);margin:10px 0 0;color:var(--ink)}
.lgl-lead{max-width:56ch;margin:16px 0 0;font-size:clamp(16px,2vw,20px);line-height:1.55;color:var(--ink-soft)}
.lgl-meta{font-family:var(--mono);font-size:12.5px;color:var(--ink-faint);margin:14px 0 0}
.lgl{max-width:760px;margin:0 auto;padding:8px 22px 40px}
.lgl h2{font-family:var(--serif);font-weight:400;letter-spacing:-.01em;font-size:clamp(20px,2.4vw,26px);line-height:1.15;margin:38px 0 12px;color:var(--ink)}
.lgl h2:first-child{margin-top:0}
.lgl p{font-size:16.5px;line-height:1.65;color:var(--ink-soft);margin:0 0 14px}
.lgl ul{margin:0 0 16px;padding-left:22px;display:flex;flex-direction:column;gap:8px}
.lgl li{font-size:16.5px;line-height:1.55;color:var(--ink-soft)}
.lgl li::marker{color:var(--clay)}
.lgl a{color:var(--clay-deep);text-decoration:underline;text-underline-offset:2px}
.lgl a:hover{color:var(--clay)}
.lgl strong{color:var(--ink);font-weight:600}
.lgl-updated{margin-top:40px;padding-top:20px;border-top:1px solid var(--line);font-family:var(--mono);font-size:12.5px;line-height:1.6;color:var(--ink-faint)}
.lgl-footer{max-width:760px;margin:24px auto 0;padding:26px 22px 48px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:10px 20px;align-items:center;justify-content:space-between;font-size:13px;color:var(--ink-faint);font-family:var(--mono)}
.lgl-footer a{color:var(--ink-soft);text-decoration:none}
.lgl-footer a:hover{color:var(--clay-deep)}
.lgl-footer nav{display:flex;gap:16px;flex-wrap:wrap}
@media(max-width:560px){ .lgl-head{padding:18px} .lgl-footer{flex-direction:column;align-items:flex-start} }
`
