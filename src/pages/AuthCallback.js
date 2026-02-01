/**
 * Page de callback après confirmation email
 * Cette page est affichée quand l'utilisateur clique sur le lien dans l'email
 */

import { supabase } from '../services/supabaseClient.js';
import router from '../router/index.js';
import authService from '../services/auth.js';

/**
 * Gérer le callback de confirmation email
 */
export async function handleAuthCallback() {
  console.log('🔄 Traitement du callback de confirmation email...');
  
  // Afficher un message de chargement
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      text-align: center;
    ">
      <div style="max-width: 500px;">
        <div class="spinner" style="
          width: 50px;
          height: 50px;
          border: 4px solid #f3f4f6;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 2rem;
        "></div>
        <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">
          Vérification de votre email...
        </h1>
        <p style="color: #6b7280;">
          Veuillez patienter pendant que nous confirmons votre compte.
        </p>
      </div>
    </div>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  try {
    // Supabase gère automatiquement le callback via l'URL
    // On récupère juste la session mise à jour
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Erreur lors de la récupération de la session:', error);
      showError('Erreur lors de la confirmation de votre email.');
      return;
    }

    if (!session) {
      console.warn('⚠️ Pas de session trouvée après callback');
      showError('Session expirée. Veuillez vous reconnecter.');
      return;
    }

    console.log('✅ Session confirmée pour:', session.user.email);

    // Créer/vérifier l'accès à l'application
    const accessResult = await authService.ensureUserAppAccess(session.user.id);
    
    if (!accessResult.success) {
      console.error('❌ Erreur création accès:', accessResult.error);
      showError('Erreur lors de la configuration de votre compte.');
      return;
    }

    // Charger les données de l'utilisateur
    await authService.loadUserData(session.user.id);

    // Afficher un message de succès
    showSuccess();

    // Rediriger vers le dashboard après 2 secondes
    setTimeout(() => {
      router.setAuth(true, authService.isAdmin());
      router.navigate('/dashboard');
    }, 2000);

  } catch (error) {
    console.error('❌ Erreur inattendue dans handleAuthCallback:', error);
    showError('Une erreur inattendue s\'est produite.');
  }
}

/**
 * Afficher un message de succès
 */
function showSuccess() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      text-align: center;
    ">
      <div style="max-width: 500px;">
        <div style="
          width: 80px;
          height: 80px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
        ">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #10b981;">
          Email confirmé ! 🎉
        </h1>
        <p style="color: #6b7280; margin-bottom: 1rem;">
          Votre compte a été confirmé avec succès.
        </p>
        <p style="color: #9ca3af; font-size: 0.875rem;">
          Redirection vers votre tableau de bord...
        </p>
      </div>
    </div>
  `;
}

/**
 * Afficher un message d'erreur
 */
function showError(message) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      text-align: center;
    ">
      <div style="max-width: 500px;">
        <div style="
          width: 80px;
          height: 80px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
        ">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #ef4444;">
          Erreur
        </h1>
        <p style="color: #6b7280; margin-bottom: 2rem;">
          ${message}
        </p>
        <a href="/login" data-link 
           style="
             display: inline-block;
             padding: 0.75rem 2rem;
             background: #3b82f6;
             color: white;
             text-decoration: none;
             border-radius: 0.5rem;
             font-weight: 600;
           ">
          Retour à la connexion
        </a>
      </div>
    </div>
  `;

  // Attacher le router au lien
  setTimeout(() => {
    const link = document.querySelector('[data-link]');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate('/login');
      });
    }
  }, 100);
}

/**
 * Rendu de la page callback (appelé par le router)
 */
export function renderAuthCallbackPage() {
  handleAuthCallback();
}
