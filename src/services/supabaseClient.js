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
 * Client Supabase partagé
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
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
