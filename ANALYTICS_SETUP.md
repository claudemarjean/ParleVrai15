# 📊 Guide d'implémentation du tracking Analytics - ParleVrai15

## ✅ Ce qui a été fait

### 1. Fichiers créés

- **`src/services/supabaseClient.js`** - Client Supabase centralisé
- **`src/services/analytics.js`** - Service de tracking des visites
- **`supabase-table-ivony_consultation.sql`** - Script SQL pour créer la table

### 2. Fichiers modifiés

- **`src/pages/Home.js`** - Ajout de l'appel à `trackFirstVisit()`
- **`.env.example`** - Ajout des instructions de configuration Supabase

---

## 🚀 Configuration étape par étape

### Étape 1 : Créer la table dans Supabase

1. Connectez-vous à [https://app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (barre latérale gauche)
4. Cliquez sur **New Query**
5. Copiez-collez le contenu de `supabase-table-ivony_consultation.sql`
6. Cliquez sur **Run** pour exécuter le script
7. Vérifiez que la table est créée dans **Table Editor**

### Étape 2 : Configurer les variables d'environnement

1. Dans votre projet Supabase, allez dans **Settings > API**
2. Copiez les valeurs suivantes :
   - **Project URL** (ex: https://xyzcompany.supabase.co)
   - **anon public** key (la clé publique)

3. Créez un fichier `.env` à la racine du projet :

```bash
# Copier .env.example vers .env
cp .env.example .env
```

4. Éditez le fichier `.env` et remplacez les valeurs :

```env
VITE_SUPABASE_URL=https://VOTRE-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. **Important** : Vérifiez que `.env` est dans votre `.gitignore` !

### Étape 3 : Redémarrer le serveur

```bash
# Arrêter le serveur actuel (Ctrl+C)
# Puis redémarrer
npm run dev
```

---

## 🧪 Test du tracking

### Test 1 : Vérifier la configuration

Ouvrez la console du navigateur (F12) et allez sur la page d'accueil.

Vous devriez voir :

```
[Analytics] 📊 Tracking première visite... {session_id: "...", device: "desktop", ...}
[Analytics] ✅ Première visite trackée avec succès
```

### Test 2 : Vérifier dans Supabase

1. Allez dans **Table Editor** > **ivony_consultation**
2. Vous devriez voir une nouvelle ligne avec :
   - `application_id` = c2036adf-59fe-4fdb-a019-7568b24fa8e1
   - `session_id` = UUID généré
   - Toutes les informations de votre navigateur

### Test 3 : Vérifier la déduplication

1. Rechargez la page plusieurs fois
2. Dans la console, vous devriez voir :
   ```
   [Analytics] Première visite déjà trackée dans cette session
   ```
3. Une seule ligne devrait être créée par session

### Test 4 : Nouvelle session

1. Fermez l'onglet complètement
2. Rouvrez l'application
3. Une nouvelle entrée sera créée (nouveau `session_id`)

---

## 📋 Données collectées

Voici toutes les données automatiquement collectées :

| Champ | Source | Exemple |
|-------|--------|---------|
| `application_id` | Constante | c2036adf-59fe-4fdb-a019-7568b24fa8e1 |
| `user_id` | authService.user.id | null ou UUID |
| `session_id` | Généré (UUID v4) | a1b2c3d4-... |
| `visited_at` | Automatique (now()) | 2026-01-31 10:30:00 |
| `timezone` | Intl API | Europe/Paris |
| `language` | navigator.language | fr-FR |
| `device_type` | userAgent | desktop/mobile/tablet |
| `os` | userAgent | Windows/MacOS/iOS/Android |
| `browser` | userAgent | Chrome/Firefox/Safari |
| `user_agent` | navigator.userAgent | Mozilla/5.0... |
| `screen_width` | window.screen.width | 1920 |
| `screen_height` | window.screen.height | 1080 |
| `referrer` | document.referrer | https://google.com |
| `utm_source` | URL params | google/facebook |
| `utm_medium` | URL params | cpc/social |
| `utm_campaign` | URL params | winter-2026 |
| `metadata` | JSON | {window_width, color_depth...} |
| `is_unique` | true | true |
| `is_authenticated` | authService | true/false |

---

## 🔧 Personnalisation

### Ajouter la géolocalisation (IP, pays, ville)

Pour obtenir ces informations, vous devez utiliser une API externe :

**Option 1 : ipapi.co (gratuit)**

```javascript
// Dans analytics.js, ajoutez cette fonction
async function getGeolocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      ip_address: data.ip,
      country: data.country_name,
      region: data.region,
      city: data.city
    };
  } catch (error) {
    console.warn('Géolocalisation indisponible:', error);
    return { ip_address: null, country: null, region: null, city: null };
  }
}

