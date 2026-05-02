import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticles, getCategories } from '@/lib/sanity'
import ArticleGrid from '@/components/articles/ArticleGrid'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Actualités Sneakers',
  description: 'Toute l\'actualité sneakers : nouvelles sorties, collaborations, leaks et tendances streetwear.',
}

type Props = { searchParams: Promise<{ categorie?: string }> }

export default async function ArticlesPage({ searchParams }: Props) {
  const [articles, categories, params] = await Promise.all([
    getArticles(24).catch(() => []),
    getCategories().catch(() => []),
    searchParams,
  ])

  const active = params.categorie
  const filtered = active
    ? articles.filter((a) => a.categories?.some((c) => c.slug.current === active))
    : articles

  return (
    <main>
      <header className="sa-pagehead">
        <span className="sa-eyebrow">Tous les articles</span>
        <h1 className="sa-h1">Articles</h1>
      </header>

      <section className="sa-section">
        {/* Filter chips */}
        <div className="sa-pillrow" style={{ marginBottom: '32px' }}>
          <Link href="/articles" className={`sa-chip${!active ? ' sa-chip--active' : ''}`}>
            Toutes catégories
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/articles?categorie=${cat.slug.current}`}
              className={`sa-chip${active === cat.slug.current ? ' sa-chip--active' : ''}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <ArticleGrid articles={filtered} cols={3} />
      </section>
    </main>
  )
}
