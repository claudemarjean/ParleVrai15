import router from '../router/index.js';
import authService from '../services/auth.js';
import lessonService from '../services/lessons.js';
import progressService from '../services/progress.js';
import { createHeader } from '../components/Header.js';
import { createFooter } from '../components/Footer.js';

/**
 * Page de la leçon du jour
 */

export function renderLessonPage() {
  const app = document.getElementById('app');
  const lesson = lessonService.getTodayLesson();
  const isCompleted = progressService.isLessonCompleted(lesson.id);
  
  if (!lesson) {
    router.navigate('/dashboard');
    return;
  }
  
  app.innerHTML = '';
  
  // Header
  const header = createHeader(true, authService.isAdmin());
  app.appendChild(header);
  
  // Main content
  const main = document.createElement('main');
  main.className = 'lesson-page';
  main.innerHTML = `
    <div class="container container-sm">
      <!-- Lesson Header -->
      <div class="lesson-header-section fade-in">
        <div class="flex-between mb-md">
          <a href="/dashboard" class="back-link" data-link>← Retour</a>
          ${isCompleted 
            ? '<div class="lesson-badge completed">✓ Complétée</div>' 
            : '<div class="lesson-badge pending">En cours</div>'}
        </div>
        
        <div class="lesson-meta">
          <span class="lesson-level">${lesson.level}</span>
          <span class="lesson-date">${new Date(lesson.date).toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        
        <h1>${lesson.theme}</h1>
      </div>

      <!-- Reading Section -->
      <section class="lesson-section card fade-in">
        <div class="section-header">
          <div class="section-icon">📖</div>
          <h2>Lecture du jour</h2>
        </div>
        <div class="section-content">
          <p class="reading-text">${lesson.reading}</p>
          <div class="reading-tip">
            <strong>💡 Astuce :</strong> Lis ce texte à voix haute plusieurs fois. 
            Concentre-toi sur la prononciation et l'intonation.
          </div>
        </div>
      </section>

      <!-- Grammar Section -->
      <section class="lesson-section card fade-in">
        <div class="section-header">
          <div class="section-icon">📝</div>
          <h2>Règle de grammaire</h2>
        </div>
        <div class="section-content">
          <h3 class="grammar-title">${lesson.grammar.title}</h3>
          <p class="grammar-explanation">${lesson.grammar.explanation}</p>
          
          <div class="grammar-examples">
            <h4>Exemples :</h4>
            <ul>
              ${lesson.grammar.examples.map(ex => `<li>${ex}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- Vocabulary Section -->
      <section class="lesson-section card fade-in">
        <div class="section-header">
          <div class="section-icon">📚</div>
          <h2>Vocabulaire</h2>
        </div>
        <div class="section-content">
          <div class="vocabulary-list">
            ${lesson.vocabulary.map(item => `
              <div class="vocabulary-item">
                <div class="vocab-word">${item.word}</div>
                <div class="vocab-translation">${item.translation}</div>
              </div>
            `).join('')}
          </div>
          <div class="vocab-tip">
            <strong>💡 Astuce :</strong> Répète chaque mot à voix haute 3 fois. 
            Essaie de créer une phrase avec chaque mot.
          </div>
        </div>
      </section>

      <!-- Exercise Section -->
      <section class="lesson-section card fade-in">
        <div class="section-header">
          <div class="section-icon">🗣️</div>
          <h2>Exercice oral</h2>
        </div>
        <div class="section-content">
          <p class="exercise-instruction"><strong>${lesson.exercise.instruction}</strong></p>
          
          <div class="exercise-template">
            ${lesson.exercise.template}
          </div>
          
          <div class="exercise-tips">
            <h4>Conseils :</h4>
            <ul>
              ${lesson.exercise.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- AI Bonus Section -->
      <section class="lesson-section card bonus-section fade-in">
        <div class="section-header">
          <div class="section-icon">🤖</div>
          <h2>BONUS : Continue avec l'IA</h2>
        </div>
        <div class="section-content">
          <p class="mb-md">
            Tu veux pratiquer encore plus ? Copie ce prompt et utilise-le sur ChatGPT 
            pour continuer à parler français !
          </p>
          
          <div class="ai-prompt-box">
            <pre id="ai-prompt">${lesson.aiPrompt}</pre>
            <button id="copy-prompt-btn" class="btn btn-secondary btn-sm">
              📋 Copier le prompt
            </button>
          </div>
          
          <p class="text-sm text-gray mt-md">
            💡 Colle ce texte dans ChatGPT et commence une conversation en français !
          </p>
        </div>
      </section>

      <!-- Complete Lesson Button -->
      ${!isCompleted ? `
        <div class="complete-section text-center fade-in">
          <button id="complete-lesson-btn" class="btn btn-success btn-lg">
            ✓ Marquer comme terminée
          </button>
          <p class="text-sm text-gray mt-md">
            En marquant cette leçon comme terminée, tu gagneras +15 minutes 
            de pratique et continueras ta série ! 🔥
          </p>
        </div>
      ` : `
        <div class="complete-section text-center fade-in">
          <div class="completed-message">
            <div class="completed-icon">🎉</div>
            <h3>Bravo !</h3>
            <p>Tu as complété cette leçon. Continue comme ça !</p>
            <a href="/dashboard" class="btn btn-primary mt-md" data-link>
              Retour au tableau de bord
            </a>
          </div>
        </div>
      `}
    </div>
  `;
  
  app.appendChild(main);
  
  // Footer
  const footer = createFooter();
  app.appendChild(footer);
  
  // Attacher les événements
  attachLessonEvents(lesson);
}

/**
 * Attacher les événements
 */
function attachLessonEvents(lesson) {
  // Bouton pour copier le prompt
  const copyBtn = document.getElementById('copy-prompt-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const prompt = document.getElementById('ai-prompt').textContent;
      try {
        await navigator.clipboard.writeText(prompt);
        copyBtn.textContent = '✓ Copié !';
        setTimeout(() => {
          copyBtn.textContent = '📋 Copier le prompt';
        }, 2000);
      } catch (err) {
        alert('Erreur lors de la copie. Sélectionne et copie manuellement.');
      }
    });
  }
  
  // Bouton pour marquer comme complétée
  const completeBtn = document.getElementById('complete-lesson-btn');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      progressService.completeLesson(lesson.id);
      
      // Animation de succès
      completeBtn.textContent = '✓ Leçon complétée !';
      completeBtn.disabled = true;
      
      // Rediriger après 1.5 secondes
      setTimeout(() => {
        router.navigate('/dashboard');
      }, 1500);
    });
  }
  
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authService.logout();
      router.logout();
    });
  }
}

/**
 * Styles de la page leçon
 */
export const lessonPageStyles = `
.lesson-page {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - 200px);
}

.lesson-header-section {
  margin-bottom: var(--spacing-2xl);
}

.back-link {
  color: var(--text-tertiary);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--primary);
}

