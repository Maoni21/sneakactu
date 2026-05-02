'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StudioLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/studio-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/studio')
      } else {
        setError('Mot de passe incorrect')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        padding: '48px 40px',
        background: 'var(--bg-sunken)',
        border: '1px solid var(--border-1)',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            letterSpacing: '-.03em',
            textTransform: 'uppercase',
            color: 'var(--fg-1)',
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
              }} />
            </span>
          </span>
          <p style={{
            marginTop: '16px',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: 'var(--fg-2)',
            letterSpacing: '.04em',
            textTransform: 'uppercase',
          }}>
            Accès Studio
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: 'var(--fg-2)',
              marginBottom: '8px',
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                background: 'var(--bg-base)',
                border: error ? '1.5px solid #ef4444' : '1.5px solid var(--border-1)',
                color: 'var(--fg-1)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: '#ef4444',
              marginBottom: '16px',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: loading ? 'var(--fg-3)' : 'var(--brand-orange)',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Connexion…' : 'Accéder au Studio →'}
          </button>
        </form>
      </div>
    </div>
  )
}
