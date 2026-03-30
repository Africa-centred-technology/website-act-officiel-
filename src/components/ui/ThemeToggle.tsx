"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle({ disabled }: { disabled?: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={!disabled ? toggleTheme : undefined}
      disabled={disabled}
      className={`theme-toggle ${disabled ? 'disabled' : ''}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      aria-label="Toggle theme"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: '0.5rem',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(8px)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Sun Icon (Light Mode) */}
      <motion.div
        initial={false}
        animate={{
          scale: theme === 'light' ? 1 : 0,
          opacity: theme === 'light' ? 1 : 0,
          rotate: theme === 'light' ? 0 : 180,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Sun size={20} color="#D35400" strokeWidth={2.5} />
      </motion.div>

      {/* Moon Icon (Dark Mode) */}
      <motion.div
        initial={false}
        animate={{
          scale: theme === 'dark' ? 1 : 0,
          opacity: theme === 'dark' ? 1 : 0,
          rotate: theme === 'dark' ? 0 : -180,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Moon size={20} color="#F39C12" strokeWidth={2.5} />
      </motion.div>

      {/* Glow effect on hover */}
      <motion.div
        className="theme-toggle-glow"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.6 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background:
            theme === 'dark'
              ? 'radial-gradient(circle, rgba(243, 156, 18, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(211, 84, 0, 0.3) 0%, transparent 70%)',
          borderRadius: '0.5rem',
          pointerEvents: 'none',
        }}
      />
    </motion.button>
  );
}
