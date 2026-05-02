/**
 * SneakActu — Script d'injection d'articles dans Sanity
 * Usage : node scripts/seed-articles.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slug(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function block(text, style = 'normal') {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style,
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
    markDefs: [],
  }
}

function h2(text) { return block(text, 'h2') }
function p(text) { return block(text, 'normal') }

// ─── Catégories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { _type: 'category', name: 'Releases', slug: { _type: 'slug', current: 'releases' }, description: 'Toutes les nouvelles sorties sneakers' },
  { _type: 'category', name: 'Collab', slug: { _type: 'slug', current: 'collab' }, description: 'Collaborations entre marques et créateurs' },
  { _type: 'category', name: 'Leak', slug: { _type: 'slug', current: 'leak' }, description: 'Fuites et premières images non officielles' },
  { _type: 'category', name: 'Guide', slug: { _type: 'slug', current: 'guide' }, description: "Guides d'achat et conseils" },
  { _type: 'category', name: 'Streetwear', slug: { _type: 'slug', current: 'streetwear' }, description: 'Mode de rue et tendances urbaines' },
]

// ─── Articles ─────────────────────────────────────────────────────────────────

const ARTICLES = [
  {
    title: 'Nike Air Max DN8 : la prochaine révolution de l\'amorti dévoilée',
    excerpt: 'Nike prépare l\'Air Max DN8 avec un système d\'amorti entièrement repensé. Premières images, date de sortie et prix — on fait le point sur ce que l\'on sait.',
    categorySlug: 'releases',
    tags: ['Nike', 'Air Max', 'DN8', 'Amorti'],
    readTime: 4,
    body: [
      h2('Un nouveau chapitre pour l\'Air Max'),
      p("Nike ne s'arrête jamais. Après le succès de l'Air Max DN en 2024 — avec ses tubes d'air visibles sur toute la semelle —, la marque au swoosh s'apprête à frapper fort avec l'Air Max DN8. Les premières images qui circulent sur les réseaux sociaux montrent une silhouette encore plus agressive, avec une unité d'air arrière renforcée et une empeigne en mesh technique stratifié."),
      h2('Ce que révèlent les leaks'),
      p("D'après les sources proches de Nike Sportswear, l'Air Max DN8 embarque un nouveau composé de mousse baptisé en interne « ReactFoam+ ». Le but : allier la réactivité du React à la légèreté de la ZoomX, sans le prix stratosphérique des modèles de running haut de gamme. La semelle extérieure, en gomme translucide, devrait exposer davantage les tubes d'air pour un look encore plus futuriste."),
      h2('Date de sortie et prix estimé'),
      p("Nike n'a pas encore communiqué officiellement, mais les revendeurs s'attendent à un drop global pour l'automne 2026, aux alentours de 160 à 180 €. Des colorways exclusifs SNKRS sont également dans les tuyaux, avec des collaborations discrètes encore non confirmées. Restez connectés — on met à jour cet article dès qu'une date officielle tombe."),
    ],
  },
  {
    title: 'New Balance 1906R x Auralee : la collab la plus propre de l\'année',
    excerpt: 'New Balance et le label japonais Auralee signent une 1906R d\'une élégance rare. Détails des matières, prix et où l\'acheter — tout ce qu\'il faut savoir.',
    categorySlug: 'collab',
    tags: ['New Balance', '1906R', 'Auralee', 'Japan', 'Collab'],
    readTime: 5,
    body: [
      h2('Quand le sportswear rencontre le tailoring japonais'),
      p("Il y a des collaborations qui se voient de loin et des collaborations qui se vivent de près. La New Balance 1906R x Auralee fait partie de la deuxième catégorie. Le label tokyoïte — connu pour ses matières haut de gamme et ses coupes épurées — a travaillé pendant près de dix-huit mois avec l'équipe design de New Balance pour aboutir à ce résultat."),
      h2('Les détails qui font la différence'),
      p("L'upper est construit en deux couches de nylon ripstop traité, avec un revêtement déperlant discret. La tige en daim naturel — provenant de tanneries contrôlées en Europe — est teinte dans deux tons de beige qui évoluent subtilement selon la lumière. Le logo NB brodé est recouvert d'un fil argenté mat, presque invisible. À l'intérieur, une doublure en lin grège complète le tableau. Même la boîte est différente : du carton non blanchi, fermée par un ruban couleur sable."),
      h2('Prix et disponibilité'),
      p("La New Balance 1906R x Auralee sera disponible à partir du 15 juin 2026, exclusivement sur le e-shop d'Auralee et dans les boutiques sélectionnées New Balance au Japon, à Paris et à Londres. Prix : 280 €. Une quantité limitée sera allouée à la France — pensez à activer les notifications sur l'app NB dès maintenant."),
    ],
  },
  {
    title: 'Jordan 1 Retro High OG « Bred Reimagined » : retour du classique ultime',
    excerpt: 'La Jordan 1 Bred revient en 2026 sous une forme revisitée. Nike et Jordan Brand jouent la carte de la fidélité aux origines tout en modernisant les matières.',
    categorySlug: 'releases',
    tags: ['Jordan', 'Jordan 1', 'Bred', 'Nike', 'OG'],
    readTime: 4,
    body: [
      h2('L\'histoire continue'),
      p("Certaines sneakers n'ont pas besoin d'être réinventées. La Jordan 1 High OG « Bred » en fait partie. Depuis sa première apparition en 1985 sur les pieds de Michael Jordan — qui s'est vu infliger une amende de 5 000 dollars par match par la NBA pour avoir porté une chaussure ne respectant pas le code couleur de l'équipe —, ce colorway rouge et noir est devenu l'un des designs les plus iconiques de l'histoire de la sneaker."),
      h2('La « Reimagined » : respect et modernité'),
      p("Pour ce retour, Jordan Brand adopte la même approche que pour la « Black Toe Reimagined » de 2023 : des matières premium, des détails revisités, mais une silhouette strictement fidèle à l'originale. L'upper combine cuir pleine fleur et cuir tumbled pour un rendu plus luxueux, avec une nuance de rouge légèrement plus profonde que les versions précédentes. Le Wings logo au col est en relief estampé, non brodé."),
      h2('Quand et comment l\'acheter'),
      p("Le drop est fixé au 4 octobre 2026 sur SNKRS et chez les revendeurs agréés Jordan Brand. Prix de détail : 195 €. Comme toujours pour un colorway Bred, attendez-vous à une demande massive — pensez à soumettre votre taille sur SNKRS dès l'ouverture de la période d'entrée. Le marché gris devrait rapidement atteindre les 400 à 600 €."),
    ],
  },
  {
    title: 'Adidas Samba OG : pourquoi la hype ne retombe pas (et ne retombera pas)',
    excerpt: 'Deux ans après son retour en force, la Samba OG d\'Adidas reste omniprésente. Analyse d\'un phénomène cultural qui va bien au-delà de la tendance.',
    categorySlug: 'streetwear',
    tags: ['Adidas', 'Samba', 'Hype', 'Tendance', 'Streetwear'],
    readTime: 6,
    body: [
      h2('Un phénomène qui dure'),
      p("En 2023, tout le monde prédisait que la Samba serait une tendance éphémère. Deux ans plus tard, la chaussure de football en salle d'Adidas est toujours là, portée aussi bien dans les rues de Copenhague que sur les trottoirs de New York ou les terrasses parisiennes. Comment expliquer cette longévité exceptionnelle dans un marché de la sneaker qui se lasse habituellement très vite ?"),
      h2('La force d\'un design intemporel'),
      p("La Samba a été créée en 1950 pour le football sur sol gelé. Son profil bas, sa semelle en gomme épaisse et son empiècement en T sur l'empeigne ne sont pas le résultat d'un brief design contemporain — ce sont des solutions fonctionnelles devenues esthétiques. Contrairement à beaucoup de runners dopés à la technologie, la Samba n'a pas besoin de se justifier. Elle existe, elle porte bien, elle vieillit bien."),
      h2('La stratégie Adidas : rareté dosée'),
      p("Adidas a appris de ses erreurs passées. Plutôt que de saturer le marché comme avec certaines Yeezy, la marque aux trois bandes contrôle soigneusement les volumes de Samba. Les collabs — Palace, Wales Bonner, Sporty & Rich — sont produites en quantités limitées et distribuées via des canaux premium. Résultat : la Samba reste accessible (entre 100 et 120 € en retail) tout en maintenant un désir constant. Une équation presque parfaite."),
      h2('Ce que ça dit de notre rapport aux sneakers'),
      p("Le succès durable de la Samba révèle un glissement dans les priorités des consommateurs. Après des années de chunky runners et de silhouettes extraterrestres, le marché exprime une forme de fatigue vis-à-vis de la surenchère technologique. La Samba, c'est le contrepoint silencieux : sobre, polyvalente, non genrée. Elle se porte avec un costume comme avec un jogging. Et c'est peut-être ça, en 2026, la vraie définition du luxe streetwear."),
    ],
  },
  {
    title: 'Guide : comment savoir si une sneaker est authentique avant d\'acheter ?',
    excerpt: 'Marché secondaire, répliques de plus en plus sophistiquées... On vous donne les 8 points de contrôle essentiels pour éviter les faux et acheter en confiance.',
    categorySlug: 'guide',
    tags: ['Guide', 'Authentification', 'Fakes', 'Marché secondaire', 'Tips'],
    readTime: 7,
    body: [
      h2('Le marché des faux n\'a jamais été aussi sophistiqué'),
      p("Les répliques de sneakers atteignent aujourd'hui un niveau de qualité qui rend l'authentification difficile, même pour des passionnés aguerris. Certains faux Jordan 1 ou Dunk sont désormais indiscernables à l'œil nu d'une version authentique à moins de savoir précisément où regarder. Ce guide vous donne les outils pour vous protéger."),
      h2('1. Vérifiez le SKU sur la languette et la boîte'),
      p("Chaque sneaker Nike, Jordan ou Adidas possède un numéro de référence unique (SKU) imprimé sur l'étiquette de la languette et sur la boîte. Ces deux numéros doivent être identiques. Sur les faux, ils sont souvent différents ou incorrects. Vérifiez ensuite ce SKU sur des bases de données comme StockX, Goat ou le site officiel de la marque."),
      h2('2. Examinez la qualité des coutures'),
      p("Les coutures d'une paire authentique sont régulières, serrées et sans fil qui dépasse. Sur les répliques, même haut de gamme, on trouve souvent des irrégularités sur les points de couture à la jonction entre l'upper et le mudguard. Utilisez une loupe ou l'option macro de votre téléphone."),
      h2('3. Pesez la chaussure'),
      p("Nike et d'autres marques publient parfois le poids officiel de leurs modèles. Un Air Force 1 authentique pèse environ 425g (pointure 42). Les faux utilisent souvent des matériaux différents qui modifient légèrement le poids — en général plus lourds. Ce n'est pas un critère suffisant seul, mais combiné aux autres, il peut trancher."),
      h2('4. Analysez la font des logos et étiquettes'),
      p("La typographie utilisée par Nike, Adidas ou Jordan Brand est précise et cohérente. Sur les faux, les lettres peuvent être légèrement trop épaisses, trop espacées, ou mal alignées. Comparez avec des photos haute définition de paires authentiques — des comptes comme @kicksonauthenticator sur Instagram font ce travail méticuleusement."),
      h2('5. Utilisez les services d\'authentification'),
      p("En cas de doute, des services comme Legit Check App, CheckCheck ou l'authentification intégrée à GOAT et StockX permettent de faire vérifier une paire par des experts. Comptez entre 5 et 20 € selon le service. C'est toujours moins cher que de se faire avoir sur une paire à 300 €."),
    ],
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔌 Connexion à Sanity...')
  console.log(`   Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`)

  // 1. Créer les catégories (upsert par slug)
  console.log('\n📁 Création des catégories...')
  const categoryMap = {}

  for (const cat of CATEGORIES) {
    const existing = await client.fetch(
      `*[_type == "category" && slug.current == $s][0]{_id}`,
      { s: cat.slug.current }
    )
    if (existing) {
      categoryMap[cat.slug.current] = existing._id
      console.log(`   ✓ Catégorie "${cat.name}" déjà présente`)
    } else {
      const created = await client.create({ ...cat, _type: 'category' })
      categoryMap[cat.slug.current] = created._id
      console.log(`   ✅ Catégorie "${cat.name}" créée`)
    }
  }

  // 2. Créer les articles
  console.log('\n📝 Injection des articles...')

  for (const art of ARTICLES) {
    const artSlug = slug(art.title)

    // Vérifier si l'article existe déjà
    const existing = await client.fetch(
      `*[_type == "article" && slug.current == $s][0]{_id}`,
      { s: artSlug }
    )

    if (existing) {
      console.log(`   ⏭  Article déjà présent : "${art.title.slice(0, 50)}…"`)
      continue
    }

    const doc = {
      _type: 'article',
      title: art.title,
      slug: { _type: 'slug', current: artSlug },
      excerpt: art.excerpt,
      body: art.body,
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: art.readTime,
      tags: art.tags,
      categories: categoryMap[art.categorySlug]
        ? [{ _type: 'reference', _ref: categoryMap[art.categorySlug] }]
        : [],
    }

    const created = await client.create(doc)
    console.log(`   ✅ Article créé : "${art.title.slice(0, 55)}…"`)
    console.log(`      → https://sneakactu.fr/articles/${artSlug}`)
  }

  console.log('\n🎉 Terminé ! Vos articles sont dans Sanity.')
  console.log('   Ouvrez /studio pour les voir et ajouter des images.\n')
}

main().catch((err) => {
  console.error('\n❌ Erreur :', err.message)
  process.exit(1)
})
