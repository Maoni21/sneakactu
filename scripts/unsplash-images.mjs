/**
 * SneakActu — Illustration automatique des articles via Unsplash
 * Usage : node scripts/unsplash-images.mjs
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// Cherche une photo sur Unsplash
async function searchUnsplash(query) {
  const encoded = encodeURIComponent(query)
  const url = `https://api.unsplash.com/search/photos?query=${encoded}&per_page=3&orientation=landscape&content_filter=high`
  const res = await get(url, { Authorization: `Client-ID ${UNSPLASH_KEY}` })

  if (res.status !== 200) throw new Error(`Unsplash API: HTTP ${res.status}`)

  const data = JSON.parse(res.text)
  if (!data.results?.length) return null

  // Prendre la photo avec le plus de likes (= meilleure qualité généralement)
  const best = data.results.sort((a, b) => b.likes - a.likes)[0]
  return {
    downloadUrl: best.urls.regular, // 1080px, suffisant pour le web
    alt: best.alt_description || query,
    credit: `Photo by ${best.user.name} on Unsplash`,
    unsplashId: best.id,
  }
}

// Télécharge un buffer depuis une URL
async function download(url) {
  const res = await get(url)
  if (res.status !== 200) throw new Error(`Download HTTP ${res.status}`)
  return res.body
}

// Construit la requête de recherche optimale depuis l'article
function buildQuery(article) {
  const title = article.title || ''
  const tags = article.tags || []

  // Extraire les mots-clés pertinents du titre
  const sneakerKeywords = ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Converse',
    'Vans', 'Asics', 'Reebok', 'Samba', 'Air Max', 'Dunk', 'Air Force']

  const foundBrand = sneakerKeywords.find(k =>
    title.toLowerCase().includes(k.toLowerCase()) ||
    tags.some(t => t.toLowerCase().includes(k.toLowerCase()))
  )

  if (foundBrand) return `${foundBrand} sneaker`

  // Fallback : premier tag + sneaker
  if (tags.length > 0) return `${tags[0]} sneaker`

  return 'sneaker streetwear'
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔌 Connexion à Sanity…\n`)

  const articles = await client.fetch(
    `*[_type == "article"] | order(publishedAt desc) {
      _id, title, slug, tags, mainImage
    }`
  )

  console.log(`📰 ${articles.length} article(s) trouvé(s)\n`)

  let added = 0
  let skipped = 0

  for (const article of articles) {
    if (article.mainImage?.asset?._ref) {
      console.log(`   ✓  Déjà une image : "${article.title?.slice(0, 45)}"`)
      skipped++
      continue
    }

    const query = buildQuery(article)
    console.log(`\n   🔍 "${article.title?.slice(0, 45)}…"`)
    console.log(`      Recherche Unsplash : "${query}"`)

    try {
      // 1. Chercher sur Unsplash
      const photo = await searchUnsplash(query)
      if (!photo) {
        console.log(`      ⚠️  Aucun résultat Unsplash`)
        continue
      }
      console.log(`      → Trouvé : ${photo.alt?.slice(0, 50)}`)

      // 2. Télécharger l'image
      const buffer = await download(photo.downloadUrl)
      console.log(`      → ${(buffer.length / 1024).toFixed(0)} Ko téléchargés`)

      // 3. Uploader dans Sanity
      const slugStr = article.slug?.current ?? article._id
      const asset = await client.assets.upload('image', buffer, {
        filename: `article-${slugStr}.jpg`,
        contentType: 'image/jpeg',
      })

      // 4. Lier à l'article
      await client.patch(article._id).set({
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt: photo.alt || article.title,
        },
      }).commit()

      console.log(`   ✅ Image ajoutée !`)
      added++

      // Pause pour respecter le rate limit Unsplash (50 req/h)
      await new Promise(r => setTimeout(r, 1200))

    } catch (err) {
      console.log(`   ❌ Erreur : ${err.message}`)
    }
  }

  console.log(`\n${'━'.repeat(50)}`)
  console.log(`✅ ${added} image(s) ajoutée(s)`)
  console.log(`⏭  ${skipped} article(s) déjà illustré(s)`)
  console.log(`\n🎉 Recharge ton site pour voir les images !\n`)
}

main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message)
  process.exit(1)
})
