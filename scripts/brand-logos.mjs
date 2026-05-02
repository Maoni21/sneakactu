/**
 * SneakActu — Logos des marques via Unsplash
 * Usage : node scripts/brand-logos.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

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

// Terme de recherche Unsplash par slug
const SEARCH_QUERIES = {
  'nike':          'Nike sneaker logo brand',
  'adidas':        'Adidas sneaker brand logo',
  'converse':      'Converse Chuck Taylor sneaker',
  'new-balance':   'New Balance sneaker brand',
  'puma':          'Puma sneaker brand logo',
  'jordan':        'Jordan Brand basketball sneaker',
  'asics':         'Asics running sneaker',
  'vans':          'Vans skateboard sneaker',
  'reebok':        'Reebok classic sneaker',
  'saucony':       'Saucony running sneaker',
  'salomon':       'Salomon trail sneaker',
  'hoka':          'Hoka running shoe',
  'fila':          'Fila sneaker brand',
  'lacoste':       'Lacoste tennis sneaker',
  'under-armour':  'Under Armour sport sneaker',
  'timberland':    'Timberland boots brand',
  'stussy':        'Stussy streetwear brand',
  'supreme':       'Supreme streetwear brand',
  'palace':        'Palace skate brand',
  'kith':          'Kith sneaker store',
  'off-white':     'Off White fashion brand',
  'mizuno':        'Mizuno sport sneaker',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'SneakActu/1.0', ...headers } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location, headers).then(resolve).catch(reject)
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), text: Buffer.concat(chunks).toString() }))
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function searchUnsplash(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=squarish`
  const res = await get(url, { Authorization: `Client-ID ${UNSPLASH_KEY}` })
  if (res.status !== 200) throw new Error(`Unsplash HTTP ${res.status}`)
  const data = JSON.parse(res.text)
  if (!data.results?.length) throw new Error('Aucun résultat')
  // Meilleure photo = plus de likes
  return data.results.sort((a, b) => b.likes - a.likes)[0]
}

async function downloadBuffer(url) {
  const res = await get(url)
  if (res.status !== 200) throw new Error(`Download HTTP ${res.status}`)
  return res.body
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔌 Connexion à Sanity…\n`)

  const brands = await client.fetch(
    `*[_type == "brand"] | order(name asc) { _id, name, slug, logo }`
  )

  console.log(`🏷  ${brands.length} marque(s) trouvée(s)\n`)

  let added = 0
  let skipped = 0

  for (const brand of brands) {
    const slug = brand.slug?.current
    if (!slug) continue

    if (brand.logo?.asset?._ref) {
      console.log(`   ✓  Logo déjà présent : ${brand.name}`)
      skipped++
      continue
    }

    const query = SEARCH_QUERIES[slug] ?? `${brand.name} sneaker brand`
    console.log(`\n   🔍 ${brand.name} — "${query}"`)

    try {
      // 1. Chercher sur Unsplash
      const photo = await searchUnsplash(query)
      console.log(`      → Photo trouvée : ${photo.alt_description?.slice(0, 50) ?? 'sans description'}`)

      // 2. Télécharger en taille small (400px) — adapté pour un logo/vignette
      const buffer = await downloadBuffer(photo.urls.small)
      console.log(`      → ${(buffer.length / 1024).toFixed(0)} Ko`)

      // 3. Upload dans Sanity
      const asset = await client.assets.upload('image', buffer, {
        filename: `logo-${slug}.jpg`,
        contentType: 'image/jpeg',
      })

      // 4. Lier à la marque
      await client.patch(brand._id).set({
        logo: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt: `${brand.name} sneaker`,
        },
      }).commit()

      console.log(`   ✅ Image ajoutée pour ${brand.name} !`)
      added++

      // Respecter le rate limit Unsplash
      await new Promise(r => setTimeout(r, 1200))

    } catch (err) {
      console.log(`   ❌ Échec ${brand.name} : ${err.message}`)
    }
  }

  console.log(`\n${'━'.repeat(50)}`)
  console.log(`✅ ${added} logo(s) ajouté(s)`)
  console.log(`⏭  ${skipped} marque(s) déjà avec image`)
  console.log(`\n🎉 Recharge ton site pour voir les résultats !\n`)
}

main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message)
  process.exit(1)
})
