import router from '../router/index.js';
import authService from '../services/auth.js';
import { createHeader } from '../components/Header.js';
import { createFooter } from '../components/Footer.js';

/**
 * Page de connexion
 */

export function renderLoginPage() {
  const app = document.getElementById('app');
  
  app.innerHTML = '';
  
  // Header
  const header = createHeader(false, false);
  app.appendChild(header);
  
  // Main content
  const main = document.createElement('main');
  main.className = 'auth-page';
  main.innerHTML = `
    <div class="container container-xs">
      <div class="auth-card card fade-in">
        <h1 class="text-center">Connexion</h1>
        <p class="text-center text-gray mb-xl">
          Bienvenue ! Connecte-toi pour continuer ta progression.
        </p>
        
        <form id="login-form" novalidate>
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              class="form-input" 
              required
              placeholder="ton@email.com"
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              autocomplete="email"
            />
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              class="form-input" 
              required
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>
          
          <div id="error-message" class="form-error hidden"></div>
          
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
            Se connecter
          </button>
        </form>
        
        <p class="text-center mt-lg">
          Pas encore de compte ? 
          <a href="/signup" data-link class="text-primary font-semibold">S'inscrire</a>
        </p>
      </div>
    </div>
  `;
  
  app.appendChild(main);
  
  // Footer
  const footer = createFooter();
  app.appendChild(footer);
  
  // Attacher les événements
  attachLoginEvents();
}

/**
 * Attacher les événements
 */
function attachLoginEvents() {
  const form = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const submitButton = form.querySelector('button[type="submit"]');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validation simple
    if (!email || !password) {
      showError('Tous les champs sont requis');
      return;
    }
    
    // Désactiver le bouton pendant le traitement
    submitButton.disabled = true;
    submitButton.textContent = 'Connexion...';
    errorMessage.classList.add('hidden');
    
    try {
      // Connexion
      const result = await authService.login(email, password);
      
      if (result.success) {
        router.setAuth(true, result.user.isAdmin);
        router.navigate('/dashboard');
      } else {
        showError(result.error || 'Erreur de connexion');
      }
    } catch (error) {
      showError('Une erreur inattendue s\'est produite');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Se connecter';
    }
  });
  
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }
}

/**
 * Page d'inscription
 */

export function renderSignupPage() {
  const app = document.getElementById('app');
  
  app.innerHTML = '';
  
  // Header
  const header = createHeader(false, false);
  app.appendChild(header);
  
  // Main content
  const main = document.createElement('main');
  main.className = 'auth-page';
  main.innerHTML = `
    <div class="container container-xs">
      <div class="auth-card card fade-in">
        <h1 class="text-center">Inscription</h1>
        <p class="text-center text-gray mb-xl">
          Commence à parler français dès aujourd'hui !
        </p>
        
        <form id="signup-form" novalidate>
          <div class="form-group">
            <label for="name" class="form-label">Prénom</label>
            <input 
              type="text" 
              id="name" 
              class="form-input" 
              required
              placeholder="Marie"
              minlength="2"
              maxlength="50"
              autocomplete="given-name"
            />
            <small class="form-help">Au moins 2 caractères</small>
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              class="form-input" 
              required
              placeholder="ton@email.com"
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              autocomplete="email"
            />
            <small class="form-help">Format : exemple@domaine.com</small>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              class="form-input" 
              required
              placeholder="••••••••"
              minlength="6"
              maxlength="72"
              autocomplete="new-password"
            />
            <small class="form-help">Minimum 6 caractères</small>
          </div>
          
          <div class="form-group">
            <label for="confirm-password" class="form-label">Confirmer le mot de passe</label>
            <input 
              type="password" 
              id="confirm-password" 
              class="form-input" 
              required
              placeholder="••••••••"
              minlength="6"
              maxlength="72"
              autocomplete="new-password"
            />
          </div>
          
          <div id="error-message" class="form-error hidden"></div>
          
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
            Créer mon compte
          </button>
        </form>
        
        <p class="text-center mt-lg">
          Déjà un compte ? 
          <a href="/login" data-link class="text-primary font-semibold">Se connecter</a>
        </p>
      </div>
    </div>
  `;
  
  app.appendChild(main);
  
  // Footer
  const footer = createFooter();
  app.appendChild(footer);
  
  // Attacher les événements
  attachSignupEvents();
}

/**
 * Attacher les événements d'inscription
 */
function attachSignupEvents() {
  const form = document.getElementById('signup-form');
  const errorMessage = document.getElementById('error-message');
  const submitButton = form.querySelector('button[type="submit"]');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupérer et nettoyer les valeurs
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation du prénom
    if (!name || name.length < 2) {
      showError('Le prénom doit contenir au moins 2 caractères');
      return;
    }
    
    // Validation de l'email
    if (!email) {
      showError('L\'email est requis');
      return;
    }
    
    // Validation format email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showError('Format d\'email invalide. Utilisez le format : exemple@domaine.com');
      return;
    }
    
    // Validation du mot de passe
    if (!password || password.length < 6) {
      showError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (password.length > 72) {
      showError('Le mot de passe ne peut pas dépasser 72 caractères');
      return;
    }
    
    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Désactiver le bouton pendant le traitement
    submitButton.disabled = true;
    submitButton.textContent = 'Création du compte...';
    errorMessage.classList.add('hidden');
    
    try {
      // Inscription
      const result = await authService.signup(email, password, name);
      
      if (result.success) {
        // Si confirmation email nécessaire
        if (result.needsEmailConfirmation) {
          showSuccess('✅ Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
          setTimeout(() => {
            router.navigate('/login');
          }, 3000);
        } else {
          // Connexion directe si pas de confirmation requise
          showSuccess('✅ Compte créé avec succès ! Redirection...');
          router.setAuth(true, result.user?.isAdmin || false);
          setTimeout(() => {
            router.navigate('/dashboard');
          }, 800);
        }
      } else {
        showError(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      showError('Une erreur inattendue s\'est produite');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Créer mon compte';
    }
  });
  
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.style.color = 'var(--color-error, #dc2626)';
  }
  
  function showSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.style.color = 'var(--color-success, #16a34a)';
  }
}

/**
 * Styles pour les pages d'authentification
 */
export const authPageStyles = `
.auth-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  padding: var(--spacing-3xl) 0;
  width: 100%;
}

.auth-card {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-2xl);
}

.auth-card h1 {
  margin-bottom: var(--spacing-sm);
}

.form-help {
  display: block;
  margin-top: var(--spacing-xs, 0.25rem);
  font-size: 0.875rem;
  color: var(--color-text-muted, #6b7280);
  font-style: italic;
}

.form-input:focus + .form-help {
  color: var(--color-primary, #3b82f6);
}

.form-input:invalid:not(:placeholder-shown) {
  border-color: var(--color-error, #dc2626);
}

.form-input:valid:not(:placeholder-shown) {
  border-color: var(--color-success, #16a34a);
}

@media (max-width: 640px) {
  .auth-page {
    padding: var(--spacing-xl) 0;
    align-items: flex-start;
  }
  
  .auth-card {
    padding: var(--spacing-lg);
    box-shadow: none;
  }
  
  .auth-card h1 {
    font-size: 1.5rem;
  }
  
  .form-group {
    margin-bottom: var(--spacing-md);
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .auth-page {
    padding: var(--spacing-2xl) 0;
  }
  
  .auth-card {
    padding: var(--spacing-xl);
  }
}
`;
