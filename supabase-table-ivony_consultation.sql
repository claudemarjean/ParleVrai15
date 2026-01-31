-- =====================================================
-- Script SQL pour la table ivony_consultation
-- À exécuter dans l'éditeur SQL de Supabase
-- =====================================================

-- Suppression de la table si elle existe (pour recréer)
-- ⚠️ Commentez cette ligne si la table existe déjà et contient des données
DROP TABLE IF EXISTS public.ivony_consultation;

-- Création de la table
CREATE TABLE public.ivony_consultation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID NOT NULL,
    user_id UUID,
    session_id UUID NOT NULL,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    
    -- Informations de localisation
    ip_address TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    timezone TEXT,
    language TEXT,
    
    -- Informations d'appareil
    device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
    os TEXT,
    browser TEXT,
    user_agent TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    
    -- Informations de tracking
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Métadonnées et flags
    metadata JSONB,
    is_unique BOOLEAN DEFAULT true,
    is_authenticated BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false
);

-- Index pour améliorer les performances
CREATE INDEX idx_ivony_consultation_application_id ON public.ivony_consultation(application_id);
CREATE INDEX idx_ivony_consultation_user_id ON public.ivony_consultation(user_id);
CREATE INDEX idx_ivony_consultation_session_id ON public.ivony_consultation(session_id);
CREATE INDEX idx_ivony_consultation_visited_at ON public.ivony_consultation(visited_at DESC);
CREATE INDEX idx_ivony_consultation_device_type ON public.ivony_consultation(device_type);

-- Commentaires
COMMENT ON TABLE public.ivony_consultation IS 'Table de tracking des consultations et visites utilisateurs';
COMMENT ON COLUMN public.ivony_consultation.application_id IS 'ID de l''application (ParleVrai15: c2036adf-59fe-4fdb-a019-7568b24fa8e1)';
COMMENT ON COLUMN public.ivony_consultation.user_id IS 'ID de l''utilisateur connecté (null si non connecté)';
COMMENT ON COLUMN public.ivony_consultation.session_id IS 'ID de session unique généré côté client';

-- =====================================================
-- Politique RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur la table
ALTER TABLE public.ivony_consultation ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut insérer (pour le tracking anonyme)
-- IMPORTANT : Permet les insertions anonymes ET authentifiées
CREATE POLICY "Permettre insertion publique" ON public.ivony_consultation
    FOR INSERT
    TO public, authenticated, anon
    WITH CHECK (true);

-- Politique : Les utilisateurs peuvent voir leurs propres données
CREATE POLICY "Utilisateurs voient leurs données" ON public.ivony_consultation
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Politique : Les utilisateurs anonymes peuvent voir les entrées anonymes
CREATE POLICY "Anonymes voient données publiques" ON public.ivony_consultation
    FOR SELECT
    TO anon
    USING (user_id IS NULL);

-- Politique : Les admins peuvent tout voir (à adapter selon votre système de rôles)
-- Décommentez et adaptez si vous avez une table de profils avec un champ role
-- CREATE POLICY "Admins voient tout" ON public.ivony_consultation
--     FOR SELECT
--     TO authenticated
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.profiles
--             WHERE profiles.id = auth.uid()
--             AND profiles.role = 'admin'
--         )
--     );

-- =====================================================
-- Vérification
-- =====================================================

-- Vérifier que la table est créée
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'ivony_consultation';

-- Vérifier les colonnes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'ivony_consultation'
ORDER BY ordinal_position;
