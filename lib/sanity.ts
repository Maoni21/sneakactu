import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

if (!projectId) {
  console.warn(
    '[SneakActu] NEXT_PUBLIC_SANITY_PROJECT_ID manquant — crée un fichier .env.local (voir .env.example). Le site tourne en mode vide.'
  )
}

export const sanityClient = createClient({
  projectId: projectId ?? 'placeholder',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
})

// Image URL builder
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ─── Types TypeScript ──────────────────────────────────────────────────────────

export type SanitySlug = { current: string }

export type SanityImage = {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  alt?: string
  hotspot?: { x: number; y: number }
}

export type Category = {
  _id: string
  name: string
  slug: SanitySlug
  description?: string
  color?: string
}

export type Brand = {
  _id: string
  name: string
  slug: SanitySlug
  logo?: SanityImage
  description?: string
  type: 'grande-marque' | 'emergente'
  instagram?: string
  instagramFollowers?: number
  country?: string
  productType?: string[]
  featured?: boolean
}

export type Article = {
  _id: string
  title: string
  slug: SanitySlug
  excerpt: string
  mainImage: SanityImage
  body: unknown[]
  publishedAt: string
  _updatedAt: string
  categories?: Category[]
  brands?: Brand[]
  tags?: string[]
  readTime?: number
  seoTitle?: string
  seoDescription?: string
}

export type Release = {
  _id: string
  sneakerName: string
  slug: SanitySlug
  brand: Brand
  releaseDate: string
  price?: number
  image: SanityImage
  buyLinks?: Array<{ store: string; url: string }>
  description?: string
  confirmed: boolean
}

// ─── Queries GROQ ──────────────────────────────────────────────────────────────

export const articleFields = `
  _id,
  title,
  slug,
  excerpt,
  mainImage { asset, alt, hotspot },
  publishedAt,
  _updatedAt,
  readTime,
  categories[]->{ _id, name, slug, color },
  brands[]->{ _id, name, slug, logo }
`

export const articleFullFields = `
  ${articleFields},
  body,
  tags,
  seoTitle,
  seoDescription
`

// Récupère tous les articles (listing)
export async function getArticles(limit = 20, offset = 0): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc) [${offset}...${offset + limit}] {
      ${articleFields}
    }`
  )
}

// Article individuel par slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return sanityClient.fetch(
    `*[_type == "article" && !(_id in path("drafts.**")) && slug.current == $slug][0] {
      ${articleFullFields}
    }`,
    { slug }
  )
}

// Articles similaires (même catégorie, exclut l'article courant)
export async function getSimilarArticles(
  articleId: string,
  categoryIds: string[],
  limit = 3
): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && !(_id in path("drafts.**")) && _id != $articleId && count(categories[@._ref in $categoryIds]) > 0] | order(publishedAt desc) [0...$limit] {
      ${articleFields}
    }`,
    { articleId, categoryIds, limit }
  )
}

// Articles par marque — cherche par référence ET par tag
export async function getArticlesByBrand(
  brandSlug: string,
  limit = 20
): Promise<Article[]> {
  const brand = await sanityClient.fetch(
    `*[_type == "brand" && slug.current == $brandSlug][0]{ name }`,
    { brandSlug }
  )
  const brandName = brand?.name ?? ''

  return sanityClient.fetch(
    `*[_type == "article" && !(_id in path("drafts.**")) && (
      $brandSlug in brands[]->slug.current ||
      $brandName in tags
    )] | order(publishedAt desc) [0...$limit] {
      ${articleFields}
    }`,
    { brandSlug, brandName, limit }
  )
}

// Derniers articles (home)
export async function getLatestArticles(limit = 6): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...$limit] {
      ${articleFields}
    }`,
    { limit }
  )
}

// Article hero (le plus récent)
export async function getHeroArticle(): Promise<Article | null> {
  return sanityClient.fetch(
    `*[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc) [0] {
      ${articleFullFields}
    }`
  )
}

// Toutes les marques
export async function getBrands(type?: 'grande-marque' | 'emergente'): Promise<Brand[]> {
  const filter = type ? `&& type == "${type}"` : ''
  return sanityClient.fetch(
    `*[_type == "brand" ${filter}] | order(name asc) {
      _id, name, slug, logo, description, type, instagram,
      instagramFollowers, country, productType, featured,
      "articleCount": count(*[_type == "article" && !(_id in path("drafts.**")) && references(^._id)])
    }`
  )
}

// Marque par slug
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  return sanityClient.fetch(
    `*[_type == "brand" && slug.current == $slug][0] {
      _id, name, slug, logo, description, type, instagram,
      instagramFollowers, country, productType, featured
    }`,
    { slug }
  )
}

// Prochaines releases
export async function getUpcomingReleases(limit = 10): Promise<Release[]> {
  const today = new Date().toISOString().split('T')[0]
  return sanityClient.fetch(
    `*[_type == "release" && releaseDate >= $today] | order(releaseDate asc) [0...$limit] {
      _id, sneakerName, slug, releaseDate, price, image, buyLinks, description, confirmed,
      brand->{ _id, name, slug, logo }
    }`,
    { today, limit }
  )
}

// Toutes les releases
export async function getAllReleases(): Promise<Release[]> {
  return sanityClient.fetch(
    `*[_type == "release"] | order(releaseDate asc) {
      _id, sneakerName, slug, releaseDate, price, image, buyLinks, description, confirmed,
      brand->{ _id, name, slug, logo }
    }`
  )
}

// Toutes les catégories
export async function getCategories(): Promise<Category[]> {
  return sanityClient.fetch(
    `*[_type == "category"] | order(name asc) { _id, name, slug, description, color }`
  )
}

// Search fulltext
export async function searchArticles(query: string): Promise<Article[]> {
  const groqQuery: string = `*[_type == "article" && !(_id in path("drafts.**")) && (title match $query || excerpt match $query || $query in tags)] | order(publishedAt desc) [0...20] { ${articleFields} }`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (sanityClient as any).fetch(groqQuery, { query: `${query}*` })
}

// Slugs pour generateStaticParams
export async function getAllArticleSlugs(): Promise<string[]> {
  const articles = await sanityClient.fetch(
    `*[_type == "article" && !(_id in path("drafts.**")) && defined(slug.current)] { "slug": slug.current }`
  )
  return articles
    .map((a: { slug: string }) => a.slug)
    .filter((s: unknown): s is string => typeof s === 'string' && s.length > 0)
}

export async function getAllBrandSlugs(): Promise<string[]> {
  const brands = await sanityClient.fetch(
    `*[_type == "brand" && defined(slug.current)] { "slug": slug.current }`
  )
  return brands
    .map((b: { slug: string }) => b.slug)
    .filter((s: unknown): s is string => typeof s === 'string' && s.length > 0)
}