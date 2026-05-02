/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://sneakactu.fr',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/studio*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api/'],
      },
    ],
    additionalSitemaps: [
      'https://sneakactu.fr/sitemap.xml',
    ],
  },
  // Pages supplémentaires avec priority custom
  additionalPaths: async () => {
    return [
      { loc: '/', changefreq: 'hourly', priority: 1.0 },
      { loc: '/articles', changefreq: 'hourly', priority: 0.9 },
      { loc: '/marques', changefreq: 'daily', priority: 0.8 },
      { loc: '/emergentes', changefreq: 'daily', priority: 0.8 },
      { loc: '/releases', changefreq: 'daily', priority: 0.9 },
      { loc: '/guides', changefreq: 'weekly', priority: 0.7 },
    ]
  },
}
