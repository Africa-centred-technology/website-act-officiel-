# 🌗 Roadmap : Implémentation du Mode Clair

## 📋 Vue d'ensemble

**Objectif** : Ajouter un mode clair (light mode) complet au site ACT avec un toggle permettant de basculer entre mode sombre et mode clair.

**État actuel** : Site entièrement en mode sombre (`background: #070E1C`)

**État cible** : Site avec :
- Mode sombre par défaut (actuel)
- Mode clair disponible
- Toggle pour basculer entre les deux
- Préférence sauvegardée dans localStorage
- Détection automatique de la préférence système

**Durée estimée** : 3-5 jours de développement

---

## 🎯 Objectifs stratégiques

### Pourquoi un mode clair ?

1. **Accessibilité** : Certains utilisateurs préfèrent le mode clair
2. **Environnements lumineux** : Meilleure lisibilité en plein jour
3. **Fatigue oculaire** : Options pour différentes préférences visuelles
4. **Standard moderne** : Attendu sur les sites professionnels 2025
5. **SEO** : Amélioration de l'expérience utilisateur

---

## 📊 Phases d'implémentation

### Phase 1 : Préparation et Architecture (Jour 1)
### Phase 2 : Système de thème de base (Jour 2)
### Phase 3 : Adaptation des composants (Jour 3-4)
### Phase 4 : Tests et optimisation (Jour 5)
### Phase 5 : Déploiement (Jour 5)

---

## 🔧 Phase 1 : Préparation et Architecture

### Durée : 1 jour

### 1.1 Analyse de l'existant

**Tâches** :
- [x] Auditer tous les fichiers utilisant des couleurs en dur
- [x] Identifier les composants à adapter
- [x] Lister toutes les variables CSS actuelles
- [x] Documenter la palette de couleurs actuelle

**Fichiers à auditer** :
```
src/app/globals.css
src/components/home2/
src/components/poles/
src/components/formations/
src/components/services/
src/components/layout/
```

**Palette actuelle** :
```css
--background: #070E1C (sombre)
--text: #FFFFFF (blanc)
--accent: #D35400 (orange ACT)
--text-secondary: rgba(255,255,255,0.7)
```

### 1.2 Définir la palette de couleurs du mode clair

**Couleurs proposées** :

| Élément | Mode sombre (actuel) | Mode clair (nouveau) |
|---------|---------------------|---------------------|
| Background principal | `#070E1C` | `#FFFFFF` |
| Background secondaire | `rgba(255,255,255,0.02)` | `#F8F9FA` |
| Texte principal | `#FFFFFF` | `#1A1A1A` |
| Texte secondaire | `rgba(255,255,255,0.7)` | `rgba(0,0,0,0.7)` |
| Accent (orange ACT) | `#D35400` | `#D35400` (même) |
| Bordures | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.1)` |
| Cards background | `rgba(255,255,255,0.03)` | `#FFFFFF` |
| Hover background | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.05)` |

### 1.3 Architecture technique

**Structure à implémenter** :

```
src/
├── contexts/
│   └── ThemeContext.tsx          # Context pour le thème
├── hooks/
│   └── useTheme.ts               # Hook personnalisé
├── components/
│   └── ui/
│       └── ThemeToggle.tsx       # Bouton toggle
└── app/
    └── globals.css               # Variables CSS pour les deux thèmes
```

**Technologies utilisées** :
- React Context API pour la gestion du thème
- CSS Variables pour les couleurs dynamiques
- localStorage pour la persistance
- `prefers-color-scheme` pour la détection système

---

## 🎨 Phase 2 : Système de thème de base

### Durée : 1 jour

### 2.1 Créer les variables CSS pour les deux thèmes

**Fichier** : `src/app/globals.css`

```css
/* Variables communes */
:root {
  /* Couleurs de marque (invariables) */
  --color-orange-act: #D35400;
  --color-green-formation: #16a34a;

  /* Polices */
  --font-display: "Lora", serif;
  --font-body: "Poppins", sans-serif;
}

