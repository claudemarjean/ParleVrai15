# 🎨 Guide des Thèmes - ParleVrai15

## Vue d'ensemble
L'application ParleVrai15 supporte maintenant **deux thèmes** :
- **Mode Clair** (par défaut)
- **Mode Sombre**

Le thème sélectionné est sauvegardé dans le `localStorage` et se souvient de votre préférence.

## 🔄 Comment Changer de Thème

### Pour l'utilisateur
1. Cliquez sur le bouton **🌙** (lune) ou **☀️** (soleil) dans le header
2. Le thème change instantanément
3. Votre préférence est automatiquement sauvegardée

### Par défaut
- Si aucun thème n'est sauvegardé, l'application utilise la préférence système
- Sur macOS/Windows : Suit le réglage Apparence système
- Sinon : Mode clair par défaut

## 🎨 Variables CSS des Thèmes

### Variables Principales

#### Arrière-plans
```css
--bg-primary      /* Fond principal des sections */
--bg-secondary    /* Fond de la page */
--bg-tertiary     /* Fond des éléments tertiaires */
--card-bg         /* Fond des cartes */
--input-bg        /* Fond des champs de formulaire */
--header-bg       /* Fond du header */
--footer-bg       /* Fond du footer */
```

#### Textes
```css
--text-primary    /* Texte principal (titres) */
--text-secondary  /* Texte secondaire (paragraphes) */
--text-tertiary   /* Texte tertiaire (labels) */
--text-muted      /* Texte atténué */
--footer-text     /* Texte du footer */
```

#### Bordures
```css
--border-color    /* Couleur des bordures */
--border-hover    /* Couleur au survol */
--input-border    /* Bordure des inputs */
```

#### Ombres
```css
--shadow-color    /* Couleur des ombres */
--shadow-light    /* Ombres légères */
```

### Valeurs Mode Clair

```css
--bg-primary: #ffffff
--bg-secondary: #f9fafb
--bg-tertiary: #f3f4f6
--text-primary: #111827
--text-secondary: #374151
--text-tertiary: #6b7280
--border-color: #e5e7eb
```

### Valeurs Mode Sombre

```css
--bg-primary: #1f2937
--bg-secondary: #111827
--bg-tertiary: #0f172a
--text-primary: #f9fafb
--text-secondary: #e5e7eb
--text-tertiary: #d1d5db
--border-color: #374151
```

## 📦 Service de Thème

### Utilisation

```javascript
import themeService from './services/theme.js';

// Obtenir le thème actuel
const theme = themeService.getCurrentTheme(); // 'light' ou 'dark'

// Basculer entre les thèmes
themeService.toggleTheme();

// Définir un thème spécifique
themeService.setTheme('dark');
themeService.setTheme('light');

// Vérifier si mode sombre
if (themeService.isDark()) {
  // Code spécifique au mode sombre
}
```

### Méthodes Disponibles

| Méthode | Description | Retour |
|---------|-------------|--------|
| `loadTheme()` | Charge le thème depuis localStorage ou système | void |
| `toggleTheme()` | Bascule entre clair et sombre | string (nouveau thème) |
| `getCurrentTheme()` | Obtient le thème actuel | 'light' \| 'dark' |
| `setTheme(theme)` | Définit un thème spécifique | void |
| `isDark()` | Vérifie si mode sombre actif | boolean |

## 🎯 Application du Thème

Le thème est appliqué via l'attribut `data-theme` sur l'élément `<html>` :

```html
<!-- Mode clair -->
<html data-theme="light">

<!-- Mode sombre -->
<html data-theme="dark">
```

Toutes les variables CSS sont automatiquement mises à jour via :

```css
/* Mode clair (par défaut) */
:root {
  --bg-primary: #ffffff;
  /* ... */
}

/* Mode sombre */
[data-theme="dark"] {
  --bg-primary: #1f2937;
  /* ... */
}
```

## 🔧 Ajouter un Nouveau Composant

Pour qu'un nouveau composant supporte les deux thèmes :

### ✅ À FAIRE
```css
/* Utiliser les variables CSS */
.mon-composant {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

### ❌ À ÉVITER
```css
/* Couleurs en dur */
.mon-composant {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #e5e7eb;
}
```

## 🎨 Cohérence des Couleurs

### Couleurs Toujours Identiques (Non Thématisées)

Ces couleurs restent identiques quel que soit le thème :

```css
--primary: #2563eb        /* Bleu principal */
--primary-dark: #1e40af   /* Bleu foncé */
--primary-light: #60a5fa  /* Bleu clair */
--secondary: #10b981      /* Vert */
--accent: #f59e0b         /* Orange */
--success: #10b981        /* Succès */
--error: #ef4444          /* Erreur */
--warning: #f59e0b        /* Avertissement */
```

### Quand Utiliser Quoi

| Élément | Variable CSS | Exemple |
|---------|--------------|---------|
| Fond de page | `--bg-secondary` | Body |
| Fond de carte | `--card-bg` | Cards, Modals |
| Fond de section | `--bg-primary` | Sections blanches |
| Titre principal | `--text-primary` | h1, h2, h3 |
| Texte de paragraphe | `--text-secondary` | p, span |
| Label de formulaire | `--text-tertiary` | labels |
| Texte désactivé | `--text-muted` | disabled text |
| Bordure normale | `--border-color` | borders |
| Fond d'input | `--input-bg` | input, textarea |

## 🚀 Transitions

Tous les éléments ont des transitions fluides lors du changement de thème :

```css
body {
  transition: background-color var(--transition-normal), 
              color var(--transition-normal);
}

.card {
  transition: background-color var(--transition-normal),
              box-shadow var(--transition-normal);
}
```

## 📱 Responsive

Le toggle de thème est adaptatif :
- **Desktop** : Bouton icône dans la navigation
- **Mobile** : Icône pleine largeur dans le menu hamburger

## 🐛 Dépannage

### Le thème ne change pas
1. Vérifier que le JavaScript est activé
2. Vérifier la console pour les erreurs
3. Vider le localStorage : `localStorage.clear()`

### Les couleurs sont incorrectes
1. Vérifier que l'élément utilise les variables CSS
2. S'assurer que `data-theme` est sur `<html>`
3. Vérifier que les transitions n'interfèrent pas

### Le thème n'est pas sauvegardé
1. Vérifier que localStorage est disponible
2. Vérifier les permissions du navigateur
3. Tester en navigation privée désactivée

## 🎨 Personnalisation Future

Pour ajouter un nouveau thème (ex: "high-contrast") :

```css
[data-theme="high-contrast"] {
  --bg-primary: #000000;
  --text-primary: #ffffff;
  /* ... */
}
```

Puis modifier le service :
```javascript
setTheme(theme) {
  if (['light', 'dark', 'high-contrast'].includes(theme)) {
    this.applyTheme(theme);
  }
}
```

## 📊 Accessibilité

- ✅ Contraste WCAG AAA en mode clair
- ✅ Contraste WCAG AAA en mode sombre
- ✅ Bouton avec `aria-label`
- ✅ Support clavier complet
- ✅ Respect des préférences système
- ✅ Animations réduites si `prefers-reduced-motion`

---

**Version** : 1.0.0  
**Dernière mise à jour** : 30 janvier 2026
