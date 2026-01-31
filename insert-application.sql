-- =====================================================
-- 🔧 Insérer l'application ParleVrai15 dans ivony_application
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- =====================================================

-- 1. Vérifier si l'application existe déjà
SELECT * FROM ivony_application 
WHERE id = 'c2036adf-59fe-4fdb-a019-7568b24fa8e1';

-- 2. Insérer l'application si elle n'existe pas
-- (Ajustez les champs selon votre structure de table)
INSERT INTO ivony_application (id, name, description, created_at)
VALUES (
    'c2036adf-59fe-4fdb-a019-7568b24fa8e1',
    'ParleVrai15',
    'Application d''apprentissage du français en 15 minutes par jour',
    now()
)
ON CONFLICT (id) DO NOTHING;

-- 3. Vérifier que l'insertion a réussi
SELECT * FROM ivony_application 
WHERE id = 'c2036adf-59fe-4fdb-a019-7568b24fa8e1';

-- ✅ Maintenant vous pouvez insérer dans ivony_consultation
