/**
 * SneakActu — Illustration ciblée des articles via Unsplash
 * Usage : node scripts/illustrate-articles.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  try {
    const lines = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8').split('\n')
    for (const line of lines) {
      const [k, ...v] = line.split('=')
      if (k && v.length) process.env[k.trim()] = v.join('=').trim()
    }
  } catch {}
}
loadEnv()

const UNSPLASH_KEY = 'OaX7hJQBmigP8CGy31yAZ7W910uNmckX5HZZUiFPGxw'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Requêtes Unsplash ciblées par slug d'article
const QUERIES = {
  // Nike
  'nike-air-max-dn8-2025':         'Nike Air Max sneaker futuristic sole',
  'nike-dunk-low-paris-2025':      'Nike Dunk Low sneaker colorful street',
  'nike-air-force-1-40-ans':       'Nike Air Force 1 white sneaker classic',
  // Adidas
  'adidas-samba-og-2025-retour':   'Adidas Samba sneaker lifestyle street',
  'adidas-gazelle-bold-tendance':  'Adidas Gazelle sneaker fashion platform',
  'adidas-ultraboost-2025-running':'Adidas Ultraboost running shoe performance',
  // Converse
  'converse-chuck-70-de-luxe-squared': 'Converse Chuck Taylor sneaker canvas',
  'converse-run-star-hike-plateforme': 'Converse platform chunky sole sneaker',
  'converse-one-star-pro-skate':       'Converse skateboard shoe street',
  // New Balance
  'new-balance-1000-made-in-usa':      'New Balance premium sneaker craftsmanship',
  'new-balance-990v6-heritage':        'New Balance 990 grey sneaker running',
  'new-balance-327-collaborations-2025':'New Balance 327 vintage sneaker colorful',
  // Puma
  'puma-suede-xl-2025':            'Puma Suede sneaker classic street',
  'puma-mb03-lamelo-ball':         'Puma basketball sneaker bold colorful',
  'puma-speedcat-retour-90s':      'Puma racing motorsport sneaker low profile',
}

// Fallback par tags
function buildFallbackQuery(article) {
  const brands = ['Nike', 'Adidas', 'Converse', 'New Balance', 'Puma', 'Jordan']
  const found = brands.find(b =>
    article.title?.toLowerCase().includes(b.toLowerCase()) ||
    article.tags?.some(t => t.toLowerCase().includes(b.toLowerCase()))
  )
  if (found) return `${found} sneaker`
  if (article.tags?.length) return `${article.tags[0]} sneaker`
  return 'sneaker streetwear'
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib.get(url, { headers: { 'User-Agent': 'SneakActu/1.0', ...headers } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location, headers).then(resolve).catch(reject)
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => {
        const body = Buffer.concat(chunks)
        resolve({ status: res.statusCode, body, text: body.toString() })
      })
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function searchUnsplash(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&content_filter=high`
  const res = await get(url, { Authorization: `Client-ID ${UNSPLASH_KEY}` })
  if (res.status !== 200) throw new Error(`Unsplash HTTP ${res.status}`)
  const data = JSON.parse(res.text)
  if (!data.results?.length) return null
  // Meilleure photo = plus de likes
  return data.results.sort((a, b) => b.likes - a.likes)[0]
}

async function download(url) {
  const res = await get(url)
  if (res.status !== 200) throw new Error(`Download HTTP ${res.status}`)
  return res.body
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔌 Connexion à Sanity…\n`)

  const articles = await client.fetch(
    `*[_type == "article"] | order(publishedAt desc) { _id, title, slug, tags, mainImage }`
  )

  console.log(`📰 ${articles.length} article(s) trouvé(s)\n`)

  let added = 0
  let skipped = 0

  for (const article of articles) {
    if (article.mainImage?.asset?._ref) {
      console.log(`   ✓  Image déjà présente : "${article.title?.slice(0, 45)}"`)
      skipped++
      continue
    }

    const slug = article.slug?.current ?? ''
    const query = QUERIES[slug] ?? buildFallbackQuery(article)

    console.log(`\n   🔍 "${article.title?.slice(0, 50)}"`)
    console.log(`      Query : "${query}"`)

    try {
      const photo = await searchUnsplash(query)
      if (!photo) {
        console.log(`      ⚠️  Aucun résultat Unsplash`)
        continue
      }
      console.log(`      → ${photo.alt_description?.slice(0, 60) ?? 'sans description'}`)

      const buffer = await download(photo.urls.regular)
      console.log(`      → ${(buffer.length / 1024).toFixed(0)} Ko`)

      const asset = await client.assets.upload('image', buffer, {
        filename: `article-${slug || article._id}.jpg`,
        contentType: 'image/jpeg',
      })

      await client.patch(article._id).set({
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt: photo.alt_description || article.title,
        },
      }).commit()

      console.log(`   ✅ Illustré !`)
      added++

      // Respecter le rate limit Unsplash (50 req/h)
      await new Promise(r => setTimeout(r, 1300))

    } catch (err) {
      console.log(`   ❌ Erreur : ${err.message}`)
    }
  }

  console.log(`\n${'━'.repeat(60)}`)
  console.log(`✅ ${added} article(s) illustré(s)`)
  console.log(`⏭  ${skipped} article(s) déjà avec image`)
  console.log(`\n🎉 Recharge ton site !\n`)
}

main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message)
  process.exit(1)
})
