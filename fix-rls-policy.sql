-- =====================================================
-- 🔧 FIX RAPIDE - Politique RLS pour ivony_consultation
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- =====================================================

-- 1. Supprimer les anciennes politiques (si elles existent)
DROP POLICY IF EXISTS "Permettre insertion publique" ON public.ivony_consultation;
DROP POLICY IF EXISTS "Utilisateurs voient leurs données" ON public.ivony_consultation;
DROP POLICY IF EXISTS "Anonymes voient données publiques" ON public.ivony_consultation;
DROP POLICY IF EXISTS "Enable insert for ParleVrai15" ON public.ivony_consultation;

-- 2. Créer la nouvelle politique d'insertion pour ParleVrai15 (CORRIGÉE)
CREATE POLICY "Enable insert for ParleVrai15" ON public.ivony_consultation
    FOR INSERT
    TO public, authenticated, anon
    WITH CHECK (
        application_id = 'c2036adf-59fe-4fdb-a019-7568b24fa8e1'::uuid
    );

-- 3. Créer les politiques de lecture
CREATE POLICY "Utilisateurs voient leurs données" ON public.ivony_consultation
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Anonymes voient données publiques" ON public.ivony_consultation
    FOR SELECT
    TO anon
    USING (user_id IS NULL);

-- 4. Vérifier que RLS est activé
ALTER TABLE public.ivony_consultation ENABLE ROW LEVEL SECURITY;

-- ✅ Vérification : Lister toutes les politiques
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'ivony_consultation';
