import router from '../router/index.js';
import authService from '../services/auth.js';
import progressService from '../services/progress.js';
import { createHeader } from '../components/Header.js';
import { createFooter } from '../components/Footer.js';

/**
 * Page Statistiques
 */

export function renderStatsPage() {
  const app = document.getElementById('app');
  const stats = progressService.getStats();
  
  app.innerHTML = '';
  
  // Header
  const header = createHeader(true, authService.isAdmin());
  app.appendChild(header);
  
  // Main content
  const main = document.createElement('main');
  main.className = 'stats-page';
  main.innerHTML = `
    <div class="container container-sm">
      <div class="page-header fade-in">
        <h1>📊 Statistiques</h1>
        <p class="text-gray">Analyse ta progression et tes performances</p>
      </div>

      <!-- Main Stats -->
      <div class="stats-grid grid grid-2 fade-in">
        <div class="stat-card-large card text-center">
          <div class="stat-icon-large">🔥</div>
          <div class="stat-value-large">${stats.currentStreak}</div>
          <div class="stat-label-large">Série actuelle</div>
          <p class="stat-description">
            Jours consécutifs de pratique
          </p>
        </div>
        
        <div class="stat-card-large card text-center">
          <div class="stat-icon-large">🏆</div>
          <div class="stat-value-large">${stats.longestStreak}</div>
          <div class="stat-label-large">Record personnel</div>
          <p class="stat-description">
            Plus longue série de jours
          </p>
        </div>
      </div>

      <!-- Detail Stats -->
      <div class="stats-detail grid grid-3 mt-xl fade-in">
        <div class="stat-card card text-center">
          <div class="stat-icon">✅</div>
          <div class="stat-value">${stats.completedCount}</div>
          <div class="stat-label">Leçons complétées</div>
        </div>
        
        <div class="stat-card card text-center">
          <div class="stat-icon">⏱️</div>
          <div class="stat-value">${stats.totalMinutes}</div>
          <div class="stat-label">Minutes pratiquées</div>
        </div>
        
        <div class="stat-card card text-center">
          <div class="stat-icon">⏰</div>
          <div class="stat-value">${stats.totalHours}</div>
          <div class="stat-label">Heures totales</div>
        </div>
      </div>

      <!-- Progress Overview -->
      <div class="progress-overview card mt-xl fade-in">
        <h2 class="mb-lg">Vue d'ensemble</h2>
        
        <div class="progress-item">
          <div class="progress-info">
            <span class="progress-label">Leçons complétées</span>
            <span class="progress-value">${stats.completedCount} / 100</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(stats.completedCount, 100)}%"></div>
          </div>
        </div>
        
        <div class="progress-item">
          <div class="progress-info">
            <span class="progress-label">Temps de pratique</span>
            <span class="progress-value">${stats.totalHours}h / 25h</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min((stats.totalHours / 25) * 100, 100)}%"></div>
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="achievements card mt-xl fade-in">
        <h2 class="mb-lg">🏅 Badges & Réalisations</h2>
        <div class="achievements-grid">
          ${renderAchievements(stats)}
        </div>
      </div>

      <!-- Motivation -->
      <div class="motivation-box card mt-xl fade-in text-center">
        <h3>Continue comme ça ! 💪</h3>
        <p class="text-lg">
          ${getMotivationalMessage(stats)}
        </p>
        <a href="/lesson" class="btn btn-primary mt-md" data-link>
          Faire ma leçon du jour
        </a>
      </div>
    </div>
  `;
  
  app.appendChild(main);
  
  // Footer
  const footer = createFooter();
  app.appendChild(footer);
  
  // Attacher les événements
  attachStatsEvents();
}

/**
 * Rendre les badges/réalisations
 */
function renderAchievements(stats) {
  const achievements = [
    {
      id: 'first-lesson',
      title: 'Premier pas',
      description: 'Complète ta première leçon',
      icon: '🎯',
      unlocked: stats.completedCount >= 1
    },
    {
      id: 'week-streak',
      title: '7 jours d\'affilée',
      description: 'Maintiens une série de 7 jours',
      icon: '🔥',
      unlocked: stats.currentStreak >= 7
    },
    {
      id: 'ten-lessons',
      title: 'Déterminé(e)',
      description: 'Complète 10 leçons',
      icon: '⭐',
      unlocked: stats.completedCount >= 10
    },
    {
      id: 'month-streak',
      title: 'Un mois complet',
      description: 'Maintiens une série de 30 jours',
      icon: '🏆',
      unlocked: stats.currentStreak >= 30
    },
    {
      id: 'fifty-lessons',
      title: 'Expert',
      description: 'Complète 50 leçons',
      icon: '🎓',
      unlocked: stats.completedCount >= 50
    },
    {
      id: 'hundred-lessons',
      title: 'Maître du français',
      description: 'Complète 100 leçons',
      icon: '👑',
      unlocked: stats.completedCount >= 100
    }
  ];
  
  return achievements.map(achievement => `
    <div class="achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}">
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-title">${achievement.title}</div>
      <div class="achievement-description">${achievement.description}</div>
      ${achievement.unlocked ? '<div class="achievement-status">✓ Débloqué</div>' : '<div class="achievement-status">🔒 Verrouillé</div>'}
    </div>
  `).join('');
}

