import router from '../router/index.js';
import authService from '../services/auth.js';
import lessonService from '../services/lessons.js';
import progressService from '../services/progress.js';
import { createHeader } from '../components/Header.js';
import { createFooter } from '../components/Footer.js';

/**
 * Page Dashboard (Tableau de bord)
 */

export function renderDashboardPage() {
  const app = document.getElementById('app');
  const user = authService.getCurrentUser();
  const stats = progressService.getStats();
  const todayLesson = lessonService.getTodayLesson();
  const isTodayCompleted = progressService.isLessonCompleted(todayLesson.id);
  
  app.innerHTML = '';
  
  // Header
  const header = createHeader(true, authService.isAdmin());
  app.appendChild(header);
  
  // Main content
  const main = document.createElement('main');
  main.className = 'dashboard-page';
  main.innerHTML = `
    <div class="container">
      <!-- Welcome Section -->
      <section class="welcome-section fade-in">
        <h1>Bonjour, ${user?.name || 'Apprenant'} ! 👋</h1>
        <p class="text-lg text-gray">
          ${isTodayCompleted 
            ? 'Bravo ! Tu as complété ta leçon du jour. Reviens demain pour continuer !' 
            : 'Prêt pour ta leçon du jour ?'}
        </p>
      </section>

      <!-- Stats Cards -->
      <section class="stats-grid grid grid-3 mt-xl">
        <div class="stat-card card text-center fade-in">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">${stats.currentStreak}</div>
          <div class="stat-label">Jours consécutifs</div>
        </div>
        
        <div class="stat-card card text-center fade-in">
          <div class="stat-icon">✅</div>
          <div class="stat-value">${stats.completedCount}</div>
          <div class="stat-label">Leçons complétées</div>
        </div>
        
        <div class="stat-card card text-center fade-in">
          <div class="stat-icon">⏱️</div>
          <div class="stat-value">${stats.totalMinutes}</div>
          <div class="stat-label">Minutes pratiquées</div>
        </div>
      </section>

      <!-- Today's Lesson -->
      <section class="today-lesson mt-2xl">
        <h2 class="mb-lg">Leçon du jour</h2>
        <div class="lesson-card card fade-in">
          <div class="lesson-header">
            <div>
              <div class="lesson-level">${todayLesson.level}</div>
              <h3>${todayLesson.theme}</h3>
            </div>
            ${isTodayCompleted 
              ? '<div class="lesson-badge completed">✓ Complétée</div>' 
              : '<div class="lesson-badge pending">À faire</div>'}
          </div>
          
          <p class="lesson-preview">
            ${todayLesson.reading.substring(0, 150)}...
          </p>
          
          <a href="/lesson" class="btn btn-primary" data-link>
            ${isTodayCompleted ? 'Revoir la leçon' : 'Commencer la leçon'}
          </a>
        </div>
      </section>

      <!-- Quick Links -->
      <section class="quick-links mt-2xl">
        <h2 class="mb-lg">Accès rapide</h2>
        <div class="grid grid-2">
          <a href="/calendar" class="quick-link-card card" data-link>
            <div class="quick-link-icon">📅</div>
            <div>
              <h3>Calendrier</h3>
              <p class="text-gray">Visualise ta progression</p>
            </div>
          </a>
          
          <a href="/stats" class="quick-link-card card" data-link>
            <div class="quick-link-icon">📊</div>
            <div>
              <h3>Statistiques</h3>
              <p class="text-gray">Analyse tes performances</p>
            </div>
          </a>
        </div>
      </section>

      <!-- Motivational Quote -->
      <section class="motivation mt-2xl mb-2xl">
        <div class="motivation-card card text-center">
          <p class="motivation-quote">
            "La persévérance, c'est ce qui rend l'impossible possible, 
            le possible probable et le probable réalisé."
          </p>
          <p class="text-gray text-sm">Continue comme ça ! 💪</p>
        </div>
      </section>
    </div>
  `;
  
  app.appendChild(main);
  
  // Footer
  const footer = createFooter();
  app.appendChild(footer);
  
  // Attacher les événements
  attachDashboardEvents();
}

/**
 * Attacher les événements
 */
function attachDashboardEvents() {
  const logoutBtn = document.getElementById('logout-btn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authService.logout();
      router.logout();
    });
  }
}

/**
 * Styles du dashboard
 */
export const dashboardStyles = `
.dashboard-page {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - 200px);
}

.welcome-section h1 {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.stats-grid {
  gap: var(--spacing-lg);
}

.stat-card {
  padding: var(--spacing-xl);
  transition: transform var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  color: var(--gray-600);
  font-size: 0.875rem;
}

.lesson-card {
  padding: var(--spacing-xl);
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
}

.lesson-level {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--gray-100);
  color: var(--gray-700);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: var(--spacing-sm);
}

.lesson-badge {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
}

.lesson-badge.completed {
  background-color: var(--success);
  color: white;
}

.lesson-badge.pending {
  background-color: var(--accent);
  color: white;
}

.lesson-preview {
  margin-bottom: var(--spacing-lg);
  color: var(--gray-700);
  line-height: 1.8;
}

.quick-link-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  transition: all var(--transition-normal);
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.quick-link-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.quick-link-icon {
  font-size: 2.5rem;
}

.quick-link-card h3 {
  margin-bottom: var(--spacing-xs);
  color: var(--gray-900);
}

.motivation-card {
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.motivation-quote {
  font-size: 1.25rem;
  font-style: italic;
  margin-bottom: var(--spacing-md);
  line-height: 1.8;
}

.motivation-card .text-gray {
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-link-card {
    flex-direction: column;
    text-align: center;
  }
}
`;
