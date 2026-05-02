import ArticleCard from './ArticleCard'
import type { Article } from '@/lib/sanity'

type Props = {
  articles: Article[]
  cols?: 2 | 3 | 4
}

export default function ArticleGrid({ articles, cols = 3 }: Props) {
  if (!articles.length) {
    return (
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '48px 0' }}>
        Aucun article trouvé.
      </p>
    )
  }

  return (
    <div className={`sa-grid sa-grid--${cols}`}>
      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
  )
}