// Puis dans collectVisitData(), remplacez :
// ip_address: null,
// country: null,
// ...

// Par :
const geo = await getGeolocation();
...
ip_address: geo.ip_address,
country: geo.country,
region: geo.region,
city: geo.city,
```

**Option 2 : Côté serveur (recommandé)**

Utilisez une fonction Supabase Edge ou un trigger PostgreSQL pour récupérer l'IP depuis les headers.

### Désactiver le tracking en développement

```javascript
// Dans analytics.js, au début de trackFirstVisit()
if (import.meta.env.DEV) {
  console.log('[Analytics] Mode développement - tracking désactivé');
  return { success: true, data: null };
}
```

### Réinitialiser le tracking (pour tests)

Dans la console du navigateur :

```javascript
// Importer le service
import analytics from './src/services/analytics.js';

// Réinitialiser
analytics.resetTracking();

// Puis rechargez la page
```

---

## 🔒 Sécurité et RLS

Les politiques RLS (Row Level Security) sont déjà configurées :

- ✅ **Insertion publique** : Tout le monde peut insérer (nécessaire pour le tracking anonyme)
- ✅ **Lecture personnelle** : Les utilisateurs connectés voient uniquement leurs données
- ⚠️ **Admin** : À configurer selon votre système de rôles

---

## 📊 Requêtes SQL utiles

### Voir toutes les visites de ParleVrai15

```sql
SELECT * FROM ivony_consultation
WHERE application_id = 'c2036adf-59fe-4fdb-a019-7568b24fa8e1'
ORDER BY visited_at DESC
LIMIT 100;
```

### Statistiques par appareil

```sql
SELECT 
  device_type,
  COUNT(*) as total_visits,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as authenticated_users
FROM ivony_consultation
WHERE application_id = 'c2036adf-59fe-4fdb-a019-7568b24fa8e1'
GROUP BY device_type;
```

### Visites par source UTM

```sql
SELECT 
  utm_source,
  utm_medium,
  utm_campaign,
  COUNT(*) as visits
FROM ivony_consultation
WHERE application_id = 'c2036adf-59fe-4fdb-a019-7568b24fa8e1'
  AND utm_source IS NOT NULL
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY visits DESC;
```

### Taux de conversion (visiteurs → connectés)

```sql
SELECT 
  COUNT(*) FILTER (WHERE is_authenticated = false) as anonymous_visits,
  COUNT(*) FILTER (WHERE is_authenticated = true) as authenticated_visits,
  ROUND(100.0 * COUNT(*) FILTER (WHERE is_authenticated = true) / COUNT(*), 2) as conversion_rate
FROM ivony_consultation
WHERE application_id = 'c2036adf-59fe-4fdb-a019-7568b24fa8e1';
```

---

## 🐛 Dépannage

### Erreur : "Supabase non configuré"

➡️ Vérifiez que le fichier `.env` existe et contient les bonnes valeurs.

### Erreur : "relation ivony_consultation does not exist"

➡️ La table n'est pas créée. Exécutez le script SQL dans Supabase.

### Erreur : "permission denied for table ivony_consultation"

➡️ Vérifiez les politiques RLS dans Supabase (Table Editor > ivony_consultation > RLS).

### Aucune donnée insérée

➡️ Ouvrez la console (F12) et vérifiez les messages `[Analytics]`.

---

## 📝 Notes de production

1. **CORS** : L'anon key est safe pour le frontend (protection par RLS)
2. **Performance** : L'insertion est asynchrone et ne bloque pas le chargement
3. **Privacy** : Respectez le RGPD - ajoutez un bandeau cookies si nécessaire
4. **Coût** : Supabase gratuit = 500 MB de données (largement suffisant pour débuter)

---

## ✨ Prochaines étapes (optionnel)

- [ ] Ajouter un dashboard analytics dans l'admin
- [ ] Tracker d'autres événements (signup, lesson_completed, etc.)
- [ ] Implémenter la géolocalisation côté serveur
- [ ] Créer des rapports hebdomadaires automatiques
- [ ] Ajouter Google Analytics en complément

---

**🎉 Vous êtes prêt !** Le tracking est maintenant actif sur votre page d'accueil.
