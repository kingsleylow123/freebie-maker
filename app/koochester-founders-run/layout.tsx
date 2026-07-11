import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from 'next/font/google'

// Editorial serif display + warm grotesk body + mono micro-labels — the Claude
// "warm paper" voice, scoped to this landing page.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  display: 'swap',
})
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.claudemalaysia.com'),
  title: "Koochester Founder's Run 2026 — by application | Claude Malaysia",
  description:
    "The Koochester Founder's Run — a curated morning run for 300 Malaysian founders at KLCC Park, 16 August 2026. Hosted by Koochester, Tealive & Warrior Plunge, in collaboration with Claude Malaysia. By application only — register and get your personalised AI game plan.",
  keywords: [
    "Koochester Founder's Run",
    'Koochester',
    'Tealive',
    'Warrior Plunge',
    'Claude Malaysia',
    'founders run KL',
    'KLCC founders run 2026',
    'Malaysia founder event',
  ],
  alternates: { canonical: 'https://www.claudemalaysia.com/koochester-founders-run' },
  icons: {
    icon: [{ url: '/koochester/cm-mark.svg', type: 'image/svg+xml' }],
    shortcut: '/koochester/cm-mark.svg',
    apple: '/koochester/cm-mark.svg',
  },
  openGraph: {
    title: "Koochester Founder's Run 2026 — by application",
    description:
      'A curated morning run for 300 Malaysian founders. Hosted by Koochester, Tealive & Warrior Plunge, in collaboration with Claude Malaysia. KLCC Park · 16 Aug 2026 · by application only.',
    url: 'https://www.claudemalaysia.com/koochester-founders-run',
    images: ['/koochester/poster-1.jpg'],
    type: 'website',
  },
}

export default function KoochesterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${fraunces.variable} ${hanken.variable} ${plexMono.variable}`}>
      {children}
    </div>
  )
}
