import Link from 'next/link'
import Image from 'next/image'
import { urlFor, type Article } from '@/lib/sanity'
import { formatDateShort } from '@/lib/utils'

type Props = {
  article: Article
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: Props) {
  const { title, slug, excerpt, mainImage, publishedAt, categories, readTime } = article

  const imageUrl = mainImage
    ? urlFor(mainImage).width(featured ? 1200 : 800).height(featured ? 750 : 500).format('webp').quality(85).url()
    : null

  const kicker = categories?.[0]?.name ?? null

  if (!slug?.current) return null

  return (
    <Link href={`/articles/${slug.current}`} className={`sa-card${featured ? ' sa-card--feat' : ''}`}>
      <div className="sa-card__media">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={mainImage?.alt ?? title}
            fill
            className="object-cover"
            style={{ transition: 'transform 0.3s ease', }}
            sizes={featured ? '(max-width:768px) 100vw, 50vw' : '(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw'}
            priority={featured}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--bg-sunken)' }} />
        )}
      </div>

      <div className="sa-card__body">
        {kicker && <span className="sa-kicker">{kicker}</span>}
        <h3 className="sa-card__title">{title}</h3>
        <div className="sa-card__meta">
          {formatDateShort(publishedAt)}
          {readTime ? ` · ${readTime} min` : ''}
        </div>
      </div>
    </Link>
  )
}
