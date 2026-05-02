import Image from 'next/image'
import { urlFor, type Release } from '@/lib/sanity'

type Props = { release: Release }

function formatReleaseDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr)).toUpperCase()
}

export default function ReleaseCard({ release }: Props) {
  const { sneakerName, brand, releaseDate, price, image, buyLinks } = release

  const imageUrl = image
    ? urlFor(image).width(600).height(600).format('webp').quality(85).url()
    : null

  const firstBuyLink = buyLinks?.[0]

  return (
    <article className="sa-release">
      <div className="sa-release__media">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={image?.alt ?? sneakerName}
            fill
            className="object-cover"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--bg-sunken)' }} />
        )}
      </div>

      <div className="sa-release__body">
        <div className="sa-release__date">{formatReleaseDate(releaseDate)}</div>
        <h4 className="sa-release__name">{sneakerName}</h4>
        <div className="sa-release__brand">{brand?.name ?? '—'}</div>
        <div className="sa-release__row">
          <span className="sa-release__price">{price ? `${price} €` : 'Prix TBD'}</span>
          {firstBuyLink ? (
            <a href={firstBuyLink.url} target="_blank" rel="noopener noreferrer" className="sa-release__buy">
              Où acheter →
            </a>
          ) : (
            <span className="sa-release__buy" style={{ opacity: .4 }}>Bientôt</span>
          )}
        </div>
      </div>
    </article>
  )
}
