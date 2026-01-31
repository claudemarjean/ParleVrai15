# 🎯 Test du tracking - ParleVrai15

## ✅ Modifications effectuées

Le code a été complètement adapté selon la documentation de **claude-folio** (application de référence qui fonctionne).

### Changements clés :

1. **Session ID** : Stocké dans `localStorage` (au lieu de `sessionStorage`)
2. **`visited_at`** : Envoyé au format ISO 8601 (`new Date().toISOString()`)
3. **`is_deleted`** : Toujours `false` (CRITIQUE !)
4. **`user_id`** : Récupéré via `supabase.auth.getSession()` (pas authService local)
5. **Géolocalisation** : Via ipapi.co (ip_address, country, region, city)
6. **Insertion** : `.insert([payload])` - Tableau avec un élément
7. **Pas de `.select()`** après l'insertion
8. **Retry** : 3 tentatives avec backoff progressif (300ms, 600ms, 900ms)
9. **`is_unique`** : Vérifié en base de données

---

## 🧪 Comment tester

### 1. Démarrer l'application

```bash
npm run dev
```

### 2. Ouvrir la console du navigateur

Appuyez sur **F12** pour ouvrir les DevTools.

### 3. Aller sur la page d'accueil

L'URL devrait être `http://localhost:5173/` (ou similaire).

### 4. Vérifier les logs dans la console

Vous devriez voir :

```
[Analytics] 📊 Début du tracking...
[Analytics] Authentifié: false
[Analytics] User ID: NULL
[Analytics] Session ID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
[Analytics] Payload: {application_id: "c2036adf-59fe-4fdb-a019-7568b24fa8e1", ...}
[Analytics] ✅ Insertion réussie (tentative 1)
[Analytics] ✅ Première visite trackée avec succès !
```

### 5. Vérifier dans Supabase

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. **Table Editor** → `ivony_consultation`
3. Filtrer par `application_id = c2036adf-59fe-4fdb-a019-7568b24fa8e1`
4. Vous devriez voir une nouvelle ligne avec :
   - ✅ `visited_at` au format ISO
   - ✅ `is_deleted = false`
   - ✅ `ip_address`, `country`, `region`, `city` remplis
   - ✅ `user_id = null` (si non connecté)
   - ✅ Tous les autres champs remplis

---

## ❌ En cas d'erreur

### Erreur : "new row violates row-level security policy"

➡️ La politique RLS bloque encore. Vérifiez dans Supabase :
- **Table Editor** → `ivony_consultation` → **RLS**
- Il doit y avoir une politique permettant INSERT avec `application_id = 'c2036adf-59fe-4fdb-a019-7568b24fa8e1'`

### Erreur : "Supabase non configuré"

➡️ Vérifiez le fichier `.env` :
```env
VITE_SUPABASE_URL=https://jzabkrztgkayunjbzlzj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Puis **redémarrez** le serveur de dev.

### Erreur réseau ou timeout

➡️ Le retry devrait gérer ça automatiquement (3 tentatives).

### Pas de géolocalisation

➡️ Normal si ipapi.co est bloqué ou lent. Les champs seront `null`.

---

## 🔄 Tester une nouvelle visite

Pour tester à nouveau (simuler un nouvel utilisateur) :

### Option 1 : Via console

```javascript
localStorage.removeItem('ivony_session_id');
location.reload();
```

### Option 2 : Via la fonction

```javascript
import analytics from './src/services/analytics.js';
analytics.resetTracking();
location.reload();
```

### Option 3 : Navigation privée

Ouvrez un nouvel onglet en navigation privée.

---

## 📊 Vérifications importantes

- [ ] Le tracking se déclenche automatiquement au chargement de la page d'accueil
- [ ] L'insertion réussit (pas d'erreur RLS)
- [ ] Les données apparaissent dans Supabase
- [ ] Le `session_id` est persisté (rechargement ne crée pas de doublon immédiat)
- [ ] Les champs obligatoires sont tous présents
- [ ] `is_deleted = false`
- [ ] `visited_at` au format ISO 8601
- [ ] La géolocalisation fonctionne (ou est null)

---

## 🎉 Si tout fonctionne

Vous devriez voir :
- ✅ Logs de succès dans la console
- ✅ Nouvelle ligne dans `ivony_consultation` 
- ✅ Toutes les données correctement remplies
- ✅ Pas d'erreur RLS

**Félicitations ! Le tracking est opérationnel. 🚀**
