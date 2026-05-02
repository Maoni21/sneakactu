/**
 * Corrige le slug de la marque Nike dans Sanity
 * Usage : node scripts/fix-nike-slug.mjs
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
  // Trouver toutes les marques avec un slug invalide (URL complète ou vide)
  const brands = await client.fetch(
    `*[_type == "brand"] { _id, name, slug, website }`
  )

  console.log(`\n🔍 ${brands.length} marque(s) trouvée(s)\n`)

  for (const brand of brands) {
    const currentSlug = brand.slug?.current ?? ''
    const isUrl = currentSlug.startsWith('http') || currentSlug.includes('.')
    const isEmpty = !currentSlug

    if (!isUrl && !isEmpty) {
      console.log(`   ✓  OK : ${brand.name} → "${currentSlug}"`)
      continue
    }

    // Générer un slug propre depuis le nom
    const fixedSlug = brand.name
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    console.log(`   🔧 Fix : ${brand.name}`)
    console.log(`      Avant : "${currentSlug}"`)
    console.log(`      Après : "${fixedSlug}"`)

    // Si le slug était une URL, la déplacer dans le champ website
    const patch = client.patch(brand._id).set({
      slug: { _type: 'slug', current: fixedSlug },
    })

    if (isUrl && !brand.website) {
      patch.set({ website: currentSlug })
      console.log(`      Website sauvegardé : ${currentSlug}`)
    }

    await patch.commit()
    console.log(`   ✅ Corrigé !\n`)
  }

  console.log('🎉 Terminé ! Toutes les marques ont maintenant un slug valide.\n')
}

main().catch(err => {
  console.error('❌ Erreur :', err.message)
  process.exit(1)
})
