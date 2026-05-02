# SneakActu — Guide de démarrage

## Prérequis

- Node.js 18+
- npm / pnpm / yarn

---

## 1. Installer les dépendances

```bash
npm install
```

> Si tu vois des warnings pour `tailwindcss-animate`, installe-le :
> ```bash
> npm install tailwindcss-animate
> ```

---

## 2. Configurer Sanity

### Créer le projet Sanity

1. Va sur [sanity.io](https://sanity.io) → **New Project**
2. Choisis un nom (ex: `sneakactu`)
3. Dataset : `production`
4. Copie le **Project ID**

### Variables d'environnement

Copie `.env.example` en `.env.local` :

```bash
cp .env.example .env.local
```

Puis remplis :

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=ton_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=ton_token  # (optionnel en dev)
```

### Accéder au Studio

Lance le projet puis va sur **http://localhost:3000/studio**

---

## 3. Lancer en développement

```bash
npm run dev
```

Le site tourne sur **http://localhost:3000**

---

## 4. Déploiement Vercel

### Via GitHub (recommandé)

1. Push le repo sur GitHub
2. Va sur [vercel.com](https://vercel.com) → **New Project** → importe le repo
3. Ajoute les variables d'environnement dans Vercel :
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`
4. Domaine custom : dans Vercel → **Domains** → ajoute `sneakactu.fr`
5. DNS Hostinger : change les nameservers vers Vercel

### Webhook Sanity → Vercel (ISR)

Dans Sanity Studio → **API** → **Webhooks** :

```
URL : https://sneakactu.fr/api/revalidate
Trigger : On create / On update / On delete
Dataset : production
```

> Pour l'instant, l'ISR est géré par `export const revalidate = 60` sur chaque page.
> Le webhook permettra une revalidation immédiate à chaque publication.

---

## 5. Google Search Console

1. Va sur [search.google.com/search-console](https://search.google.com/search-console)
2. Ajoute le domaine `sneakactu.fr`
3. Vérifie via le fichier HTML ou DNS
4. Soumets le sitemap : `https://sneakactu.fr/sitemap.xml`

---

## 6. Structure des fichiers

```
sneakactu/
├── app/                    → Pages Next.js (App Router)
│   ├── layout.tsx          → Layout global
│   ├── page.tsx            → Homepage
│   ├── articles/           → Liste + article individuel
│   ├── marques/            → Liste + page marque
│   ├── emergentes/         → Liste + page émergente
│   ├── releases/           → Calendrier
│   ├── guides/             → Guides d'achat
│   ├── recherche/          → Page recherche
│   ├── studio/             → Sanity Studio embarqué
│   └── sitemap.ts          → Sitemap dynamique
├── components/
│   ├── layout/             → Navbar, Footer
│   ├── articles/           → ArticleCard, ArticleGrid, ArticleBody
│   ├── brands/             → BrandCard
│   ├── releases/           → ReleaseCard
│   ├── ui/                 → Breadcrumb, CategoryBadge
│   └── providers/          → ThemeProvider
├── lib/
│   ├── sanity.ts           → Client + queries GROQ + types
│   └── utils.ts            → Utilitaires
├── sanity/
│   └── schemas/            → Schémas (article, brand, release, category)
└── sanity.config.ts        → Config Studio Sanity
```

---

## 7. Prochaines étapes (Phase 2)

- [ ] Ajouter `tailwindcss-animate` au package.json
- [ ] Créer les 30-40 premiers articles via Sanity Studio
- [ ] Configurer Google Analytics (GA4)
- [ ] Setup n8n pour les automatisations réseaux sociaux
- [ ] Inscription Boosterlink / Ereferer pour les backlinks
- [ ] Configurer le webhook Sanity → Vercel pour l'ISR
