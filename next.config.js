/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  // ISR revalidation par défaut
  experimental: {
    // Needed for Sanity Studio if embedded
  },
}

module.exports = nextConfig
