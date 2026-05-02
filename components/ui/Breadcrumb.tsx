import Link from 'next/link'

type Item = { label: string; href?: string }

export default function Breadcrumb({ items }: { items: Item[] }) {
  return (
    <nav className="sa-breadcrumb" aria-label="Fil d'Ariane"
      itemScope itemType="https://schema.org/BreadcrumbList">
      {items.map((item, i) => (
        <span key={i} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {i > 0 && <span style={{ color: 'var(--fg-3)' }}>/</span>}
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} itemProp="item"><span itemProp="name">{item.label}</span></Link>
          ) : (
            <span className="sa-breadcrumb__current" itemProp="name">{item.label}</span>
          )}
          <meta itemProp="position" content={String(i + 1)} />
        </span>
      ))}
    </nav>
  )
}
