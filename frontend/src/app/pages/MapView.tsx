import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Navigation, Sun, Moon, Globe, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { mockPlaces, type Place } from '../data/mockData';
import { PlaceCard } from '../components/PlaceCard';
import { PlaceDetailModal } from '../components/PlaceDetailModal';
import { UserMenu } from '../components/UserMenu';
import { SimpleMapView } from '../components/Map/SimpleMapView';

export const MapView: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, t } = useApp();
  const [places] = useState<Place[]>(mockPlaces);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(mockPlaces);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Draggable sheet state
  const [sheetHeight, setSheetHeight] = useState(120);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const MIN_HEIGHT = 90;
  const MAX_HEIGHT = window.innerHeight * 0.85;

  const categories = ['all', 'religious', 'historical', 'nature', 'restaurant'];

  useEffect(() => {
    let filtered: Place[] = places;
    
    if (searchQuery) {
      filtered = filtered.filter((p: Place) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameAr.includes(searchQuery)
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p: Place) => p.category === selectedCategory);
    }
    
    setFilteredPlaces(filtered);
  }, [searchQuery, selectedCategory, places]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  // Drag handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    dragStartHeight.current = sheetHeight;
  };

  const handleDragMove = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = dragStartY.current - clientY;
    let newHeight = dragStartHeight.current + deltaY;
    
    newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
    setSheetHeight(newHeight);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  // Focus search input when pressing "/" or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Close filters with Escape
      if (e.key === 'Escape' && showFilters) {
        setShowFilters(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFilters]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[var(--discover-bg)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <SimpleMapView
        places={filteredPlaces}
        selectedPlace={selectedPlace}
        onPlaceSelect={setSelectedPlace}
        center={[24.4672, 39.6111]}
        zoom={13}
      />

      {/* Search Bar - Ensure it can receive focus */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] z-20">
        <div 
          className="glass-effect rounded-full shadow-lg px-4 py-3 flex items-center gap-3"
          onClick={() => searchInputRef.current?.focus()}
        >
          <Search className="w-5 h-5 text-[var(--discover-text-secondary)]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaces') || 'Search places...'}
            className="flex-1 bg-transparent border-none outline-none text-[var(--discover-text-primary)] placeholder:text-[var(--discover-text-secondary)]"
            autoComplete="off"
            spellCheck="false"
          />
          <button 
            onClick={(e) => { e.stopPropagation(); setShowFilters(!showFilters); }} 
            className="p-2 hover:bg-white/20 dark:hover:bg-slate-700/50 rounded-full transition-colors"
          >
            <Filter className="w-5 h-5 text-[var(--discover-text-secondary)]" />
          </button>
        </div>

        {showFilters && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-[var(--discover-surface)] rounded-2xl shadow-xl z-30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[var(--discover-text-primary)]">Categories</h3>
              <button onClick={() => setShowFilters(false)} className="p-1">
                <X className="w-5 h-5 text-[var(--discover-text-secondary)]" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setShowFilters(false); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-[var(--discover-primary)] text-white' : 'bg-[var(--discover-card)] text-[var(--discover-text-secondary)] hover:bg-[var(--discover-primary)]/20'}`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-32 right-4 z-20 flex flex-col gap-3">
        <button className="w-12 h-12 rounded-full bg-[var(--discover-primary)] text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
          <Navigation className="w-5 h-5" />
        </button>
        <button onClick={toggleTheme} className="w-12 h-12 rounded-full bg-white dark:bg-[var(--discover-surface)] shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
          {theme === 'light' ? <Moon className="w-5 h-5 text-[var(--discover-neutral)]" /> : <Sun className="w-5 h-5 text-[var(--discover-accent)]" />}
        </button>
        <button onClick={toggleLanguage} className="w-12 h-12 rounded-full bg-white dark:bg-[var(--discover-surface)] shadow-lg hover:scale-105 transition-transform flex items-center justify-center relative">
          <Globe className="w-5 h-5 text-[var(--discover-neutral)]" />
          <span className="absolute -bottom-1 -right-1 text-xs font-bold text-[var(--discover-primary)] bg-white dark:bg-[var(--discover-surface)] px-1 rounded-full">{language === 'ar' ? 'AR' : 'EN'}</span>
        </button>
        <UserMenu />
      </div>

      {/* Freely Draggable Bottom Sheet */}
      <div 
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[var(--discover-surface)] rounded-t-3xl shadow-2xl z-30 overflow-hidden"
        style={{ 
          height: sheetHeight,
          transition: isDragging ? 'none' : 'height 0.2s ease-out'
        }}
      >
        <div 
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors" />
        </div>
        
        <div className="flex items-center justify-between px-6 py-2">
          <h2 className="text-xl font-semibold text-[var(--discover-text-primary)]">
            {t('nearbyPlaces') || 'Nearby Places'}
          </h2>
          <span className="text-xs text-[var(--discover-text-secondary)]">
            ↑ Drag to resize ↑
          </span>
        </div>
        
        <div className="px-6 pb-6 overflow-y-auto" style={{ height: sheetHeight - 60 }}>
          <div className="space-y-4">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} layout="horizontal" onClick={() => setSelectedPlace(place)} />
            ))}
          </div>
        </div>
      </div>

      {selectedPlace && <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />}
    </div>
  );
};
