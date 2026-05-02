/**
 * SneakActu — 15 articles (3 par marque : Nike, Adidas, Converse, New Balance, Puma)
 * Usage : node scripts/seed-brand-articles.mjs
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

function toBlock(text) {
  return text.split('\n\n').filter(Boolean).map((para, i) => ({
    _type: 'block',
    _key: `block_${i}_${Math.random().toString(36).slice(2, 7)}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `span_${i}`, text: para.trim(), marks: [] }],
  }))
}

// ─── Articles ─────────────────────────────────────────────────────────────────

const ARTICLES = [

  // ──── NIKE ────────────────────────────────────────────────────────────────

  {
    slug: 'nike-air-max-dn8-2025',
    brand: 'nike',
    title: 'Nike Air Max DN8 : la silhouette qui redéfinit le confort en 2025',
    excerpt: 'Nike dévoile l\'Air Max DN8, une évolution radicale de son système Dynamic Air avec une semelle repensée et un upper ultra-léger.',
    tags: ['Nike', 'Air Max', 'Nouveauté', 'Lifestyle'],
    date: '2025-03-15',
    body: `Nike frappe fort en ce début d'année avec la Air Max DN8, une silhouette qui pousse le concept Dynamic Air à son paroxysme. Présentée lors de la Paris Fashion Week sneakers, cette paire mêle technologie de pointe et esthétique futuriste pour s'imposer comme la référence lifestyle de 2025.

La grande nouveauté réside dans la semelle intermédiaire entièrement repensée. Nike a intégré quatre tubes d'air de diamètres différents, créant une réponse amorti progressive selon les zones de pied. Résultat : un confort sur mesure qui s'adapte à chaque foulée, que vous soyez sur l'asphalte parisien ou dans un festival en plein air.

L'upper abandonne les matières traditionnelles au profit d'un mesh 3D structuré, quasi translucide par endroits, qui laisse deviner les systèmes d'air en dessous. Une transparence assumée qui devient signature visuelle. La construction est maintenue par des sangles TPU soudées sans couture, pour un maintien optimal sans points de friction.

Du côté des coloris de lancement, Nike mise sur le contraste avec un "Black/Volt" percutant et un "White/Royal Blue" plus sage. Les prix s'affichent à 179€, un positionnement cohérent avec le segment premium. Les premières paires sont disponibles sur SNKRS et chez les revendeurs sélectionnés dès le 20 mars.

La DN8 s'inscrit dans la stratégie de Nike de reconquérir les jeunes consommateurs qui se sont tournés vers New Balance ou Adidas ces dernières années. Un pari risqué mais bien exécuté.`,
    seoTitle: 'Nike Air Max DN8 2025 : prix, coloris et date de sortie',
    seoDescription: 'Nike dévoile l\'Air Max DN8 avec son nouveau système Dynamic Air à 4 tubes. Prix 179€, dispo dès le 20 mars 2025.',
  },

  {
    slug: 'nike-dunk-low-paris-2025',
    brand: 'nike',
    title: 'Nike Dunk Low "Paris" : un hommage à la capitale en édition limitée',
    excerpt: 'Nike célèbre Paris avec une Dunk Low exclusive aux couleurs de la ville lumière. Une édition limitée très attendue.',
    tags: ['Nike', 'Dunk Low', 'Édition Limitée', 'Paris'],
    date: '2025-04-02',
    body: `C'est le drop que toute la communauté sneakers parisienne attendait. Nike lance la Dunk Low "Paris", une édition limitée conçue en collaboration avec des artistes locaux pour rendre hommage à la capitale française. Disponible uniquement en France dans un premier temps, cette paire est déjà en rupture de stock sur le marché secondaire.

Le design s'inspire directement de l'architecture haussmannienne : le beige crème de la tige en cuir pleine fleur évoque les façades du 7e arrondissement, tandis que les overlays en daim brun rappellent les boiseries des brasseries historiques. La semelle est teintée dans un bleu profond qui fait écho à la Seine au crépuscule.

Le détail le plus marquant reste la broderie intérieure : une carte stylisée de Paris, avec ses arrondissements dessinés en fil doré. Chaque paire est numérotée à la main, avec un certificat d'authenticité glissé dans une boîte collector aux couleurs de la ville.

Nike a limité la production à 3 000 paires, réparties entre le SNKRS, la boutique Nike des Champs-Élysées et une poignée de concept stores partenaires. Le prix de vente conseillé est de 160€, mais les premières reventres sur StockX affichent déjà des prix deux fois supérieurs.

Cette sortie confirme l'importance de Paris dans la stratégie de Nike Europe. Après le succès des collaborations avec des artistes français ces dernières années, la marque au swoosh ancre définitivement son histoire dans la culture sneakers hexagonale.`,
    seoTitle: 'Nike Dunk Low Paris 2025 : l\'édition limitée parisienne',
    seoDescription: 'Nike lance la Dunk Low Paris en édition limitée à 3000 paires. Prix 160€, coloris inspiré de l\'architecture haussmannienne.',
  },

  {
    slug: 'nike-air-force-1-40-ans',
    brand: 'nike',
    title: 'Nike Air Force 1 : 40 ans et toujours au sommet de la culture sneakers',
    excerpt: 'La Air Force 1 fête ses 40 ans en 2025. Retour sur la sneaker qui a tout changé et sur les drops anniversaire à venir.',
    tags: ['Nike', 'Air Force 1', 'Histoire', 'Anniversaire'],
    date: '2025-02-20',
    body: `1982. Bruce Kilgore conçoit pour Nike une basket de basketball révolutionnaire : la Air Force 1, première chaussure à intégrer la technologie Air dans une semelle. Quarante-trois ans plus tard, cette silhouette est devenue l'une des sneakers les plus vendues de l'histoire, avec plus de 350 millions de paires écoulées dans le monde. Une longévité que peu auraient anticipée.

L'histoire de la AF1 est indissociable de la culture urbaine américaine. Dans les années 90, elle devient la chaussure de référence dans les quartiers de Baltimore, Washington et New York, portée par des rappeurs comme Jay-Z et Nelly, qui lui dédiera même un titre. C'est cette adoption par la culture hip-hop qui transforme une simple chaussure de sport en symbole culturel.

Pour cet anniversaire, Nike a préparé un programme de drops ambitieux tout au long de l'année 2025. Le premier chapitre, baptisé "40 Years of Fresh", comprend 12 coloris revisités qui rendent hommage aux éditions les plus iconiques. Du blanc on white originel aux collabs les plus folles, chaque paire raconte un moment de l'histoire de la silhouette.

Le clou du spectacle sera une collaboration surprise annoncée pour septembre, impliquant un créateur de mode parisien dont le nom n'a pas encore été révélé. Les rumeurs évoquent une construction entièrement repensée avec des matières de maroquinerie haut de gamme.

La Air Force 1 n'a pas fini de surprendre. Sa capacité à se réinventer sans perdre son ADN est peut-être son plus grand secret de longévité.`,
    seoTitle: 'Nike Air Force 1 : 40 ans d\'une icône intemporelle',
    seoDescription: 'La Nike Air Force 1 fête ses 40 ans en 2025. Histoire, drops anniversaire et collab surprise à venir.',
  },

  // ──── ADIDAS ──────────────────────────────────────────────────────────────

  {
    slug: 'adidas-samba-og-2025-retour',
    brand: 'adidas',
    title: 'Adidas Samba OG : le retour du classique qui ne finit pas de dominer',
    excerpt: 'La Samba OG d\'Adidas confirme sa domination en 2025 avec de nouveaux coloris et des collaborations de prestige qui font grimper la demande.',
    tags: ['Adidas', 'Samba', 'Classique', 'Tendance'],
    date: '2025-03-10',
    body: `Il y a deux ans, peu auraient parié que la Samba, créée en 1950 pour le football sur terrain gelé, deviendrait la silhouette la plus portée de la planète mode. Pourtant, en 2025, le phénomène ne montre aucun signe d'essoufflement. Adidas surfe sur cette vague avec brio, en alimentant régulièrement le marché avec des coloris inédits et des collaborations stratégiques.

Le secret de la Samba réside dans son design intemporel : une tige en cuir souple, une semelle en gomme crêpe légèrement surélevée, et ce "T-toe" caractéristique en daim. Des éléments pensés pour le terrain qui fonctionnent miraculeusement bien dans un contexte lifestyle. La silhouette plate et basse convient à toutes les morphologies et se porte avec tout : du jean large à la robe de soirée.

Pour le printemps-été 2025, Adidas a misé sur une palette de couleurs terreuses et naturelles. Le "Cardboard/Cloud White" s'impose comme le coloris de la saison, parfaitement aligné avec les tendances mode actuelles. Plus audacieux, le "Collegiate Green" attire l'œil avec ses rappels d'une autre époque.

Côté collaborations, Adidas a frappé fort avec une version signée par un chef cuisinier étoilé parisien — une première dans l'univers sneakers — et une autre avec une galerie d'art contemporain de Berlin. Des partnerships qui élargissent l'audience de la Samba bien au-delà de la communauté sneakers traditionnelle.

La question que tout le monde se pose : quand ce phénomène va-t-il s'arrêter ? Les experts du secteur estiment que la Samba a encore deux à trois ans de règne devant elle, portée par une demande internationale qui ne faiblit pas.`,
    seoTitle: 'Adidas Samba OG 2025 : nouveaux coloris et collaborations',
    seoDescription: 'La Samba OG confirme sa domination en 2025. Nouveaux coloris terreuses et collabs inédites pour la reine des sneakers.',
  },

  {
    slug: 'adidas-gazelle-bold-tendance',
    brand: 'adidas',
    title: 'Adidas Gazelle Bold : la plateforme qui s\'impose dans la mode féminine',
    excerpt: 'La Gazelle Bold d\'Adidas avec sa semelle épaisse devient un incontournable du vestiaire féminin, portée par des influenceuses et des célébrités du monde entier.',
    tags: ['Adidas', 'Gazelle', 'Mode', 'Femme'],
    date: '2025-02-28',
    body: `Adidas a réussi quelque chose de rare : créer une sneaker de plateforme qui ne sacrifie ni le style ni l'héritage. La Gazelle Bold, dérivée de la Gazelle originale des années 60, troque la semelle plate traditionnelle contre une épaisseur généreuse de 4 centimètres qui change tout. Cette hauteur supplémentaire transforme la silhouette et s'intègre parfaitement dans la tendance plateforme qui domine depuis 2023.

Ce qui frappe d'abord, c'est la fidélité aux codes originaux de la Gazelle malgré cette transformation. Le T-toe en daim, les trois bandes sur le côté, la languette contrastée : tous les éléments iconiques sont présents, simplement portés plus haut. Adidas a su moderniser sans trahir, un équilibre difficile à atteindre.

La Gazelle Bold a été adoptée massivement par la communauté féminine, ce qui n'était pas forcément prévisible pour une marque historiquement perçue comme très masculine. Des célébrités comme Dua Lipa et Rosalía l'ont portée lors d'apparitions publiques, générant des millions d'impressions sur les réseaux sociaux et propulsant les ventes à des niveaux records.

Les coloris ont joué un rôle crucial dans ce succès : Adidas a misé sur des teintes inhabituelles pour la marque — lilas pastel, rose poudré, bleu azur — qui parlent directement à une audience féminine en quête de couleurs expressives. Ces choix chromatiques audacieux ont permis à la paire de se démarquer dans un marché très saturé.

Pour 2025, Adidas annonce une déclinaison "Bold +" encore plus surélevée, prévue pour l'automne. La marque aux trois bandes semble avoir trouvé une formule gagnante qu'elle entend décliner en plusieurs générations.`,
    seoTitle: 'Adidas Gazelle Bold 2025 : la platform qui s\'impose',
    seoDescription: 'La Gazelle Bold d\'Adidas s\'impose dans la mode féminine avec sa semelle plateforme. Nouveaux coloris et version Bold+ à venir.',
  },

  {
    slug: 'adidas-ultraboost-2025-running',
    brand: 'adidas',
    title: 'Adidas Ultraboost 25 : la running qui veut reconquérir les podiums',
    excerpt: 'Adidas relance sa ligne Ultraboost avec une version 25 entièrement repensée, ciblant à la fois les coureurs sérieux et les amateurs de sneakers de performance.',
    tags: ['Adidas', 'Ultraboost', 'Running', 'Performance'],
    date: '2025-04-10',
    body: `Après plusieurs années à voir New Balance et On Running grignoter ses parts de marché dans le segment running lifestyle, Adidas contre-attaque avec l'Ultraboost 25. Une version repensée de fond en comble qui ambitionne de retrouver la place de leader que la silhouette occupait entre 2016 et 2020.

Le principal changement concerne la semelle Boost, technologie phare d'Adidas. La nouvelle génération intègre des granules de mousse EPP (polypropylène expansé) reformulés qui offrent 20% d'énergie restituée supplémentaire selon les tests internes de la marque. En pratique, on note une réactivité accrue à chaque appui, particulièrement sensible sur les longues distances.

L'upper Primeknit OG a lui aussi bénéficié d'une refonte majeure. Le textile 3D s'adapte maintenant en temps réel à la forme du pied grâce à une structure à zones différenciées : plus rigide en médio-pied pour le maintien, plus souple en avant-pied pour la liberté de mouvement. L'intégration du système Continental rubber en semelle extérieure garantit une accroche optimale sur sol mouillé.

Côté design, Adidas adopte une approche plus épurée que les précédentes versions. Exit les débauches de détails visuels : l'Ultraboost 25 assume une ligne claire et des coloris sobres qui parlent aussi bien aux coureurs qu'aux amateurs de streetwear. Le coloris "Core Black" reste la référence, mais le "Wonder White" séduit par sa fraîcheur minimaliste.

L'Ultraboost 25 sort à 210€, un tarif premium justifié par les innovations technologiques. Un prix élevé mais aligné sur la concurrence dans ce segment ultra-compétitif.`,
    seoTitle: 'Adidas Ultraboost 25 : la running repensée de fond en comble',
    seoDescription: 'Adidas relance l\'Ultraboost 25 avec une nouvelle mousse Boost +20% et un Primeknit OG repensé. Prix 210€.',
  },

  // ──── CONVERSE ────────────────────────────────────────────────────────────

  {
    slug: 'converse-chuck-70-de-luxe-squared',
    brand: 'converse',
    title: 'Converse Chuck 70 De Luxe Squared : la Chuck repensée pour 2025',
    excerpt: 'Converse revisite son icône avec la Chuck 70 De Luxe Squared, une version à semelle rectangulaire qui secoue les codes de la sneaker la plus vendue de l\'histoire.',
    tags: ['Converse', 'Chuck 70', 'Nouveauté', 'Design'],
    date: '2025-03-20',
    body: `On ne touche pas à une icône sans prendre de risques. Converse l'a bien compris en lançant la Chuck 70 De Luxe Squared, une réinterprétation audacieuse de la silhouette fondatrice qui ose modifier l'élément le plus sacré : la semelle. Fini le contour arrondi traditionnel, place à une semelle aux angles nets et carrés qui change radicalement la silhouette de la chaussure.

Ce choix de design crée un dialogue fascinant entre passé et présent. Le reste de la chaussure reste fidèle à l'esprit Chuck : toile de coton côtelée, eyelets métalliques, languette longue et patch en caoutchouc à la cheville. Mais la semelle Squared lui confère une présence visuelle inédite, une carrure qui rappelle davantage les créations de maisons de mode que l'univers sportswear traditionnel.

Le confort a également été revu à la hausse. Converse a intégré une semelle intérieure OrthoLite plus épaisse et un amorti en mousse EVA supplémentaire, corrigeant le principal reproche fait à la Chuck classique : son manque de soutien pour un usage quotidien intensif. Une évolution bienvenue qui ne compromet pas l'authenticité de la pièce.

Le lancement s'est accompagné d'une campagne impliquant des artistes et musiciens indépendants, parfaitement dans l'ADN Converse. La marque a toujours eu cette capacité à fédérer les communautés créatives, et la De Luxe Squared ne déroge pas à la règle.

Disponible en toile blanche, noire et en deux coloris saisonniers, la Chuck 70 De Luxe Squared est vendue 120€. Un tarif légèrement supérieur à la Chuck standard, justifié par les améliorations apportées.`,
    seoTitle: 'Converse Chuck 70 De Luxe Squared 2025 : prix et avis',
    seoDescription: 'La Chuck 70 De Luxe Squared de Converse ose la semelle carrée. Nouveau confort OrthoLite à 120€.',
  },

  {
    slug: 'converse-run-star-hike-plateforme',
    brand: 'converse',
    title: 'Converse Run Star Hike : la plateforme qui ne ressemble à rien d\'autre',
    excerpt: 'La Run Star Hike de Converse s\'impose comme la plateforme la plus originale du marché avec sa semelle dentée chunky inspirée des semelles de randonnée.',
    tags: ['Converse', 'Run Star Hike', 'Plateforme', 'Mode'],
    date: '2025-01-30',
    body: `Dans un marché des sneakers de plateforme dominé par les silhouettes lisses et architecturées, la Converse Run Star Hike fait figure d'ovni. Sa semelle dentée, directement inspirée des chaussures de randonnée technique, lui confère un profil immédiatement reconnaissable qui ne laisse personne indifférent. On l'aime ou on la déteste, mais on ne peut pas l'ignorer.

La Run Star Hike est née en 2019 mais continue d'évoluer et de gagner du terrain en 2025. Converse propose cette saison de nouveaux coloris qui jouent la carte du contraste brutal : la tige blanche classique associée à une semelle noire dentelée, ou une version entièrement monochrome dans différentes teintes qui souligne les détails de la semelle.

Ce qui fait la force de cette silhouette, c'est sa polyvalence stylistique inattendue. Malgré son look extravagant, elle se marie aussi bien avec une tenue grunge qu'avec une robe midi ou un ensemble tailleur. Les fashion editors l'ont rapidement adoptée, lui offrant une légitimité dans des sphères bien au-delà du streetwear habituel de Converse.

La construction intègre le canvas durable caractéristique de Chuck, associé à une semelle intermédiaire en mousse légère qui absorbe les chocs malgré l'apparence robuste. La semelle extérieure en caoutchouc garantit une bonne accroche, même sur les surfaces glissantes.

À 110€ en toile et 130€ en cuir, la Run Star Hike reste dans les gammes accessibles de Converse tout en proposant quelque chose de vraiment différent. Un rapport valeur/originalité difficile à battre.`,
    seoTitle: 'Converse Run Star Hike 2025 : la plateforme dentée iconique',
    seoDescription: 'La Run Star Hike de Converse et sa semelle dentée chunky. Nouveaux coloris 2025 dès 110€.',
  },

  {
    slug: 'converse-one-star-pro-skate',
    brand: 'converse',
    title: 'Converse One Star Pro : le retour du skate authentique dans l\'ère moderne',
    excerpt: 'La One Star Pro s\'impose comme la sneaker de skate la plus honnête du moment, fidèle à son héritage tout en répondant aux exigences des skateurs contemporains.',
    tags: ['Converse', 'One Star', 'Skate', 'Lifestyle'],
    date: '2025-02-14',
    body: `Il existe une honnêteté dans la One Star Pro de Converse CONS que peu de sneakers de skate contemporaines peuvent revendiquer. Pas de technologie superflue, pas de marketing excessif : juste une chaussure pensée pour fonctionner sur un skate, avec un design qui a traversé les décennies sans ride-up.

La One Star est née dans les années 70 et a vécu sa golden age dans les 80s et 90s, portée par des légendes du skate comme Mark Gonzales. Le retour de la Pro en 2025 ne cherche pas à réinventer la formule mais à l'affiner subtilement. La semelle vulcanisée reste le cœur du dispositif : sa fine épaisseur offre ce board-feel irremplaçable que recherchent les skateurs exigeants.

La nouveauté de cette édition 2025 concerne l'upper en daim de qualité supérieure, plus résistant à l'abrasion des tricks répétés. Converse CONS a collaboré avec plusieurs pros du circuit pour valider les modifications apportées : la doublure intérieure renforcée aux zones d'usure critique, les œillets refaits en aluminium anodisé et l'ajout d'un insert en mousse EVA sous la semelle intérieure pour les sessions longues.

La campagne de lancement met en avant des skateurs underground, loin des stars du circuit mainstream, affirmant la volonté de Converse CONS de rester ancrée dans la culture skate authentique. Une posture que la communauté apprécie et qui fidélise une audience très engagée.

La One Star Pro est disponible à 90€, un prix accessible qui la différencie des propositions premium du marché. Pour ceux qui veulent une sneaker de skate fonctionnelle avec un look lifestyle assumé, c'est difficile de faire mieux.`,
    seoTitle: 'Converse One Star Pro 2025 : la skate shoe authentique',
    seoDescription: 'La Converse CONS One Star Pro revient en 2025 avec une construction daim premium. Prix 90€ pour les skateurs exigeants.',
  },

  // ──── NEW BALANCE ─────────────────────────────────────────────────────────

  {
    slug: 'new-balance-1000-made-in-usa',
    brand: 'new-balance',
    title: 'New Balance 1000 : le sommet du savoir-faire américain en édition limitée',
    excerpt: 'New Balance dévoile la 1000, une silhouette haut de gamme fabriquée aux États-Unis qui repousse les limites du craftsmanship dans l\'industrie sneakers.',
    tags: ['New Balance', '1000', 'Made in USA', 'Premium'],
    date: '2025-04-05',
    body: `New Balance continue de jouer une partition unique dans l'industrie sneakers mondiale avec la sortie de la 1000, sa nouvelle silhouette phare de la gamme Made in USA. Dans un secteur dominé par la production offshore à grande échelle, la marque de Boston maintient ses ateliers américains et en fait un argument marketing d'une puissance redoutable.

La 1000 est une déclaration d'intention. Fabriquée à Lawrence, Massachusetts, dans l'usine historique de New Balance, chaque paire nécessite plus de 70 opérations manuelles réalisées par des artisans qualifiés. Le résultat est visible au premier regard : des finitions irréprochables, des coutures parfaitement alignées, une construction qui respire la solidité durable.

Les matières sélectionnées sont au niveau de la réputation. L'upper associe un mesh technique développé spécifiquement pour cette silhouette avec des renforts en cuir pleine fleur d'origine américaine. La semelle intermédiaire Fresh Foam X de dernière génération offre un amorti cloud-like qui rivalise avec les meilleures technologies du marché.

Le design s'inscrit dans la tradition New Balance d'esthétique fonctionnelle : le "N" emblématique est ici brodé en fils de soie naturelle, un détail de couturier dans un contexte sportswear. Les coloris de lancement — un beige naturel et un bleu marine profond — ont été développés en collaboration avec un teinturier japonais réputé pour ses méthodes artisanales.

À 320€, la 1000 n'est pas une sneaker grand public. C'est un objet de collection, un argument pour ceux qui croient que la qualité a un prix. Production limitée à 500 paires par coloris, avec liste d'attente déjà saturée.`,
    seoTitle: 'New Balance 1000 Made in USA 2025 : le sommet du craftsmanship',
    seoDescription: 'New Balance 1000 Made in USA : 70 opérations manuelles, matières premium, 320€. Édition limitée à 500 paires.',
  },

  {
    slug: 'new-balance-990v6-heritage',
    brand: 'new-balance',
    title: 'New Balance 990v6 : six générations plus tard, l\'icône reste indétrônable',
    excerpt: 'La 990v6 de New Balance prouve qu\'on peut faire évoluer une silhouette légendaire sans jamais trahir son âme. Une mise à jour magistrale.',
    tags: ['New Balance', '990', 'Heritage', 'Running'],
    date: '2025-03-01',
    body: `1982. New Balance lance la 990 à 100 dollars, un prix exorbitant pour l'époque qui lui vaut immédiatement le surnom de "la chaussure à 100 dollars". C'est aussi la première fois qu'une sneaker de running dépasse ce palier psychologique, ouvrant la voie au marché premium qui domine aujourd'hui. Quarante-trois ans et six générations plus tard, la 990v6 confirme que cette silhouette est l'une des plus importantes de l'histoire de la discipline.

La v6 affiche une continuité remarquable avec ses prédécesseurs tout en apportant des améliorations significatives. La semelle intermédiaire combine désormais deux couches de mousses aux densités différentes : une couche supérieure en ENCAP souple pour l'absorption initiale des chocs, une couche inférieure en foam XC plus ferme pour la stabilité et la réponse. Un système qui mérite son titre de "meilleur amorti de l'histoire de la 990".

L'upper en mesh et suède reste fidèle à l'esthétique grise caractéristique, ce "dad shoe grey" qui a largement contribué à la renaissance de la silhouette dans la culture lifestyle. New Balance a simplement raffiné les coupes et amélioré la qualité des matières, notamment avec un mesh plus respirant et un suède de meilleure densité.

Ce qui distingue vraiment la 990v6, c'est sa capacité à satisfaire deux audiences opposées. Les coureurs cherchant une chaussure de longue distance fiable et confortable y trouvent leur compte. Les amateurs de mode qui veulent une sneaker lifestyle premium avec un héritage authentique également. Peu de modèles réussissent cet équilibre aussi naturellement.

Disponible à 185€ sur le site New Balance et chez les détaillants sélectionnés. Pas de raffle, pas d'algorithme SNKRS : first come, first served, comme au bon vieux temps.`,
    seoTitle: 'New Balance 990v6 2025 : six générations d\'excellence',
    seoDescription: 'La New Balance 990v6 évolue avec un double amorti ENCAP + foam XC. 185€ pour l\'héritière d\'une légende.',
  },

  {
    slug: 'new-balance-327-collaborations-2025',
    brand: 'new-balance',
    title: 'New Balance 327 : la silhouette la plus collaborée de l\'année',
    excerpt: 'La 327 s\'impose comme le canvas préféré des créateurs en 2025 avec pas moins de 8 collaborations majeures prévues sur l\'année.',
    tags: ['New Balance', '327', 'Collaboration', 'Lifestyle'],
    date: '2025-02-05',
    body: `La New Balance 327 est en train de vivre sa meilleure année depuis son lancement en 2020. Inspirée des silhouettes de trail running des années 70, avec son grand "N" vintage et sa semelle en gomme naturelle, la 327 s'est imposée comme le terrain de jeu favori des créateurs qui veulent explorer l'héritage de New Balance sans les contraintes des silhouettes ultra-iconiques comme la 990.

Pas moins de 8 collaborations majeures sont prévues en 2025, un record pour une seule silhouette. Parmi les plus attendues : une version avec une marque de prêt-à-porter parisienne qui transforme la 327 en sneaker de "sport chic" avec des matières de vestiaire — laine bouillie, cuir de veau naturel — et une autre avec un artiste plasticien new-yorkais qui traite la chaussure comme une sculpture à porter.

La collaboration la plus disruptive vient d'une maison de cosmétiques japonaise qui a intégré dans la languette une microcapsule diffusant un léger parfum boisé. Une idée étrange qui suscite autant de curiosité que de scepticisme, mais qui génère un buzz médiatique considérable.

New Balance a compris avec la 327 que la meilleure façon de maintenir une silhouette pertinente est de la confier à des partenaires créatifs qui apportent des perspectives extérieures au monde de la sneakers. Chaque collaboration est pensée comme une édition limitée artistique plutôt qu'un simple exercice de co-branding.

Les prix varient de 120€ pour les versions lifestyle standards à plus de 300€ pour les éditions collaboratives les plus travaillées. Une stratification tarifaire qui répond à des audiences différentes tout en maintenant le désir pour la silhouette.`,
    seoTitle: 'New Balance 327 collaborations 2025 : les 8 drops à suivre',
    seoDescription: '8 collaborations majeures pour la New Balance 327 en 2025. De Paris à New York, la silhouette vintage s\'offre à tous les créateurs.',
  },

  // ──── PUMA ────────────────────────────────────────────────────────────────

  {
    slug: 'puma-suede-xl-2025',
    brand: 'puma',
    title: 'Puma Suede XL : la version surdimensionnée d\'un classique indémodable',
    excerpt: 'Puma revisite sa légendaire Suede avec une version XL au profil chunky qui répond parfaitement aux tendances actuelles sans renier son héritage.',
    tags: ['Puma', 'Suede', 'Chunky', 'Tendance'],
    date: '2025-03-25',
    body: `La Puma Suede est l'une des sneakers les plus importantes de l'histoire. Créée en 1968, portée par Tommie Smith lors de sa victoire olympique au 200 mètres (et de son célèbre poing levé), adoptée par les danseurs de breakdance dans les années 80 puis par les rappeurs dans les 90s, elle a traversé toutes les cultures urbaines du XXe siècle. En 2025, la Suede XL lui offre un nouveau chapitre.

Le "XL" dans le nom ne ment pas : tout est agrandi. La semelle est plus haute, le profil plus imposant, l'ensemble plus présent visuellement. Pourtant, Puma a réussi à préserver l'équilibre délicat qui fait la Suede : malgré sa nouvelle stature, elle ne semble jamais lourdé ou maladroite.

La matière principale reste le suède qui donne son nom à la silhouette, mais dans une qualité supérieure à la Suede classique. L'entretien reste simple — Puma fournit un kit de nettoyage adapté — mais la texture plus veloutée et plus épaisse donne un sentiment de luxe accessible assez agréable.

Les coloris choisis pour le lancement parlent à toutes les générations. Le "Black/Black" monochromatique séduit les puristes, le "Cream White/Gum" conquiert les amateurs de tons chauds et le "Poison Pink" attire une clientèle plus jeune en quête de visibilité. Trois entrées, trois audiences, un seul modèle.

La Suede XL est disponible à 110€, un tarif accessible qui démocratise le chunky sans prise de tête. Puma confirme avec cette sortie sa capacité à rester pertinent dans un marché ultra-compétitif en misant sur son héritage plutôt qu'en cherchant à innover à tout prix.`,
    seoTitle: 'Puma Suede XL 2025 : le chunky qui respecte la légende',
    seoDescription: 'La Puma Suede XL revisite le classique de 1968 avec un profil surdimensionné. 3 coloris à 110€.',
  },

  {
    slug: 'puma-mb03-lamelo-ball',
    brand: 'puma',
    title: 'Puma MB.03 LaMelo Ball : la signature shoe qui s\'affranchit du terrain',
    excerpt: 'La troisième itération de la signature LaMelo Ball dépasse le cadre du basketball pour s\'imposer comme une sneaker lifestyle à part entière.',
    tags: ['Puma', 'Basketball', 'LaMelo Ball', 'Signature'],
    date: '2025-01-20',
    body: `LaMelo Ball est l'un des joueurs NBA les plus influents de sa génération, pas seulement pour son jeu mais pour son style. Sa signature shoe chez Puma, la MB, en est à sa troisième itération et continue de progresser dans une direction clairement assumée : au-delà du basketball, vers la culture.

La MB.03 hérite de la construction technique de ses prédécesseurs — semelle en caoutchouc à haute traction, amorti Nitro FOAM, système de laçage asymétrique — mais c'est son design qui fait la différence. LaMelo a pris une part active dans le processus créatif, imposant des formes et des coloris qui reflètent sa personnalité exubérante.

La version "La France" sortie en exclusivité pour le marché français en mars a été particulièrement bien reçue. Coloris bleu-blanc-rouge revisité dans une palette moderne et non conventionnelle, avec des détails en or qui rappellent l'image du joueur. Production limitée à 1 200 paires, épuisées en moins de 20 minutes sur le site de Puma.

Ce qui rend la MB.03 intéressante d'un point de vue culturel, c'est sa capacité à convaincre des consommateurs qui ne suivent pas le basketball. La silhouette fonctionne comme une sneaker lifestyle à part entière, portée avec des tenues quotidiennes sans aucune connotation sportive apparente. C'est le signe d'une signature shoe réussie : elle transcende son contexte d'origine.

Disponible à 140€ en version standard, la MB.03 se positionne intelligemment dans une gamme de prix accessible pour une signature shoe de joueur NBA actif. Puma a trouvé avec LaMelo Ball un partenaire à même de porter ses ambitions dans la culture basketball et au-delà.`,
    seoTitle: 'Puma MB.03 LaMelo Ball 2025 : la signature qui dépasse le basket',
    seoDescription: 'La MB.03 de LaMelo Ball passe du terrain à la rue. Amorti Nitro FOAM, design extravagant, 140€.',
  },

  {
    slug: 'puma-speedcat-retour-90s',
    brand: 'puma',
    title: 'Puma Speedcat : le retour de la sneaker de Formula 1 qui enflamme 2025',
    excerpt: 'La Speedcat de Puma, née dans les paddocks de Formule 1 dans les années 90, connaît un retour en force spectaculaire alimenté par la passion mondiale pour le sport automobile.',
    tags: ['Puma', 'Speedcat', 'Vintage', 'Formule 1'],
    date: '2025-04-18',
    body: `La Formule 1 est en pleine renaissance culturelle. Portée par une nouvelle génération de fans conquise par les séries documentaires et des pilotes devenus de véritables icônes pop, la discipline attire désormais des audiences bien au-delà de son fan base traditionnel. Puma, équipementier officiel de plusieurs écuries, surfe sur cette vague avec un timing parfait : le retour de la Speedcat.

La Speedcat est née dans les paddocks dans les années 90. Conçue à l'origine comme une chaussure fonctionnelle pour les mécaniciens et le personnel des stands — sa semelle ultra-fine permettait une meilleure sensibilité des pédales — elle a rapidement été adoptée par les pilotes en dehors des circuits, puis par le grand public séduit par son esthétique racing authentique.

Ce qui la distingue immédiatement dans le paysage sneakers actuel, c'est son profil extrêmement bas et sa semelle quasi-inexistante. À contre-courant des silhouettes chunky qui dominent depuis plusieurs années, la Speedcat assume une extrême finesse qui lui confère un look presque minimaliste, mais chargé d'histoire.

Puma a été malin dans sa stratégie de retour. Plutôt que de sur-marketer le produit, la marque a d'abord habillé des pilotes actuels et des célébrités proches de la F1 avec des paires en édition très limitée. L'effet "vu-sur" a créé une demande organique avant même la mise en vente officielle.

La Speedcat OG est disponible à 100€ dans plusieurs coloris qui font référence aux livrées d'écuries historiques. La version Ferrari en rouge et jaune est déjà en rupture. Une renaissance méritée pour une silhouette qui avait tout pour revenir.`,
    seoTitle: 'Puma Speedcat 2025 : le retour de la sneaker Formula 1',
    seoDescription: 'La Puma Speedcat ressurgit des paddocks F1. Profil ultra-bas, 100€, coloris Ferrari déjà sold out.',
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔌 Connexion à Sanity…\n`)

  // Récupérer les marques
  const brands = await client.fetch(
    `*[_type == "brand"] { _id, name, slug }`
  )
  console.log(`🏷  ${brands.length} marque(s) trouvée(s) dans Sanity\n`)

  // Récupérer les slugs d'articles existants pour éviter les doublons
  const existing = await client.fetch(
    `*[_type == "article"] { "slug": slug.current }`
  )
  const existingSlugs = new Set(existing.map(a => a.slug))

  let created = 0
  let skipped = 0

  for (const art of ARTICLES) {
    if (existingSlugs.has(art.slug)) {
      console.log(`   ⏭  Déjà existant : "${art.title.slice(0, 50)}"`)
      skipped++
      continue
    }

    const brand = brands.find(b => b.slug?.current === art.brand)
    const brandRef = brand ? [{ _type: 'reference', _ref: brand._id, _key: brand._id }] : []

    const doc = {
      _type: 'article',
      title: art.title,
      slug: { _type: 'slug', current: art.slug },
      excerpt: art.excerpt,
      tags: art.tags,
      publishedAt: new Date(art.date).toISOString(),
      body: toBlock(art.body),
      seoTitle: art.seoTitle,
      seoDescription: art.seoDescription,
      ...(brandRef.length > 0 && { brands: brandRef }),
    }

    try {
      await client.create(doc)
      console.log(`   ✅ "${art.title.slice(0, 60)}"`)
      created++
    } catch (err) {
      console.log(`   ❌ Erreur : ${err.message}`)
    }
  }

  console.log(`\n${'━'.repeat(60)}`)
  console.log(`✅ ${created} article(s) créé(s)`)
  console.log(`⏭  ${skipped} article(s) déjà existant(s)`)
  console.log(`\n🎉 Recharge ton site pour voir les articles !\n`)
}

main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message)
  process.exit(1)
})
