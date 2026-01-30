import router from '../router/index.js';
import authService from '../services/auth.js';
import lessonService from '../services/lessons.js';
import { createHeader } from '../components/Header.js';
import { createFooter } from '../components/Footer.js';

/**
 * Page Admin - Back Office
 */

export function renderAdminPage() {
  const app = document.getElementById('app');
  const lessons = lessonService.getAllLessons();
  
  app.innerHTML = '';
  
  // Header
  const header = createHeader(true, true);
  app.appendChild(header);
  
  // Main content
  const main = document.createElement('main');
  main.className = 'admin-page';
  main.innerHTML = `
    <div class="container">
      <div class="page-header fade-in">
        <h1>🔧 Administration</h1>
        <p class="text-gray">Gérer les leçons de l'application</p>
      </div>

      <div class="admin-actions fade-in mb-xl">
        <button id="create-lesson-btn" class="btn btn-primary">
          + Créer une nouvelle leçon
        </button>
      </div>

      <div class="lessons-table-container card fade-in">
        <h2 class="mb-lg">Liste des leçons</h2>
        <div class="table-responsive">
          <table class="lessons-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Niveau</th>
                <th>Thème</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${lessons.map(lesson => `
                <tr>
                  <td>${lesson.id}</td>
                  <td>${new Date(lesson.date).toLocaleDateString('fr-FR')}</td>
                  <td><span class="badge">${lesson.level}</span></td>
                  <td>${lesson.theme}</td>
                  <td class="actions">
                    <button class="btn btn-sm btn-secondary edit-btn" data-id="${lesson.id}">
                      Modifier
                    </button>
                    <button class="btn btn-sm btn-secondary preview-btn" data-id="${lesson.id}">
                      Prévisualiser
                    </button>
                    <button class="btn btn-sm btn-secondary delete-btn" data-id="${lesson.id}">
                      Supprimer
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal pour créer/éditer une leçon -->
    <div id="lesson-modal" class="modal hidden">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modal-title">Créer une leçon</h2>
          <button id="close-modal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <form id="lesson-form">
            <div class="form-row">
              <div class="form-group">
                <label for="level" class="form-label">Niveau</label>
                <select id="level" class="form-select" required>
                  <option value="">Choisir un niveau</option>
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="theme" class="form-label">Thème</label>
                <input type="text" id="theme" class="form-input" required placeholder="Ex: Se présenter" />
              </div>
            </div>

            <div class="form-group">
              <label for="date" class="form-label">Date de publication</label>
              <input type="date" id="date" class="form-input" required />
            </div>

            <div class="form-group">
              <label for="reading" class="form-label">Lecture du jour</label>
              <textarea id="reading" class="form-textarea" required placeholder="Texte de la lecture..."></textarea>
            </div>

            <div class="form-group">
              <label for="grammar-title" class="form-label">Titre de la règle de grammaire</label>
              <input type="text" id="grammar-title" class="form-input" required placeholder="Ex: Le présent de l'indicatif" />
            </div>

            <div class="form-group">
              <label for="grammar-explanation" class="form-label">Explication de la règle</label>
              <textarea id="grammar-explanation" class="form-textarea" required placeholder="Explication de la règle..."></textarea>
            </div>

            <div class="form-group">
              <label for="grammar-examples" class="form-label">Exemples (un par ligne)</label>
              <textarea id="grammar-examples" class="form-textarea" required placeholder="Je parle français\nTu parles anglais"></textarea>
            </div>

            <div class="form-group">
              <label for="vocabulary" class="form-label">Vocabulaire (format: mot | traduction, un par ligne)</label>
              <textarea id="vocabulary" class="form-textarea" required placeholder="parler | to speak\napprendre | to learn"></textarea>
            </div>

            <div class="form-group">
              <label for="exercise-instruction" class="form-label">Instruction de l'exercice</label>
              <input type="text" id="exercise-instruction" class="form-input" required placeholder="Ex: Présentez-vous à voix haute" />
            </div>

            <div class="form-group">
              <label for="exercise-template" class="form-label">Template de l'exercice</label>
              <textarea id="exercise-template" class="form-textarea" required placeholder="Template avec des [espaces à remplir]"></textarea>
            </div>

            <div class="form-group">
              <label for="exercise-tips" class="form-label">Conseils (un par ligne)</label>
              <textarea id="exercise-tips" class="form-textarea" required placeholder="Parlez lentement\nRépétez plusieurs fois"></textarea>
            </div>

            <div class="form-group">
              <label for="ai-prompt" class="form-label">Prompt bonus IA</label>
              <textarea id="ai-prompt" class="form-textarea" required placeholder="Prompt pour ChatGPT..."></textarea>
            </div>

            <div class="form-actions">
              <button type="button" id="cancel-btn" class="btn btn-secondary">Annuler</button>
              <button type="submit" class="btn btn-primary">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de prévisualisation -->
    <div id="preview-modal" class="modal hidden">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h2>Prévisualisation de la leçon</h2>
          <button id="close-preview" class="close-btn">&times;</button>
        </div>
        <div class="modal-body" id="preview-content">
          <!-- Le contenu sera injecté ici -->
        </div>
      </div>
    </div>
  `;
  
  app.appendChild(main);
  
  // Footer
  const footer = createFooter();
  app.appendChild(footer);
  
  // Attacher les événements
  attachAdminEvents();
}

/**
 * Attacher les événements admin
 */
function attachAdminEvents() {
  let currentEditId = null;
  
  const modal = document.getElementById('lesson-modal');
  const previewModal = document.getElementById('preview-modal');
  const form = document.getElementById('lesson-form');
  
  // Créer une nouvelle leçon
  document.getElementById('create-lesson-btn').addEventListener('click', () => {
    currentEditId = null;
    document.getElementById('modal-title').textContent = 'Créer une leçon';
    form.reset();
    modal.classList.remove('hidden');
  });
  
  // Fermer les modals
  document.getElementById('close-modal').addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  document.getElementById('close-preview').addEventListener('click', () => {
    previewModal.classList.add('hidden');
  });
  
  document.getElementById('cancel-btn').addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  // Éditer une leçon
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const lesson = lessonService.getLessonById(id);
      
      if (lesson) {
        currentEditId = id;
        document.getElementById('modal-title').textContent = 'Modifier la leçon';
        
        // Remplir le formulaire
        document.getElementById('level').value = lesson.level;
        document.getElementById('theme').value = lesson.theme;
        document.getElementById('date').value = lesson.date;
        document.getElementById('reading').value = lesson.reading;
        document.getElementById('grammar-title').value = lesson.grammar.title;
        document.getElementById('grammar-explanation').value = lesson.grammar.explanation;
        document.getElementById('grammar-examples').value = lesson.grammar.examples.join('\n');
        document.getElementById('vocabulary').value = lesson.vocabulary.map(v => `${v.word} | ${v.translation}`).join('\n');
        document.getElementById('exercise-instruction').value = lesson.exercise.instruction;
        document.getElementById('exercise-template').value = lesson.exercise.template;
        document.getElementById('exercise-tips').value = lesson.exercise.tips.join('\n');
        document.getElementById('ai-prompt').value = lesson.aiPrompt;
        
        modal.classList.remove('hidden');
      }
    });
  });
  
  // Prévisualiser
  document.querySelectorAll('.preview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const lesson = lessonService.getLessonById(id);
      
      if (lesson) {
        showPreview(lesson);
      }
    });
  });
  
  // Supprimer
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
        lessonService.deleteLesson(id);
        router.handleRoute(); // Recharger la page
      }
    });
  });
  
  // Soumettre le formulaire
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const lessonData = {
      level: document.getElementById('level').value,
      theme: document.getElementById('theme').value,
      date: document.getElementById('date').value,
      reading: document.getElementById('reading').value,
      grammar: {
        title: document.getElementById('grammar-title').value,
        explanation: document.getElementById('grammar-explanation').value,
        examples: document.getElementById('grammar-examples').value.split('\n').filter(e => e.trim())
      },
      vocabulary: document.getElementById('vocabulary').value.split('\n').filter(v => v.trim()).map(v => {
        const [word, translation] = v.split('|').map(s => s.trim());
        return { word, translation };
      }),
      exercise: {
        instruction: document.getElementById('exercise-instruction').value,
        template: document.getElementById('exercise-template').value,
        tips: document.getElementById('exercise-tips').value.split('\n').filter(t => t.trim())
      },
      aiPrompt: document.getElementById('ai-prompt').value
    };
    
    if (currentEditId) {
      lessonService.updateLesson(currentEditId, lessonData);
    } else {
      lessonService.createLesson(lessonData);
    }
    
    modal.classList.add('hidden');
    router.handleRoute(); // Recharger la page
  });
  
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
 * Afficher la prévisualisation
 */
function showPreview(lesson) {
  const previewContent = document.getElementById('preview-content');
  const previewModal = document.getElementById('preview-modal');
  
  previewContent.innerHTML = `
    <div class="preview-lesson">
      <div class="lesson-meta mb-lg">
        <span class="lesson-level">${lesson.level}</span>
        <span class="lesson-date">${new Date(lesson.date).toLocaleDateString('fr-FR')}</span>
      </div>
      
      <h1 class="mb-xl">${lesson.theme}</h1>
      
      <section class="preview-section">
        <h2>📖 Lecture du jour</h2>
        <p>${lesson.reading}</p>
      </section>
      
      <section class="preview-section">
        <h2>📝 ${lesson.grammar.title}</h2>
        <p style="white-space: pre-line;">${lesson.grammar.explanation}</p>
        <ul>
          ${lesson.grammar.examples.map(ex => `<li>${ex}</li>`).join('')}
        </ul>
      </section>
      
      <section class="preview-section">
        <h2>📚 Vocabulaire</h2>
        ${lesson.vocabulary.map(v => `<p><strong>${v.word}</strong> - ${v.translation}</p>`).join('')}
      </section>
      
      <section class="preview-section">
        <h2>🗣️ Exercice oral</h2>
        <p><strong>${lesson.exercise.instruction}</strong></p>
        <div class="exercise-preview">${lesson.exercise.template}</div>
        <ul>
          ${lesson.exercise.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </section>
      
      <section class="preview-section">
        <h2>🤖 Prompt IA</h2>
        <pre>${lesson.aiPrompt}</pre>
      </section>
    </div>
  `;
  
  previewModal.classList.remove('hidden');
}

/**
 * Styles Admin
 */
export const adminPageStyles = `
.admin-page {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - 200px);
}

.admin-actions {
  display: flex;
  justify-content: flex-end;
}

.lessons-table-container {
  padding: var(--spacing-xl);
  overflow-x: auto;
}

.table-responsive {
  overflow-x: auto;
}

.lessons-table {
  width: 100%;
  border-collapse: collapse;
}

.lessons-table th {
  background-color: var(--bg-tertiary);
  padding: var(--spacing-md);
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
  color: var(--text-primary);
}

.lessons-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.lessons-table .actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--primary);
  color: white;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal.hidden {
  display: none;
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
}