.lesson-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.lesson-date {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.lesson-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-xl);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--border-color);
}

.section-icon {
  font-size: 2rem;
}

.section-header h2 {
  margin-bottom: 0;
}

.section-content {
  line-height: 1.8;
}

.reading-text {
  font-size: 1.125rem;
  line-height: 2;
  margin-bottom: var(--spacing-lg);
  color: var(--text-secondary);
}

.reading-tip,
.vocab-tip {
  background-color: var(--bg-tertiary);
  padding: var(--spacing-md);
  border-left: 4px solid var(--primary);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--primary);
}

.grammar-title {
  color: var(--primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.25rem;
}

.grammar-explanation {
  white-space: pre-line;
  margin-bottom: var(--spacing-lg);
  color: var(--text-secondary);
}

.grammar-examples {
  background-color: var(--bg-tertiary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.grammar-examples h4 {
  margin-bottom: var(--spacing-sm);
  font-size: 1rem;
}

.grammar-examples ul {
  list-style: none;
  padding-left: 0;
}

.grammar-examples li {
  padding: var(--spacing-xs) 0;
  padding-left: var(--spacing-md);
  position: relative;
}

.grammar-examples li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: var(--primary);
}

.vocabulary-list {
  display: grid;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.vocabulary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
  transition: transform var(--transition-fast), background-color var(--transition-fast);
  border: 1px solid var(--border-color);
}

.vocabulary-item:hover {
  transform: translateX(5px);
  background-color: var(--bg-secondary);
}

.vocab-word {
  font-weight: 600;
  color: var(--text-primary);
}

.vocab-translation {
  color: var(--text-tertiary);
  font-style: italic;
}

.exercise-instruction {
  font-size: 1.125rem;
  margin-bottom: var(--spacing-lg);
}

.exercise-template {
  background-color: var(--primary);
  color: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-size: 1.125rem;
  line-height: 2;
  margin-bottom: var(--spacing-lg);
  white-space: pre-line;
}

.exercise-tips {
  background-color: var(--bg-tertiary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.exercise-tips h4 {
  margin-bottom: var(--spacing-sm);
  font-size: 1rem;
}

.exercise-tips ul {
  list-style: none;
  padding-left: 0;
}

.exercise-tips li {
  padding: var(--spacing-xs) 0;
  padding-left: var(--spacing-md);
  position: relative;
}

.exercise-tips li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--success);
}

.bonus-section {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border: 2px solid var(--primary-light);
}

.ai-prompt-box {
  position: relative;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
  border: 2px solid var(--border-color);
  font-family: 'Courier New', monospace;
}

.ai-prompt-box pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
}

.ai-prompt-box button {
  margin-top: var(--spacing-md);
}

.complete-section {
  margin: var(--spacing-2xl) 0;
}

.completed-message {
  background-color: var(--success);
  color: white;
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
}

.completed-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
}

.completed-message h3 {
  color: white;
  margin-bottom: var(--spacing-sm);
}

.completed-message p {
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .lesson-page {
    padding: var(--spacing-lg) 0;
  }
  
  .lesson-header-section {
    margin-bottom: var(--spacing-lg);
  }
  
  .lesson-meta {
    flex-direction: column;
    gap: var(--spacing-xs);
    align-items: flex-start;
  }
  
  .lesson-section {
    padding: var(--spacing-lg);
  }
  
  .section-number {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .vocabulary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .vocab-word {
    font-size: 1rem;
  }
  
  .exercise-template {
    font-size: 0.938rem;
    padding: var(--spacing-md);
  }
  
  .grammar-content,
  .reading-text {
    font-size: 0.938rem;
  }
  
  .prompt-box {
    padding: var(--spacing-md);
  }
  
  .prompt-text {
    font-size: 0.875rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .action-buttons .btn {
    width: 100%;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .lesson-section {
    padding: var(--spacing-xl);
  }
  
  .section-number {
    font-size: 2.5rem;
  }
  
  .exercise-template {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .vocabulary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .exercise-template {
    font-size: 1rem;
  }
}
`;
