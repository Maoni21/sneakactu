import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://sneakactu.fr'),
  title: {
    default: 'SneakActu — Actualité Sneakers & Streetwear',
    template: '%s | SneakActu',
  },
  description:
    'SneakActu est la référence française sur l\'actualité sneakers : nouvelles sorties, marques émergentes Instagram, guides d\'achat et calendrier des releases.',
  keywords: ['sneakers', 'actualité sneakers', 'releases sneakers', 'streetwear', 'marques émergentes'],
  authors: [{ name: 'SneakActu', url: 'https://sneakactu.fr' }],
  creator: 'SneakActu',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://sneakactu.fr',
    siteName: 'SneakActu',
    title: 'SneakActu — Actualité Sneakers & Streetwear',
    description: 'La référence française sur l\'actualité sneakers.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'SneakActu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SneakActu — Actualité Sneakers & Streetwear',
    description: 'La référence française sur l\'actualité sneakers.',
    images: ['/og-image.jpg'],
    site: '@sneakactu',
    creator: '@sneakactu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