/* Mode sombre (par défaut) */
[data-theme="dark"] {
  --bg-primary: #070E1C;
  --bg-secondary: rgba(255,255,255,0.02);
  --bg-tertiary: rgba(255,255,255,0.03);
  --bg-hover: rgba(255,255,255,0.05);

  --text-primary: #FFFFFF;
  --text-secondary: rgba(255,255,255,0.7);
  --text-tertiary: rgba(255,255,255,0.5);

  --border-primary: rgba(255,255,255,0.1);
  --border-secondary: rgba(255,255,255,0.08);

  --shadow: rgba(0,0,0,0.5);
}

/* Mode clair */
[data-theme="light"] {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8F9FA;
  --bg-tertiary: #F1F3F5;
  --bg-hover: rgba(0,0,0,0.05);

  --text-primary: #1A1A1A;
  --text-secondary: rgba(0,0,0,0.7);
  --text-tertiary: rgba(0,0,0,0.5);

  --border-primary: rgba(0,0,0,0.1);
  --border-secondary: rgba(0,0,0,0.08);

  --shadow: rgba(0,0,0,0.1);
}

/* Application des couleurs */
body {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

### 2.2 Créer le ThemeContext

**Fichier** : `src/contexts/ThemeContext.tsx`

```typescript
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Charger le thème au montage
  useEffect(() => {
    setMounted(true);

    // 1. Vérifier localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;

    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // 2. Détecter la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Appliquer le thème au document
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Éviter le flash pendant l'hydratation
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 2.3 Créer le hook useTheme

**Fichier** : `src/hooks/useTheme.ts`

```typescript
'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
```

### 2.4 Créer le bouton ThemeToggle

**Fichier** : `src/components/ui/ThemeToggle.tsx`

```typescript
'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Passer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
      style={{
        position: 'relative',
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        border: '1px solid var(--border-primary)',
        background: 'var(--bg-secondary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      {theme === 'dark' ? (
        <Sun size={20} color="var(--text-primary)" />
      ) : (
        <Moon size={20} color="var(--text-primary)" />
      )}
    </motion.button>
  );
}
```

### 2.5 Intégrer le ThemeProvider dans l'application

**Fichier** : `src/app/layout.tsx`

```typescript
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2.6 Ajouter le toggle dans le Header

**Fichier** : `src/components/layout/Header.tsx`

```typescript
import ThemeToggle from '@/components/ui/ThemeToggle';

// Dans le Header, ajouter :
<div className="header-actions">
  <ThemeToggle />
  {/* Autres boutons... */}
</div>
```

---

## 🔄 Phase 3 : Adaptation des composants

### Durée : 2 jours

### 3.1 Remplacer les couleurs en dur par des variables CSS

**Stratégie** :
1. Chercher tous les `background: '#070E1C'`
2. Remplacer par `background: 'var(--bg-primary)'`
3. Faire de même pour toutes les couleurs

**Script de recherche** :
```bash
# Trouver tous les fichiers avec des couleurs en dur
grep -r "#070E1C" src/
grep -r "#FFFFFF" src/
grep -r "rgba(255,255,255" src/
```

**Remplacement systématique** :

| Ancien | Nouveau |
|--------|---------|
| `background: '#070E1C'` | `background: 'var(--bg-primary)'` |
| `color: '#FFFFFF'` | `color: 'var(--text-primary)'` |
| `color: 'rgba(255,255,255,0.7)'` | `color: 'var(--text-secondary)'` |
| `border: '1px solid rgba(255,255,255,0.1)'` | `border: '1px solid var(--border-primary)'` |

### 3.2 Composants prioritaires à adapter

#### Niveau 1 : Layout (Jour 3 matin)
- [ ] `Header.tsx`
- [ ] `Footer.tsx` / `FooterStrip.tsx`
- [ ] `Sidebar.tsx` (si existe)

#### Niveau 2 : Pages principales (Jour 3 après-midi)
- [ ] `HomePage` / `Home2Shell.tsx`
- [ ] `AboutShell.tsx`
- [ ] `ContactShell.tsx`

#### Niveau 3 : Pôles (Jour 4 matin)
- [ ] `PoleDeveloppementShell.tsx`
- [ ] `PoleConseilShell.tsx`
- [ ] `PoleFormationShell.tsx`
- [ ] `PolesIndexShell.tsx`

