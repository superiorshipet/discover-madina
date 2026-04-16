import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Place } from '../data/mockData';

interface PlaceCardProps {
  place: Place;
  layout: 'horizontal' | 'vertical';
  onClick?: () => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, layout, onClick }) => {
  const { language, t } = useApp();
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      religious: '🕌', cultural: '🏛️', entertainment: '🎡', dining: '🍽️', historical: '🏛️', nature: '🌳', restaurant: '🍗'
    };
    return icons[category] || '📍';
  };

  const placeName = language === 'ar' ? place.nameAr : place.name;

  if (layout === 'vertical') {
    return (
      <div onClick={onClick} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer border border-gray-200 dark:border-gray-700">
        <div className="relative h-36 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-gray-700 dark:to-gray-600">
          {place.thumbnail ? <img src={place.thumbnail} alt={placeName} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-4xl">{getCategoryIcon(place.category)}</div>}
        </div>
        <div className="p-3">
          <div className="flex items-center gap-1 mb-1"><span className="text-sm px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{t(place.category)}</span></div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{placeName}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1"><Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /><span className="font-medium">{place.rating}</span><span>({place.reviewCount})</span></div>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400"><MapPin className="w-4 h-4" /><span>{place.distance} km</span></div>
          <div className={`mt-2 text-xs ${place.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{place.isOpen ? '🟢 ' + t('openNow') : '🔴 ' + t('closedNow')}</div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer flex gap-3 p-3 border border-gray-200 dark:border-gray-700">
      <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-2xl">{getCategoryIcon(place.category)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold text-gray-900 dark:text-white truncate">{placeName}</h3><span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 whitespace-nowrap">{t(place.category)}</span></div>
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1"><Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /><span className="font-medium">{place.rating}</span><span>({place.reviewCount} reviews)</span></div>
        <div className="flex items-center justify-between"><div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400"><MapPin className="w-4 h-4" /><span>{place.distance} km</span></div><div className={`text-xs ${place.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{place.isOpen ? '🟢 Open' : '🔴 Closed'}</div></div>
      </div>
    </div>
  );
};
