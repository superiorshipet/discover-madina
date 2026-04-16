import React from 'react';
import { MapPin, Moon, Sun, Languages } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface FloatingActionsProps {
  onLocate: () => void;
  theme: string;
  onThemeToggle: () => void;
  language: string;
  onLanguageToggle: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onLocate, theme, onThemeToggle, language, onLanguageToggle,
}) => {
  return (
    <div className="absolute bottom-24 right-4 z-10 flex flex-col gap-3">
      <button onClick={onLocate} className="w-12 h-12 rounded-full bg-[var(--discover-primary)] text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
        <MapPin className="w-5 h-5" />
      </button>
      <button onClick={onThemeToggle} className="w-12 h-12 rounded-full bg-white dark:bg-[var(--discover-surface)] shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
        {theme === 'dark' ? <Sun className="w-5 h-5 text-[var(--discover-text-primary)]" /> : <Moon className="w-5 h-5 text-[var(--discover-text-primary)]" />}
      </button>
      <button onClick={onLanguageToggle} className="w-12 h-12 rounded-full bg-white dark:bg-[var(--discover-surface)] shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
        <Languages className="w-5 h-5 text-[var(--discover-text-primary)]" />
        <span className="absolute -bottom-1 -right-1 text-xs font-bold text-[var(--discover-primary)]">{language === 'ar' ? 'AR' : 'EN'}</span>
      </button>
      <UserMenu />
    </div>
  );
};
