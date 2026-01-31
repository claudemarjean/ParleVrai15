# 🚀 Déploiement sur Vercel - ParleVrai15

## 📋 Configuration des variables d'environnement

### Étape 1 : Connectez votre projet à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Importez votre repository ParleVrai15
4. Vercel détectera automatiquement Vite

### Étape 2 : Configurer les variables d'environnement

**Dans l'interface Vercel :**

1. Allez dans votre projet > **Settings**
2. Cliquez sur **Environment Variables** (menu gauche)
3. Ajoutez les variables suivantes :

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://VOTRE-PROJECT.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |

**Important :**
- ✅ Cochez **Production**, **Preview** et **Development**
- ✅ Ces clés sont **publiques** et sûres (protection par RLS dans Supabase)
- ✅ Le préfixe `VITE_` est obligatoire pour que Vite les expose au client

### Étape 3 : Déployer

```bash
# Option 1 : Depuis Vercel (automatique)
# Chaque push sur main déclenchera un déploiement

# Option 2 : Depuis le terminal
npx vercel
```

---

## 🔧 Configuration Build (vercel.json)

Créez ce fichier à la racine si nécessaire :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## ✅ Vérification

Après le déploiement :

1. Ouvrez votre site Vercel
2. Ouvrez la console (F12)
3. Allez sur la page d'accueil
4. Vous devriez voir : `[Analytics] 📊 Tracking première visite...`

Si vous voyez `[Analytics] ⚠️ Supabase non configuré`, c'est que les variables d'environnement ne sont pas configurées correctement dans Vercel.

---

## 🔄 Workflow complet

### Développement local (votre machine)
```bash
# 1. Créer .env avec vos clés
cp .env.example .env
# Éditer .env avec vos vraies valeurs

# 2. Lancer le dev
npm run dev
```

### Production (Vercel)
```bash
# 1. Configurer les variables dans Vercel (une seule fois)
# 2. Push sur GitHub
git push origin main

# 3. Vercel déploie automatiquement ✅
```

---

## 🐛 Dépannage

### Les variables ne sont pas reconnues

1. Vérifiez que les noms commencent par `VITE_`
2. Redeployez le projet (Settings > Deployments > Redeploy)
3. Vérifiez dans Build Logs que les variables sont présentes

### Le tracking ne fonctionne pas en production

Ouvrez la console et vérifiez les erreurs CORS ou réseau.

---

## 📌 À retenir

- ❌ **Ne jamais** committer `.env` 
- ✅ **Toujours** configurer les variables dans Vercel Settings
- ✅ Le préfixe `VITE_` expose les variables au navigateur
- ✅ Les clés Supabase `anon` sont sûres côté client (RLS activé)
