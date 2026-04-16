import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Globe, Sun, Moon, HelpCircle, Mail, FileText, LogOut, User, Star, Bookmark, Camera } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { API_BASE } from '../config/api';

export const ProfilePage: React.FC = () => {
  const { user, logout, language, setLanguage, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'reviews'>('profile');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ChevronIcon = language === 'ar' ? ChevronLeft : ChevronRight;

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }

    try {
      const res = await fetch(`${API_BASE}/profile`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        const reviewsRes = await fetch(`${API_BASE}/profile/reviews`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (reviewsRes.ok) setMyReviews(await reviewsRes.json());
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/profile/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({ ...profile, profileImageUrl: data.imageUrl });
        alert('✅ Profile image updated!');
      } else {
        const err = await res.text();
        alert('❌ Upload failed: ' + err);
      }
    } catch (err) {
      alert('❌ Network error');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/auth'); };

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="text-4xl animate-pulse">⏳</div></div>;
  if (error || !profile) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="text-center"><p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'Unable to load profile'}</p><button onClick={fetchProfile} className="px-4 py-2 bg-blue-500 text-white rounded-xl mr-2">Retry</button><button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-500 text-white rounded-xl">Back to Map</button></div></div>;

  const profileImageUrl = profile.profileImageUrl ? `${window.location.origin}${profile.profileImageUrl}` : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            {language === 'ar' ? <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  profile.username?.charAt(0).toUpperCase()
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={uploading}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-md flex items-center justify-center border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/jpeg,image/png,image/webp" className="hidden" />
            </div>
            {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-1">{profile.username}</h2>
            <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"><Bookmark className="w-6 h-6 text-blue-500 mx-auto mb-2" /><div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats?.saved || 0}</div><div className="text-sm text-gray-600 dark:text-gray-400">Saved</div></div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"><Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" /><div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats?.reviews || 0}</div><div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div></div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"><Camera className="w-6 h-6 text-green-500 mx-auto mb-2" /><div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats?.photos || 0}</div><div className="text-sm text-gray-600 dark:text-gray-400">Photos</div></div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          <button onClick={() => setActiveTab('profile')} className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}><User className="w-4 h-4" /> Settings</button>
          <button onClick={() => setActiveTab('reviews')} className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'reviews' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}><Star className="w-4 h-4" /> My Reviews ({myReviews.length})</button>
        </div>

        {activeTab === 'profile' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700"><h3 className="font-semibold text-gray-900 dark:text-white">Preferences</h3></div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"><div className="flex items-center gap-3"><Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" /><span className="text-gray-900 dark:text-white">Language</span></div><div className="flex items-center gap-2"><span className="text-gray-600 dark:text-gray-400">{language === 'en' ? 'English 🇺🇸' : 'العربية 🇸🇦'}</span><ChevronIcon className="w-5 h-5 text-gray-400" /></div></button>
                <button onClick={toggleTheme} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"><div className="flex items-center gap-3">{theme === 'light' ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}<span className="text-gray-900 dark:text-white">Theme</span></div><div className="flex items-center gap-2"><span className="text-gray-600 dark:text-gray-400">{theme === 'dark' ? 'Dark 🌙' : 'Light ☀️'}</span><ChevronIcon className="w-5 h-5 text-gray-400" /></div></button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden mt-6 border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700"><h3 className="font-semibold text-gray-900 dark:text-white">Support</h3></div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"><div className="flex items-center gap-3"><HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" /><span className="text-gray-900 dark:text-white">Help Center</span></div><ChevronIcon className="w-5 h-5 text-gray-400" /></button>
                <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"><div className="flex items-center gap-3"><Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" /><span className="text-gray-900 dark:text-white">Contact Us</span></div><ChevronIcon className="w-5 h-5 text-gray-400" /></button>
                <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" /><span className="text-gray-900 dark:text-white">Privacy Policy</span></div><ChevronIcon className="w-5 h-5 text-gray-400" /></button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            {myReviews.length === 0 ? (
              <div className="text-center py-8"><Star className="w-12 h-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-600 dark:text-gray-400">You haven't written any reviews yet.</p><button onClick={() => navigate('/')} className="mt-4 text-blue-500 hover:underline">Explore places to review</button></div>
            ) : (
              <div className="space-y-4">
                {myReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2"><h4 className="font-semibold text-gray-900 dark:text-white">{review.attractionName}</h4><span className={`text-xs px-2 py-1 rounded-full ${review.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{review.status}</span></div>
                    <div className="flex items-center gap-1 mb-2">{Array(review.rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment || 'No comment'}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button onClick={handleLogout} className="w-full py-4 px-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-medium mt-6 border border-gray-200 dark:border-gray-700"><LogOut className="w-5 h-5" /> Log Out</button>
      </div>
    </div>
  );
};
