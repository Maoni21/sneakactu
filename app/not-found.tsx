import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 32px' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(80px, 15vw, 180px)', lineHeight: 1, color: 'var(--border-2)', margin: 0, userSelect: 'none' }}>
        404
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', textTransform: 'uppercase', letterSpacing: '-.02em', margin: '16px 0 12px', color: 'var(--fg-1)' }}>
        Page introuvable
      </h1>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: 1.6, color: 'var(--fg-2)', maxWidth: '400px', margin: '0 0 32px' }}>
        La page que tu cherches n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/" className="sa-btn sa-btn--accent">
        ← Retour à l&apos;accueil
      </Link>
    </main>
  )
}
