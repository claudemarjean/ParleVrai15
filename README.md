# 🗣️ ParleVrai15

**Parler français, pour de vrai.**

Application web pour apprendre à parler français naturellement avec seulement 15 minutes par jour.

---

## 🌟 Caractéristiques

- ✅ **Authentification sécurisée** avec Supabase Auth
- ✅ **Gestion centralisée** des accès via la plateforme Ivony
- ✅ **Leçons quotidiennes** de 15 minutes
- ✅ **Suivi de progression** avec calendrier et statistiques
- ✅ **Système de badges** et motivation
- ✅ **Interface responsive** (mobile, tablette, desktop)
- ✅ **Mode sombre/clair**
- ✅ **Session persistante** multi-devices

## 🚀 Démarrage rapide

### Prérequis

- Node.js 16+ et npm
- Compte Supabase (gratuit)

### Installation

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd ParleVrai15

# 2. Installer les dépendances
npm install

# 3. Configurer Supabase
cp .env.example .env
# Éditer .env avec vos credentials Supabase

# 4. Lancer l'application
npm run dev
```

### Configuration Supabase (5 minutes)

Suivez le guide détaillé dans [QUICK_START.md](./QUICK_START.md) :

1. Créer un projet Supabase
2. Créer la table `ivony_users_apps`
3. Appliquer les politiques RLS
4. Configurer le fichier `.env`

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](./QUICK_START.md) | Guide de démarrage rapide (10 min) |
| [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md) | Documentation complète de l'authentification |
| [API_REFERENCE.md](./API_REFERENCE.md) | Référence API du service auth |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | Guide de migration |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | Récapitulatif de l'implémentation |

## 🛠️ Stack technique

- **Frontend** : Vanilla JavaScript + Vite
- **Authentification** : Supabase Auth
- **Base de données** : PostgreSQL (Supabase)
- **Hébergement** : Vercel (ou autre)
- **Plateforme** : Ivony (multi-applications)

## 📦 Structure du projet

```
ParleVrai15/
├── src/
│   ├── main.js                 # Point d'entrée
│   ├── components/
│   │   ├── Header.js           # En-tête
│   │   └── Footer.js           # Pied de page
│   ├── pages/
│   │   ├── Home.js             # Page d'accueil
│   │   ├── Auth.js             # Login/Signup
│   │   ├── Dashboard.js        # Tableau de bord
│   │   ├── Lesson.js           # Page de leçon
│   │   ├── Calendar.js         # Calendrier
│   │   ├── Stats.js            # Statistiques
│   │   └── Admin.js            # Administration
│   ├── router/
│   │   └── index.js            # Router SPA
│   ├── services/
│   │   ├── supabaseClient.js   # Client Supabase
│   │   ├── auth.js             # Service d'authentification
│   │   ├── lessons.js          # Gestion des leçons
│   │   ├── progress.js         # Suivi progression
│   │   ├── analytics.js        # Analytics
│   │   └── theme.js            # Gestion du thème
│   ├── styles/
│   │   └── main.css            # Styles globaux
│   └── utils/
│       ├── constants.js        # Constantes
│       └── helpers.js          # Fonctions utilitaires
├── supabase-rls-policies.sql   # Politiques de sécurité
├── test-auth.js                # Tests d'authentification
├── .env.example                # Exemple de configuration
├── package.json
├── vite.config.js
└── index.html
```

## 🔐 Authentification

ParleVrai15 utilise **Supabase Auth** avec gestion centralisée des accès via la table `ivony_users_apps`.

### Fonctionnalités

- ✅ Inscription avec email/mot de passe
- ✅ Connexion sécurisée
- ✅ Session persistante
- ✅ Gestion des rôles (user/admin)
- ✅ Vérification du status (active/inactive/suspended)
- ✅ Mise à jour automatique de la date de dernier accès

### Exemple d'utilisation

```javascript
import authService from './services/auth.js';

// Inscription
const result = await authService.signup(
  'user@example.com',
  'password123',
  'Prénom Nom'
);

// Connexion
const result = await authService.login(
  'user@example.com',
  'password123'
);

// Vérifier si connecté
if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
  console.log('Bonjour', user.name);
}

// Déconnexion
await authService.logout();
```

Voir [API_REFERENCE.md](./API_REFERENCE.md) pour la documentation complète.

## 🧪 Tests

### Tests d'authentification

```bash
# Dans la console du navigateur
const script = document.createElement('script');
script.src = '/test-auth.js';
script.type = 'module';
document.head.appendChild(script);

// Exécuter tous les tests
AuthTests.runAllTests();
```

### Tests manuels

1. Créer un compte → vérifier redirection
2. Se déconnecter
3. Se reconnecter → vérifier session
4. Rafraîchir la page → session doit persister
5. Vérifier dans Supabase Dashboard :
   - Table `auth.users`
   - Table `ivony_users_apps`

## 🎨 Personnalisation

### Thème

L'application supporte le mode sombre/clair automatique.

Les couleurs sont définies dans [src/styles/main.css](src/styles/main.css) :

```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-error: #ef4444;
  /* etc. */
}
```

### Configuration

Les constantes de l'application sont dans [src/utils/constants.js](src/utils/constants.js) :

```javascript
export const APP_CONFIG = {
  NAME: 'ParleVrai15',
  TAGLINE: 'Parler français, pour de vrai.',
  VERSION: '1.0.0'
};

export const IVONY_CONFIG = {
  APPLICATION_ID: 'c2036adf-59fe-4fdb-a019-7568b24fa8e1',
  // ...
};
```

## 🚢 Déploiement

### Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configuration des variables d'environnement
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy --prod

# Configuration dans netlify.toml ou via UI
```

### Configuration Supabase pour la production

1. Aller dans Supabase Dashboard > Settings > API
2. Mettre à jour **Site URL** avec votre domaine de production
3. Ajouter les **Redirect URLs** autorisées
4. Configurer les templates d'emails (optionnel)

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Supabase](https://supabase.com) - Backend as a Service
- [Vite](https://vitejs.dev) - Build tool rapide
- [Vercel](https://vercel.com) - Hébergement

## 📞 Support

Pour toute question ou problème :

1. Consulter la [documentation](./QUICK_START.md)
2. Vérifier les [issues GitHub](../../issues)
3. Contacter l'équipe de support

---

**Fait avec ❤️ pour la plateforme Ivony**
