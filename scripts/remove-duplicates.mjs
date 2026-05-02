/**
 * SneakActu — Supprime les articles en double (même slug ou même titre)
 * Usage : node scripts/remove-duplicates.mjs
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

async function main() {
  console.log(`\n🔌 Connexion à Sanity…\n`)

  const articles = await client.fetch(
    `*[_type == "article"] | order(publishedAt asc) { _id, title, slug, publishedAt, mainImage }`
  )

  console.log(`📰 ${articles.length} article(s) trouvé(s)\n`)

  // Détecter les doublons par slug
  const seenSlugs = new Map()   // slug → _id du premier (qu'on garde)
  const seenTitles = new Map()  // titre normalisé → _id
  const toDelete = []

  for (const art of articles) {
    const slug = art.slug?.current ?? ''
    const titleKey = art.title?.toLowerCase().trim() ?? ''

    let isDuplicate = false

    if (slug && seenSlugs.has(slug)) {
      console.log(`   🔁 Doublon slug "${slug}" → supprime ${art._id}`)
      toDelete.push(art._id)
      isDuplicate = true
    } else if (slug) {
      seenSlugs.set(slug, art._id)
    }

    if (!isDuplicate && titleKey && seenTitles.has(titleKey)) {
      console.log(`   🔁 Doublon titre "${art.title?.slice(0, 50)}" → supprime ${art._id}`)
      toDelete.push(art._id)
      isDuplicate = true
    } else if (!isDuplicate && titleKey) {
      seenTitles.set(titleKey, art._id)
    }
  }

  if (toDelete.length === 0) {
    console.log('✅ Aucun doublon trouvé !\n')
    return
  }

  console.log(`\n🗑  ${toDelete.length} doublon(s) à supprimer…\n`)

  let deleted = 0
  for (const id of toDelete) {
    try {
      await client.delete(id)
      console.log(`   ✅ Supprimé : ${id}`)
      deleted++
    } catch (err) {
      console.log(`   ❌ Échec suppression ${id} : ${err.message}`)
    }
  }

  console.log(`\n${'━'.repeat(50)}`)
  console.log(`🗑  ${deleted} doublon(s) supprimé(s)`)
  console.log(`📰 Il reste ${articles.length - deleted} article(s)\n`)
  console.log('🎉 Recharge ton site !\n')
}

main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message)
  process.exit(1)
})
