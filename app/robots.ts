import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/'],
      },
    ],
    sitemap: 'https://sneakactu.fr/sitemap.xml',
    host: 'https://sneakactu.fr',
  }
}
