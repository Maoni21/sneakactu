import Link from 'next/link'
import Image from 'next/image'
import { urlFor, type Brand } from '@/lib/sanity'

type Props = { brand: Brand }

export default function EmergenteCard({ brand }: Props) {
  const imageUrl = brand.logo
    ? urlFor(brand.logo).width(800).height(600).format('webp').quality(85).url()
    : null

  return (
    <Link href={`/emergentes/${brand.slug.current}`} className="sa-emergente">
      <div className="sa-emergente__media">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={brand.name}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--brand-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--brand-paper)' }}>
              {brand.name[0]}
            </span>
          </div>
        )}
        <span className="sa-tag sa-tag--blue sa-emergente__badge">Émergente</span>
      </div>

      <div className="sa-emergente__body">
        <h4 className="sa-emergente__name">{brand.name}</h4>
        <div className="sa-emergente__meta">
          {brand.country && <span>{brand.country}</span>}
          {brand.country && brand.instagramFollowers && <span>·</span>}
          {brand.instagramFollowers && (
            <span>{(brand.instagramFollowers / 1000).toFixed(0)}K followers</span>
          )}
        </div>
        {brand.description && (
          <p className="sa-emergente__desc">{brand.description}</p>
        )}
      </div>
    </Link>
  )
}
