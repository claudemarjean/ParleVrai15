/**
 * Composant Header
 */

import themeService from '../services/theme.js';

export function createHeader(isAuthenticated = false, isAdmin = false) {
  const header = document.createElement('header');
  header.className = 'header';
  
  const currentTheme = themeService.getCurrentTheme();
  const themeIcon = currentTheme === 'dark' ? '☀️' : '🌙';
  
  header.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <a href="/" class="logo" data-link>
            ParleVrai<span class="logo-accent">15</span>
          </a>
          
          <div class="nav-links">
            ${isAuthenticated ? `
              <a href="/dashboard" class="nav-link" data-link>Tableau de bord</a>
              <a href="/lesson" class="nav-link" data-link>Leçon du jour</a>
              <a href="/calendar" class="nav-link" data-link>Calendrier</a>
              <a href="/stats" class="nav-link" data-link>Statistiques</a>
              ${isAdmin ? `<a href="/admin" class="nav-link" data-link>Admin</a>` : ''}
              <button id="theme-toggle" class="btn-icon" title="Changer de thème" aria-label="Basculer le thème">
                ${themeIcon}
              </button>
              <button id="logout-btn" class="btn btn-secondary btn-sm">Déconnexion</button>
            ` : `
              <button id="theme-toggle" class="btn-icon" title="Changer de thème" aria-label="Basculer le thème">
                ${themeIcon}
              </button>
              <a href="/login" class="btn btn-secondary btn-sm" data-link>Se connecter</a>
              <a href="/signup" class="btn btn-primary btn-sm" data-link>S'inscrire</a>
            `}
          </div>
          
          <button class="mobile-menu-btn" id="mobile-menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  `;
  
  // Attacher les événements
  setTimeout(() => {
    // Changement de thème
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const newTheme = themeService.toggleTheme();
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      });
    }
    
    // Déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        // Importer authService dynamiquement pour éviter les dépendances circulaires
        const { default: authService } = await import('../services/auth.js');
        
        logoutBtn.disabled = true;
        logoutBtn.textContent = 'Déconnexion...';
        
        const result = await authService.logout();
        
        if (!result.success) {
          console.error('Erreur lors de la déconnexion');
          logoutBtn.disabled = false;
          logoutBtn.textContent = 'Déconnexion';
        }
        // Si succès, authService déclenchera onAuthStateChange qui redirigera vers home
      });
    }
  }, 0);
  
  return header;
}

/**
 * Styles pour le header
 */
export const headerStyles = `
.header {
  background-color: var(--header-bg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color var(--transition-normal);
  border-bottom: 1px solid var(--border-color);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.logo-accent {
  color: var(--primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--primary);
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.btn-icon:hover {
  background-color: var(--bg-tertiary);
  transform: scale(1.1);
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
}

.mobile-menu-btn span {
  width: 24px;
  height: 2px;
  background-color: var(--text-primary);
  transition: all var(--transition-fast);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--header-bg);
    flex-direction: column;
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-md);
    width: 100%;
    gap: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
  }
  
  .nav-links.active {
    display: flex;
  }
  
  .nav-links .btn {
    width: 100%;
    justify-content: center;
  }
  
  .nav-links .btn-icon {
    width: 100%;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .logo {
    font-size: 1.25rem;
  }
  
  .navbar-content {
    padding: var(--spacing-sm) 0;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .nav-links {
    gap: var(--spacing-md);
  }
  
  .nav-link {
    font-size: 0.875rem;
  }
  
  .logo {
    font-size: 1.375rem;
  }
}
`;
