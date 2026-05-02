/**
 * SneakActu — Logos des marques + liaison articles↔marques
 * Usage : node scripts/seed-brand-logos.mjs
 *
 * 1. Télécharge les logos via Clearbit (gratuit)
 * 2. Les uploade dans Sanity
 * 3. Lie chaque article à sa marque selon les tags
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

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ─── Config logos ─────────────────────────────────────────────────────────────
// Clearbit Logo API : logo officiel haute qualité, licence libre pour affichage
const BRAND_LOGOS = {
  'nike':        { domain: 'nike.com',        tagVariants: ['Nike'] },
  'adidas':      { domain: 'adidas.com',       tagVariants: ['Adidas'] },
  'converse':    { domain: 'converse.com',     tagVariants: ['Converse', 'Chuck Taylor'] },
  'new-balance': { domain: 'newbalance.com',   tagVariants: ['New Balance', 'New Balance 1906R'] },
  'puma':        { domain: 'puma.com',         tagVariants: ['Puma'] },
  'jordan':      { domain: 'nike.com/jordan',  tagVariants: ['Jordan', 'Jordan 1', 'Jordan Brand'] },
}

// ─── Helper download ──────────────────────────────────────────────────────────
function download(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib.get(url, { headers: { 'User-Agent': 'SneakActu/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
        return download(res.headers.location, redirects - 1).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

// ─── PARTIE 1 : Logos ─────────────────────────────────────────────────────────
async function addLogos() {
  console.log('━━━ PARTIE 1 : Logos des marques ━━━\n')

  const brands = await client.fetch(
    `*[_type == "brand" && defined(slug.current)] { _id, name, slug, logo }`
  )

  for (const brand of brands) {
    const slug = brand.slug.current
    const config = BRAND_LOGOS[slug]

    if (!config) {
      console.log(`   ⏭  Pas de config logo pour : ${brand.name}`)
      continue
    }

    if (brand.logo?.asset?._ref) {
      console.log(`   ✓  Logo déjà présent : ${brand.name}`)
      continue
    }

    const logoUrl = `https://logo.clearbit.com/${config.domain.replace('/jordan', '')}`
    console.log(`   📥 Téléchargement logo ${brand.name}…`)

    try {
      const buffer = await download(logoUrl)
      console.log(`      → ${(buffer.length / 1024).toFixed(0)} Ko`)

      const asset = await client.assets.upload('image', buffer, {
        filename: `logo-${slug}.png`,
        contentType: 'image/png',
      })

      await client.patch(brand._id).set({
        logo: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt: `Logo ${brand.name}`,
        },
      }).commit()

      console.log(`   ✅ Logo ${brand.name} ajouté !\n`)
    } catch (err) {
      console.log(`   ⚠️  Échec logo ${brand.name} : ${err.message}\n`)
    }
  }
}

// ─── PARTIE 2 : Liaison articles↔marques ─────────────────────────────────────
async function linkArticlesToBrands() {
  console.log('━━━ PARTIE 2 : Liaison articles ↔ marques ━━━\n')

  const [articles, brands] = await Promise.all([
    client.fetch(`*[_type == "article" && defined(tags)] { _id, title, tags, brands }`),
    client.fetch(`*[_type == "brand" && defined(slug.current)] { _id, name, slug }`),
  ])

  console.log(`   ${articles.length} articles · ${brands.length} marques\n`)

  let linked = 0

  for (const article of articles) {
    const tags = article.tags ?? []
    const existingRefs = (article.brands ?? []).map(b => b._ref)
    const toAdd = []

    for (const brand of brands) {
      // Déjà lié ?
      if (existingRefs.includes(brand._id)) continue

      const config = BRAND_LOGOS[brand.slug.current]
      if (!config) continue

      // Cherche le nom de la marque dans les tags de l'article
      const match = config.tagVariants.some(variant =>
        tags.some(tag => tag.toLowerCase().includes(variant.toLowerCase()))
      )

      if (match) {
        toAdd.push({ _type: 'reference', _ref: brand._id, _key: brand._id })
      }
    }

    if (toAdd.length === 0) continue

    // Ajouter les références
    const currentBrands = (article.brands ?? []).map((b, i) => ({
      ...b,
      _key: b._key ?? `brand-${i}`,
    }))

    await client.patch(article._id).set({
      brands: [...currentBrands, ...toAdd],
    }).commit()

    const names = toAdd.map(r => brands.find(b => b._id === r._ref)?.name).join(', ')
    console.log(`   ✅ "${article.title.slice(0, 45)}…"`)
    console.log(`      → lié à : ${names}\n`)
    linked++
  }

  if (linked === 0) {
    console.log('   ℹ️  Aucun nouveau lien à créer (tout est déjà à jour)\n')
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔌 Connexion à Sanity (${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID})\n`)

  await addLogos()
  await linkArticlesToBrands()

  console.log('🎉 Tout est bon ! Recharge le site pour voir les logos et les articles par marque.\n')
}

main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message)
  process.exit(1)
})
