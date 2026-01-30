/**
 * Point d'entrée principal de l'application ParleVrai15
 */

import router from './router/index.js';
import authService from './services/auth.js';

// Importer les pages
import { renderHomePage, homePageStyles } from './pages/Home.js';
import { renderLoginPage, renderSignupPage, authPageStyles } from './pages/Auth.js';
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
function initApp() {
  // Injecter tous les styles dans le DOM
  injectStyles();
  
  // Configurer les routes
  setupRoutes();
  
  // Vérifier l'authentification
  router.checkAuth();
  
  // Charger la route initiale
  router.handleRoute();
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
