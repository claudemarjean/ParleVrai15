# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [1.0.0] - 2026-01-30

### 🎉 Version initiale

#### Ajouté
- **Landing Page**
  - Hero section avec nom et slogan
  - Section "Comment ça marche" (3 étapes)
  - Section "Pourquoi ParleVrai15"
  - Call-to-action pour inscription/connexion

- **Authentification**
  - Page d'inscription avec validation
  - Page de connexion
  - Système de session (localStorage en mode démo)
  - Support pour mode admin

- **Dashboard utilisateur**
  - Vue d'ensemble personnalisée
  - Statistiques (jours consécutifs, leçons complétées, minutes)
  - Carte de la leçon du jour
  - Accès rapide calendrier et stats
  - Messages de motivation

- **Leçon du jour**
  - Lecture du jour (texte authentique)
  - Règle de grammaire unique et claire
  - Vocabulaire (3-5 mots avec traductions)
  - Exercice oral guidé avec template
  - Section BONUS : Prompt IA pour ChatGPT
  - Bouton "Marquer comme terminée"
  - Copie du prompt en un clic

- **Calendrier**
  - Vue mensuelle interactive
  - Visualisation des jours complétés
  - Navigation entre les mois
  - Légende explicative
  - Indicateur du jour actuel

- **Statistiques**
  - Série actuelle de jours
  - Record personnel
  - Nombre de leçons complétées
  - Temps total pratiqué (minutes et heures)
  - Barres de progression
  - 6 badges débloquables :
    - Premier pas (1 leçon)
    - 7 jours d'affilée
    - Déterminé(e) (10 leçons)
    - Un mois complet (30 jours)
    - Expert (50 leçons)
    - Maître du français (100 leçons)
  - Messages motivationnels contextuels

- **Back-Office Admin**
  - Liste de toutes les leçons
  - CRUD complet (Create, Read, Update, Delete)
  - Formulaire détaillé pour créer/éditer :
    - Niveau (Débutant/Intermédiaire/Avancé)
    - Thème
    - Date de publication
    - Lecture, grammaire, vocabulaire, exercice
    - Prompt IA
  - Prévisualisation complète avant publication
  - Interface avec modals élégantes

- **Architecture technique**
  - Vite comme outil de build
  - Vanilla JavaScript (pas de framework lourd)
  - Routing SPA personnalisé
  - Services modulaires (Auth, Lessons, Progress)
  - Composants réutilisables (Header, Footer)
  - CSS moderne avec variables
  - Mobile-first responsive design
  - Animations fluides

- **Données de démonstration**
  - 2 leçons complètes pré-créées
  - Système de stockage localStorage

- **Documentation**
  - README.md complet
  - QUICKSTART.md (guide de démarrage)
  - PROJECT_SUMMARY.md (récapitulatif du projet)
  - SUPABASE_INTEGRATION.md (guide d'intégration backend)
  - LESSON_EXAMPLES.md (exemples de leçons)
  - CUSTOMIZATION.md (guide de personnalisation)
  - Code entièrement commenté

#### Préparé pour
- Intégration Supabase (Auth + Database)
- Déploiement en production
- Extension des fonctionnalités

---

## [Unreleased] - Fonctionnalités futures possibles

### À considérer pour les prochaines versions

#### Authentification
- [ ] Authentification OAuth (Google, Facebook)
- [ ] Récupération de mot de passe
- [ ] Vérification par email
- [ ] Authentification à deux facteurs

#### Leçons
- [ ] Enregistrement audio des exercices
- [ ] Playback audio des lectures
- [ ] Répétition espacée (SRS)
- [ ] Quiz interactifs
- [ ] Certificats de complétion

#### Social
- [ ] Partage sur réseaux sociaux
- [ ] Leaderboard global
- [ ] Défis entre amis
- [ ] Groupes d'étude

#### Notifications
- [ ] Rappels quotidiens (push notifications)
- [ ] Emails de motivation
- [ ] Notifications de série brisée

#### Gamification
- [ ] Système de points
- [ ] Plus de badges
- [ ] Niveaux d'utilisateur
- [ ] Récompenses virtuelles
- [ ] Boutique de récompenses

#### Contenu
- [ ] 100+ leçons tous niveaux
- [ ] Thèmes spécialisés (business, voyage, etc.)
- [ ] Podcasts intégrés
- [ ] Vidéos explicatives
- [ ] Exercices de prononciation avec IA

#### Technique
- [ ] Progressive Web App (PWA)
- [ ] Mode hors-ligne
- [ ] Thème sombre
- [ ] Internationalisation (i18n)
- [ ] Export PDF des leçons
- [ ] Analytics détaillées

#### Admin
- [ ] Génération de leçons par IA
- [ ] Import/Export en masse
- [ ] Planification automatique
- [ ] Statistiques d'utilisation
- [ ] Gestion des utilisateurs

---

## Versioning

- **MAJOR** (X.0.0) : Changements incompatibles
- **MINOR** (0.X.0) : Nouvelles fonctionnalités compatibles
- **PATCH** (0.0.X) : Corrections de bugs

---

## Support

Pour suggérer une fonctionnalité ou signaler un bug :
1. Vérifier que ce n'est pas déjà dans la roadmap
2. Créer une issue détaillée
3. Proposer une solution si possible

---

**Note** : Ce changelog sera mis à jour à chaque nouvelle version.
