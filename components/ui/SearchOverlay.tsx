'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import Link from 'next/link'
import { searchArticles, type Article } from '@/lib/sanity'
import { formatDateShort } from '@/lib/utils'

type Props = { onClose: () => void }

export default function SearchOverlay({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleInput = (value: string) => {
    setQuery(value)
    if (value.trim().length < 2) { setResults([]); return }
    startTransition(async () => {
      const data = await searchArticles(value.trim()).catch(() => [])
      setResults(data)
    })
  }

  return (
    <div className="sa-search" onClick={onClose}>
      <div className="sa-search__panel" onClick={(e) => e.stopPropagation()}>
        <div className="sa-search__row">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, color: 'var(--fg-3)' }}>
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="RECHERCHER…"
            className="sa-search__row"
            style={{
              flex: 1,
              border: 0,
              background: 'transparent',
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              color: 'var(--fg-1)',
              textTransform: 'uppercase',
              outline: 'none',
              padding: 0,
            }}
          />
          {isPending && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ animation: 'spin 1s linear infinite', color: 'var(--fg-3)' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          )}
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase' }}
          >
            Esc
          </button>
        </div>

        {results.length > 0 ? (
          <div style={{ marginTop: '16px' }}>
            {results.slice(0, 5).map((article) => (
              <Link
                key={article._id}
                href={`/articles/${article.slug.current}`}
                onClick={onClose}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border-3)',
                  textDecoration: 'none',
                  color: 'var(--fg-1)',
                  gap: '16px',
                }}
              >
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '15px', lineHeight: 1.2 }}>
                  {article.title}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)', flexShrink: 0 }}>
                  {formatDateShort(article.publishedAt)}
                </span>
              </Link>
            ))}
          </div>
        ) : query.length >= 2 && !isPending ? (
          <p className="sa-search__hint">Aucun résultat pour « {query} »</p>
        ) : (
          <p className="sa-search__hint">Tapez pour rechercher · Échap pour fermer</p>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