#### Niveau 4 : Formations et Services (Jour 4 après-midi)
- [ ] `FormationsShell.tsx`
- [ ] `FormationDetailShell.tsx`
- [ ] `ServicesShell.tsx`
- [ ] `ServiceDetailShell.tsx`

### 3.3 Composants UI réutilisables

- [ ] `CTAButton.tsx`
- [ ] `CTASection.tsx`
- [ ] Tous les composants dans `src/components/ui/`

### 3.4 Cas particuliers : Backgrounds complexes

**WaveTerrain, Grain, Cursor** :

Ces composants créent des effets de fond. Il faut :
1. Détecter le thème actuel
2. Adapter l'opacité et les couleurs

```typescript
// Exemple pour WaveTerrain.tsx
const { theme } = useTheme();

const waveColor = theme === 'dark'
  ? 'rgba(211, 84, 0, 0.1)'
  : 'rgba(211, 84, 0, 0.05)';
```

---

## 🧪 Phase 4 : Tests et optimisation

### Durée : 1 jour

### 4.1 Tests fonctionnels

**Checklist de test** :

#### Navigation
- [ ] Header s'adapte correctement
- [ ] Footer s'adapte correctement
- [ ] Menu mobile fonctionne dans les deux thèmes

#### Pages
- [ ] Home : tous les éléments lisibles
- [ ] About : texte et images contrastés
- [ ] Pôles : cartes bien contrastées
- [ ] Formations : filtres et cartes lisibles
- [ ] Services : toutes sections adaptées
- [ ] Contact : formulaire accessible

#### Composants
- [ ] Boutons visibles et cliquables
- [ ] Cards avec bon contraste
- [ ] Modals/Popups adaptés
- [ ] Formulaires lisibles

### 4.2 Tests d'accessibilité

**Contraste** :
- [ ] Ratio de contraste ≥ 4.5:1 pour le texte normal
- [ ] Ratio de contraste ≥ 3:1 pour le texte large
- [ ] Tester avec WebAIM Contrast Checker

**Navigation** :
- [ ] Toggle accessible au clavier (Tab)
- [ ] Focus visible sur le toggle
- [ ] Changement de thème annoncé aux lecteurs d'écran

### 4.3 Tests de performance

- [ ] Pas de flash lors du chargement (FOUC)
- [ ] Transition fluide entre thèmes
- [ ] localStorage fonctionne
- [ ] Détection système fonctionne

### 4.4 Tests multi-navigateurs

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile (iOS/Android)

### 4.5 Optimisations

**Performance** :
```typescript
// Éviter le FOUC avec un script inline dans <head>
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      const theme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  `
}} />
```

**Transitions** :
```css
/* Transitions fluides */
* {
  transition: background-color 0.3s ease,
              color 0.3s ease,
              border-color 0.3s ease;
}

