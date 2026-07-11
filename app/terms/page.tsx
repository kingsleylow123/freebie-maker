import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from 'next/font/google'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', style: ['normal', 'italic'], display: 'swap' })
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono', display: 'swap' })

const UPDATED = '11 July 2026'
const SUPPORT_EMAIL = 'support@cmoaiconsulting.com'

export const metadata: Metadata = {
  title: 'Terms of Service — Claude Malaysia',
  description:
    'The terms that govern your use of the Claude Malaysia website, community, events and paid programs. Operated by CMO Consulting Sdn. Bhd.',
  alternates: { canonical: 'https://www.claudemalaysia.com/terms' },
  openGraph: { title: 'Terms of Service — Claude Malaysia', type: 'website', url: 'https://www.claudemalaysia.com/terms' },
}

export default function TermsPage() {
  return (
    <main className={`lgl-page ${fraunces.variable} ${hanken.variable} ${plexMono.variable}`}>
      <header className="lgl-head">
        <a className="lgl-brand" href="/join">Claude Malaysia</a>
        <a className="lgl-back" href="/join">Home</a>
      </header>

      <div className="lgl-wrap">
        <p className="lgl-eyebrow">Legal</p>
        <h1 className="lgl-h1">Terms of Service</h1>
        <p className="lgl-lead">
          These terms govern your use of the Claude Malaysia website, community, events and paid
          programs. By using them, you agree to these terms.
        </p>
        <p className="lgl-meta">Operated by CMO Consulting Sdn. Bhd. (202601024007) · Last updated {UPDATED}</p>
      </div>

      <article className="lgl">
        <h2>1. Who we are</h2>
        <p>
          The Claude Malaysia website, community and events are operated by <strong>CMO Consulting
          Sdn. Bhd.</strong> (Reg. No. 202601024007 / 1686104-X), a company registered in Malaysia
          (&ldquo;Claude Malaysia&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). We are an{' '}
          <strong>independent community and are not affiliated with, or endorsed by, Anthropic</strong>.
        </p>

        <h2>2. Accepting these terms</h2>
        <p>
          By accessing our website or taking part in our community, events or paid programs, you agree
          to these Terms of Service and our <a href="/refund-policy">Refund Policy</a>. If you
          don&rsquo;t agree, please don&rsquo;t use our services.
        </p>

        <h2>3. Eligibility</h2>
        <p>
          You must be at least 18 years old (or have a parent or guardian&rsquo;s consent) and use our
          services only for lawful purposes.
        </p>

        <h2>4. Events, workshops and payments</h2>
        <p>
          Event details, availability and prices may change, and seats are subject to availability.
          Payment confirms your booking. Cancellations, refunds and transfers are covered by our{' '}
          <a href="/refund-policy">Refund Policy</a>.
        </p>

        <h2>5. Community conduct</h2>
        <p>
          Our community runs on trust and respect. You agree not to spam, harass others, share illegal
          or harmful content, or disrupt our events. We may remove content or suspend access if these
          terms are broken, and we <strong>reserve the right to remove or ban anyone from our
          community at our discretion</strong>.
        </p>

        <h2>6. Our content and materials</h2>
        <p>
          Our website content, workshop materials, templates and resources belong to us or our
          licensors. You may use them for your own learning and business, but you may not copy, resell,
          redistribute or republish them without our written permission.
        </p>

        <h2>7. Your contributions</h2>
        <p>
          If you share content with us (builds, comments, testimonials), you&rsquo;re responsible for
          it and you give us permission to display and share it in connection with Claude Malaysia.
          Please don&rsquo;t post anything you don&rsquo;t have the right to share.
        </p>
        <p>
          We also <strong>reserve the right to use content shared during our workshops, WhatsApp groups
          and events</strong> (including photos, recordings, chats and screenshots) <strong>publicly</strong>{' '}
          — for example in our marketing, social media and case studies.
        </p>

        <h2>8. No guarantees</h2>
        <p>
          Our programs teach tools and methods. They are provided <strong>&ldquo;as is&rdquo;</strong>,
          and we <strong>do not guarantee any specific result, income or outcome</strong> — what you
          achieve depends on you.
        </p>

        <h2>9. Third-party tools and links</h2>
        <p>
          We may link to or rely on third-party tools and websites (for payment, scheduling, or AI
          tools). We&rsquo;re not responsible for their content, availability or practices.
        </p>

        <h2>10. Limitation of liability</h2>
        <p>
          To the fullest extent allowed by law, Claude Malaysia and CMO Consulting Sdn. Bhd. are not
          liable for indirect or consequential losses. Where we are liable, our total liability is
          limited to the amount you paid us for the relevant program.
        </p>

        <h2>11. Changes and termination</h2>
        <p>
          We may update these terms or our services from time to time; your continued use means you
          accept the changes. We may suspend or end access for anyone who breaches these terms.
        </p>

        <h2>12. Governing law</h2>
        <p>
          These terms are governed by the laws of <strong>Malaysia</strong>, and the Malaysian courts
          have jurisdiction.
        </p>

        <h2>13. Contact</h2>
        <p>
          Questions about these terms? Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
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
