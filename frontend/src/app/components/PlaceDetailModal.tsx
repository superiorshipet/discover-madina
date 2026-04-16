import React, { useState } from 'react';
import { X, Star, Navigation, Bookmark, Share2, Clock, Phone, Globe as WebIcon, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Place } from '../data/mockData';
import { mockReviews, ratingDistribution } from '../data/mockData';

interface PlaceDetailModalProps {
  place: Place;
  onClose: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose }) => {
  const { language, t } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const placeName = language === 'ar' ? place.nameAr : place.name;
  const placeDescription = language === 'ar' ? place.descriptionAr : place.description;
  const placeReviews = mockReviews.filter(r => r.placeId === place.id && r.status === 'approved');

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % 4);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + 4) % 4);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center">
      <div 
        className="bg-white dark:bg-[var(--discover-surface)] w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[var(--discover-surface)] z-10 px-4 py-3 flex justify-end border-b border-[var(--discover-border)]">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[var(--discover-text-primary)]" />
          </button>
        </div>

        {/* Image Carousel */}
        <div className="relative h-64 bg-gradient-to-br from-blue-100 via-emerald-100 to-amber-100 dark:from-slate-700 dark:via-slate-600 dark:to-slate-800">
          {place.thumbnail ? (
            <img
              src={place.thumbnail}
              alt={placeName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl">
              {getCategoryIcon(place.category)}
            </div>
          )}
          
          {/* Carousel Controls */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Category */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getCategoryIcon(place.category)}</span>
              <h1 className="text-2xl font-bold text-[var(--discover-text-primary)]">
                {placeName}
              </h1>
            </div>
            <div className="text-[var(--discover-text-secondary)] flex items-center gap-2">
              <span className="text-xl">{getCategoryIcon(place.category)}</span>
              <span>{t(place.category)}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-[var(--discover-accent)] text-[var(--discover-accent)]" />
            <span className="font-semibold text-lg text-[var(--discover-text-primary)]">
              {place.rating}
            </span>
            <span className="text-[var(--discover-text-secondary)]">
              ({place.reviewCount} {t('reviews')})
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--discover-primary)]/10 hover:bg-[var(--discover-primary)]/20 transition-colors">
              <Navigation className="w-6 h-6 text-[var(--discover-primary)]" />
              <span className="text-sm font-medium text-[var(--discover-primary)]">
                {t('directions')}
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--discover-accent)]/10 hover:bg-[var(--discover-accent)]/20 transition-colors">
              <Bookmark className="w-6 h-6 text-[var(--discover-accent)]" />
              <span className="text-sm font-medium text-[var(--discover-accent)]">
                {t('save')}
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--discover-secondary)]/10 hover:bg-[var(--discover-secondary)]/20 transition-colors">
              <Share2 className="w-6 h-6 text-[var(--discover-secondary)]" />
              <span className="text-sm font-medium text-[var(--discover-secondary)]">
                {t('share')}
              </span>
            </button>
          </div>

          {/* Information */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--discover-text-primary)] mb-3">
              📋 {t('information')}
            </h2>
            <div className="space-y-3 bg-[var(--discover-card)] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[var(--discover-text-secondary)]">
                  <Clock className="w-5 h-5" />
                  <span>{t('hours')}</span>
                </div>
                <span className="font-medium text-[var(--discover-text-primary)]">
                  {place.hours}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[var(--discover-text-secondary)]">
                  <Phone className="w-5 h-5" />
                  <span>{t('phone')}</span>
                </div>
                <span className="font-medium text-[var(--discover-text-primary)]">
                  {place.phone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[var(--discover-text-secondary)]">
                  <WebIcon className="w-5 h-5" />
                  <span>{t('website')}</span>
                </div>
                <span className="font-medium text-[var(--discover-primary)] hover:underline cursor-pointer">
                  {place.website}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[var(--discover-text-secondary)]">
                  <DollarSign className="w-5 h-5" />
                  <span>{t('price')}</span>
                </div>
                <span className="font-medium text-[var(--discover-text-primary)]">
                  {place.price}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--discover-text-primary)] mb-3">
              📝 {t('description')}
            </h2>
            <p className="text-[var(--discover-text-secondary)] leading-relaxed">
              {showFullDescription ? placeDescription : `${placeDescription.substring(0, 150)}...`}
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-[var(--discover-primary)] hover:underline ml-2"
              >
                [{showFullDescription ? 'Show less' : t('readMore')}]
              </button>
            </p>
          </div>

          {/* Photos */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--discover-text-primary)] mb-3">
              📸 {t('photos')}
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-slate-700 dark:to-slate-600"
                />
              ))}
              <div className="aspect-square rounded-lg bg-[var(--discover-card)] flex items-center justify-center text-[var(--discover-text-secondary)] font-semibold cursor-pointer hover:bg-[var(--discover-primary)]/10 transition-colors">
                +12
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--discover-text-primary)] mb-3">
              ⭐ {t('reviews')}
            </h2>
            
            {/* Rating Summary */}
            <div className="bg-[var(--discover-card)] rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-6 h-6 fill-[var(--discover-accent)] text-[var(--discover-accent)]" />
                <span className="text-2xl font-bold text-[var(--discover-text-primary)]">
                  {place.rating}
                </span>
                <span className="text-[var(--discover-text-secondary)]">
                  ({place.reviewCount})
                </span>
              </div>
              <div className="space-y-2">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <span className="text-sm text-[var(--discover-text-secondary)] w-8">
                      {item.stars}★
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--discover-accent)]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-[var(--discover-text-secondary)] w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-4">
              {placeReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[var(--discover-card)] rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--discover-primary)] to-[var(--discover-secondary)] flex items-center justify-center text-white font-semibold">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--discover-text-primary)]">
                          {review.userName}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-[var(--discover-accent)] text-[var(--discover-accent)]"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-[var(--discover-text-secondary)]">
                      {review.date}
                    </span>
                  </div>
                  <p className="text-[var(--discover-text-secondary)]">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Write Review Button */}
            <button className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-[var(--discover-primary)] to-[var(--discover-secondary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              ✏️ {t('writeReview')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};