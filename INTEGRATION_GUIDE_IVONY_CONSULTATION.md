# 📖 GUIDE D'INTÉGRATION - ivony_consultation

> **Application de référence** : claude-folio  
> **Date d'analyse** : 31 janvier 2026  
> **Statut** : ✅ Fonctionne parfaitement avec ivony_consultation

---

## 🎯 OBJECTIF

Ce document détaille **EXACTEMENT** comment l'application claude-folio réussit à insérer des données dans la table `ivony_consultation` sans erreur RLS (Row Level Security). Utilisez ce guide pour reproduire cette configuration dans d'autres applications.

---

## 📋 TABLE DES MATIÈRES

1. [Configuration Supabase](#1-configuration-supabase)
2. [Structure des données](#2-structure-des-données)
3. [Gestion du user_id](#3-gestion-du-user_id)
4. [Génération du session_id](#4-génération-du-session_id)
5. [Fonction d'insertion](#5-fonction-dinsertion)
6. [Code complet à copier](#6-code-complet-à-copier)
7. [Checklist d'intégration](#7-checklist-dintégration)

---

## 1. CONFIGURATION SUPABASE

### 1.1 Initialisation du client

```javascript
// Configuration globale
window.IVONY_CONFIG = {
  SUPABASE_URL: 'https://jzabkrztgkayunjbzlzj.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6YWJrcnp0Z2theXVuamJ6bHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTEzNjQsImV4cCI6MjA4MzI4NzM2NH0.C2z2JLVtLh8oPv9zBAOjjp3Geqrpf4O-k9ATYYzw1cE',
  PORTFOLIO_APP_ID: '00da2367-d90d-4735-8f42-cf99adebf881'
};

// Initialisation du client
window.supabaseClient = supabase.createClient(
    IVONY_CONFIG.SUPABASE_URL,
    IVONY_CONFIG.SUPABASE_ANON_KEY
);
```

### 1.2 Caractéristiques de l'initialisation

✅ **Options utilisées** : AUCUNE (configuration par défaut)
- Pas de headers personnalisés
- Pas de configuration auth personnalisée
- localStorage par défaut pour la persistance
- Pas de `fetch` personnalisé

⚠️ **IMPORTANT** : L'application utilise la configuration Supabase la plus basique possible. Si votre application a des options personnalisées, cela pourrait être la source du problème RLS.

---

## 2. STRUCTURE DES DONNÉES

### 2.1 Payload complet d'insertion

```javascript
const payload = {
    application_id: applicationId,              // UUID (obligatoire)
    user_id: activeSession?.user?.id || null,  // UUID ou NULL
    is_authenticated: isAuthenticated,          // boolean
    is_unique: isUnique,                        // boolean
    session_id: sessionId,                      // UUID
    ip_address: geo.ip_address,                 // string ou NULL
    country: geo.country,                       // string ou NULL
    region: geo.region,                         // string ou NULL
    city: geo.city,                             // string ou NULL
    browser,                                    // string
    os,                                         // string
    device_type: deviceType,                    // string
    visited_at: new Date().toISOString(),      // timestamp ISO 8601
    is_deleted: false                           // boolean (IMPORTANT!)
};
```

### 2.2 Champs obligatoires (TOUS doivent être présents)

| Champ | Type | Valeur | Remarque |
|-------|------|--------|----------|
| `application_id` | UUID | UUID valide | **Obligatoire** |
| `session_id` | UUID | UUID valide | **Obligatoire** |
| `is_authenticated` | boolean | true/false | **Obligatoire** |
| `is_unique` | boolean | true/false | **Obligatoire** |
| `visited_at` | timestamp | ISO 8601 | **Obligatoire** |
| `is_deleted` | boolean | `false` | **⚠️ CRITIQUE!** |
| `user_id` | UUID | UUID ou `null` | Peut être null |

### 2.3 Format des dates

```javascript
// ✅ CORRECT
visited_at: new Date().toISOString()
// Exemple: "2026-01-31T14:23:45.678Z"

// ❌ INCORRECT
visited_at: Date.now()           // Nombre au lieu de string
visited_at: new Date()           // Objet au lieu de string
visited_at: "2026-01-31"         // Pas au format ISO complet
```

---

## 3. GESTION DU USER_ID

### 3.1 Récupération de la session

```javascript
// Récupérer la session active
const { data: sessionData } = await supabase.auth.getSession();
const activeSession = sessionData?.session || null;
const isAuthenticated = Boolean(activeSession?.user?.id);

console.log('Authentifié:', isAuthenticated);
console.log('User ID:', activeSession?.user?.id || 'NULL');
```

### 3.2 Détermination du user_id

```javascript
const payload = {
    user_id: activeSession?.user?.id || null,
    is_authenticated: isAuthenticated,
    // ... autres champs
};
```

### 3.3 Points clés

✅ **user_id peut être NULL** - La politique RLS DOIT accepter `user_id = NULL`  
✅ **Utiliser `.auth.getSession()`** et non `.auth.getUser()`  
✅ **Vérifier que la session existe** avant d'accéder à `.user.id`

---

## 4. GÉNÉRATION DU SESSION_ID

### 4.1 Fonction de génération UUID

```javascript
function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback pour navigateurs anciens
    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return template.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
```

### 4.2 Persistance du session_id

```javascript
const STORAGE_KEY = 'ivony_session_id';

function getStoredSessionId() {
    try {
        return window.localStorage.getItem(STORAGE_KEY) || null;
    } catch (err) {
        console.warn('localStorage inaccessible', err);
        return null;
    }
}

function persistSessionId(id) {
    try {
        window.localStorage.setItem(STORAGE_KEY, id);
    } catch (err) {
        console.warn('Impossible de stocker le session_id', err);
    }
}

function getOrCreateSessionId() {
    const existing = getStoredSessionId();
    if (existing) return existing;
    
    const newId = uuid();
    persistSessionId(newId);
    return newId;
}
```

### 4.3 Utilisation

```javascript
// Pour utilisateur authentifié
const sessionId = activeSession?.access_token 
    || activeSession?.user?.id 
    || getOrCreateSessionId();

// Pour utilisateur non authentifié
const sessionId = getOrCreateSessionId();
```

---

## 5. FONCTION D'INSERTION

### 5.1 Fonction avec retry

```javascript
const MAX_RETRY = 3;

async function insertWithRetry(supabase, payload) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= MAX_RETRY; attempt += 1) {
        const { error } = await supabase
            .from('ivony_consultation')
            .insert([payload]);  // ⚠️ IMPORTANT: Tableau avec un élément!

        if (!error) {
            return { success: true };
        }

        lastError = error;
        const backoff = attempt * 300; // 300ms, 600ms, 900ms
        await new Promise((resolve) => setTimeout(resolve, backoff));
    }

    return { success: false, error: lastError };
}
```

### 5.2 Points critiques

⚠️ **`.insert([payload])`** - Le payload DOIT être dans un tableau  
⚠️ **Pas de `.select()`** après l'insert  
⚠️ **Pas de `.single()`** ou `.maybeSingle()`  
⚠️ **Retry avec backoff** pour gérer les erreurs transitoires

### 5.3 Fonction principale de tracking

```javascript
async function trackConsultation(supabase, applicationId, options = {}) {
    console.log('[Tracking] Début...');
    
    // 1. Validation
    if (!supabase || typeof supabase.from !== 'function') {
        console.error('[Tracking] Supabase client manquant');
        return { success: false, error: 'Supabase client manquant' };
    }

    if (!applicationId) {
        console.error('[Tracking] applicationId manquant');
        return { success: false, error: 'applicationId manquant' };
    }

    try {
        // 2. Récupération de la session
        const { data: sessionData } = await supabase.auth.getSession();
        const activeSession = sessionData?.session || null;
        const isAuthenticated = Boolean(activeSession?.user?.id);

        // 3. Génération session_id
        const sessionId = isAuthenticated
            ? activeSession?.access_token || activeSession?.user?.id || getOrCreateSessionId()
            : getOrCreateSessionId();

        // 4. Détection device
        const { deviceType, browser, os } = detectDevice();
        
        // 5. Géolocalisation
        const geo = await fetchIpData(options.geo);
        
        // 6. Vérification unicité
        const isUnique = await isUniqueVisit(supabase, applicationId, sessionId);

        // 7. Construction payload
        const payload = {
            application_id: applicationId,
            user_id: activeSession?.user?.id || null,
            is_authenticated: isAuthenticated,
            is_unique: isUnique,
            session_id: sessionId,
            ip_address: geo.ip_address,
            country: geo.country,
            region: geo.region,
            city: geo.city,
            browser,
            os,
            device_type: deviceType,
            visited_at: new Date().toISOString(),
            is_deleted: false
        };

        console.log('[Tracking] Payload:', payload);

        // 8. Insertion avec retry
        const result = await insertWithRetry(supabase, payload);
        
        if (!result.success) {
            console.error('[Tracking] Échec:', result.error);
            return { success: false, error: result.error };
        }

        console.log('[Tracking] ✅ Succès !');
        return { success: true };
        
    } catch (err) {
        console.error('[Tracking] Erreur:', err);
        return { success: false, error: err };
    }
}
```

---

## 6. CODE COMPLET À COPIER

### 6.1 Fonctions utilitaires

```javascript
// ========================================
// UTILITAIRES UUID & SESSION
// ========================================

const STORAGE_KEY = 'ivony_session_id';

function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return template.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function getStoredSessionId() {
    try {
        return window.localStorage.getItem(STORAGE_KEY) || null;
    } catch (err) {
        console.warn('localStorage inaccessible', err);
        return null;
    }
}

function persistSessionId(id) {
    try {
        window.localStorage.setItem(STORAGE_KEY, id);
    } catch (err) {
        console.warn('Impossible de stocker le session_id', err);
    }
}

function getOrCreateSessionId() {
    const existing = getStoredSessionId();
    if (existing) return existing;
    const newId = uuid();
    persistSessionId(newId);
    return newId;
}

// ========================================
// DÉTECTION DEVICE
// ========================================

function detectDevice() {
    const ua = navigator.userAgent || '';
    const lowerUA = ua.toLowerCase();
    
    const deviceType = /mobile|iphone|android|ipad/.test(lowerUA)
        ? 'mobile'
        : /tablet|ipad/.test(lowerUA)
            ? 'tablet'
            : 'desktop';

    let browser = 'unknown';
    if (/edg\//i.test(ua)) browser = 'edge';
    else if (/chrome|crios/i.test(ua)) browser = 'chrome';
    else if (/safari/i.test(ua)) browser = 'safari';
    else if (/firefox|fxios/i.test(ua)) browser = 'firefox';
    else if (/opr\//i.test(ua)) browser = 'opera';

    let os = 'unknown';
    if (/windows nt/i.test(ua)) os = 'windows';
    else if (/android/i.test(ua)) os = 'android';
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'ios';
    else if (/mac os x/i.test(ua)) os = 'macos';
    else if (/linux/i.test(ua)) os = 'linux';

    return { deviceType, browser, os };
}

// ========================================
// GÉOLOCALISATION
// ========================================

const IPAPI_URL = 'https://ipapi.co';
const EMPTY_GEO = { ip_address: null, country: null, region: null, city: null };

function normalizeGeo(raw = {}) {
    return {
        ip_address: raw.ip_address || raw.ip || null,
        country: raw.country || raw.country_name || null,
        region: raw.region || raw.region_name || null,
        city: raw.city || null
    };
}

async function fetchIpData(overrideGeo) {
    const provided = normalizeGeo(overrideGeo);
    if (provided.ip_address || provided.country || provided.region || provided.city) {
        return provided;
    }

    try {
        const autoRes = await fetch(`${IPAPI_URL}/json/`);
        const autoJson = await autoRes.json();
        const autoGeo = normalizeGeo({
            ip_address: autoJson?.ip,
            country: autoJson?.country_name,
            region: autoJson?.region,
            city: autoJson?.city
        });

        if (autoGeo.ip_address || autoGeo.country || autoGeo.region || autoGeo.city) {
            return autoGeo;
        }
    } catch (err) {
        console.warn('Géolocalisation échouée', err);
    }

    return EMPTY_GEO;
}

// ========================================
// VÉRIFICATION UNICITÉ
// ========================================

async function isUniqueVisit(supabase, applicationId, sessionId) {
    try {
        const { data, error } = await supabase
            .from('ivony_consultation')
            .select('id')
            .eq('application_id', applicationId)
            .eq('session_id', sessionId)
            .limit(1);

        if (error) {
            console.warn('Erreur vérif unicité', error);
            return true;
        }

        return !data || data.length === 0;
    } catch (err) {
        console.warn('Erreur vérif unicité', err);
        return true;
    }
}

// ========================================
// INSERTION AVEC RETRY
// ========================================

const MAX_RETRY = 3;

async function insertWithRetry(supabase, payload) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= MAX_RETRY; attempt += 1) {
        const { error } = await supabase
            .from('ivony_consultation')
            .insert([payload]);  // ⚠️ Array!

        if (!error) {
            return { success: true };
        }

        lastError = error;
        const backoff = attempt * 300;
        await new Promise((resolve) => setTimeout(resolve, backoff));
    }

    return { success: false, error: lastError };
}

// ========================================
// FONCTION PRINCIPALE
// ========================================

async function trackConsultation(supabase, applicationId, options = {}) {
    console.log('[Tracking] Début...');
    
    if (!supabase || typeof supabase.from !== 'function') {
        console.error('[Tracking] Supabase client manquant');
        return { success: false, error: 'Supabase client manquant' };
    }

    if (!applicationId) {
        console.error('[Tracking] applicationId manquant');
        return { success: false, error: 'applicationId manquant' };
    }

    try {
        const { data: sessionData } = await supabase.auth.getSession();
        const activeSession = sessionData?.session || null;
        const isAuthenticated = Boolean(activeSession?.user?.id);

        const sessionId = isAuthenticated
            ? activeSession?.access_token || activeSession?.user?.id || getOrCreateSessionId()
            : getOrCreateSessionId();

        const { deviceType, browser, os } = detectDevice();
        const geo = await fetchIpData(options.geo);
        const isUnique = await isUniqueVisit(supabase, applicationId, sessionId);

        const payload = {
            application_id: applicationId,
            user_id: activeSession?.user?.id || null,
            is_authenticated: isAuthenticated,
            is_unique: isUnique,
            session_id: sessionId,
            ip_address: geo.ip_address,
            country: geo.country,
            region: geo.region,
            city: geo.city,
            browser,
            os,
            device_type: deviceType,
            visited_at: new Date().toISOString(),
            is_deleted: false
        };

        console.log('[Tracking] Payload:', payload);

        const result = await insertWithRetry(supabase, payload);
        
        if (!result.success) {
            console.error('[Tracking] Échec:', result.error);
            return { success: false, error: result.error };
        }

        console.log('[Tracking] ✅ Succès !');
        return { success: true };
        
    } catch (err) {
        console.error('[Tracking] Erreur:', err);
        return { success: false, error: err };
    }
}
```

### 6.2 Initialisation dans HTML

```html
<!-- Charger Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Configuration -->
<script>
window.IVONY_CONFIG = {
    SUPABASE_URL: 'https://jzabkrztgkayunjbzlzj.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6YWJrcnp0Z2theXVuamJ6bHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTEzNjQsImV4cCI6MjA4MzI4NzM2NH0.C2z2JLVtLh8oPv9zBAOjjp3Geqrpf4O-k9ATYYzw1cE',
    PORTFOLIO_APP_ID: '00da2367-d90d-4735-8f42-cf99adebf881'
};

// Initialiser Supabase
window.supabaseClient = supabase.createClient(
    IVONY_CONFIG.SUPABASE_URL,
    IVONY_CONFIG.SUPABASE_ANON_KEY
);
</script>

<!-- Charger le tracking -->
<script src="tracking.js"></script>

<!-- Utiliser le tracking -->
<script>
document.addEventListener('DOMContentLoaded', async () => {
    const result = await trackConsultation(
        window.supabaseClient,
        IVONY_CONFIG.PORTFOLIO_APP_ID,
        { source: 'page_load' }
    );
    
    if (!result.success) {
        console.error('Tracking échoué:', result.error);
    }
});
</script>
```

---

## 7. CHECKLIST D'INTÉGRATION

### ✅ Avant l'intégration

- [ ] Vérifier que le client Supabase est initialisé avec les bonnes clés
- [ ] Confirmer que `application_id` est un UUID valide
- [ ] Tester que `localStorage` est accessible
- [ ] Vérifier que la table `ivony_consultation` existe

### ✅ Configuration Supabase

- [ ] URL Supabase correcte
- [ ] Clé anon correcte
- [ ] Pas d'options personnalisées (utiliser config par défaut)
- [ ] Client disponible globalement (`window.supabaseClient`)

### ✅ Structure du payload

- [ ] `application_id` est un UUID
- [ ] `session_id` est généré par `uuid()`
- [ ] `user_id` peut être `null`
- [ ] `is_deleted` est `false`
- [ ] `visited_at` utilise `.toISOString()`
- [ ] `is_authenticated` est un boolean
- [ ] `is_unique` est un boolean

### ✅ Fonction d'insertion

- [ ] Utiliser `.insert([payload])` (avec array)
- [ ] PAS de `.select()` après l'insert
- [ ] PAS de `.single()` ou `.maybeSingle()`
- [ ] Retry avec backoff implémenté
- [ ] Logs détaillés en console

### ✅ Gestion des erreurs

- [ ] Try/catch autour de l'insertion
- [ ] Retour de `{ success, error }`
- [ ] Logs clairs en cas d'erreur
- [ ] Pas de throw non géré

### ✅ Tests

- [ ] Test avec utilisateur authentifié
- [ ] Test avec utilisateur non authentifié
- [ ] Test de la persistance du session_id
- [ ] Vérifier les logs dans la console
- [ ] Vérifier l'insertion dans la base

---

## 8. DÉPANNAGE

### Erreur : "row violates row-level security policy"

**Causes possibles :**
1. ❌ `user_id` n'est pas `null` quand il devrait l'être
2. ❌ `is_deleted` manque dans le payload
3. ❌ Format de payload incorrect (objet au lieu de array)
4. ❌ Politique RLS trop restrictive

**Solutions :**
```javascript
// ✅ Vérifier le payload
console.log('Payload avant insertion:', JSON.stringify(payload, null, 2));

// ✅ Vérifier le format d'insertion
await supabase.from('ivony_consultation').insert([payload])  // Array!

// ✅ Vérifier user_id
const user_id = session?.user?.id || null;  // Peut être null
console.log('User ID:', user_id);
```

### Erreur : "Invalid UUID"

**Cause :** Format de UUID incorrect

**Solution :**
```javascript
// ✅ Utiliser crypto.randomUUID()
const sessionId = crypto.randomUUID();
console.log('Session ID:', sessionId);

// ✅ Vérifier le format
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
console.log('UUID valide:', uuidRegex.test(sessionId));
```

### Erreur : "localStorage is not defined"

**Cause :** localStorage non disponible (SSR, incognito, etc.)

**Solution :**
```javascript
function getStoredSessionId() {
    try {
        return window.localStorage.getItem(STORAGE_KEY) || null;
    } catch (err) {
        console.warn('localStorage inaccessible', err);
        return null;  // Fallback: générer nouveau UUID à chaque fois
    }
}
```

---

## 9. DIFFÉRENCES AVEC AUTRES IMPLÉMENTATIONS

### ❌ Erreurs courantes dans d'autres apps

| Erreur | Impact | Solution |
|--------|--------|----------|
| `.insert(payload)` sans array | RLS policy error | Utiliser `.insert([payload])` |
| `user_id` obligatoire | RLS policy error | Permettre `user_id = null` |
| `is_deleted` manquant | Insertion échoue | Toujours envoyer `is_deleted: false` |
| `.select()` après insert | Erreur de permissions | Ne pas utiliser `.select()` |
| Date en timestamp | Format incorrect | Utiliser `.toISOString()` |

---

## 10. VERSIONS ET COMPATIBILITÉ

### Version Supabase JS

```javascript
// claude-folio utilise @supabase/supabase-js v2.89.0
// Vérifier la version :
console.log('Supabase version:', supabase.version);
```

### Navigateurs supportés

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  

### APIs requises

- `crypto.randomUUID()` (avec fallback)
- `localStorage` (avec fallback)
- `fetch` API
- `Promise` / `async/await`

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :

1. **Vérifier les logs console** : Tous les logs sont préfixés `[Tracking]`
2. **Comparer le payload** : Utiliser `JSON.stringify(payload, null, 2)`
3. **Tester la requête** : Copier/coller le code de `insertWithRetry`
4. **Vérifier RLS** : Tester dans SQL Editor de Supabase

---

## 📝 CHANGELOG

| Date | Version | Changement |
|------|---------|------------|
| 2026-01-31 | 1.0 | Version initiale basée sur claude-folio |

---

**✅ FIN DU GUIDE D'INTÉGRATION**

Ce document contient TOUT ce qui est nécessaire pour reproduire le succès de l'intégration claude-folio avec ivony_consultation.
