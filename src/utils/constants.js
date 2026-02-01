/**
 * Constantes de l'application ParleVrai15
 */

// Durée d'une leçon en minutes
export const LESSON_DURATION = 15;

// Niveaux disponibles
export const LEVELS = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé'
};

// Messages de motivation
export const MOTIVATIONAL_MESSAGES = {
  STREAK_0: "Commence ta série aujourd'hui ! Chaque grand voyage commence par un premier pas.",
  STREAK_1_6: "Tu es sur une bonne lancée ! Continue comme ça !",
  STREAK_7_29: "Incroyable ! Tu es en train de créer une habitude solide.",
  STREAK_30_PLUS: "Extraordinaire ! Tu es un vrai champion de la persévérance ! 🏆"
};

// Badges disponibles
export const BADGES = [
  {
    id: 'first-lesson',
    title: 'Premier pas',
    description: 'Complète ta première leçon',
    icon: '🎯',
    threshold: 1,
    type: 'lessons'
  },
  {
    id: 'week-streak',
    title: '7 jours d\'affilée',
    description: 'Maintiens une série de 7 jours',
    icon: '🔥',
    threshold: 7,
    type: 'streak'
  },
  {
    id: 'ten-lessons',
    title: 'Déterminé(e)',
    description: 'Complète 10 leçons',
    icon: '⭐',
    threshold: 10,
    type: 'lessons'
  },
  {
    id: 'month-streak',
    title: 'Un mois complet',
    description: 'Maintiens une série de 30 jours',
    icon: '🏆',
    threshold: 30,
    type: 'streak'
  },
  {
    id: 'fifty-lessons',
    title: 'Expert',
    description: 'Complète 50 leçons',
    icon: '🎓',
    threshold: 50,
    type: 'lessons'
  },
  {
    id: 'hundred-lessons',
    title: 'Maître du français',
    description: 'Complète 100 leçons',
    icon: '👑',
    threshold: 100,
    type: 'lessons'
  }
];

// Routes de l'application
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  LESSON: '/lesson',
  CALENDAR: '/calendar',
  STATS: '/stats',
  ADMIN: '/admin',
  NOT_FOUND: '/404'
};

// Clés localStorage
export const STORAGE_KEYS = {
  USER: 'user',
  LESSONS: 'lessons',
  PROGRESS: 'progress'
};

// Configuration de l'application
export const APP_CONFIG = {
  NAME: 'ParleVrai15',
  TAGLINE: 'Parler français, pour de vrai.',
  DESCRIPTION: 'Apprends à parler français naturellement avec seulement 15 minutes par jour.',
  VERSION: '1.0.0'
};

// Configuration Ivony
export const IVONY_CONFIG = {
  // ID de l'application ParleVrai15 dans la plateforme Ivony
  APPLICATION_ID: 'c2036adf-59fe-4fdb-a019-7568b24fa8e1',
  
  // Rôles disponibles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },
  
  // Status possibles
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
  }
};
