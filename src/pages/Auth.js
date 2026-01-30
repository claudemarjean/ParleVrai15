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
        
        <form id="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              class="form-input" 
              required
              placeholder="ton@email.com"
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
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validation simple
    if (!email || !password) {
      showError('Tous les champs sont requis');
      return;
    }
    
    // Connexion
    const result = await authService.login(email, password);
    
    if (result.success) {
      router.setAuth(true, result.user.isAdmin);
      router.navigate('/dashboard');
    } else {
      showError(result.error || 'Erreur de connexion');
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
        
        <form id="signup-form">
          <div class="form-group">
            <label for="name" class="form-label">Prénom</label>
            <input 
              type="text" 
              id="name" 
              class="form-input" 
              required
              placeholder="Marie"
            />
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              class="form-input" 
              required
              placeholder="ton@email.com"
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
              minlength="6"
            />
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
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      showError('Tous les champs sont requis');
      return;
    }
    
    if (password !== confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 6) {
      showError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    // Inscription
    const result = await authService.signup(email, password, name);
    
    if (result.success) {
      router.setAuth(true, false);
      router.navigate('/dashboard');
    } else {
      showError(result.error || 'Erreur lors de l\'inscription');
    }
  });
  
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
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
}

.auth-card {
  max-width: 500px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
}

.auth-card h1 {
  margin-bottom: var(--spacing-sm);
}
`;