/**
 * Obtenir un message motivationnel
 */
function getMotivationalMessage(stats) {
  if (stats.currentStreak === 0) {
    return "Commence ta série aujourd'hui ! Chaque grand voyage commence par un premier pas.";
  } else if (stats.currentStreak < 7) {
    return `Tu es sur une bonne lancée avec ${stats.currentStreak} jour${stats.currentStreak > 1 ? 's' : ''} consécutif${stats.currentStreak > 1 ? 's' : ''} ! Continue !`;
  } else if (stats.currentStreak < 30) {
    return `Incroyable ! ${stats.currentStreak} jours consécutifs ! Tu es en train de créer une habitude solide.`;
  } else {
    return `Extraordinaire ! ${stats.currentStreak} jours de suite ! Tu es un vrai champion de la persévérance ! 🏆`;
  }
}

/**
 * Attacher les événements
 */
function attachStatsEvents() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authService.logout();
      router.logout();
    });
  }
}

/**
 * Styles des statistiques
 */
export const statsPageStyles = `
.stats-page {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - 200px);
}

.stat-card-large {
  padding: var(--spacing-2xl);
  transition: transform var(--transition-normal);
}

.stat-card-large:hover {
  transform: translateY(-5px);
}

.stat-icon-large {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
}

.stat-value-large {
  font-size: 4rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: var(--spacing-sm);
}

.stat-label-large {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.stat-description {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.progress-overview {
  padding: var(--spacing-xl);
}

.progress-item {
  margin-bottom: var(--spacing-lg);
}

.progress-item:last-child {
  margin-bottom: 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.progress-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.progress-value {
  color: var(--primary);
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
  transition: width var(--transition-slow);
}

.achievements {
  padding: var(--spacing-xl);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.achievement-badge {
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all var(--transition-normal);
  border: 2px solid var(--border-color);
  background-color: var(--card-bg);
}

.achievement-badge.unlocked {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-color: var(--primary);
}

.achievement-badge.locked {
  opacity: 0.5;
  filter: grayscale(100%);
}

.achievement-badge:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.achievement-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-sm);
}

.achievement-title {
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.achievement-description {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-sm);
}

.achievement-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  display: inline-block;
}

.achievement-badge.unlocked .achievement-status {
  background-color: var(--success);
  color: white;
}

.achievement-badge.locked .achievement-status {
  background-color: var(--bg-tertiary);
  color: var(--text-tertiary);
  border: 1px solid var(--border-color);
}

.motivation-box {
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.motivation-box h3 {
  color: white;
  margin-bottom: var(--spacing-md);
}

.motivation-box p {
  color: rgba(255, 255, 255, 0.95);
}

@media (max-width: 640px) {
  .stats-page {
    padding: var(--spacing-lg) 0;
  }
  
  .stats-grid,
  .stats-detail {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .stat-card-large {
    padding: var(--spacing-lg);
  }
  
  .stat-icon-large {
    font-size: 2.5rem;
  }
  
  .stat-value-large {
    font-size: 2.5rem;
  }
  
  .stat-label-large {
    font-size: 1rem;
  }
  
  .stat-description {
    font-size: 0.875rem;
  }
  
  .stat-card {
    padding: var(--spacing-lg);
  }
  
  .stat-icon {
    font-size: 2rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .progress-overview {
    padding: var(--spacing-lg);
  }
  
  .progress-bar-container {
    height: 8px;
  }
  
  .achievement-card {
    padding: var(--spacing-md);
  }
  
  .motivation-card {
    padding: var(--spacing-lg);
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-detail {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card:last-child {
    grid-column: 1 / -1;
    max-width: 50%;
    margin: 0 auto;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .stats-grid,
  .stats-detail {
    grid-template-columns: 1fr;
  }
  
  .stat-value-large {
    font-size: 3rem;
  }
}
`;
