import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from 'next/font/google'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', style: ['normal', 'italic'], display: 'swap' })
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono', display: 'swap' })

const UPDATED = '11 July 2026'
const SUPPORT_EMAIL = 'support@cmoaiconsulting.com'

export const metadata: Metadata = {
  title: 'Privacy Policy — Claude Malaysia',
  description:
    'How Claude Malaysia collects, uses and protects your personal data, in line with Malaysia’s Personal Data Protection Act (PDPA). Operated by CMO Consulting Sdn. Bhd.',
  alternates: { canonical: 'https://www.claudemalaysia.com/privacy' },
  openGraph: { title: 'Privacy Policy — Claude Malaysia', type: 'website', url: 'https://www.claudemalaysia.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className={`lgl-page ${fraunces.variable} ${hanken.variable} ${plexMono.variable}`}>
      <header className="lgl-head">
        <a className="lgl-brand" href="/join">Claude Malaysia</a>
        <a className="lgl-back" href="/join">Home</a>
      </header>

      <div className="lgl-wrap">
        <p className="lgl-eyebrow">Legal</p>
        <h1 className="lgl-h1">Privacy Policy</h1>
        <p className="lgl-lead">
          How we collect, use and protect your personal data, in line with Malaysia&rsquo;s Personal
          Data Protection Act 2010 (PDPA).
        </p>
        <p className="lgl-meta">Operated by CMO Consulting Sdn. Bhd. (202601024007) · Last updated {UPDATED}</p>
      </div>

      <article className="lgl">
        <h2>1. Who we are</h2>
        <p>
          The Claude Malaysia website, community and events are operated by <strong>CMO Consulting
          Sdn. Bhd.</strong> (Reg. No. 202601024007 / 1686104-X), a company registered in Malaysia
          (&ldquo;Claude Malaysia&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). This policy explains how
          we collect, use and protect your personal data.
        </p>

        <h2>2. What we collect</h2>
        <ul>
          <li>
            <strong>You give us:</strong> your name, email, phone / WhatsApp number, and anything you
            type into our forms, surveys, chat widget or messages.
          </li>
          <li>
            <strong>When you pay:</strong> billing details are collected and processed by our payment
            provider (Stripe) — we don&rsquo;t store your full card number.
          </li>
          <li>
            <strong>Automatically:</strong> basic usage data such as device, browser and pages
            visited, via cookies and analytics.
          </li>
        </ul>

        <h2>3. How we use it</h2>
        <p>
          To register you for and run our workshops, challenges and events; to reply to you and
          provide support; to process payments; to send you updates, reminders and marketing about
          Claude Malaysia (you can opt out any time); and to improve our website and programs.
        </p>

        <h2>4. Marketing messages</h2>
        <p>
          With your consent, we may contact you by email, WhatsApp or SMS about events and offers. You
          can opt out at any time by replying STOP, using the unsubscribe link, or emailing us — and
          we&rsquo;ll stop.
        </p>

        <h2>5. Who we share it with</h2>
        <p>
          We don&rsquo;t sell your personal data. We share it only with trusted service providers who
          help us operate — such as <strong>Stripe</strong> (payments), <strong>Meta / Instagram and
          WhatsApp</strong> (ads and messaging), <strong>Google</strong> (email and analytics), and
          our hosting and database providers. We may also disclose data if required by law.
        </p>

        <h2>6. Cookies and analytics</h2>
        <p>
          We use cookies and analytics tools to understand how the site is used and to improve it. You
          can control cookies through your browser settings.
        </p>

        <h2>7. How long we keep it</h2>
        <p>
          We keep your personal data only as long as needed for the purposes above, or as required by
          law (for example, tax and accounting records).
        </p>

        <h2>8. Your rights (PDPA)</h2>
        <p>
          You may ask us to <strong>access or correct</strong> your personal data, or to{' '}
          <strong>withdraw your consent</strong> or limit how we use it. To do so, email us at the
          address below. Withdrawing consent may mean we can no longer provide certain services.
        </p>

        <h2>9. Security</h2>
        <p>
          We take reasonable steps to protect your personal data. No online service can be 100%
          secure, but we work to keep your information safe.
        </p>

        <h2>10. Third-party links</h2>
        <p>
          Our site may link to other websites. We&rsquo;re not responsible for their content or
          privacy practices — please review their policies.
        </p>

        <h2>11. Children</h2>
        <p>
          Our services are intended for adults (18+). We don&rsquo;t knowingly collect personal data
          from children.
        </p>

        <h2>12. Changes</h2>
        <p>
          We may update this policy from time to time; the latest version will always be on this page.
        </p>

        <h2>13. Contact</h2>
        <p>
          Questions or requests about your personal data? Email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
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
