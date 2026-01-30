/**
 * Service de gestion du thème (clair/sombre)
 */

class ThemeService {
  constructor() {
    this.currentTheme = 'light';
    this.loadTheme();
  }

  /**
   * Charger le thème depuis localStorage ou préférence système
   */
  loadTheme() {
    // Vérifier localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else {
      // Vérifier la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    }
    
    this.applyTheme(this.currentTheme);
  }

  /**
   * Appliquer un thème
   */
  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  /**
   * Basculer entre les thèmes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    return newTheme;
  }

  /**
   * Obtenir le thème actuel
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Définir un thème spécifique
   */
  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.applyTheme(theme);
    }
  }

  /**
   * Vérifier si le mode sombre est actif
   */
  isDark() {
    return this.currentTheme === 'dark';
  }
}

// Exporter une instance unique
const themeService = new ThemeService();
export default themeService;
