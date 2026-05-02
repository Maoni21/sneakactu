import { MetadataRoute } from 'next'
import { sanityClient } from '@/lib/sanity'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sneakactu.fr'

  // Articles
  const articles = await sanityClient.fetch<Array<{ slug: string; publishedAt: string; _updatedAt: string }>>(
    `*[_type == "article"] { "slug": slug.current, publishedAt, _updatedAt }`
  )

  // Marques
  const brands = await sanityClient.fetch<Array<{ slug: string; type: string }>>(
    `*[_type == "brand"] { "slug": slug.current, type }`
  )

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const brandUrls: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/marques/${brand.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: brand.type === 'grande-marque' ? 0.7 : 0.6,
  }))

  const emergenteUrls: MetadataRoute.Sitemap = brands
    .filter((b) => b.type === 'emergente')
    .map((brand) => ({
      url: `${baseUrl}/emergentes/${brand.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/marques`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/emergentes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/releases`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...articleUrls,
    ...brandUrls,
    ...emergenteUrls,
  ]
}