/* Désactiver les transitions au chargement */
.no-transition * {
  transition: none !important;
}
```

---

## 🚀 Phase 5 : Déploiement

### Durée : 0.5 jour

### 5.1 Préparation

- [ ] Créer une branche `feature/light-mode`
- [ ] Commiter tous les changements
- [ ] Tester en local une dernière fois

### 5.2 Documentation

- [ ] Mettre à jour le README avec les infos sur le thème
- [ ] Documenter le ThemeContext et useTheme
- [ ] Ajouter des exemples d'utilisation

### 5.3 Review et merge

- [ ] Code review par l'équipe
- [ ] Corrections si nécessaires
- [ ] Merge vers `main`

### 5.4 Déploiement en production

- [ ] Deploy sur staging
- [ ] Tests finaux
- [ ] Deploy sur production
- [ ] Monitoring post-déploiement

---

## 📈 Métriques de succès

### KPIs à suivre

1. **Adoption du mode clair**
   - % d'utilisateurs qui activent le mode clair
   - Target : 30-40% des utilisateurs

2. **Performance**
   - Temps de chargement initial : < 100ms supplémentaires
   - Temps de changement de thème : < 300ms

3. **Accessibilité**
   - Score Lighthouse Accessibility : ≥ 95
   - Tous les contrastes WCAG AA conformes

4. **Satisfaction utilisateur**
   - Feedback positif dans les retours
   - Taux de rebond inchangé ou amélioré

---

## 🛠️ Outils et ressources

### Outils de développement

- **Contrast Checker** : https://webaim.org/resources/contrastchecker/
- **Color Palette Generator** : https://coolors.co/
- **Lighthouse** : Tests d'accessibilité
- **React DevTools** : Debug du Context

### Ressources de design

- **Palette de couleurs mode clair** : À définir avec le designer
- **Guide de style ACT** : Respecter la charte graphique
- **Inspiration** : Sites avec dark/light mode réussis

### Documentation

- **CSS Variables** : https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- **prefers-color-scheme** : https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
- **React Context** : https://react.dev/reference/react/useContext

---

## ⚠️ Risques et mitigation

### Risque 1 : Flash de contenu non stylisé (FOUC)

**Impact** : Mauvaise expérience utilisateur au chargement

**Mitigation** :
- Script inline dans `<head>` pour appliquer le thème avant hydration
- Cookie ou localStorage lu côté serveur si possible

### Risque 2 : Composants mal contrastés

**Impact** : Accessibilité compromise

**Mitigation** :
- Tests systématiques de contraste
- Review manuelle de tous les composants
- Outils automatisés (axe DevTools)

### Risque 3 : Performance dégradée

**Impact** : Site plus lent

**Mitigation** :
- Utiliser CSS Variables (natif, très rapide)
- Éviter les re-renders inutiles avec React.memo
- Lazy loading des composants lourds

### Risque 4 : Bugs sur mobile

**Impact** : Mauvaise expérience mobile

**Mitigation** :
- Tests sur vrais devices
- Gestion tactile du toggle
- Tests sur iOS et Android

---

## 📅 Planning détaillé

### Semaine 1

| Jour | Phase | Tâches | Responsable |
|------|-------|--------|-------------|
| **Lundi** | Phase 1 | Audit + Architecture | Dev Lead |
| **Mardi** | Phase 2 | Système de base | Dev Frontend |
| **Mercredi** | Phase 3.1 | Layout + Pages principales | Dev Frontend |
| **Jeudi** | Phase 3.2 | Pôles + Formations | Dev Frontend |
| **Vendredi** | Phase 4 + 5 | Tests + Déploiement | Équipe complète |

### Répartition du temps

```
Phase 1 : Préparation        ███░░░░░░░  20%
Phase 2 : Système de base    ████░░░░░░  20%
Phase 3 : Adaptation         ██████░░░░  40%
Phase 4 : Tests              ███░░░░░░░  15%
Phase 5 : Déploiement        █░░░░░░░░░   5%
```

---

## ✅ Checklist finale

### Avant de démarrer
- [ ] Validation de la roadmap par l'équipe
- [ ] Palette de couleurs validée par le designer
- [ ] Branche feature créée
- [ ] Environnement de dev prêt

### Pendant le développement
- [ ] Variables CSS créées
- [ ] ThemeContext implémenté
- [ ] ThemeToggle fonctionnel
- [ ] Tous les composants adaptés
- [ ] Tests passants

### Avant le déploiement
- [ ] Code review complété
- [ ] Tests d'accessibilité OK
- [ ] Tests multi-navigateurs OK
- [ ] Documentation à jour
- [ ] Performance validée

### Après le déploiement
- [ ] Monitoring actif
- [ ] Feedback collecté
- [ ] Bugs corrigés rapidement
- [ ] Métriques suivies

---

## 🎯 Prochaines étapes immédiates

1. **Valider cette roadmap** avec l'équipe
2. **Choisir les couleurs finales** du mode clair
3. **Créer la branche** `feature/light-mode`
4. **Commencer par la Phase 1** : Audit de l'existant

---

## 📞 Contact et support

Pour toute question sur l'implémentation :
- 👨‍💻 Dev Lead : [Nom]
- 🎨 Designer : [Nom]
- 📧 Email : dev@africacentredtechnology.com

---

**Date de création** : 2026-03-30
**Dernière mise à jour** : 2026-03-30
**Version** : 1.0
**Statut** : 📝 Draft - En attente de validation

---

**Let's build a beautiful light mode! ☀️**
