/**
 * Composant Footer
 */

export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>ParleVrai<span class="logo-accent">15</span></h3>
          <p class="text-gray">Parler français, pour de vrai.</p>
        </div>
        
        <div class="footer-section">
          <h4>Navigation</h4>
          <ul class="footer-links">
            <li><a href="/" data-link>Accueil</a></li>
            <li><a href="/login" data-link>Se connecter</a></li>
            <li><a href="/signup" data-link>S'inscrire</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>À propos</h4>
          <ul class="footer-links">
            <li><a href="#" data-link>Notre méthode</a></li>
            <li><a href="#" data-link>Contact</a></li>
            <li><a href="#" data-link>Mentions légales</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ParleVrai15. Tous droits réservés.</p>
      </div>
    </div>
  `;
  
  return footer;
}

/**
 * Styles pour le footer
 */
export const footerStyles = `
.footer {
  background-color: var(--footer-bg);
  color: var(--footer-text);
  margin-top: auto;
  padding: var(--spacing-3xl) 0 var(--spacing-lg);
  transition: background-color var(--transition-normal), color var(--transition-normal);
  border-top: 1px solid var(--border-color);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.footer-section h3,
.footer-section h4 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1rem;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: var(--spacing-sm);
}

.footer-links a {
  color: var(--text-tertiary);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--primary-light);
}

.footer-bottom {
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .footer {
    padding: var(--spacing-2xl) 0 var(--spacing-md);
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    text-align: center;
  }
  
  .footer-section h3,
  .footer-section h4 {
    font-size: 0.938rem;
  }
  
  .footer-links {
    margin-bottom: var(--spacing-md);
  }
  
  .footer-bottom {
    font-size: 0.875rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-section:first-child {
    grid-column: 1 / -1;
    text-align: center;
  }
}
`;
