/**
 * Service Analytics - Tracking des visites
 * Trace la première visite d'un utilisateur sur la page d'accueil
 * 
 * ⚠️ Code adapté depuis claude-folio (application de référence qui fonctionne)
 */

import supabase, { isSupabaseConfigured } from './supabaseClient.js';

// ID de l'application ParleVrai15
const APPLICATION_ID = 'c2036adf-59fe-4fdb-a019-7568b24fa8e1';

// Clé pour localStorage (session_id persistant)
const SESSION_STORAGE_KEY = 'ivony_session_id';

// Configuration retry
const MAX_RETRY = 3;

/**
 * Génère un UUID v4 côté client
 * @returns {string} UUID généré
 */
function generateUUID() {
  // Utiliser crypto.randomUUID si disponible (moderne)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback pour navigateurs anciens
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Récupère le session_id stocké
 * @returns {string|null} Session ID ou null
 */
function getStoredSessionId() {
  try {
    return window.localStorage.getItem(SESSION_STORAGE_KEY) || null;
  } catch (err) {
    console.warn('[Analytics] localStorage inaccessible', err);
    return null;
  }
}

/**
 * Persiste le session_id
 * @param {string} id - Session ID à stocker
 */
function persistSessionId(id) {
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, id);
  } catch (err) {
    console.warn('[Analytics] Impossible de stocker le session_id', err);
  }
}

/**
 * Obtient ou crée un session_id
 * @returns {string} Session ID
 */
function getOrCreateSessionId() {
  const existing = getStoredSessionId();
  if (existing) return existing;
  
  const newId = generateUUID();
  persistSessionId(newId);
  return newId;
}

/**
 * Détecte le type d'appareil depuis le userAgent
 * @returns {string} "mobile" | "tablet" | "desktop"
 */
function detectDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|windows phone/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Détecte le système d'exploitation
 * @returns {string} OS détecté
 */
function detectOS() {
  const ua = navigator.userAgent.toLowerCase();
  
  if (/windows nt/i.test(ua)) return 'windows';
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/mac os x/i.test(ua)) return 'macos';
  if (/linux/i.test(ua)) return 'linux';
  
  return 'unknown';
}

/**
 * Détecte le navigateur
 * @returns {string} Navigateur détecté
 */
function detectBrowser() {
  const ua = navigator.userAgent;
  
  if (/edg\//i.test(ua)) return 'edge';
  if (/chrome|crios/i.test(ua)) return 'chrome';
  if (/safari/i.test(ua)) return 'safari';
  if (/firefox|fxios/i.test(ua)) return 'firefox';
  if (/opr\//i.test(ua)) return 'opera';
  
  return 'unknown';
}

/**
 * Extrait les paramètres UTM de l'URL
 * @returns {Object} Objet contenant utm_source, utm_medium, utm_campaign
 */
function extractUTMParameters() {
  const params = new URLSearchParams(window.location.search);
  
  return {
    utm_source: params.get('utm_source') || null,
    utm_medium: params.get('utm_medium') || null,
    utm_campaign: params.get('utm_campaign') || null
  };
}

/**
 * Normalise les données de géolocalisation
 * @param {Object} raw - Données brutes
 * @returns {Object} Données normalisées
 */
function normalizeGeo(raw = {}) {
  return {
    ip_address: raw.ip_address || raw.ip || null,
    country: raw.country || raw.country_name || null,
    region: raw.region || raw.region_name || null,
    city: raw.city || null
  };
}

/**
 * Récupère les données de géolocalisation via ipapi.co
 * @returns {Promise<Object>} Données de géolocalisation
 */
async function fetchIpData() {
  const EMPTY_GEO = { ip_address: null, country: null, region: null, city: null };
  
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      console.warn('[Analytics] Géolocalisation échouée (HTTP)', response.status);
      return EMPTY_GEO;
    }
    
    const data = await response.json();
    const geo = normalizeGeo({
      ip_address: data?.ip,
      country: data?.country_name,
      region: data?.region,
      city: data?.city
    });
    
    return geo;
  } catch (err) {
    console.warn('[Analytics] Géolocalisation échouée', err);
    return EMPTY_GEO;
  }
}

/**
 * Vérifie si c'est une visite unique
 * @param {string} sessionId - ID de session
 * @returns {Promise<boolean>} true si unique
 */
