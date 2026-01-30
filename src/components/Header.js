/**
 * Composant Header
 */

export function createHeader(isAuthenticated = false, isAdmin = false) {
  const header = document.createElement('header');
  header.className = 'header';
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
              <button id="logout-btn" class="btn btn-secondary btn-sm">Déconnexion</button>
            ` : `
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
  
  return header;
}

/**
 * Styles pour le header
 */
export const headerStyles = `
.header {
  background-color: white;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
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
  color: var(--gray-900);
  text-decoration: none;
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
  color: var(--gray-700);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--primary);
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
  background-color: var(--gray-700);
  transition: all var(--transition-fast);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    flex-direction: column;
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-md);
    width: 100%;
    gap: var(--spacing-md);
  }
  
  .nav-links.active {
    display: flex;
  }
  
  .nav-links .btn {
    width: 100%;
    justify-content: center;
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
