📋 PROMPT D'ANALYSE - Application qui fonctionne avec ivony_consultation
================================================================================

CONTEXTE :
- Nous avons une application ParleVrai15 qui essaie d'insérer dans ivony_consultation
- Erreur : "new row violates row-level security policy for table ivony_consultation"
- Une autre application fonctionne DÉJÀ avec cette table
- Nous devons reproduire EXACTEMENT la même structure

================================================================================
INFORMATIONS À COLLECTER DE L'APPLICATION QUI FONCTIONNE :
================================================================================

1. CLIENT SUPABASE
   ─────────────────
   □ Comment le client Supabase est initialisé ?
   □ Quelles options sont passées à createClient() ?
   □ Y a-t-il des headers personnalisés ?
   
   Cherchez :
   - createClient()
   - supabase.from()
   - Configuration auth: { ... }

2. STRUCTURE DES DONNÉES
   ──────────────────────
   □ Quels champs sont envoyés dans l'INSERT ?
   □ Dans quel ordre ?
   □ Y a-t-il des champs obligatoires absents dans notre code ?
   
   Cherchez :
   - .insert()
   - Les objets de données avant insertion
   - Les champs : application_id, user_id, session_id, etc.

3. GESTION DU USER_ID
   ────────────────────
   □ Comment récupère-t-on le user_id ?
   □ Utilise-t-il auth.uid() de Supabase ou un ID local ?
   □ Que fait-il quand user_id est null ?
   
   Cherchez :
   - auth.uid()
   - supabase.auth.getUser()
   - user_id dans les données

4. SESSION_ID
   ───────────
   □ Comment est généré le session_id ?
   □ Même fonction UUID que nous ?
   □ Est-il stocké quelque part (sessionStorage, localStorage) ?

5. REQUÊTE EXACTE
   ───────────────
   □ Code complet de la fonction qui insère dans ivony_consultation
   □ Y a-t-il des .select() après .insert() ?
   □ Y a-t-il des options spéciales (.single(), .maybeSingle()) ?
   
   Cherchez :
   - supabase.from('ivony_consultation').insert()
   - La chaîne complète de la requête

6. GESTION DES ERREURS
   ────────────────────
   □ Comment gère-t-il les erreurs ?
   □ Y a-t-il des retry ou fallback ?

================================================================================
CODE À COPIER/COLLER :
================================================================================

FICHIER 1 : Configuration client Supabase
─────────────────────────────────────────
[Coller ici le code d'initialisation du client Supabase]


FICHIER 2 : Fonction d'insertion dans ivony_consultation
────────────────────────────────────────────────────────
[Coller ici la fonction complète qui insère les données]


FICHIER 3 : Exemple de données envoyées
───────────────────────────────────────
[Coller ici un exemple d'objet inséré, avec tous les champs]


================================================================================
QUESTIONS SPÉCIFIQUES :
================================================================================

1. L'application qui fonctionne utilise-t-elle la MÊME clé anon Supabase ?
   → Vérifier le .env ou la configuration

2. Y a-t-il une différence dans la version de @supabase/supabase-js ?
   → Vérifier package.json

3. Y a-t-il un middleware ou intercepteur avant l'insertion ?
   → Chercher : beforeInsert, middleware, interceptor

4. Les données sont-elles validées/transformées avant insertion ?
   → Chercher : validate, transform, map

5. Y a-t-il une authentification Supabase active ?
   → Chercher : supabase.auth.signIn, getSession, getUser

================================================================================
FICHIERS À EXAMINER EN PRIORITÉ :
================================================================================

□ services/supabase.js (ou similaire)
□ services/analytics.js (ou tracking.js)
□ Le fichier qui fait l'insertion dans ivony_consultation
□ .env ou config avec les clés Supabase
□ package.json (version de @supabase/supabase-js)

================================================================================
