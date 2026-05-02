import type { Metadata } from 'next'
import { getArticles } from '@/lib/sanity'
import ArticleGrid from '@/components/articles/ArticleGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Guides d\'achat sneakers',
  description: 'Les meilleurs guides d\'achat sneakers : tailles, comparatifs, conseils pour choisir tes prochaines paires Nike, Adidas, New Balance…',
  alternates: { canonical: 'https://sneakactu.fr/guides' },
  openGraph: {
    title: 'Guides d\'achat sneakers — SneakActu',
    description: 'Les meilleurs guides d\'achat sneakers : tailles, comparatifs, conseils pour choisir tes prochaines paires.',
    url: 'https://sneakactu.fr/guides',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default async function GuidesPage() {
  const articles = await getArticles(20).catch(() => [])

  return (
    <main>
      <header className="sa-pagehead">
        <span className="sa-eyebrow">Guides d'achat</span>
        <h1 className="sa-h1">Guides</h1>
        <p className="sa-pagehead__lede">
          Tout ce qu&apos;il faut savoir pour choisir, acheter et entretenir tes sneakers.
          Comparatifs, conseils taille, meilleures paires de l&apos;année.
        </p>
      </header>

      <section className="sa-section">
        <ArticleGrid articles={articles} cols={3} />
      </section>
    </main>
  )
}
