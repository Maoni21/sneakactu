'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import SearchOverlay from '@/components/ui/SearchOverlay'

const navLinks = [
  { href: '/articles',   label: 'Actus' },
  { href: '/marques',    label: 'Marques' },
  { href: '/emergentes', label: 'Émergentes' },
  { href: '/releases',   label: 'Releases' },
  { href: '/guides',     label: 'Guides' },
]

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <header className="sa-nav">
        <div className="sa-nav__inner">
          {/* Logo */}
          <Link href="/" className="sa-nav__logo" aria-label="SneakActu — Accueil">
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              letterSpacing: '-.03em',
              textTransform: 'uppercase',
              color: 'var(--fg-1)',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0,
            }}>
              SNEAK
              <span style={{ position: 'relative', display: 'inline-block' }}>
                ACTU
                <span style={{
                  position: 'absolute',
                  bottom: '-3px',
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'var(--brand-orange)',
                  borderRadius: 0,
                }} />
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="sa-nav__links" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`sa-nav__link ${pathname?.startsWith(link.href) ? 'is-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Tools: search + theme + mobile menu */}
          <div className="sa-nav__tools">
            {/* Search */}
            <button
              className="sa-iconbtn"
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7"/>
                <path d="m20 20-3.5-3.5"/>
              </svg>
            </button>

            {/* Theme toggle */}
            {mounted && (
              <button
                className="sa-iconbtn"
                onClick={toggleTheme}
                aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                {isDark ? (
                  /* Sun icon */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>
                  </svg>
                ) : (
                  /* Moon icon */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
                  </svg>
                )}
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="sa-iconbtn"
              style={{ display: 'none' }}
              id="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid var(--border-1)',
            background: 'var(--bg-base)',
            padding: '8px 32px 16px',
          }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '.04em',
                  textTransform: 'uppercase',
                  padding: '12px 0',
                  color: pathname?.startsWith(link.href) ? 'var(--brand-orange)' : 'var(--fg-1)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--border-3)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Mobile menu button CSS override */}
      <style>{`
        @media (max-width: 768px) {
          .sa-nav__links { display: none !important; }
          #mobile-menu-btn { display: grid !important; }
        }
      `}</style>

      {/* Search overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}
