import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllReleases, getBrands } from '@/lib/sanity'
import ReleaseCard from '@/components/releases/ReleaseCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Calendrier des releases sneakers 2026',
  description: 'Toutes les prochaines sorties sneakers 2026 : Nike, Adidas, New Balance, Jordan… Dates, prix et liens d\'achat.',
  alternates: { canonical: 'https://sneakactu.fr/releases' },
  openGraph: {
    title: 'Calendrier des releases sneakers 2026 — SneakActu',
    description: 'Toutes les prochaines sorties sneakers 2026 : Nike, Adidas, New Balance, Jordan… Dates, prix et liens d\'achat.',
    url: 'https://sneakactu.fr/releases',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default async function ReleasesPage() {
  const [releases, brands] = await Promise.all([
    getAllReleases().catch(() => []),
    getBrands('grande-marque').catch(() => []),
  ])

  const today = new Date(); today.setHours(0,0,0,0)
  const upcoming = releases.filter((r) => new Date(r.releaseDate) >= today)
  const past = releases.filter((r) => new Date(r.releaseDate) < today)

  return (
    <main>
      <header className="sa-pagehead">
        <span className="sa-eyebrow">Calendrier</span>
        <h1 className="sa-h1">Prochaines releases</h1>
        <p className="sa-pagehead__lede">
          Toutes les sorties sneakers à venir, par date. Sources officielles uniquement.
        </p>
      </header>

      <section className="sa-section">
        {/* Brand filter chips */}
        {brands.length > 0 && (
          <div className="sa-pillrow" style={{ marginBottom: '32px' }}>
            <span className="sa-chip sa-chip--active">Toutes les marques</span>
            {brands.slice(0, 6).map((b) => (
              <Link key={b._id} href={`/marques/${b.slug.current}`} className="sa-chip">{b.name}</Link>
            ))}
          </div>
        )}

        {upcoming.length > 0 ? (
          <div className="sa-grid sa-grid--4">
            {upcoming.map((r) => <ReleaseCard key={r._id} release={r} />)}
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg-2)', fontSize: '17px' }}>
            Aucune release à venir pour le moment.
          </p>
        )}
      </section>

      {past.length > 0 && (
        <section className="sa-section sa-section--sunken">
          <div className="sa-section__head">
            <h2 className="sa-h2" style={{ opacity: .5 }}>Sorties passées</h2>
          </div>
          <div className="sa-grid sa-grid--4" style={{ opacity: .55 }}>
            {past.map((r) => <ReleaseCard key={r._id} release={r} />)}
          </div>
        </section>
      )}
    </main>
  )
}
