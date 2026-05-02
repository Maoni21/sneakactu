import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/sanity'

type CategoryBadgeProps = {
  category: Category
  className?: string
  clickable?: boolean
}

export default function CategoryBadge({
  category,
  className,
  clickable = true,
}: CategoryBadgeProps) {
  const baseClass = cn(
    'inline-flex items-center text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md transition-opacity',
    category.color ?? 'bg-primary',
    'text-white',
    clickable && 'hover:opacity-80 cursor-pointer',
    className
  )

  if (clickable) {
    return (
      <Link href={`/articles?categorie=${category.slug.current}`} className={baseClass}>
        {category.name}
      </Link>
    )
  }

  return <span className={baseClass}>{category.name}</span>
}
