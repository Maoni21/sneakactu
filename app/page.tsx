import Image from 'next/image'
import Link from 'next/link'
import {
  getHeroArticle,
  getLatestArticles,
  getBrands,
  getUpcomingReleases,
  urlFor,
} from '@/lib/sanity'
import { formatDateShort } from '@/lib/utils'
import ArticleGrid from '@/components/articles/ArticleGrid'
import BrandCard from '@/components/brands/BrandCard'
import EmergenteCard from '@/components/brands/EmergenteCard'
import ReleaseCard from '@/components/releases/ReleaseCard'

export const revalidate = 60

export default async function HomePage() {
  const [hero, articles, brands, releases] = await Promise.all([
    getHeroArticle().catch(() => null),
    getLatestArticles(6).catch(() => []),
    getBrands().catch(() => []),
    getUpcomingReleases(5).catch(() => []),
  ])

  const heroImageUrl = hero?.mainImage
    ? urlFor(hero.mainImage).width(1600).height(900).format('webp').quality(90).url()
    : null

  const grandsBrands = brands.filter((b) => b.type === 'grande-marque')
  const emergentBrands = brands.filter((b) => b.type === 'emergente').slice(0, 3)
  const heroCategory = hero?.categories?.[0]?.name ?? 'Actualité'

  return (
    <main>
      {/* ── HERO ── */}
      {hero && hero.slug?.current ? (
        <Link href={`/articles/${hero.slug.current}`} className="sa-hero" aria-label={`Lire : ${hero.title}`}>
          <div className="sa-hero__media">
            {heroImageUrl && (
              <Image
                src={heroImageUrl}
                alt={hero.mainImage?.alt ?? hero.title}
                fill
                priority
                style={{ objectFit: 'cover' }}
                sizes="100vw"
              />
            )}
            <div className="sa-hero__shade" />
            <div className="sa-hero__overlay">
              <span className="sa-kicker sa-kicker--invert">{heroCategory}</span>
              <h1 className="sa-hero__title">{hero.title}</h1>
              <div className="sa-hero__meta">
                <span>{formatDateShort(hero.publishedAt)}</span>
                <span>·</span>
                <span>{hero.readTime ? `${hero.readTime} min de lecture` : 'Lire l\'article'}</span>
              </div>
            </div>
            <span className="sa-btn sa-btn--accent sa-hero__cta">Lire l&apos;article →</span>
          </div>
        </Link>
      ) : (
        /* Hero placeholder when no Sanity data */
        <div className="sa-hero">
          <div className="sa-hero__media" style={{ background: 'var(--brand-ink)' }}>
            <div className="sa-hero__shade" />
            <div className="sa-hero__overlay">
              <span className="sa-kicker sa-kicker--invert">Actualité</span>
              <h1 className="sa-hero__title">Bienvenue sur SneakActu</h1>
              <div className="sa-hero__meta">
                <span>Ajoutez vos premiers articles dans Sanity Studio</span>
              </div>
            </div>
            <Link href="/studio" className="sa-btn sa-btn--accent sa-hero__cta">
              Ouvrir le Studio →
            </Link>
          </div>
        </div>
      )}

      {/* ── DERNIÈRES ACTUS ── */}
      <section className="sa-section">
        <div className="sa-section__head">
          <h2 className="sa-h2">Dernières actus</h2>
          <Link href="/articles" className="sa-section__more">Toutes les actus →</Link>
        </div>
        {articles.length > 0 ? (
          <ArticleGrid articles={articles} cols={3} />
        ) : (
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg-2)', fontSize: '17px', lineHeight: 1.6 }}>
            Aucun article publié pour le moment. Commencez à rédiger dans{' '}
            <Link href="/studio">Sanity Studio</Link>.
          </p>
        )}
      </section>

      {/* ── MARQUES ── */}
      {grandsBrands.length > 0 && (
        <section className="sa-section sa-section--sunken">
          <div className="sa-section__head">
            <h2 className="sa-h2">Marques</h2>
            <Link href="/marques" className="sa-section__more">Toutes les marques →</Link>
          </div>
          <div className="sa-brandbar">
            {grandsBrands.map((brand) => (
              <BrandCard key={brand._id} brand={brand} variant="pill" />
            ))}
          </div>
        </section>
      )}

      {/* ── ÉMERGENTES ── */}
      {emergentBrands.length > 0 && (
        <section className="sa-section">
          <div className="sa-section__head">
            <div>
              <span className="sa-eyebrow" style={{ display: 'block', marginBottom: '4px' }}>Le différenciant</span>
              <h2 className="sa-h2">Émergentes</h2>
            </div>
            <Link href="/emergentes" className="sa-section__more">Toutes les émergentes →</Link>
          </div>
          <div className="sa-grid sa-grid--3">
            {emergentBrands.map((brand) => (
              <EmergenteCard key={brand._id} brand={brand} />
            ))}
          </div>
        </section>
      )}

      {/* ── RELEASES — fond ink ── */}
      {releases.length > 0 && (
        <section className="sa-section sa-section--ink">
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div className="sa-section__head sa-section__head--invert">
              <h2 className="sa-h2 sa-h2--invert">Prochaines releases</h2>
              <Link href="/releases" className="sa-section__more sa-section__more--invert">
                Calendrier complet →
              </Link>
            </div>
            <div className="sa-grid sa-grid--5">
              {releases.map((release) => (
                <ReleaseCard key={release._id} release={release} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
