import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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
    title: `Sneakers ${brand.name} — Toute l'actu`,
    description: brand.description ?? `Toute l'actualité sneakers ${brand.name} sur SneakActu.`,
    alternates: { canonical: `/marques/${slug}` },
  }
}

export default async function MarquePage({ params }: Props) {
  const { slug } = await params
  const [brand, articles] = await Promise.all([
    getBrandBySlug(slug).catch(() => null),
    getArticlesByBrand(slug).catch(() => []),
  ])

  if (!brand) notFound()

  const logoUrl = brand.logo
    ? urlFor(brand.logo).width(200).height(200).format('webp').quality(90).url()
    : null

  return (
    <main>
      {/* Brand header — sunken bg */}
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
            <span className="sa-eyebrow">Marque</span>
            <h1 className="sa-h1">{brand.name}</h1>
            <p className="sa-brandhead__desc">
              {brand.description
                ? brand.description
                : `Tout ce qu'on a écrit sur ${brand.name} : analyses, drops, retros et collabs. ${articles.length} article${articles.length !== 1 ? 's' : ''} publié${articles.length !== 1 ? 's' : ''}.`}
            </p>
          </div>
        </div>
      </header>

      {/* Articles */}
      <section className="sa-section">
        <Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: 'Marques', href: '/marques' }, { label: brand.name }]} />

        <div className="sa-pillrow" style={{ margin: '32px 0' }}>
          <span className="sa-chip sa-chip--active">Tout</span>
          {['Releases', 'Analyses', 'Collabs', 'Retros'].map((f) => (
            <span key={f} className="sa-chip">{f}</span>
          ))}
        </div>

        {articles.length > 0 ? (
          <ArticleGrid articles={articles} cols={3} />
        ) : (
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg-2)', fontSize: '17px', lineHeight: 1.6 }}>
            Aucun article sur cette marque pour le moment.
          </p>
        )}
      </section>
    </main>
  )
}
