/**
 * SneakActu — Upload des logos officiels des marques
 * Usage : node scripts/upload-brand-logos.mjs
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

// Mapping fichier → slug de la marque dans Sanity
const LOGOS = [
  { file: '1.jpg', slug: 'nike',        name: 'Nike' },
  { file: '2.jpg', slug: 'adidas',      name: 'Adidas' },
  { file: '3.jpg', slug: 'converse',    name: 'Converse' },
  { file: '4.jpg', slug: 'new-balance', name: 'New Balance' },
  { file: '5.jpg', slug: 'puma',        name: 'Puma' },
]

async function main() {
  console.log(`\n🔌 Connexion à Sanity — ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}\n`)

  // Récupérer toutes les marques
  const brands = await client.fetch(
    `*[_type == "brand"] { _id, name, slug }`
  )
  console.log(`🏷  ${brands.length} marque(s) dans Sanity\n`)

  for (const { file, slug, name } of LOGOS) {
    const brand = brands.find(b => b.slug?.current === slug)

    if (!brand) {
      console.log(`   ⚠️  Marque introuvable : ${name} (slug: ${slug})`)
      continue
    }

    const filePath = resolve(__dirname, file)
    console.log(`   📥 Upload logo ${name} (${file})…`)

    try {
      const buffer = readFileSync(filePath)
      console.log(`      → ${(buffer.length / 1024).toFixed(0)} Ko`)

      // Upload dans Sanity
      const asset = await client.assets.upload('image', buffer, {
        filename: `logo-${slug}.jpg`,
        contentType: 'image/jpeg',
      })

      // Lier à la marque (écrase l'ancien logo si existant)
      await client.patch(brand._id).set({
        logo: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt: `Logo ${name}`,
        },
      }).commit()

      console.log(`   ✅ Logo ${name} mis à jour !\n`)

    } catch (err) {
      console.log(`   ❌ Échec ${name} : ${err.message}\n`)
    }
  }

  console.log('🎉 Tous les logos ont été uploadés. Recharge ton site !\n')
}

main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message)
  process.exit(1)
})
