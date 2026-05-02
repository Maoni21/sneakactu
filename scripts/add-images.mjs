/**
 * SneakActu — Script d'ajout d'images aux articles via Unsplash
 * Usage : node scripts/add-images.mjs
 *
 * Télécharge des photos libres de droits depuis Unsplash,
 * les upload dans Sanity et les lie aux articles existants.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Charger .env.local manuellement
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local')
    const lines = readFileSync(envPath, 'utf-8').split('\n')
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

// ─── Images Unsplash par article slug ─────────────────────────────────────────
// Photos libres de droits (licence Unsplash — usage commercial autorisé)

const IMAGE_MAP = {
  'nike-air-max-dn8-la-prochaine-revolution-de-l-amorti-devoilee': {
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=85&fm=jpg',
    alt: 'Nike Air Max — vue de profil sur fond blanc',
    credit: 'Unsplash',
  },
  'new-balance-1906r-x-auralee-la-collab-la-plus-propre-de-l-annee': {
    url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1600&q=85&fm=jpg',
    alt: 'Sneakers New Balance sur fond neutre',
    credit: 'Unsplash',
  },
  'jordan-1-retro-high-og-bred-reimagined-retour-du-classique-ultime': {
    url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1600&q=85&fm=jpg',
    alt: 'Jordan 1 High OG rouge et noir, vue de trois quarts',
    credit: 'Unsplash',
  },
  'adidas-samba-og-pourquoi-la-hype-ne-retombe-pas-et-ne-retombera-pas': {
    url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1600&q=85&fm=jpg',
    alt: 'Adidas Samba OG blanche sur sol béton',
    credit: 'Unsplash',
  },
  'guide-comment-savoir-si-une-sneaker-est-authentique-avant-d-acheter': {
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1600&q=85&fm=jpg',
    alt: 'Paire de sneakers inspectée de près, détail de la semelle',
    credit: 'Unsplash',
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const chunks = []
    const request = (targetUrl) => {
      https.get(targetUrl, { headers: { 'User-Agent': 'SneakActu/1.0' } }, (res) => {
        // Suivre les redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location)
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} pour ${targetUrl}`))
        }
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => resolve(Buffer.concat(chunks)))
        res.on('error', reject)
      }).on('error', reject)
    }
    request(url)
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔌 Connexion à Sanity...')
  console.log(`   Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}\n`)

  // Récupérer tous les articles qui n'ont pas encore d'image
  const articles = await client.fetch(
    `*[_type == "article" && defined(slug.current)] { _id, title, slug, mainImage }`
  )

  console.log(`📰 ${articles.length} article(s) trouvé(s) dans Sanity\n`)

  for (const article of articles) {
    const slug = article.slug?.current
    const config = IMAGE_MAP[slug]

    if (!config) {
      console.log(`   ⏭  Pas d'image configurée pour : "${article.title?.slice(0, 50)}"`)
      continue
    }

    if (article.mainImage?.asset?._ref) {
      console.log(`   ✓  Déjà une image pour : "${article.title?.slice(0, 50)}"`)
      continue
    }

    console.log(`   📥 Téléchargement image pour : "${article.title?.slice(0, 50)}…"`)

    try {
      // 1. Télécharger l'image
      const buffer = await downloadImage(config.url)
      console.log(`      → ${(buffer.length / 1024).toFixed(0)} Ko téléchargés`)

      // 2. Uploader dans Sanity
      const asset = await client.assets.upload('image', buffer, {
        filename: `${slug}.jpg`,
        contentType: 'image/jpeg',
      })
      console.log(`      → Asset Sanity créé : ${asset._id}`)

      // 3. Lier l'asset à l'article
      await client.patch(article._id).set({
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt: config.alt,
        },
      }).commit()

      console.log(`   ✅ Image liée à l'article !\n`)

    } catch (err) {
      console.error(`   ❌ Erreur pour "${slug}" : ${err.message}\n`)
    }
  }

  console.log('🎉 Terminé ! Rechargez votre site pour voir les images.\n')
}

main().catch((err) => {
  console.error('\n❌ Erreur fatale :', err.message)
  process.exit(1)
})
