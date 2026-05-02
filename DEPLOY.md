# 🚀 Déploiement SneakActu sur Vercel

## 1. Pousser le code sur GitHub

```bash
cd ~/Desktop/sneakactu

# Si pas encore initialisé
git init
git add .
git commit -m "feat: initial deploy"

# Créer un repo sur github.com puis :
git remote add origin https://github.com/TON_USERNAME/sneakactu.git
git branch -M main
git push -u origin main
```

---

## 2. Importer sur Vercel

1. Va sur **vercel.com** → "Add New Project"
2. Clique **"Import Git Repository"** → sélectionne `sneakactu`
3. Framework détecté automatiquement : **Next.js** ✅

---

## 3. Variables d'environnement (OBLIGATOIRE)

Dans Vercel → Settings → **Environment Variables**, ajoute :

| Nom | Valeur |
|-----|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `mrzyhh7a` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | *(ton token Sanity — ne pas partager)* |
| `NEXT_PUBLIC_SITE_URL` | `https://sneakactu.fr` |

> ⚠️ Le `SANITY_API_TOKEN` doit être en **"Sensitive"** sur Vercel

---

## 4. Deploy

Clique **"Deploy"** — Vercel build et déploie automatiquement. ✅

---

## 5. Connecter ton nom de domaine

1. Vercel → ton projet → **Settings → Domains**
2. Clique **"Add Domain"** → tape `sneakactu.fr`
3. Vercel te donne deux enregistrements DNS à ajouter chez ton registrar :

```
Type : A       sneakactu.fr      →  76.76.21.21
Type : CNAME   www.sneakactu.fr  →  cname.vercel-dns.com
```

4. Attends 10-30 min que le DNS se propage
5. Vercel active le **SSL (HTTPS) automatiquement** 🔒

---

## 6. Soumettre à Google Search Console

1. Va sur **search.google.com/search-console**
2. Ajoute la propriété `https://sneakactu.fr`
3. Vérifie via le fichier HTML ou la balise meta
4. Va dans **Sitemaps** → entre `https://sneakactu.fr/sitemap.xml`
5. Google commence à indexer dans les 24-48h

---

## 7. Sanity CORS (important)

Pour que Sanity accepte les requêtes depuis ton domaine en prod :

1. Va sur **sanity.io/manage** → ton projet
2. **API → CORS Origins**
3. Ajoute `https://sneakactu.fr` et `https://www.sneakactu.fr`

---

## Déploiements suivants

Chaque `git push` sur `main` redéploie automatiquement. 🔄
