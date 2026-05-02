import type { Metadata } from 'next'
import Link from 'next/link'
import { getBrands } from '@/lib/sanity'
import BrandCard from '@/components/brands/BrandCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Toutes les marques sneakers',
  description: 'Nike, Adidas, New Balance, Jordan, Asics et toutes les marques émergentes sur SneakActu.',
  alternates: { canonical: 'https://sneakactu.fr/marques' },
  openGraph: {
    title: 'Toutes les marques sneakers — SneakActu',
    description: 'Nike, Adidas, New Balance, Jordan, Asics et toutes les marques émergentes sur SneakActu.',
    url: 'https://sneakactu.fr/marques',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

type Props = { searchParams: Promise<{ type?: string }> }

export default async function MarquesPage({ searchParams }: Props) {
  const [brands, params] = await Promise.all([
    getBrands().catch(() => []),
    searchParams,
  ])
  const active = params.type

  const filtered = (active === 'grande-marque' || active === 'emergente')
    ? brands.filter((b) => b.type === active)
    : brands

  const grandCount = brands.filter((b) => b.type === 'grande-marque').length
  const emCount = brands.filter((b) => b.type === 'emergente').length

  return (
    <main>
      <header className="sa-pagehead">
        <span className="sa-eyebrow">Toutes les marques</span>
        <h1 className="sa-h1">Marques</h1>
        <p className="sa-pagehead__lede">{grandCount} grandes marques · {emCount} marques émergentes</p>
      </header>

      <section className="sa-section">
        <div className="sa-pillrow" style={{ marginBottom: '32px' }}>
          <Link href="/marques" className={`sa-chip${!active ? ' sa-chip--active' : ''}`}>Toutes</Link>
          <Link href="/marques?type=grande-marque" className={`sa-chip${active === 'grande-marque' ? ' sa-chip--active' : ''}`}>Grandes marques</Link>
          <Link href="/marques?type=emergente" className={`sa-chip${active === 'emergente' ? ' sa-chip--active' : ''}`}>Émergentes</Link>
        </div>

        <div className="sa-grid sa-grid--4">
          {filtered.map((brand) => (
            <BrandCard key={brand._id} brand={brand as typeof brand & { articleCount?: number }} variant="card" />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg-2)', fontSize: '17px' }}>
            Aucune marque dans cette catégorie pour le moment.
          </p>
        )}
      </section>
    </main>
  )
}
