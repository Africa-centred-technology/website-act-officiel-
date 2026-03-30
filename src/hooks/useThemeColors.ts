"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { useMemo } from 'react';

/**
 * Hook pour obtenir les couleurs adaptées au thème actif
 * Utiliser ce hook au lieu de couleurs en dur
 */
export function useThemeColors() {
  const { theme } = useTheme();

  const colors = useMemo(() => {
    if (theme === 'light') {
      return {
        // Backgrounds - Tons bleus clairs
        bgPrimary: '#F0F4F8',
        bgSecondary: '#E1E8ED',
        bgTertiary: '#D4DCE3',
        bgCard: 'rgba(255, 255, 255, 0.6)',
        bgGlass: 'rgba(255, 255, 255, 0.5)',

        // Textes - Bleus foncés
        textPrimary: '#1A2F3A',
        textSecondary: '#2E4A5C',
        textMuted: '#5A7A8F',
        textInverse: '#FFFFFF',

        // Bordures
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderLight: 'rgba(0, 0, 0, 0.05)',

        // Ombres
        shadowSm: '0 2px 8px rgba(0, 0, 0, 0.05)',
        shadowMd: '0 4px 16px rgba(0, 0, 0, 0.08)',
        shadowLg: '0 8px 32px rgba(0, 0, 0, 0.12)',

        // Couleurs de marque (inchangées)
        actOrange: '#D35400',
        actGold: '#F39C12',
        actDark: '#0A1410',
        actGreen: '#1B3022',
        actCream: '#FCF9F2',
      };
    }

    // Dark mode (par défaut)
    return {
      // Backgrounds
      bgPrimary: '#070E1C',
      bgSecondary: '#0A1410',
      bgTertiary: '#1B3022',
      bgCard: 'rgba(255, 255, 255, 0.03)',
      bgGlass: 'rgba(255, 255, 255, 0.05)',

      // Textes
      textPrimary: '#FFFFFF',
      textSecondary: '#E0E0E0',
      textMuted: '#A0A0A0',
      textInverse: '#0A1410',

      // Bordures
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderLight: 'rgba(255, 255, 255, 0.05)',

      // Ombres
      shadowSm: '0 2px 8px rgba(0, 0, 0, 0.1)',
      shadowMd: '0 4px 16px rgba(0, 0, 0, 0.15)',
      shadowLg: '0 8px 32px rgba(0, 0, 0, 0.2)',

      // Couleurs de marque (inchangées)
      actOrange: '#D35400',
      actGold: '#F39C12',
      actDark: '#0A1410',
      actGreen: '#1B3022',
      actCream: '#FCF9F2',
    };
  }, [theme]);

  return colors;
}

/**
 * Helper pour obtenir une couleur de texte avec opacité adaptée au thème
 */
export function useThemeTextColor(opacity: number = 1) {
  const { theme } = useTheme();

  if (theme === 'light') {
    if (opacity >= 0.9) return 'rgba(10, 20, 16, 0.95)';
    if (opacity >= 0.7) return 'rgba(10, 20, 16, 0.85)';
    if (opacity >= 0.5) return 'rgba(10, 20, 16, 0.7)';
    if (opacity >= 0.3) return 'rgba(10, 20, 16, 0.5)';
    return 'rgba(10, 20, 16, 0.3)';
  }

  // Dark mode
  if (opacity >= 0.9) return 'rgba(255, 255, 255, 0.95)';
  if (opacity >= 0.7) return 'rgba(255, 255, 255, 0.8)';
  if (opacity >= 0.5) return 'rgba(255, 255, 255, 0.6)';
  if (opacity >= 0.3) return 'rgba(255, 255, 255, 0.4)';
  return 'rgba(255, 255, 255, 0.2)';
}
