import type { Metadata } from 'next'
import Link from 'next/link'
import { getBrands } from '@/lib/sanity'
import EmergenteCard from '@/components/brands/EmergenteCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Marques sneakers émergentes Instagram',
  description: 'Les ateliers, créateurs et marques découverts sur Instagram qui font le vestiaire de demain.',
}

export default async function EmergentesPage() {
  const brands = await getBrands('emergente').catch(() => [])

  const countries = [...new Set(brands.map((b) => b.country).filter(Boolean))] as string[]

  return (
    <main>
      <header className="sa-pagehead">
        <span className="sa-eyebrow">Le différenciant</span>
        <h1 className="sa-h1">Marques émergentes</h1>
        <p className="sa-pagehead__lede">
          Les ateliers, créateurs et marques découverts sur Instagram qui font le vestiaire de demain.
        </p>
      </header>

      <section className="sa-section">
        {/* Country filter chips */}
        {countries.length > 0 && (
          <div className="sa-pillrow" style={{ marginBottom: '32px' }}>
            <span className="sa-chip sa-chip--active">Toutes</span>
            {countries.slice(0, 6).map((c) => (
              <span key={c} className="sa-chip">{c}</span>
            ))}
          </div>
        )}

        {brands.length > 0 ? (
          <div className="sa-grid sa-grid--3">
            {brands.map((brand) => (
              <EmergenteCard key={brand._id} brand={brand} />
            ))}
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg-2)', fontSize: '17px', lineHeight: 1.6 }}>
            Aucune marque émergente référencée pour le moment.{' '}
            <Link href="/studio">Ajoutez-en dans le Studio →</Link>
          </p>
        )}
      </section>
    </main>
  )
}
