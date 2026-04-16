import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Place } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PlaceCardProps {
  place: Place;
  layout: 'horizontal' | 'vertical';
  onClick?: () => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, layout, onClick }) => {
  const { language, t } = useApp();
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      religious: '🕌',
      historical: '🏛️',
      nature: '🌳',
      restaurant: '🍽️',
      shopping: '🛍️',
      entertainment: '🎭',
      museum: '🖼️',
      hotel: '🏨',
    };
    return icons[category] || '📍';
  };

  const placeName = language === 'ar' ? place.nameAr : place.name;

  if (layout === 'vertical') {
    return (
      <div
        onClick={onClick}
        className="bg-white dark:bg-[var(--discover-card)] rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
      >
        <div className="relative h-36 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-slate-700 dark:to-slate-600">
          {place.thumbnail ? (
            <img
              src={place.thumbnail}
              alt={placeName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              {getCategoryIcon(place.category)}
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm px-2 py-0.5 rounded-full bg-[var(--discover-primary)]/10 text-[var(--discover-primary)]">
              {t(place.category)}
            </span>
          </div>
          <h3 className="font-semibold text-[var(--discover-text-primary)] mb-1 truncate">
            {placeName}
          </h3>
          <div className="flex items-center gap-1 text-sm text-[var(--discover-text-secondary)] mb-1">
            <Star className="w-4 h-4 fill-[var(--discover-accent)] text-[var(--discover-accent)]" />
            <span className="font-medium">{place.rating}</span>
            <span>({place.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-[var(--discover-text-secondary)]">
            <MapPin className="w-4 h-4" />
            <span>{place.distance} {t('kmAway')}</span>
          </div>
          <div className={`mt-2 text-xs ${place.isOpen ? 'text-[var(--discover-secondary)]' : 'text-[var(--discover-danger)]'}`}>
            {place.isOpen ? t('openNow') : t('closedNow')}
          </div>
        </div>
      </div>
    );
  }

  // Horizontal layout
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[var(--discover-card)] rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer flex gap-3 p-3"
    >
      <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-2xl">
        {getCategoryIcon(place.category)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-[var(--discover-text-primary)] truncate">
            {placeName}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--discover-primary)]/10 text-[var(--discover-primary)] whitespace-nowrap">
            {t(place.category)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-[var(--discover-text-secondary)] mb-1">
          <Star className="w-4 h-4 fill-[var(--discover-accent)] text-[var(--discover-accent)]" />
          <span className="font-medium">{place.rating}</span>
          <span>({place.reviewCount} {t('reviews')})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-[var(--discover-text-secondary)]">
            <MapPin className="w-4 h-4" />
            <span>{place.distance} {t('kmAway')}</span>
          </div>
          <div className={`text-xs ${place.isOpen ? 'text-[var(--discover-secondary)]' : 'text-[var(--discover-danger)]'}`}>
            {place.isOpen ? '🟢 ' + t('openNow') : '🔴 ' + t('closedNow')}
          </div>
        </div>
      </div>
    </div>
  );
};