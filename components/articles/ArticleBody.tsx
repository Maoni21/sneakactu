import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

const components = {
  types: {
    image: ({ value }: { value: { asset: unknown; alt?: string; caption?: string } }) => {
      if (!value?.asset) return null
      const url = urlFor(value as Parameters<typeof urlFor>[0]).width(1200).format('webp').quality(90).url()
      return (
        <figure style={{ margin: '32px 0' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
            <Image src={url} alt={value.alt ?? ''} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 760px" />
          </div>
          {value.caption && (
            <figcaption style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--fg-2)', marginTop: '8px' }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({ value, children }: { value?: { href: string; blank?: boolean }; children: React.ReactNode }) => (
      <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel={value?.blank ? 'noopener noreferrer' : undefined}>
        {children}
      </a>
    ),
    internalLink: ({ value, children }: { value?: { reference?: { slug?: { current: string } } }; children: React.ReactNode }) => {
      const slug = value?.reference?.slug?.current
      return slug ? <a href={`/articles/${slug}`}>{children}</a> : <>{children}</>
    },
  },
  block: {
    h2: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 800, margin: '40px 0 16px', color: 'var(--fg-1)' }}>{children}</h3>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="sa-pull"><p>{children}</p></blockquote>
    ),
    normal: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul style={{ paddingLeft: '24px', margin: '16px 0', fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: 1.65 }}>{children}</ul>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <ol style={{ paddingLeft: '24px', margin: '16px 0', fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: 1.65 }}>{children}</ol>
    ),
  },
}

export default function ArticleBody({ body }: { body: unknown[] }) {
  return (
    <div className="sa-article__body">
      <PortableText value={body as Parameters<typeof PortableText>[0]['value']} components={components} />
    </div>
  )
}
