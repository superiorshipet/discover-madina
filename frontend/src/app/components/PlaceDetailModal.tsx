import React, { useState } from 'react';
import { X, Star, Navigation, Bookmark, Share2, Clock, Phone, Globe as WebIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Place } from '../data/mockData';
import { API_BASE } from '../config/api';

interface PlaceDetailModalProps {
  place: Place;
  onClose: () => void;
  onSave?: (place: Place) => void;
  onDirections?: (place: Place) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose, onSave, onDirections }) => {
  const { language, t, isAuthenticated, user } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const placeName = language === 'ar' ? place.nameAr : place.name;
  const placeDescription = language === 'ar' ? place.descriptionAr : place.description;
  const photos = place.photos || [];

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews/attraction/${place.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {}
  };

  React.useEffect(() => { fetchReviews(); }, [place.id]);

  const handleSubmitReview = async () => {
    if (!isAuthenticated) { alert('Please login first'); return; }
    if (rating === 0) { alert('Please select a rating'); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rating, comment, attractionId: place.id })
      });
      if (res.ok) {
        alert('✅ Review submitted for approval!');
        setShowReviewModal(false);
        setRating(0);
        setComment('');
        fetchReviews();
      } else {
        alert('❌ Failed to submit review');
      }
    } catch { alert('❌ Error'); }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center" onClick={onClose}>
      <div className="bg-white dark:bg-[var(--discover-surface)] w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-[var(--discover-surface)] z-10 px-4 py-3 flex justify-between items-center border-b border-[var(--discover-border)]">
          <h2 className="font-bold text-lg">{placeName}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="relative h-64 bg-gradient-to-br from-blue-100 to-emerald-100">
          {photos.length > 0 ? (
            <>
              <img src={`${window.location.origin}${photos[currentImageIndex].imageUrl}`} alt={placeName} className="w-full h-full object-cover" />
              {photos.length > 1 && (
                <>
                  <button onClick={() => setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"><ChevronLeft /></button>
                  <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % photos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"><ChevronRight /></button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">{photos.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`} />)}</div>
                </>
              )}
            </>
          ) : place.thumbnail ? (
            <img src={place.thumbnail} alt={placeName} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl">{place.category === 'religious' ? '🕌' : '📍'}</div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2"><span className="text-2xl">{place.category === 'religious' ? '🕌' : '📍'}</span><span className="text-sm text-[var(--discover-text-secondary)]">{place.category}</span></div>
          <div className="flex items-center gap-2"><Star className="w-5 h-5 fill-[var(--discover-accent)] text-[var(--discover-accent)]" /><span className="font-semibold">{place.rating}</span><span className="text-[var(--discover-text-secondary)]">({place.reviewCount} reviews)</span></div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => onDirections?.(place)} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[var(--discover-primary)]/10 hover:bg-[var(--discover-primary)]/20"><Navigation className="w-5 h-5 text-[var(--discover-primary)]" /><span className="text-xs">Directions</span></button>
            <button onClick={() => onSave?.(place)} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[var(--discover-accent)]/10 hover:bg-[var(--discover-accent)]/20"><Bookmark className="w-5 h-5 text-[var(--discover-accent)]" /><span className="text-xs">Save</span></button>
            <button onClick={() => setShowReviewModal(true)} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[var(--discover-secondary)]/10 hover:bg-[var(--discover-secondary)]/20"><Star className="w-5 h-5 text-[var(--discover-secondary)]" /><span className="text-xs">Review</span></button>
          </div>

          <div className="space-y-2"><h3 className="font-semibold">📋 Info</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-[var(--discover-text-secondary)]">Hours</span><span>{place.hours}</span></div></div></div>

          <div><h3 className="font-semibold mb-2">📝 Description</h3><p className="text-sm text-[var(--discover-text-secondary)]">{showFullDescription ? placeDescription : placeDescription.slice(0, 150) + '...'}<button onClick={() => setShowFullDescription(!showFullDescription)} className="text-[var(--discover-primary)] ml-2">[{showFullDescription ? 'Less' : 'More'}]</button></p></div>

          <div><h3 className="font-semibold mb-3">⭐ Reviews</h3>{reviews.length === 0 ? <p className="text-sm text-[var(--discover-text-secondary)]">No reviews yet.</p> : reviews.slice(0, 3).map((r) => <div key={r.id} className="border-b border-[var(--discover-border)] py-3"><div className="flex items-center gap-2"><span className="font-medium">{r.username}</span><div className="flex">{Array(r.rating).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-[var(--discover-accent)] text-[var(--discover-accent)]" />)}</div></div><p className="text-sm text-[var(--discover-text-secondary)]">{r.comment}</p></div>)}</div>
        </div>
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReviewModal(false)}>
          <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <div className="flex gap-2 mb-4 text-3xl">{[1, 2, 3, 4, 5].map((i) => <button key={i} onClick={() => setRating(i)} className={`${rating >= i ? 'text-[var(--discover-accent)]' : 'text-gray-300'}`}>★</button>)}</div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." className="w-full p-3 border rounded-xl mb-4" rows={3} />
            <div className="flex gap-2"><button onClick={handleSubmitReview} disabled={submitting} className="flex-1 py-2 bg-[var(--discover-primary)] text-white rounded-xl">{submitting ? 'Submitting...' : 'Submit'}</button><button onClick={() => setShowReviewModal(false)} className="flex-1 py-2 border rounded-xl">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
