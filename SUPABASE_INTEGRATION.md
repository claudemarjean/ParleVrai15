# Guide d'intégration Supabase

## Configuration

1. Créer un projet sur [supabase.com](https://supabase.com)

2. Créer un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Installer le client Supabase (déjà dans package.json) :

```bash
npm install
```

## Créer les tables dans Supabase

### Table `profiles`

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Table `lessons`

```sql
CREATE TABLE lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  level TEXT NOT NULL,
  theme TEXT NOT NULL,
  date DATE NOT NULL,
  reading TEXT NOT NULL,
  grammar JSONB NOT NULL,
  vocabulary JSONB NOT NULL,
  exercise JSONB NOT NULL,
  ai_prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view lessons
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only admins can insert lessons
CREATE POLICY "Admins can insert lessons"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy: Only admins can update lessons
CREATE POLICY "Admins can update lessons"
  ON lessons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy: Only admins can delete lessons
CREATE POLICY "Admins can delete lessons"
  ON lessons FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

### Table `user_progress`

```sql
CREATE TABLE user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX user_progress_user_id_idx ON user_progress(user_id);
CREATE INDEX user_progress_completed_at_idx ON user_progress(completed_at);
```

## Modifier les services

### src/services/supabase.js (nouveau fichier)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Mettre à jour src/services/auth.js

Remplacer les méthodes localStorage par des appels Supabase Auth.

### Mettre à jour src/services/lessons.js

Remplacer les méthodes localStorage par des requêtes Supabase.

### Mettre à jour src/services/progress.js

Remplacer les méthodes localStorage par des requêtes Supabase.

## Authentification avec Supabase

### Signup

```javascript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name
    }
  }
});
```

### Login

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

### Logout

```javascript
const { error } = await supabase.auth.signOut();
```

### Get current user

```javascript
const { data: { user } } = await supabase.auth.getUser();
```

## Fonctions utiles

### Récupérer toutes les leçons

```javascript
const { data, error } = await supabase
  .from('lessons')
  .select('*')
  .order('date', { ascending: false });
```

### Récupérer la leçon du jour

```javascript
const today = new Date().toISOString().split('T')[0];
const { data, error } = await supabase
  .from('lessons')
  .select('*')
  .eq('date', today)
  .single();
```

### Marquer une leçon comme complétée

```javascript
const { data, error } = await supabase
  .from('user_progress')
  .insert({
    user_id: user.id,
    lesson_id: lessonId
  });
```

### Récupérer la progression de l'utilisateur

```javascript
const { data, error } = await supabase
  .from('user_progress')
  .select('*')
  .eq('user_id', user.id)
  .order('completed_at', { ascending: false });
```

## Réaltime (optionnel)

Pour des mises à jour en temps réel :

```javascript
const channel = supabase
  .channel('lessons')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'lessons' },
    (payload) => {
      console.log('Change received!', payload);
      // Rafraîchir les données
    }
  )
  .subscribe();
```
