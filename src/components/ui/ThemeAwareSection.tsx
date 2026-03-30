"use client";

import React, { CSSProperties } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeAwareSectionProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  background?: 'primary' | 'secondary' | 'tertiary' | 'transparent';
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Section qui adapte automatiquement ses couleurs au thème actif
 */
export default function ThemeAwareSection({
  children,
  className = '',
  style = {},
  background = 'transparent',
  as: Component = 'section',
}: ThemeAwareSectionProps) {
  const { theme } = useTheme();

  const backgroundColors = {
    primary: 'var(--bg-primary)',
    secondary: 'var(--bg-secondary)',
    tertiary: 'var(--bg-tertiary)',
    transparent: 'transparent',
  };

  const mergedStyle: CSSProperties = {
    backgroundColor: backgroundColors[background],
    color: 'var(--text-primary)',
    ...style,
  };

  return (
    <Component className={className} style={mergedStyle}>
      {children}
    </Component>
  );
}