async function isUniqueVisit(sessionId) {
  try {
    const { data, error } = await supabase
      .from('ivony_consultation')
      .select('id')
      .eq('application_id', APPLICATION_ID)
      .eq('session_id', sessionId)
      .limit(1);

    if (error) {
      console.warn('[Analytics] Erreur vérif unicité', error);
      return true; // Par défaut, considérer comme unique
    }

    return !data || data.length === 0;
  } catch (err) {
    console.warn('[Analytics] Erreur vérif unicité', err);
    return true;
  }
}

/**
 * Insère les données dans Supabase avec retry
 * @param {Object} payload - Données à insérer
 * @returns {Promise<Object>} Résultat de l'insertion
 */
async function insertWithRetry(payload) {
  let lastError = null;
  
  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    try {
      // ⚠️ IMPORTANT : .insert([payload]) - Array avec un élément !
      // ⚠️ IMPORTANT : Pas de .select() après
      const { error } = await supabase
        .from('ivony_consultation')
        .insert([payload]);

      if (!error) {
        console.log(`[Analytics] ✅ Insertion réussie (tentative ${attempt})`);
        return { success: true };
      }

      lastError = error;
      console.warn(`[Analytics] ⚠️ Tentative ${attempt}/${MAX_RETRY} échouée:`, error.message);
      
      // Backoff progressif : 300ms, 600ms, 900ms
      if (attempt < MAX_RETRY) {
        const backoff = attempt * 300;
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    } catch (err) {
      lastError = err;
      console.warn(`[Analytics] ⚠️ Exception tentative ${attempt}/${MAX_RETRY}:`, err);
      
      if (attempt < MAX_RETRY) {
        const backoff = attempt * 300;
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  return { success: false, error: lastError };
}

/**
 * Fonction principale : Track la première visite
 * À appeler au chargement de la page d'accueil
 * 
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function trackFirstVisit() {
  console.log('[Analytics] 📊 Début du tracking...');
  
  // Vérifier si Supabase est configuré
  if (!isSupabaseConfigured()) {
    console.warn('[Analytics] ⚠️ Supabase non configuré. Tracking désactivé.');
    console.warn('Configurez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env');
    return { success: false, error: 'Supabase non configuré' };
  }
  
  try {
    // 1. Récupérer la session Supabase (utilisateur authentifié ou non)
    const { data: sessionData } = await supabase.auth.getSession();
    const activeSession = sessionData?.session || null;
    const isAuthenticated = Boolean(activeSession?.user?.id);
    
    console.log('[Analytics] Authentifié:', isAuthenticated);
    console.log('[Analytics] User ID:', activeSession?.user?.id || 'NULL');

    // 2. Générer ou récupérer le session_id
    const sessionId = isAuthenticated
      ? activeSession?.access_token || activeSession?.user?.id || getOrCreateSessionId()
      : getOrCreateSessionId();
    
    console.log('[Analytics] Session ID:', sessionId);

    // 3. Détection de l'appareil
    const deviceType = detectDeviceType();
    const browser = detectBrowser();
    const os = detectOS();
    
    // 4. Géolocalisation (asynchrone)
    const geo = await fetchIpData();
    
    // 5. Vérifier si c'est une visite unique
    const isUnique = await isUniqueVisit(sessionId);
    
    // 6. Extraire les paramètres UTM
    const utmParams = extractUTMParameters();

    // 7. Construire le payload EXACT selon la doc claude-folio
    const payload = {
      application_id: APPLICATION_ID,
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
      visited_at: new Date().toISOString(), // ⚠️ CRITIQUE : Format ISO 8601
      is_deleted: false // ⚠️ CRITIQUE : Obligatoire !
    };
    
    // Ajouter les paramètres UTM s'ils existent
    if (utmParams.utm_source) payload.utm_source = utmParams.utm_source;
    if (utmParams.utm_medium) payload.utm_medium = utmParams.utm_medium;
    if (utmParams.utm_campaign) payload.utm_campaign = utmParams.utm_campaign;
    
    console.log('[Analytics] Payload:', payload);
    
    // 8. Insérer dans Supabase avec retry
    const result = await insertWithRetry(payload);
    
    if (!result.success) {
      console.error('[Analytics] ❌ Échec après', MAX_RETRY, 'tentatives:', result.error);
      return { success: false, error: result.error };
    }
    
    console.log('[Analytics] ✅ Première visite trackée avec succès !');
    return { success: true };
    
  } catch (error) {
    console.error('[Analytics] ❌ Erreur inattendue:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Réinitialise le tracking (pour tests)
 * ⚠️ Ne pas utiliser en production
 */
export function resetTracking() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  console.log('[Analytics] 🔄 Tracking réinitialisé');
}

export default {
  trackFirstVisit,
  resetTracking
};
