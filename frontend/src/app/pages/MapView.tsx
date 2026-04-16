import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Navigation, Sun, Moon, Globe, X, Home } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { mockPlaces, type Place } from '../data/mockData';
import { PlaceCard } from '../components/PlaceCard';
import { PlaceDetailModal } from '../components/PlaceDetailModal';
import { UserMenu } from '../components/UserMenu';
import { SimpleMapView } from '../components/Map/SimpleMapView';
import { API_BASE } from '../config/api';

export const MapView: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, t, isAuthenticated, user } = useApp();
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [routeTo, setRouteTo] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sheetHeight, setSheetHeight] = useState(120);
  const [isDragging, setIsDragging] = useState(false);
  const [locateTrigger, setLocateTrigger] = useState(0);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const MIN_HEIGHT = 90;
  const MAX_HEIGHT = window.innerHeight * 0.85;
  const categories = ['all', 'religious', 'cultural', 'entertainment', 'dining'];

  const fetchPlaces = async () => {
    try {
      const res = await fetch(`${API_BASE}/attractions`);
      if (res.ok) {
        const data = await res.json();
        const mapped: Place[] = data.map((a: any) => ({ id: a.id, name: a.nameEn || a.name, nameAr: a.name, category: a.category, lat: a.latitude, lng: a.longitude, rating: a.ratingAvg || 4.5, reviewCount: 0, distance: '0.0', isOpen: true, hours: a.openingHours || '24/7', phone: '', website: '', price: 'Free', description: a.description || '', descriptionAr: a.description || '', thumbnail: a.imageUrl || null, photos: a.photos || [], isFeatured: a.isFeatured || false }));
        setPlaces(mapped); setFilteredPlaces(mapped);
      } else { setPlaces(mockPlaces); setFilteredPlaces(mockPlaces); }
    } catch { setPlaces(mockPlaces); setFilteredPlaces(mockPlaces); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPlaces(); }, []);

  useEffect(() => {
    let filtered = places;
    if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.nameAr.includes(searchQuery));
    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
    setFilteredPlaces(filtered);
  }, [searchQuery, selectedCategory, places]);

  const handleSavePlace = async (place: Place) => { if (!isAuthenticated) { navigate('/auth'); return; } try { await fetch(`${API_BASE}/savedplaces/${place.id}`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }); alert('✅ Saved!'); } catch { alert('❌ Failed'); } };
  const handleGetDirections = (place: Place) => { setRouteTo(place); setSelectedPlace(null); };
  const handleLocateUser = () => { setLocateTrigger(prev => prev + 1); };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => { setIsDragging(true); dragStartY.current = 'touches' in e ? e.touches[0].clientY : e.clientY; dragStartHeight.current = sheetHeight; };
  const handleDragMove = (e: TouchEvent | MouseEvent) => { if (!isDragging) return; const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY; let newHeight = dragStartHeight.current + (dragStartY.current - clientY); newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight)); setSheetHeight(newHeight); };
  useEffect(() => { if (isDragging) { window.addEventListener('mousemove', handleDragMove); window.addEventListener('mouseup', () => setIsDragging(false)); window.addEventListener('touchmove', handleDragMove); window.addEventListener('touchend', () => setIsDragging(false)); } return () => { window.removeEventListener('mousemove', handleDragMove); window.removeEventListener('touchmove', handleDragMove); }; }, [isDragging]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="text-4xl">🕌</div></div>;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <SimpleMapView places={filteredPlaces} selectedPlace={selectedPlace} onPlaceSelect={setSelectedPlace} center={[24.4672, 39.6111]} zoom={13} routeTo={routeTo} locateTrigger={locateTrigger} />
      
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] z-20">
        <div className="glass-effect rounded-full shadow-lg px-4 py-3 flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur" onClick={() => searchInputRef.current?.focus()}>
          <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <input ref={searchInputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('searchPlaces') || "Search places..."} className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-500" />
          <button onClick={e => { e.stopPropagation(); setShowFilters(!showFilters); }} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
        </div>
        {showFilters && <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-30"><div className="flex justify-between mb-3"><h3 className="font-semibold text-gray-900 dark:text-white">Categories</h3><button onClick={() => setShowFilters(false)}><X className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button></div><div className="flex flex-wrap gap-2">{categories.map(cat => <button key={cat} onClick={() => { setSelectedCategory(cat); setShowFilters(false); }} className={`px-4 py-2 rounded-full ${selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{cat}</button>)}</div></div>}
      </div>

      <div className="absolute bottom-32 right-4 z-20 flex flex-col gap-3">
        <button onClick={handleLocateUser} className="w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center"><Navigation className="w-5 h-5" /></button>
        <button onClick={toggleTheme} className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:scale-105 transition-transform flex items-center justify-center border border-gray-200 dark:border-gray-700">{theme === 'light' ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-yellow-500" />}</button>
        <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:scale-105 transition-transform flex items-center justify-center relative border border-gray-200 dark:border-gray-700"><Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" /><span className="absolute -bottom-1 -right-1 text-xs font-bold text-blue-500 bg-white dark:bg-gray-800 px-1 rounded-full">{language === 'ar' ? 'AR' : 'EN'}</span></button>
        {user?.role === 'admin' && <button onClick={() => navigate('/admin')} className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:scale-105 transition-transform flex items-center justify-center border border-gray-200 dark:border-gray-700"><Home className="w-5 h-5 text-gray-700 dark:text-gray-300" /></button>}
        <UserMenu />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl z-30 overflow-hidden" style={{ height: sheetHeight }}>
        <div className="flex justify-center pt-3 pb-2 cursor-grab" onMouseDown={handleDragStart} onTouchStart={handleDragStart}><div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" /></div>
        <div className="flex justify-between px-6 py-2"><h2 className="font-semibold text-gray-900 dark:text-white">{t('nearbyPlaces') || "Nearby Places"}</h2><span className="text-xs text-gray-500 dark:text-gray-400">↑ Drag ↑</span></div>
        <div className="px-6 pb-6 overflow-y-auto" style={{ height: sheetHeight - 60 }}>{filteredPlaces.map(p => <PlaceCard key={p.id} place={p} layout="horizontal" onClick={() => setSelectedPlace(p)} />)}</div>
      </div>

      {selectedPlace && <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} onSave={handleSavePlace} onDirections={handleGetDirections} onPlaceUpdate={fetchPlaces} />}
      {routeTo && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 flex items-center gap-2 border border-gray-200 dark:border-gray-700"><span className="text-gray-900 dark:text-white">🗺️ Route to {routeTo.name}</span><button onClick={() => setRouteTo(null)} className="ml-2 text-red-500 hover:text-red-700">✕</button></div>}
    </div>
  );
};
