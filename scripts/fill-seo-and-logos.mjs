/**
 * SneakActu — Remplit les métadonnées SEO des articles
 *             + ajoute les logos manquants aux marques
 * Usage : node scripts/fill-seo-and-logos.mjs
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

// ─── Logos connus (Clearbit) ───────────────────────────────────────────────────
const LOGO_DOMAINS = {
  'nike':          'nike.com',
  'adidas':        'adidas.com',
  'converse':      'converse.com',
  'new-balance':   'newbalance.com',
  'puma':          'puma.com',
  'jordan':        'jordan.com',
  'asics':         'asics.com',
  'vans':          'vans.com',
  'reebok':        'reebok.com',
  'salomon':       'salomon.com',
  'on-running':    'on-running.com',
  'hoka':          'hoka.com',
  'new-era':       'neweracap.com',
  'carhartt':      'carhartt.com',
  'stussy':        'stussy.com',
  'supreme':       'supremenewyork.com',
  'palace':        'palaceskateboards.com',
  'kith':          'kith.com',
  'off-white':     'off---white.com',
  'auralee':       'auralee.jp',
  'saucony':       'saucony.com',
  'brooks':        'brooksrunning.com',
  'mizuno':        'mizuno.com',
  'fila':          'fila.com',
  'diadora':       'diadora.com',
  'merrell':       'merrell.com',
  'timberland':    'timberland.com',
  'ugg':           'ugg.com',
  'crocs':         'crocs.com',
  'birkenstock':   'birkenstock.com',
}

// ─── Génération SEO intelligente ──────────────────────────────────────────────
function generateSeoTitle(title) {
  // Max 65 chars, garde le titre si assez court, sinon tronque proprement
  if (title.length <= 65) return title
  const words = title.split(' ')
  let result = ''
  for (const word of words) {
    if ((result + ' ' + word).trim().length > 62) break
    result = (result + ' ' + word).trim()
  }
  return result + '…'
}

function generateSeoDescription(title, excerpt, tags) {
  // Priorité : excerpt existant (160 chars max) sinon génération depuis tags
  if (excerpt && excerpt.length >= 50) {
    return excerpt.length <= 160 ? excerpt : excerpt.slice(0, 157) + '…'
  }
  const tagStr = tags?.slice(0, 3).join(', ') ?? ''
  const base = `${title} — Actualité sneakers sur SneakActu. ${tagStr ? `Tout sur ${tagStr}.` : ''}`
  return base.length <= 160 ? base : base.slice(0, 157) + '…'
}

// ─── Download helper ──────────────────────────────────────────────────────────
function download(url, redirects = 6) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 SneakActu/1.0' } }, (res) => {
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

// ─── PARTIE 1 : SEO des articles ─────────────────────────────────────────────
async function fillArticleSeo() {
  console.log('━━━ PARTIE 1 : Métadonnées SEO des articles ━━━\n')

  const articles = await client.fetch(
    `*[_type == "article"] { _id, title, slug, excerpt, tags, seoTitle, seoDescription }`
  )

  console.log(`   ${articles.length} article(s) trouvé(s)\n`)

  let updated = 0

  for (const article of articles) {
    const patch = {}

    // seoTitle — uniquement si vide
    if (!article.seoTitle) {
      patch.seoTitle = generateSeoTitle(article.title)
    }

    // seoDescription — uniquement si vide
    if (!article.seoDescription) {
      patch.seoDescription = generateSeoDescription(
        article.title,
        article.excerpt,
        article.tags
      )
    }

    if (Object.keys(patch).length === 0) {
      console.log(`   ✓  Déjà rempli : "${article.title.slice(0, 50)}"`)
      continue
    }

    await client.patch(article._id).set(patch).commit()

    console.log(`   ✅ "${article.title.slice(0, 50)}…"`)
    if (patch.seoTitle)       console.log(`      SEO Title : "${patch.seoTitle}"`)
    if (patch.seoDescription) console.log(`      SEO Desc  : "${patch.seoDescription.slice(0, 80)}…"`)
    console.log()
    updated++
  }

  console.log(`   → ${updated} article(s) mis à jour\n`)
}

// ─── PARTIE 2 : Logos des marques ────────────────────────────────────────────
async function fillBrandLogos() {
  console.log('━━━ PARTIE 2 : Logos des marques ━━━\n')

  const brands = await client.fetch(
    `*[_type == "brand"] { _id, name, slug, logo }`
  )

  let added = 0

  for (const brand of brands) {
    const slug = brand.slug?.current
    if (!slug) continue

    // Déjà un logo ?
    if (brand.logo?.asset?._ref) {
      console.log(`   ✓  Logo OK : ${brand.name}`)
      continue
    }

    const domain = LOGO_DOMAINS[slug]
    if (!domain) {
      console.log(`   ⏭  Pas de domaine connu pour : ${brand.name} (slug: ${slug})`)
      continue
    }

    const logoUrl = `https://logo.clearbit.com/${domain}`
    console.log(`   📥 Logo ${brand.name} (${domain})…`)

    try {
      const buffer = await download(logoUrl)
      console.log(`      → ${(buffer.length / 1024).toFixed(0)} Ko téléchargés`)

      const asset = await client.assets.upload('image', buffer, {
        filename: `logo-${slug}.png`,
        contentType: 'image/png',
      })

      await client.patch(brand._id).set({
        logo: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt: `Logo officiel ${brand.name}`,
        },
      }).commit()

      console.log(`   ✅ Logo ${brand.name} ajouté !\n`)
      added++

      // Petite pause pour ne pas spammer l'API
      await new Promise(r => setTimeout(r, 500))

    } catch (err) {
      console.log(`   ⚠️  Échec pour ${brand.name} : ${err.message}\n`)
    }
  }

  console.log(`   → ${added} logo(s) ajouté(s)\n`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔌 Connexion à Sanity — projet : ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}\n`)

  await fillArticleSeo()
  await fillBrandLogos()

  console.log('🎉 Tout est à jour ! Recharge ton site.\n')
}

main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message)
  process.exit(1)
})
