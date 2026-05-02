/**
 * SneakActu — Injection des marques dans Sanity
 * Usage : node scripts/seed-brands.mjs
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

const BRANDS = [
  {
    name: 'Adidas',
    slug: 'adidas',
    type: 'grande-marque',
    country: 'Allemagne',
    website: 'https://www.adidas.fr',
    description: 'Fondée en 1949 à Herzogenaurach, Adidas est l\'une des marques de sport les plus influentes au monde. Des Stan Smith à la Samba en passant par les Yeezy, la marque aux trois bandes a façonné la culture sneaker depuis sept décennies.',
    productType: ['Running', 'Lifestyle', 'Football', 'Basketball'],
    featured: true,
  },
  {
    name: 'Converse',
    slug: 'converse',
    type: 'grande-marque',
    country: 'États-Unis',
    website: 'https://www.converse.com',
    description: 'Née en 1908, Converse est l\'inventrice de la sneaker moderne. La Chuck Taylor All Star, lancée en 1917, reste l\'une des chaussures les plus vendues de l\'histoire — portée par les basketteurs, les punks, les artistes et les étudiants du monde entier.',
    productType: ['Lifestyle', 'Basketball', 'Skateboard'],
    featured: true,
  },
  {
    name: 'New Balance',
    slug: 'new-balance',
    type: 'grande-marque',
    country: 'États-Unis',
    website: 'https://www.newbalance.fr',
    description: 'Fondée en 1906 à Boston, New Balance s\'est imposée comme la référence du running technique avant de conquérir le monde du lifestyle. Ses modèles 574, 990 et 1906R sont devenus des icônes, plébiscitées par la scène streetwear mondiale pour leur qualité de fabrication et leur esthétique sobre.',
    productType: ['Running', 'Lifestyle', 'Trail'],
    featured: true,
  },
  {
    name: 'Puma',
    slug: 'puma',
    type: 'grande-marque',
    country: 'Allemagne',
    website: 'https://www.puma.com',
    description: 'Fondée en 1948 à Herzogenaurach par Rudolf Dassler — frère d\'Adolf, fondateur d\'Adidas —, Puma a forgé son identité dans le sport de haut niveau avant de s\'imposer dans la culture streetwear. Des Suede aux Clyde, en passant par les collaborations avec Rihanna ou A$AP Rocky, Puma navigue avec élégance entre sport et mode.',
    productType: ['Running', 'Football', 'Lifestyle', 'Basketball'],
    featured: true,
  },
]

async function main() {
  console.log('🔌 Connexion à Sanity...\n')

  for (const brand of BRANDS) {
    // Vérifier si la marque existe déjà
    const existing = await client.fetch(
      `*[_type == "brand" && slug.current == $s][0]{ _id, name }`,
      { s: brand.slug }
    )

    if (existing) {
      console.log(`   ⏭  Déjà présente : ${brand.name}`)
      continue
    }

    const doc = {
      _type: 'brand',
      name: brand.name,
      slug: { _type: 'slug', current: brand.slug },
      type: brand.type,
      country: brand.country,
      website: brand.website,
      description: brand.description,
      productType: brand.productType,
      featured: brand.featured,
    }

    const created = await client.create(doc)
    console.log(`   ✅ ${brand.name} créée → /marques/${brand.slug}`)
  }

  console.log('\n🎉 Terminé ! Les marques sont dans Sanity.')
  console.log('   Pense à ajouter les logos depuis /studio → Marques\n')
}

main().catch(err => {
  console.error('❌ Erreur :', err.message)
  process.exit(1)
})
