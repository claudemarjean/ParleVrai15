/**
 * Service d'authentification
 * Préparé pour intégration Supabase
 */

class AuthService {
  constructor() {
    this.user = null;
    this.loadUser();
  }

  /**
   * Charger l'utilisateur depuis le localStorage
   */
  loadUser() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  /**
   * Inscription
   * TODO: Intégrer Supabase Auth
   */
  async signup(email, password, name) {
    try {
      // Simulation - À remplacer par Supabase
      const user = {
        id: Date.now(),
        email,
        name,
        isAdmin: false,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      this.user = user;
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Connexion
   * TODO: Intégrer Supabase Auth
   */
  async login(email, password) {
    try {
      // Simulation - À remplacer par Supabase
      const user = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        isAdmin: email.includes('admin'),
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      this.user = user;
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Déconnexion
   */
  async logout() {
    localStorage.removeItem('user');
    this.user = null;
    return { success: true };
  }

  /**
   * Récupérer l'utilisateur actuel
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated() {
    return this.user !== null;
  }

  /**
   * Vérifier si l'utilisateur est admin
   */
  isAdmin() {
    return this.user?.isAdmin || false;
  }
}

export default new AuthService();
