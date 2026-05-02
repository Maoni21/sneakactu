import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getBrandBySlug, getArticlesByBrand, getAllBrandSlugs, urlFor } from '@/lib/sanity'
import ArticleGrid from '@/components/articles/ArticleGrid'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllBrandSlugs().catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const brand = await getBrandBySlug(slug).catch(() => null)
  if (!brand) return {}
  return {
    title: `${brand.name} — Marque émergente`,
    description: brand.description ?? `Découvrez ${brand.name} sur SneakActu.`,
    alternates: { canonical: `/emergentes/${slug}` },
  }
}

export default async function EmergentePage({ params }: Props) {
  const { slug } = await params
  const [brand, articles] = await Promise.all([
    getBrandBySlug(slug).catch(() => null),
    getArticlesByBrand(slug).catch(() => []),
  ])

  if (!brand || brand.type !== 'emergente') notFound()

  const logoUrl = brand.logo
    ? urlFor(brand.logo).width(300).height(300).format('webp').quality(90).url()
    : null

  return (
    <main>
      <header className="sa-brandhead">
        <div className="sa-brandhead__inner">
          <div className="sa-brandhead__mono">
            {logoUrl ? (
              <Image src={logoUrl} alt={brand.name} width={120} height={120} style={{ objectFit: 'contain', maxWidth: '80%', maxHeight: '80%' }} />
            ) : (
              <span>{brand.name[0]}</span>
            )}
          </div>
          <div>
            <span className="sa-tag sa-tag--blue" style={{ marginBottom: '12px', display: 'inline-block' }}>Émergente</span>
            <h1 className="sa-h1">{brand.name}</h1>
            {brand.description && (
              <p className="sa-brandhead__desc">{brand.description}</p>
            )}
            <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
              {brand.country && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>
                  📍 {brand.country}
                </span>
              )}
              {brand.instagramFollowers && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>
                  {brand.instagramFollowers.toLocaleString('fr-FR')} followers
                </span>
              )}
              {brand.instagram && (
                <a href={brand.instagram} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--brand-orange)', textDecoration: 'none' }}>
                  Instagram →
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {articles.length > 0 && (
        <section className="sa-section">
          <Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: 'Émergentes', href: '/emergentes' }, { label: brand.name }]} />
          <div className="sa-section__head" style={{ marginTop: '32px' }}>
            <h2 className="sa-h2">Articles sur {brand.name}</h2>
          </div>
          <ArticleGrid articles={articles} cols={3} />
        </section>
      )}
    </main>
  )
}
