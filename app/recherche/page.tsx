'use client'

import { useState, useTransition } from 'react'
import { searchArticles, type Article } from '@/lib/sanity'
import { formatDateShort } from '@/lib/utils'
import Link from 'next/link'

export default function RecherchePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [searched, setSearched] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleInput = (value: string) => {
    setQuery(value)
    if (value.trim().length < 2) { setResults([]); setSearched(false); return }
    startTransition(async () => {
      const data = await searchArticles(value.trim()).catch(() => [])
      setResults(data)
      setSearched(true)
    })
  }

  return (
    <main>
      <header className="sa-pagehead">
        <span className="sa-eyebrow">Recherche</span>
        <h1 className="sa-h1">Rechercher</h1>
      </header>

      <section className="sa-section">
        {/* Search bar */}
        <div style={{ borderBottom: '2px solid var(--border-1)', display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', marginBottom: '40px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, color: 'var(--fg-3)' }}>
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="NIKE AIR MAX, JORDAN 1, NEW BALANCE…"
            autoFocus
            style={{
              flex: 1,
              border: 0,
              background: 'transparent',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 4vw, 40px)',
              color: 'var(--fg-1)',
              textTransform: 'uppercase',
              outline: 'none',
              letterSpacing: '-.02em',
            }}
          />
          {isPending && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ animation: 'spin 1s linear infinite', color: 'var(--fg-3)', flexShrink: 0 }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          )}
        </div>

        {/* Results */}
        {searched && !isPending && (
          <>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: '24px' }}>
              {results.length === 0 ? `Aucun résultat pour « ${query} »` : `${results.length} résultat${results.length > 1 ? 's' : ''}`}
            </p>
            {results.length > 0 && (
              <div>
                {results.map((article) => (
                  <Link
                    key={article._id}
                    href={`/articles/${article.slug.current}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      padding: '20px 0',
                      borderBottom: '1px solid var(--border-2)',
                      textDecoration: 'none',
                      color: 'var(--fg-1)',
                      gap: '24px',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '18px', lineHeight: 1.2, letterSpacing: '-.01em' }}>
                      {article.title}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)', flexShrink: 0 }}>
                      {formatDateShort(article.publishedAt)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {!searched && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
            Tapez au moins 2 caractères pour rechercher
          </p>
        )}
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}
