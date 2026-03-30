# 🎨 Guide d'adaptation des composants au système de thème

## 🎯 Objectif

Adapter **tous les composants** de l'application pour qu'ils utilisent les variables CSS du thème au lieu de couleurs fixes.

---

## 📋 Principe de base

### ❌ Avant (couleurs fixes)
```tsx
<div style={{
  background: '#0A1410',
  color: '#FFFFFF',
  border: '1px solid rgba(255,255,255,0.1)'
}}>
  Contenu
</div>
```

### ✅ Après (variables CSS)
```tsx
<div style={{
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)'
}}>
  Contenu
</div>
```

---

## 🎨 Variables CSS disponibles

### Backgrounds
| Variable | Dark Mode | Light Mode | Usage |
|----------|-----------|------------|-------|
| `--bg-primary` | #070E1C | #FFFFFF | Fond principal |
| `--bg-secondary` | #0A1410 | #FCF9F2 | Fond secondaire |
| `--bg-tertiary` | #1B3022 | #F5F1E8 | Fond tertiaire |
| `--bg-card` | rgba(255,255,255,0.03) | rgba(0,0,0,0.02) | Cartes |
| `--bg-glass` | rgba(255,255,255,0.05) | rgba(0,0,0,0.03) | Glassmorphism |

### Textes
| Variable | Dark Mode | Light Mode | Usage |
|----------|-----------|------------|-------|
| `--text-primary` | #FFFFFF | #0A1410 | Texte principal |
| `--text-secondary` | #E0E0E0 | #2C4A35 | Texte secondaire |
| `--text-muted` | #A0A0A0 | #6B7280 | Texte atténué |
| `--text-inverse` | #0A1410 | #FFFFFF | Texte inverse |

### Bordures
| Variable | Dark Mode | Light Mode |
|----------|-----------|------------|
| `--border-color` | rgba(255,255,255,0.1) | rgba(0,0,0,0.1) |
| `--border-light` | rgba(255,255,255,0.05) | rgba(0,0,0,0.05) |

### Ombres
| Variable | Usage |
|----------|-------|
| `--shadow-sm` | Petite ombre |
| `--shadow-md` | Ombre moyenne |
| `--shadow-lg` | Grande ombre |

### Couleurs de marque (inchangées)
- `#D35400` - Orange ACT
- `#F39C12` - Or ACT
- Ces couleurs restent fixes dans les deux thèmes

---

## 🔧 Méthodes d'adaptation

### Méthode 1 : Utiliser ThemeAwareSection

**Pour**: Sections, containers, wrappers

```tsx
import ThemeAwareSection from '@/components/ui/ThemeAwareSection';

export default function MyComponent() {
  return (
    <ThemeAwareSection background="secondary" style={{ padding: '4rem' }}>
      <h2>Mon titre</h2>
      <p>Mon contenu</p>
    </ThemeAwareSection>
  );
}
```

**Props disponibles**:
- `background`: 'primary' | 'secondary' | 'tertiary' | 'transparent'
- `as`: 'section' | 'div' | 'article' | etc.
- `style`: CSSProperties
- `className`: string

---

### Méthode 2 : Remplacer les couleurs inline

**Pour**: Styles existants

```tsx
// ❌ AVANT
<div style={{
  background: '#0A1410',
  color: '#FFFFFF',
  border: '1px solid rgba(255,255,255,0.1)'
}}>

// ✅ APRÈS
<div style={{
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)'
}}>
```

---

### Méthode 3 : CSS avec data-theme

**Pour**: Styles CSS personnalisés

```css
/* styles.module.css */
.myComponent {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

/* Styles spécifiques au thème si nécessaire */
[data-theme="dark"] .myComponent {
  box-shadow: 0 0 20px rgba(211, 84, 0, 0.2);
}

[data-theme="light"] .myComponent {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

---

## 📝 Tableau de correspondance

### Backgrounds
| Couleur fixe | Variable CSS |
|--------------|--------------|
| `#070E1C` | `var(--bg-primary)` |
| `#0A1410` | `var(--bg-secondary)` |
| `#1B3022` | `var(--bg-tertiary)` |
| `rgba(255,255,255,0.03)` | `var(--bg-card)` |
| `rgba(255,255,255,0.05)` | `var(--bg-glass)` |

### Textes
| Couleur fixe | Variable CSS |
|--------------|--------------|
| `#FFFFFF` ou `white` | `var(--text-primary)` |
| `#E0E0E0` | `var(--text-secondary)` |
| `rgba(255,255,255,0.8)` | `var(--text-secondary)` |
| `rgba(255,255,255,0.5)` | `var(--text-muted)` |

### Bordures
| Couleur fixe | Variable CSS |
|--------------|--------------|
| `rgba(255,255,255,0.1)` | `var(--border-color)` |
| `rgba(255,255,255,0.05)` | `var(--border-light)` |

---

## 🎯 Composants à adapter (priorités)

### Priorité 1 - Pages principales ⚡
- [ ] `src/app/page.tsx` (Homepage)
- [ ] `src/app/about/page.tsx`
- [ ] `src/app/services/page.tsx`
- [ ] `src/app/poles/page.tsx`
- [ ] `src/app/formations/page.tsx`

### Priorité 2 - Composants de layout 🏗️
- [x] `src/app/layout.tsx` ✅ Fait
- [x] `src/components/layout/Header.tsx` ✅ Fait
- [ ] `src/components/layout/Footer.tsx`
- [ ] `src/components/layout/FooterStrip.tsx`

### Priorité 3 - Composants réutilisables 🧩
- [x] `src/components/ui/ThemeToggle.tsx` ✅ Fait
- [x] `src/components/ui/ThemeAwareSection.tsx` ✅ Créé
- [ ] `src/components/ui/CTAButton.tsx`
- [ ] `src/components/ui/Card.tsx` (si existe)

