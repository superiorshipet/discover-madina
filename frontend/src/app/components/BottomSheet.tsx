import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { PlaceCard } from './PlaceCard';
import { useApp } from '../contexts/AppContext';
import type { Place } from '../data/mockData';

interface BottomSheetProps {
  places: Place[];
  onPlaceSelect: (place: Place) => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ places, onPlaceSelect }) => {
  const { t } = useApp();
  const [sheetState, setSheetState] = useState<'collapsed' | 'half' | 'expanded'>('collapsed');
  const HEIGHTS = { collapsed: 140, half: 400, expanded: window.innerHeight * 0.85 };
  const toggleSheet = () => {
    if (sheetState === 'collapsed') setSheetState('half');
    else if (sheetState === 'half') setSheetState('expanded');
    else setSheetState('collapsed');
  };
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[var(--discover-surface)] rounded-t-3xl shadow-2xl transition-all duration-300 z-30 overflow-hidden" style={{ height: HEIGHTS[sheetState] }}>
      <div className="flex justify-center pt-3 pb-2 cursor-grab" onClick={toggleSheet}>
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
      <div className="flex items-center justify-between px-6 py-2">
        <h2 className="text-xl font-semibold text-[var(--discover-text-primary)]">{t('nearbyPlaces')}</h2>
        <button onClick={toggleSheet} className="p-2 hover:bg-[var(--discover-card)] rounded-full">
          <ChevronUp className={`w-5 h-5 text-[var(--discover-text-secondary)] transition-transform ${sheetState === 'expanded' ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <div className="px-6 pb-6 overflow-y-auto h-[calc(100%-60px)]">
        <div className={sheetState === 'collapsed' ? 'flex gap-4 overflow-x-auto pb-2' : 'grid grid-cols-2 gap-4'}>
          {places.map((place) => (
            <div key={place.id} className={sheetState === 'collapsed' ? 'min-w-[200px]' : ''}>
              <PlaceCard place={place} layout={sheetState === 'collapsed' ? 'horizontal' : 'vertical'} onClick={() => onPlaceSelect(place)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
