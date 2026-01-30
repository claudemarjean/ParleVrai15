import router from '../router/index.js';
import authService from '../services/auth.js';
import { createHeader } from '../components/Header.js';
import { createFooter } from '../components/Footer.js';

/**
 * Page d'accueil (Landing Page)
 */

export function renderHomePage() {
  const app = document.getElementById('app');
  
  app.innerHTML = '';
  
  // Header
  const header = createHeader(authService.isAuthenticated(), authService.isAdmin());
  app.appendChild(header);
  
  // Main content
  const main = document.createElement('main');
  main.className = 'home-page';
  main.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content fade-in">
          <h1 class="hero-title">
            Parle<span class="text-primary">Vrai</span>15
          </h1>
          <p class="hero-subtitle">Parler français, pour de vrai.</p>
          <p class="hero-description">
            Apprends à parler français naturellement avec seulement 
            <strong>15 minutes par jour</strong>. Concentre-toi sur l'oral, 
            la pratique et la confiance.
          </p>
          <div class="hero-cta">
            <a href="/signup" class="btn btn-primary btn-lg" data-link>
              Commencer gratuitement
            </a>
            <a href="/login" class="btn btn-secondary btn-lg" data-link>
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment ça marche -->
    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title text-center">Comment ça marche ?</h2>
        <div class="grid grid-3">
          <div class="feature-card card text-center fade-in">
            <div class="feature-icon">📖</div>
            <h3>1. Lis</h3>
            <p>
              Chaque jour, une courte lecture authentique pour 
              découvrir du vocabulaire en contexte.
            </p>
          </div>
          
          <div class="feature-card card text-center fade-in">
            <div class="feature-icon">📝</div>
            <h3>2. Apprends</h3>
            <p>
              Une règle de grammaire simple et 3 à 5 mots de 
              vocabulaire essentiels à retenir.
            </p>
          </div>
          
          <div class="feature-card card text-center fade-in">
            <div class="feature-icon">🗣️</div>
            <h3>3. Parle</h3>
            <p>
              Un exercice oral guidé pour pratiquer à voix haute. 
              C'est en parlant qu'on apprend !
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pourquoi ParleVrai15 -->
    <section class="why-section">
      <div class="container">
        <div class="why-content">
          <div class="why-text">
            <h2 class="section-title">Pourquoi ParleVrai15 ?</h2>
            <ul class="why-list">
              <li>
                <strong>🎯 Concentré sur l'oral</strong>
                <p>Pas de théorie interminable. On apprend à parler en parlant.</p>
              </li>
              <li>
                <strong>⏱️ Seulement 15 minutes</strong>
                <p>Une routine quotidienne facile à tenir, même avec un emploi du temps chargé.</p>
              </li>
              <li>
                <strong>🚀 Progression visible</strong>
                <p>Suis tes progrès jour après jour et maintiens ta série.</p>
              </li>
              <li>
                <strong>🤖 Bonus IA</strong>
                <p>Un prompt ChatGPT prêt à copier pour continuer à pratiquer.</p>
              </li>
              <li>
                <strong>💪 Simple et motivant</strong>
                <p>Un design clair, un ton humain, zéro pression.</p>
              </li>
            </ul>
          </div>
          <div class="why-visual">
            <div class="stats-preview card">
              <h3>Ta progression</h3>
              <div class="stat-item">
                <div class="stat-number">7</div>
                <div class="stat-label">Jours consécutifs 🔥</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">105</div>
                <div class="stat-label">Minutes pratiquées</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">12</div>
                <div class="stat-label">Leçons complétées</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="final-cta">
      <div class="container text-center">
        <h2>Prêt à commencer ?</h2>
        <p class="text-lg mb-xl">
          Rejoins ParleVrai15 aujourd'hui et commence à parler français 
          avec confiance.
        </p>
        <a href="/signup" class="btn btn-primary btn-lg" data-link>
          Créer mon compte gratuitement
        </a>
      </div>
    </section>
  `;
  
  app.appendChild(main);
  
  // Footer
  const footer = createFooter();
  app.appendChild(footer);
  
  // Ajouter les événements
  attachHomeEvents();
}

/**
 * Attacher les événements de la page
 */
function attachHomeEvents() {
  // Menu mobile
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      navLinks?.classList.toggle('active');
    });
  }
}

/**
 * Styles spécifiques à la page d'accueil
 */
export const homePageStyles = `
/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: var(--spacing-3xl) 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: var(--spacing-md);
  color: white;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.95;
}

.hero-description {
  font-size: 1.125rem;
  margin-bottom: var(--spacing-2xl);
  opacity: 0.9;
  line-height: 1.8;
}

.hero-cta {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* How it works */
.how-it-works {
  padding: var(--spacing-3xl) 0;
  background-color: white;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-2xl);
}

.feature-card {
  transition: transform var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

/* Why section */
.why-section {
  padding: var(--spacing-3xl) 0;
  background-color: var(--gray-50);
}

.why-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
}

.why-list {
  list-style: none;
}

.why-list li {
  margin-bottom: var(--spacing-lg);
  padding-left: var(--spacing-lg);
}

.why-list strong {
  display: block;
  font-size: 1.125rem;
  margin-bottom: var(--spacing-xs);
}

.stats-preview {
  padding: var(--spacing-xl);
}

.stats-preview h3 {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.stat-item {
  text-align: center;
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--gray-200);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary);
}

.stat-label {
  color: var(--gray-600);
  margin-top: var(--spacing-sm);
}

/* Final CTA */
.final-cta {
  padding: var(--spacing-3xl) 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.final-cta h2 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.final-cta p {
  color: rgba(255, 255, 255, 0.9);
}

/* Responsive */
@media (max-width: 640px) {
  .hero {
    padding: var(--spacing-2xl) 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-cta {
    flex-direction: column;
    width: 100%;
  }
  
  .hero-cta .btn {
    width: 100%;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .feature-icon {
    font-size: 2.5rem;
  }
  
  .how-it-works,
  .why-section,
  .final-cta {
    padding: var(--spacing-2xl) 0;
  }
  
  .why-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
  
  .stats-preview {
    order: -1;
    padding: var(--spacing-lg);
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .why-list li {
    padding-left: 0;
  }
  
  .final-cta h2 {
    font-size: 1.75rem;
  }
  
  .final-cta p {
    font-size: 1rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.375rem;
  }
  
  .section-title {
    font-size: 2.25rem;
  }
  
  .why-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
  
  .stats-preview {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .feature-card:last-child {
    grid-column: 1 / -1;
    max-width: 50%;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .why-content {
    grid-template-columns: 1fr;
  }
  
  .stats-preview {
    order: -1;
  }
}
`;
