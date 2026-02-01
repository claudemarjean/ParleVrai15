/**
 * Client Supabase
 * Configuration centralisée pour l'accès à Supabase
 */

import { createClient } from '@supabase/supabase-js';

// ⚠️ IMPORTANT: Configurez ces variables dans votre fichier .env
// Ou directement ici pour les tests (ne jamais committer les vraies clés !)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://VOTRE-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'VOTRE-ANON-KEY';

/**
 * Obtenir l'URL de redirection basée sur l'environnement
 */
function getRedirectUrl() {
  // En production, utiliser l'URL actuelle du site
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  return 'http://localhost:5173/auth/callback';
}

/**
 * Client Supabase partagé
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // URL de redirection dynamique (s'adapte automatiquement à l'environnement)
    redirectTo: getRedirectUrl()
  }
});

/**
 * Vérifier si le client est configuré correctement
 */
export function isSupabaseConfigured() {
  return SUPABASE_URL !== 'https://VOTRE-PROJECT.supabase.co' 
    && SUPABASE_ANON_KEY !== 'VOTRE-ANON-KEY';
}

export default supabase;
