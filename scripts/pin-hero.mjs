/**
 * Met l'article Jordan 1 Bred en hero (date la plus récente)
 * Usage : node scripts/pin-hero.mjs
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
  // Trouver l'article Jordan
  const article = await client.fetch(
    `*[_type == "article" && slug.current match "jordan*"][0]{ _id, title, slug, publishedAt }`
  )

  if (!article) {
    console.log('❌ Article Jordan introuvable dans Sanity.')
    console.log('   Vérifie que le slug commence par "jordan" dans le Studio.')
    return
  }

  console.log(`\n✅ Article trouvé : "${article.title}"`)
  console.log(`   Slug : ${article.slug.current}`)
  console.log(`   Date actuelle : ${article.publishedAt}\n`)

  // Mettre la date à maintenant pour en faire le plus récent
  const now = new Date().toISOString()
  await client.patch(article._id).set({ publishedAt: now }).commit()

  console.log(`🚀 Date mise à jour → ${now}`)
  console.log(`   L'article Jordan est maintenant le hero de la homepage !\n`)
  console.log('   Recharge localhost:3000 pour voir le résultat.')
}

main().catch(err => {
  console.error('❌ Erreur :', err.message)
  process.exit(1)
})
