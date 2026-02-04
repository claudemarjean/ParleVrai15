/**
 * Point d'entrée principal de l'application ParleVrai15
 */

import router from './router/index.js';
import authService from './services/auth.js';
import themeService from './services/theme.js';

// Importer les pages
import { renderHomePage, homePageStyles } from './pages/Home.js';
import { renderLoginPage, renderSignupPage, authPageStyles } from './pages/Auth.js';
import { renderAuthCallbackPage } from './pages/AuthCallback.js';
import { renderDashboardPage, dashboardStyles } from './pages/Dashboard.js';
import { renderLessonPage, lessonPageStyles } from './pages/Lesson.js';
import { renderCalendarPage, calendarPageStyles } from './pages/Calendar.js';
import { renderStatsPage, statsPageStyles } from './pages/Stats.js';
import { renderAdminPage, adminPageStyles } from './pages/Admin.js';

// Importer les styles des composants
import { headerStyles } from './components/Header.js';
import { footerStyles } from './components/Footer.js';

/**
 * Initialiser l'application
 */
async function initApp() {
  // Initialiser le thème
  themeService.loadTheme();
  
  // Injecter tous les styles dans le DOM
  injectStyles();
  
  // Configurer les routes
  setupRoutes();
  
  // Connecter authService et router pour synchronisation automatique
  setupAuthSync();
  
  // Vérifier et restaurer la session Supabase
  await checkAndRestoreSession();
  
  // Vérifier l'authentification
  router.checkAuth();
  
  // Charger la route initiale
  router.handleRoute();
}

/**
 * Connecter authService et router pour synchronisation automatique
 */
function setupAuthSync() {
  authService.onAuthStateChange((isAuthenticated, isAdmin) => {
    router.setAuth(isAuthenticated, isAdmin);
    
    // Si déconnexion, rediriger vers la page d'accueil
    if (!isAuthenticated) {
      router.redirectToHome();
    }
  });
}

/**
 * Vérifier et restaurer la session utilisateur au démarrage
 */
async function checkAndRestoreSession() {
  try {
    const result = await authService.checkSession();
    
    if (result.success && result.user) {
      // Session restaurée avec succès
      console.log('Session restaurée:', result.user.email);
      router.setAuth(true, result.user.isAdmin);
    } else {
      // Pas de session active
      console.log('Aucune session active');
      router.setAuth(false, false);
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de session:', error);
    router.setAuth(false, false);
  }
}

/**
 * Injecter les styles dans le DOM
 */
function injectStyles() {
  const styles = `
    ${headerStyles}
    ${footerStyles}
    ${homePageStyles}
    ${authPageStyles}
    ${dashboardStyles}
    ${lessonPageStyles}
    ${calendarPageStyles}
    ${statsPageStyles}
    ${adminPageStyles}
  `;
  
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

/**
 * Configurer toutes les routes de l'application
 */
function setupRoutes() {
  // Routes publiques
  router.addRoute('/', renderHomePage, false, false);
  router.addRoute('/login', renderLoginPage, false, false);
  router.addRoute('/signup', renderSignupPage, false, false);
  router.addRoute('/auth/callback', renderAuthCallbackPage, false, false);
  
  // Routes authentifiées
  router.addRoute('/dashboard', renderDashboardPage, true, false);
  router.addRoute('/lesson', renderLessonPage, true, false);
  router.addRoute('/calendar', renderCalendarPage, true, false);
  router.addRoute('/stats', renderStatsPage, true, false);
  
  // Routes admin
  router.addRoute('/admin', renderAdminPage, true, true);
  
  // Route 404
  router.addRoute('/404', render404Page, false, false);
}

/**
 * Page 404
 */
function render404Page() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container" style="padding: var(--spacing-3xl) 0; text-align: center;">
      <h1 style="font-size: 4rem; margin-bottom: var(--spacing-md);">404</h1>
      <p style="font-size: 1.5rem; margin-bottom: var(--spacing-xl);">
        Oups ! Cette page n'existe pas.
      </p>
      <a href="/" class="btn btn-primary" data-link>Retour à l'accueil</a>
    </div>
  `;
}

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
