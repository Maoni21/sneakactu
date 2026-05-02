import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  getArticleBySlug,
  getSimilarArticles,
  getAllArticleSlugs,
  urlFor,
} from '@/lib/sanity'
import { formatDate } from '@/lib/utils'
import ArticleBody from '@/components/articles/ArticleBody'
import ArticleGrid from '@/components/articles/ArticleGrid'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs().catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug).catch(() => null)
  if (!article) return {}
  const title = article.seoTitle ?? article.title
  const description = article.seoDescription ?? article.excerpt
  const imageUrl = article.mainImage ? urlFor(article.mainImage).width(1200).height(630).format('webp').url() : undefined
  return {
    title,
    description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title, description, type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article._updatedAt,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug).catch(() => null)
  if (!article) notFound()

  const categoryIds = article.categories?.map((c) => c._id) ?? []
  const similar = categoryIds.length
    ? await getSimilarArticles(article._id, categoryIds, 3).catch(() => [])
    : []

  const heroUrl = article.mainImage
    ? urlFor(article.mainImage).width(1600).height(900).format('webp').quality(90).url()
    : null

  const kicker = article.categories?.[0]?.name ?? null

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: heroUrl ?? '',
    datePublished: article.publishedAt,
    dateModified: article._updatedAt,
    author: { '@type': 'Organization', name: 'SneakActu', url: 'https://sneakactu.fr' },
    publisher: {
      '@type': 'Organization',
      name: 'SneakActu',
      logo: { '@type': 'ImageObject', url: 'https://sneakactu.fr/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://sneakactu.fr/articles/${slug}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <div className="sa-article">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: 'Accueil', href: '/' },
            { label: 'Articles', href: '/articles' },
            { label: article.title },
          ]} />

          {/* Header */}
          <header className="sa-article__head">
            {kicker && <span className="sa-kicker">{kicker}</span>}
            <h1 className="sa-article__title">{article.title}</h1>
            <p className="sa-article__lede">{article.excerpt}</p>
            <div className="sa-article__meta">
              <span>Par SneakActu</span>
              <span>·</span>
              <span>{formatDate(article.publishedAt)}</span>
              {article.readTime && (
                <>
                  <span>·</span>
                  <span>{article.readTime} min de lecture</span>
                </>
              )}
              {article.brands && article.brands.length > 0 && (
                <>
                  <span>·</span>
                  {article.brands.map((b) => (
                    <Link key={b._id} href={`/marques/${b.slug.current}`} style={{ color: 'var(--brand-orange)', textDecoration: 'none' }}>
                      {b.name}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </header>
        </div>

        {/* Hero image — même largeur que le texte */}
        {heroUrl && (
          <div className="sa-article">
            <div className="sa-article__hero" style={{ position: 'relative' }}>
              <Image
                src={heroUrl}
                alt={article.mainImage?.alt ?? article.title}
                fill
                priority
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 760px) 100vw, 760px"
              />
            </div>
            {article.mainImage?.alt && (
              <p style={{ marginTop: '10px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--fg-2)', lineHeight: 1.4 }}>
                {article.mainImage.alt}
              </p>
            )}
          </div>
        )}

        {/* Body */}
        <div className="sa-article">
          {article.body && <ArticleBody body={article.body} />}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-1)' }}>
              {article.tags.map((tag) => (
                <span key={tag} className="sa-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Articles similaires */}
        {similar.length > 0 && (
          <section className="sa-section" style={{ borderTop: '1px solid var(--border-1)', marginTop: '80px' }}>
            <div className="sa-section__head">
              <h2 className="sa-h2">À lire aussi</h2>
            </div>
            <ArticleGrid articles={similar} cols={3} />
          </section>
        )}
      </article>
    </>
  )
}
