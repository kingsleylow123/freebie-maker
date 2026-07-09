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
  metadataBase: new URL('https://claudemalaysia.com'),
  title: "Koochester Founder's Run 2026 — Register | Claude Malaysia",
  description:
    "Register for the Koochester Founder's Run — a curated morning run for 300 Malaysian founders at KLCC Park, 16 August 2026. Meet, learn and grow the healthy way, then get your personalised AI game plan with Claude Malaysia.",
  alternates: { canonical: 'https://claudemalaysia.com/koochester-founders-run' },
  openGraph: {
    title: "Koochester Founder's Run 2026 — Register",
    description:
      'A curated morning run for 300 Malaysian founders. KLCC Park · 16 Aug 2026. Register and get your personalised AI game plan with Claude Malaysia.',
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