.modal-large {
  max-width: 1000px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-tertiary);
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: var(--spacing-xl);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-color);
}

/* Preview */
.preview-lesson {
  line-height: 1.8;
}

.preview-section {
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
}

.preview-section:last-child {
  border-bottom: none;
}

.preview-section h2 {
  margin-bottom: var(--spacing-md);
  color: var(--primary);
}

.exercise-preview {
  background-color: var(--bg-tertiary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin: var(--spacing-md) 0;
  white-space: pre-line;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

@media (max-width: 640px) {
  .admin-page {
    padding: var(--spacing-lg) 0;
  }
  
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .admin-header .btn {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .lessons-table {
    overflow-x: auto;
    display: block;
  }
  
  .lessons-table table {
    min-width: 600px;
  }
  
  .lessons-table .actions {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .lessons-table .actions .btn {
    width: 100%;
    font-size: 0.813rem;
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .modal-content {
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
    max-width: 100%;
    width: 100%;
    padding: var(--spacing-lg);
  }
  
  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .close-modal {
    align-self: flex-end;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .lessons-table {
    overflow-x: auto;
  }
  
  .modal-content {
    max-width: 90%;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .lessons-table .actions {
    flex-direction: column;
  }
  
  .modal-content {
    max-height: 100vh;
    border-radius: 0;
  }
}
`;
