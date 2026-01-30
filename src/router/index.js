/**
 * Router simple pour Vanilla JavaScript
 * Gère la navigation SPA
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.isAuthenticated = false;
    this.isAdmin = false;
    
    // Écouter les changements d'URL
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Intercepter les clics sur les liens
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigate(e.target.href);
      }
    });
  }

  /**
   * Enregistrer une route
   */
  addRoute(path, handler, requireAuth = false, requireAdmin = false) {
    this.routes[path] = {
      handler,
      requireAuth,
      requireAdmin
    };
  }

  /**
   * Naviguer vers une route
   */
  navigate(path) {
    window.history.pushState(null, null, path);
    this.handleRoute();
  }

  /**
   * Gérer le routage
   */
  async handleRoute() {
    const path = window.location.pathname;
    
    // Route par défaut
    let route = this.routes[path] || this.routes['/404'];
    
    // Vérifier l'authentification
    if (route && route.requireAuth && !this.isAuthenticated) {
      this.navigate('/login');
      return;
    }
    
    // Vérifier les droits admin
    if (route && route.requireAdmin && !this.isAdmin) {
      this.navigate('/dashboard');
      return;
    }
    
    // Exécuter le handler de la route
    if (route) {
      this.currentRoute = path;
      await route.handler();
    }
  }

  /**
   * Définir l'état d'authentification
   */
  setAuth(isAuthenticated, isAdmin = false) {
    this.isAuthenticated = isAuthenticated;
    this.isAdmin = isAdmin;
  }

  /**
   * Vérifier l'authentification
   */
  checkAuth() {
    // TODO: Vérifier avec Supabase
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.setAuth(true, userData.isAdmin || false);
      return true;
    }
    return false;
  }

  /**
   * Déconnexion
   */
  logout() {
    localStorage.removeItem('user');
    this.setAuth(false, false);
    this.navigate('/');
  }
}

export default new Router();
