# 🚀 Guide de démarrage rapide - ParleVrai15

## Installation

```bash
npm install
```

## Lancement en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Build pour la production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## Prévisualisation du build

```bash
npm run preview
```

---

## 📖 Guide d'utilisation

### Mode démo (sans backend)

L'application fonctionne actuellement en mode **démo** avec les données stockées dans le **localStorage** du navigateur.

#### Pour tester l'application :

1. **Page d'accueil** : `http://localhost:3000/`
   - Découvrir le concept
   - Navigation vers inscription/connexion

2. **Créer un compte** : 
   - Cliquer sur "S'inscrire"
   - Remplir le formulaire (email/mot de passe fictifs acceptés)
   - Automatiquement redirigé vers le dashboard

3. **Se connecter** :
   - Utiliser n'importe quel email/mot de passe
   - Pour tester le mode admin : utiliser un email contenant "admin" (ex: `admin@test.com`)

4. **Dashboard utilisateur** :
   - Vue d'ensemble de la progression
   - Statistiques (jours consécutifs, leçons complétées)
   - Accès rapide à la leçon du jour

5. **Leçon du jour** :
   - Lecture, grammaire, vocabulaire
   - Exercice oral guidé
   - Prompt bonus pour ChatGPT
   - Bouton "Marquer comme terminée"

6. **Calendrier** :
   - Visualisation mensuelle
   - Jours complétés marqués en vert
   - Navigation entre les mois

7. **Statistiques** :
   - Badges et réalisations
   - Graphiques de progression
   - Série de jours consécutifs

8. **Back-office Admin** :
   - Accessible avec un compte admin
   - CRUD complet des leçons
   - Prévisualisation avant publication

---

## 🔧 Intégration Supabase (Backend réel)

Pour connecter l'application à un vrai backend :

1. Lire le guide complet : [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md)

2. Créer un compte sur [supabase.com](https://supabase.com)

3. Créer les tables SQL (voir le guide)

4. Copier `.env.example` vers `.env` et remplir vos credentials

5. Modifier les services dans `src/services/` pour utiliser Supabase

---

## 📁 Structure du projet

```
ParleVrai15/
├── src/
│   ├── components/        # Composants réutilisables (Header, Footer)
│   ├── pages/            # Pages de l'application
│   │   ├── Home.js       # Landing page
│   │   ├── Auth.js       # Login/Signup
│   │   ├── Dashboard.js  # Tableau de bord
│   │   ├── Lesson.js     # Leçon du jour
│   │   ├── Calendar.js   # Calendrier
│   │   ├── Stats.js      # Statistiques
│   │   └── Admin.js      # Back-office
│   ├── router/           # Système de routing
│   ├── services/         # Services (auth, lessons, progress)
│   ├── styles/           # CSS global
│   ├── utils/            # Utilitaires
│   └── main.js           # Point d'entrée
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎨 Fonctionnalités

### ✅ Implémentées
- Landing page attractive
- Authentification (inscription/connexion)
- Dashboard utilisateur
- Leçon du jour complète (lecture, grammaire, vocabulaire, exercice)
- Système de progression (jours consécutifs, leçons complétées)
- Calendrier interactif
- Statistiques détaillées avec badges
- Back-office admin (CRUD leçons)
- Prévisualisation des leçons
- Prompt IA à copier pour ChatGPT
- Responsive mobile-first
- Animations fluides

### 🚀 Prêt pour
- Intégration Supabase (auth + database)
- Déploiement production
- Ajout de nouvelles fonctionnalités

---

## 🎯 Comptes de test

### Utilisateur normal
- Email : `user@test.com`
- Mot de passe : `password`

### Administrateur
- Email : `admin@test.com`
- Mot de passe : `admin`

(En mode démo, n'importe quel email/mot de passe fonctionne)

---

## 💡 Conseils de développement

### Ajouter une nouvelle page

1. Créer le fichier dans `src/pages/`
2. Exporter la fonction `renderPageName()`
3. Exporter les styles spécifiques
4. Ajouter la route dans `src/main.js`

### Modifier les styles

- Styles globaux : `src/styles/main.css`
- Variables CSS : définies dans `:root` du fichier main.css
- Styles spécifiques : dans chaque fichier de page

### Ajouter un service

1. Créer le fichier dans `src/services/`
2. Exporter une instance singleton
3. Importer dans les pages qui en ont besoin

---

## 🐛 Débogage

### Réinitialiser les données

Pour effacer toutes les données en mode démo :

```javascript
// Dans la console du navigateur
localStorage.clear();
location.reload();
```

### Voir les données stockées

```javascript
// Dans la console du navigateur
console.log('User:', localStorage.getItem('user'));
console.log('Lessons:', localStorage.getItem('lessons'));
console.log('Progress:', localStorage.getItem('progress'));
```

---

## 📱 Compatibilité

- ✅ Chrome, Firefox, Safari, Edge (versions récentes)
- ✅ Mobile (iOS Safari, Chrome Android)
- ✅ Tablette

---

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est un projet éducatif.

---

## 👨‍💻 Support

Pour toute question ou problème, consulter :
- Le fichier README.md
- Le guide Supabase : SUPABASE_INTEGRATION.md
- Le code commenté dans `src/`

---

**Bon apprentissage du français ! 🇫🇷**
