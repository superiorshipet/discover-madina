import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilter: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onFilter }) => {
  const { t } = useApp();
  return (
    <div className="glass-effect rounded-full px-4 py-3 flex items-center gap-3 shadow-lg">
      <Search className="w-5 h-5 text-[var(--discover-text-secondary)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('searchPlaces')}
        className="flex-1 bg-transparent border-none outline-none text-[var(--discover-text-primary)] placeholder:text-[var(--discover-text-secondary)]"
      />
      <button onClick={onFilter} className="p-1 hover:bg-[var(--discover-card)] rounded-full transition-colors">
        <SlidersHorizontal className="w-5 h-5 text-[var(--discover-text-secondary)]" />
      </button>
    </div>
  );
};
