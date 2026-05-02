import Link from 'next/link'
import Image from 'next/image'
import { urlFor, type Brand } from '@/lib/sanity'

type Props = {
  brand: Brand & { articleCount?: number }
  variant?: 'pill' | 'card'
}

export default function BrandCard({ brand, variant = 'pill' }: Props) {
  const logoUrl = brand.logo
    ? urlFor(brand.logo).width(600).height(600).format('webp').quality(90).url()
    : null

  if (!brand.slug?.current) return null

  const href = brand.type === 'emergente'
    ? `/emergentes/${brand.slug.current}`
    : `/marques/${brand.slug.current}`

  if (variant === 'card') {
    // Grid card variant (for /marques listing)
    return (
      <Link href={href} className="sa-card" style={{ textDecoration: 'none' }}>
        <div className="sa-card__media" style={{ aspectRatio: '1' }}>
          {logoUrl ? (
            <div style={{ position: 'absolute', inset: '16px' }}>
              <Image
                src={logoUrl}
                alt={brand.name}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--brand-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--brand-paper)' }}>
                {brand.name[0]}
              </span>
            </div>
          )}
        </div>
        <div className="sa-card__body">
          <h3 className="sa-card__title" style={{ fontSize: '16px' }}>{brand.name}</h3>
          <div className="sa-card__meta">
            {brand.country && `${brand.country} · `}
            {brand.articleCount ?? 0} article{(brand.articleCount ?? 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </Link>
    )
  }

  // Default: BrandPill (used in homepage brandbar)
  return (
    <Link href={href} className="sa-brandpill">
      <div className="sa-brandpill__logo">
        {logoUrl ? (
          <Image src={logoUrl} alt={brand.name} width={56} height={56} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', padding: '6px' }} />
        ) : (
          <span>{brand.name[0]}</span>
        )}
      </div>
      <div className="sa-brandpill__name">{brand.name}</div>
      <div className="sa-brandpill__count">{brand.articleCount ?? 0} articles</div>
    </Link>
  )
}
