import React, { useState, useRef } from 'react';
import { X, Star, Navigation, Bookmark, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Place } from '../data/mockData';
import { API_BASE } from '../config/api';
import { getImageUrl } from '../utils/imageUrl';

interface PlaceDetailModalProps {
  place: Place;
  onClose: () => void;
  onSave?: (place: Place) => void;
  onDirections?: (place: Place) => void;
  onPlaceUpdate?: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose, onSave, onDirections, onPlaceUpdate }) => {
  const { language, isAuthenticated } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const placeName = language === 'ar' ? place.nameAr : place.name;
  const placeDescription = language === 'ar' ? place.descriptionAr : place.description;
  const photos = place.photos || [];

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews/attraction/${place.id}`);
      if (res.ok) setReviews(await res.json());
    } catch {}
  };

  React.useEffect(() => { fetchReviews(); }, [place.id]);

  const handleSubmitReview = async () => {
    if (!isAuthenticated) { alert('Please login first'); return; }
    if (rating === 0) { setError('Please select a rating'); return; }
    setSubmitting(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rating, comment: comment || '', attractionId: place.id })
      });
      if (res.ok) {
        alert('✅ Review submitted!');
        setShowReviewModal(false); setRating(0); setComment('');
        fetchReviews();
        if (onPlaceUpdate) onPlaceUpdate();
      } else {
        const err = await res.json();
        setError(err.message || 'Failed to submit review');
      }
    } catch { setError('Network error'); }
    setSubmitting(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 5) { alert('Maximum 5 photos allowed'); return; }

    const token = localStorage.getItem('token');
    if (!token) { alert('Please login first'); return; }

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    try {
      const res = await fetch(`${API_BASE}/attractions/${place.id}/photos`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert(`✅ ${files.length} photo(s) uploaded!`);
        if (onPlaceUpdate) onPlaceUpdate();
        onClose();
      } else {
        alert('❌ Upload failed');
      }
    } catch { alert('❌ Network error'); }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">{placeName}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
        </div>

        <div className="relative h-64 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-gray-700 dark:to-gray-600">
          {photos.length > 0 ? (
            <>
              <img src={getImageUrl(photos[currentImageIndex].imageUrl)} alt={placeName} className="w-full h-full object-cover" />
              {photos.length > 1 && (
                <>
                  <button onClick={() => setCurrentImageIndex(p => (p - 1 + photos.length) % photos.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center"><ChevronLeft className="w-5 h-5" /></button>
                  <button onClick={() => setCurrentImageIndex(p => (p + 1) % photos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center"><ChevronRight className="w-5 h-5" /></button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">{photos.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`} />)}</div>
                </>
              )}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">{currentImageIndex + 1} / {photos.length}</div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl">{place.category === 'religious' ? '🕌' : '📍'}</div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2"><span className="text-2xl">{place.category === 'religious' ? '🕌' : '📍'}</span><span className="text-sm text-gray-600 dark:text-gray-400">{place.category}</span></div>
          <div className="flex items-center gap-2"><Star className="w-5 h-5 fill-yellow-500 text-yellow-500" /><span className="font-semibold text-gray-900 dark:text-white">{place.rating}</span><span className="text-gray-600 dark:text-gray-400">({place.reviewCount} reviews)</span></div>

          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => onDirections?.(place)} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"><Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" /><span className="text-xs text-gray-700 dark:text-gray-300">Directions</span></button>
            <button onClick={() => onSave?.(place)} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"><Bookmark className="w-5 h-5 text-yellow-600 dark:text-yellow-400" /><span className="text-xs text-gray-700 dark:text-gray-300">Save</span></button>
            <button onClick={() => setShowReviewModal(true)} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30"><Star className="w-5 h-5 text-green-600 dark:text-green-400" /><span className="text-xs text-gray-700 dark:text-gray-300">Review</span></button>
            {isAuthenticated && (
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30"><Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" /><span className="text-xs text-gray-700 dark:text-gray-300">{uploading ? '...' : 'Photos'}</span></button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/jpeg,image/png,image/webp" multiple className="hidden" />
          </div>

          <div className="space-y-2"><h3 className="font-semibold text-gray-900 dark:text-white">📋 Info</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Hours</span><span className="text-gray-900 dark:text-white">{place.hours}</span></div></div></div>

          <div><h3 className="font-semibold text-gray-900 dark:text-white mb-2">📝 Description</h3><p className="text-sm text-gray-600 dark:text-gray-400">{showFullDescription ? placeDescription : placeDescription.slice(0, 150) + '...'}<button onClick={() => setShowFullDescription(!showFullDescription)} className="text-blue-600 dark:text-blue-400 ml-2">[{showFullDescription ? 'Less' : 'More'}]</button></p></div>

          <div><h3 className="font-semibold text-gray-900 dark:text-white mb-3">⭐ Reviews ({reviews.length})</h3>{reviews.length === 0 ? <p className="text-sm text-gray-600 dark:text-gray-400">No reviews yet.</p> : reviews.slice(0, 5).map(r => <div key={r.id} className="border-b border-gray-200 dark:border-gray-700 py-3"><div className="flex items-center gap-2"><span className="font-medium text-gray-900 dark:text-white">{r.username}</span><div className="flex">{Array(r.rating).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />)}</div></div><p className="text-sm text-gray-600 dark:text-gray-400">{r.comment}</p></div>)}</div>
        </div>
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReviewModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Write a Review</h3>
            {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">{error}</div>}
            <div className="flex gap-2 mb-4 text-3xl">{[1,2,3,4,5].map(i => <button key={i} onClick={() => setRating(i)} className={`${rating >= i ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}>★</button>)}</div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" rows={3} />
            <div className="flex gap-2"><button onClick={handleSubmitReview} disabled={submitting} className="flex-1 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit'}</button><button onClick={() => { setShowReviewModal(false); setError(''); }} className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