### Priorité 4 - Shells de pages 📄
- [ ] `src/components/poles/PolesIndexShell.tsx`
- [ ] `src/components/poles/PoleDeveloppementShell.tsx`
- [ ] `src/components/poles/PoleConseilShell.tsx`
- [ ] `src/components/poles/PoleFormationShell.tsx`
- [ ] `src/components/services/ServicesShell.tsx`
- [ ] `src/components/formations/FormationsShell.tsx`

### Priorité 5 - Composants spécifiques 🎨
- [ ] Tous les autres composants dans `src/components/`

---

## 🔄 Processus d'adaptation pas-à-pas

### Étape 1 : Identifier les couleurs fixes
```bash
# Rechercher toutes les couleurs fixes dans un fichier
grep -E "#[0-9A-Fa-f]{6}|rgba?\(" src/components/MyComponent.tsx
```

### Étape 2 : Remplacer par les variables
1. Ouvrir le fichier
2. Rechercher les couleurs (Ctrl+F)
3. Remplacer par les variables CSS correspondantes
4. Tester visuellement

### Étape 3 : Tester les deux thèmes
1. Mode dark (par défaut) : tout doit s'afficher correctement
2. Cliquer sur le toggle → mode light
3. Vérifier que toutes les couleurs changent
4. Vérifier le contraste (texte lisible)

### Étape 4 : Valider
- [ ] Pas d'erreurs dans la console
- [ ] Texte lisible dans les deux modes
- [ ] Contrastes WCAG AA respectés
- [ ] Animations fluides

---

## 💡 Exemples pratiques

### Exemple 1 : Section simple
```tsx
// ❌ AVANT
<section style={{
  padding: '6rem 4rem',
  background: '#0A1410',
  color: '#FFFFFF'
}}>
  <h2 style={{ color: '#FFFFFF', fontSize: '3rem' }}>Titre</h2>
  <p style={{ color: 'rgba(255,255,255,0.8)' }}>Description</p>
</section>

// ✅ APRÈS
<ThemeAwareSection
  background="secondary"
  style={{ padding: '6rem 4rem' }}
>
  <h2 style={{ color: 'var(--text-primary)', fontSize: '3rem' }}>Titre</h2>
  <p style={{ color: 'var(--text-secondary)' }}>Description</p>
</ThemeAwareSection>
```

### Exemple 2 : Card
```tsx
// ❌ AVANT
<div style={{
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '1rem',
  padding: '2rem'
}}>
  <h3 style={{ color: '#FFFFFF' }}>Titre card</h3>
</div>

// ✅ APRÈS
<div style={{
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: '1rem',
  padding: '2rem'
}}>
  <h3 style={{ color: 'var(--text-primary)' }}>Titre card</h3>
</div>
```

### Exemple 3 : Bouton avec glassmorphism
```tsx
// ❌ AVANT
<button style={{
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#FFFFFF'
}}>

// ✅ APRÈS
<button style={{
  background: 'var(--bg-glass)',
  backdropFilter: 'blur(8px)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)'
}}>
```

---

## ⚠️ Cas particuliers

### 1. Conserver les couleurs de marque ACT
**NE PAS** remplacer :
- `#D35400` (Orange ACT)
- `#F39C12` (Or ACT)

Ces couleurs doivent rester fixes dans les deux thèmes.

### 2. Images et illustrations
Les images ne changent pas automatiquement. Si nécessaire :
```tsx
const { theme } = useTheme();

<img
  src={theme === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png'}
  alt="Logo"
/>
```

### 3. Composants tiers
Pour les composants de libraries externes, utilisez des wrappers :
```tsx
<div style={{ filter: theme === 'light' ? 'invert(1)' : 'none' }}>
  <ExternalComponent />
</div>
```

---

## ✅ Checklist de validation

Pour chaque composant adapté :

- [ ] Toutes les couleurs fixes remplacées par des variables
- [ ] Test visuel en mode dark ✅
- [ ] Test visuel en mode light ✅
- [ ] Contraste texte/fond suffisant (WCAG AA)
- [ ] Bordures visibles dans les deux modes
- [ ] Animations fluides lors du changement
- [ ] Pas d'erreurs console
- [ ] Couleurs ACT (orange/or) préservées

---

## 🚀 Script de recherche automatique

Pour trouver tous les fichiers avec des couleurs fixes :

```bash
# Rechercher les couleurs hexadécimales
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "#[0-9A-Fa-f]\{6\}"

# Rechercher les rgba
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "rgba("

# Compter les occurrences
grep -r "#0A1410" src --include="*.tsx" | wc -l
```

---

## 📊 Progression

| Catégorie | Total | Adaptés | Reste | % |
|-----------|-------|---------|-------|---|
| Layout | 4 | 2 | 2 | 50% |
| Pages | 10 | 0 | 10 | 0% |
| Shells | 6 | 0 | 6 | 0% |
| UI Components | 5 | 2 | 3 | 40% |
| **TOTAL** | **25** | **4** | **21** | **16%** |

---

## 🎉 Résultat final attendu

Une fois tous les composants adaptés :
- ✅ Mode dark : apparence actuelle préservée
- ✅ Mode light : version claire cohérente
- ✅ Toggle instantané sans bugs visuels
- ✅ Contraste optimal dans les deux modes
- ✅ Performance maintenue
- ✅ Code maintenable avec variables CSS

---

**Date**: 30 mars 2026
**Objectif**: Adapter toute l'application au système de thème
**Statut**: 📝 EN COURS - Guide créé, adaptation à faire
