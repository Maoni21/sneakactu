/**
 * SneakActu — Supprime les anciens articles remplacés par les nouveaux
 * Garde les 15 articles des marques (Nike/Adidas/Converse/NB/Puma)
 * et supprime les anciens qui parlent des mêmes sujets
 * Usage : node scripts/clean-old-articles.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

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

// Les 15 slugs qu'on veut garder (créés par seed-brand-articles.mjs)
const KEEP_SLUGS = new Set([
  'nike-air-max-dn8-2025',
  'nike-dunk-low-paris-2025',
  'nike-air-force-1-40-ans',
  'adidas-samba-og-2025-retour',
  'adidas-gazelle-bold-tendance',
  'adidas-ultraboost-2025-running',
  'converse-chuck-70-de-luxe-squared',
  'converse-run-star-hike-plateforme',
  'converse-one-star-pro-skate',
  'new-balance-1000-made-in-usa',
  'new-balance-990v6-heritage',
  'new-balance-327-collaborations-2025',
  'puma-suede-xl-2025',
  'puma-mb03-lamelo-ball',
  'puma-speedcat-retour-90s',
])

// Marques concernées — on supprime les vieux articles qui parlent d'elles
const BRAND_KEYWORDS = ['nike', 'adidas', 'converse', 'new balance', 'puma', 'jordan', 'air max', 'dunk', 'samba', 'gazelle', 'chuck', 'suede']

function articleMatchesBrand(article) {
  const text = [
    article.title ?? '',
    ...(article.tags ?? []),
  ].join(' ').toLowerCase()
  return BRAND_KEYWORDS.some(k => text.includes(k))
}

async function main() {
  console.log(`\n🔌 Connexion à Sanity…\n`)

  const articles = await client.fetch(
    `*[_type == "article"] | order(publishedAt asc) { _id, title, slug, tags, publishedAt }`
  )

  console.log(`📰 ${articles.length} article(s) au total\n`)

  const toDelete = []
  const toKeep = []

  for (const art of articles) {
    const slug = art.slug?.current ?? ''

    if (KEEP_SLUGS.has(slug)) {
      toKeep.push(art)
      continue
    }

    // Article hors liste → supprimer s'il parle des mêmes marques
    if (articleMatchesBrand(art)) {
      console.log(`   🗑  À supprimer : "${art.title?.slice(0, 60)}" (${slug})`)
      toDelete.push(art._id)
    } else {
      toKeep.push(art)
      console.log(`   ✓  Conservé    : "${art.title?.slice(0, 60)}" (${slug})`)
    }
  }

  if (toDelete.length === 0) {
    console.log('\n✅ Rien à supprimer.\n')
    return
  }

  console.log(`\n🗑  Suppression de ${toDelete.length} article(s) en double…\n`)

  let deleted = 0
  for (const id of toDelete) {
    try {
      await client.delete(id)
      deleted++
    } catch (err) {
      console.log(`   ❌ Échec : ${err.message}`)
    }
  }

  console.log(`${'━'.repeat(55)}`)
  console.log(`✅ ${deleted} ancien(s) article(s) supprimé(s)`)
  console.log(`📰 ${toKeep.length} article(s) conservé(s)`)
  console.log(`\n🎉 Recharge ton site !\n`)
}

main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message)
  process.exit(1)
})
