import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { LayoutDashboard, MapPin, Star, Users, Crown, Settings, Menu, X, Plus, Edit, Trash2, Check, XIcon, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { mockPlaces, mockReviews, mockStats, mockAdmins } from '../data/mockData';

type AdminView = 'overview' | 'places' | 'reviews' | 'users' | 'admins' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { user, logout, t, language } = useApp();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reviewFilter, setReviewFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const pendingReviews = mockReviews.filter(r => r.status === 'pending');
  const approvedReviews = mockReviews.filter(r => r.status === 'approved');

  const menuItems = [
    { id: 'overview' as AdminView, icon: LayoutDashboard, label: t('overview') },
    { id: 'places' as AdminView, icon: MapPin, label: t('places') },
    { id: 'reviews' as AdminView, icon: Star, label: t('reviews') },
    { id: 'users' as AdminView, icon: Users, label: t('users') },
    { id: 'admins' as AdminView, icon: Crown, label: t('admins') },
    { id: 'settings' as AdminView, icon: Settings, label: t('settings') },
  ];

  return (
    <div className="min-h-screen bg-[var(--discover-bg)] flex" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 md:w-20'
        } bg-white dark:bg-[var(--discover-surface)] border-r border-[var(--discover-border)] transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[var(--discover-border)]">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--discover-primary)] to-[var(--discover-secondary)] flex items-center justify-center text-white text-xl">
                🗺️
              </div>
              <span className="font-bold text-xl text-[var(--discover-text-primary)]">
                {t('discover')}
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--discover-primary)] to-[var(--discover-secondary)] flex items-center justify-center text-white text-xl">
              🗺️
            </div>
          )}
        </div>

        {/* Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id
                  ? 'bg-[var(--discover-primary)] text-white shadow-lg'
                  : 'text-[var(--discover-text-secondary)] hover:bg-[var(--discover-card)]'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[var(--discover-border)]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--discover-danger)] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">{t('logOut')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--discover-text-primary)] mb-2">
              {menuItems.find(i => i.id === currentView)?.label}
            </h1>
            <p className="text-[var(--discover-text-secondary)]">
              Welcome back, {user.username}!
            </p>
          </div>

          {/* Overview */}
          {currentView === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 shadow-sm">
                  <div className="text-4xl font-bold text-[var(--discover-text-primary)] mb-2">
                    {mockStats.totalPlaces}
                  </div>
                  <div className="text-[var(--discover-text-secondary)]">{t('places')}</div>
                </div>
                <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 shadow-sm">
                  <div className="text-4xl font-bold text-[var(--discover-accent)] mb-2">
                    {mockStats.pendingPlaces}
                  </div>
                  <div className="text-[var(--discover-text-secondary)]">{t('pending')}</div>
                </div>
                <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 shadow-sm">
                  <div className="text-4xl font-bold text-[var(--discover-text-primary)] mb-2">
                    {mockStats.totalUsers}
                  </div>
                  <div className="text-[var(--discover-text-secondary)]">{t('users')}</div>
                </div>
                <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 shadow-sm">
                  <div className="text-4xl font-bold text-[var(--discover-text-primary)] mb-2">
                    {mockStats.totalPhotos}
                  </div>
                  <div className="text-[var(--discover-text-secondary)]">{t('photos')}</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[var(--discover-text-primary)] mb-4">
                  {t('recentActivity')}
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[var(--discover-text-secondary)]">
                    <div className="w-2 h-2 rounded-full bg-[var(--discover-secondary)]" />
                    <span>New place added: Central Park</span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--discover-text-secondary)]">
                    <div className="w-2 h-2 rounded-full bg-[var(--discover-primary)]" />
                    <span>Review approved for Grand Canyon</span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--discover-text-secondary)]">
                    <div className="w-2 h-2 rounded-full bg-[var(--discover-accent)]" />
                    <span>New user registered</span>
                  </div>
                </div>
              </div>

              {/* Add New Place Button */}
              <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[var(--discover-primary)] to-[var(--discover-secondary)] text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Places Management */}
          {currentView === 'places' && (
            <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--discover-card)] border-b border-[var(--discover-border)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--discover-text-primary)]">
                        {t('name')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--discover-text-primary)]">
                        {t('category')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--discover-text-primary)]">
                        {t('rating')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--discover-text-primary)]">
                        {t('status')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--discover-text-primary)]">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--discover-border)]">
                    {mockPlaces.slice(0, 6).map((place) => (
                      <tr key={place.id} className="hover:bg-[var(--discover-card)]/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-xl">
                              🏛️
                            </div>
                            <span className="font-medium text-[var(--discover-text-primary)]">
                              {place.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[var(--discover-text-secondary)]">
                          {t(place.category)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-[var(--discover-accent)] text-[var(--discover-accent)]" />
                            <span className="font-medium text-[var(--discover-text-primary)]">
                              {place.rating}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--discover-secondary)]/10 text-[var(--discover-secondary)]">
                            {t('active')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-[var(--discover-primary)]/10 rounded-lg transition-colors">
                              <Edit className="w-4 h-4 text-[var(--discover-primary)]" />
                            </button>
                            <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-[var(--discover-danger)]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews Moderation */}
          {currentView === 'reviews' && (
            <div className="space-y-6">
              {/* Filter Tabs */}
              <div className="flex gap-2 bg-white dark:bg-[var(--discover-surface)] rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setReviewFilter('pending')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    reviewFilter === 'pending'
                      ? 'bg-[var(--discover-primary)] text-white shadow-sm'
                      : 'text-[var(--discover-text-secondary)]'
                  }`}
                >
                  {t('pending')} ({pendingReviews.length})
                </button>
                <button
                  onClick={() => setReviewFilter('approved')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    reviewFilter === 'approved'
                      ? 'bg-[var(--discover-primary)] text-white shadow-sm'
                      : 'text-[var(--discover-text-secondary)]'
                  }`}
                >
                  {t('approved')} ({approvedReviews.length})
                </button>
                <button
                  onClick={() => setReviewFilter('rejected')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    reviewFilter === 'rejected'
                      ? 'bg-[var(--discover-primary)] text-white shadow-sm'
                      : 'text-[var(--discover-text-secondary)]'
                  }`}
                >
                  {t('rejected')} (0)
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {mockReviews
                  .filter(r => r.status === reviewFilter)
                  .map((review) => (
                    <div
                      key={review.id}
                      className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-[var(--discover-text-primary)] mb-1">
                            {review.placeName}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--discover-text-secondary)]">
                            <span>👤 {review.userName}</span>
                            <span>•</span>
                            <div className="flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 fill-[var(--discover-accent)] text-[var(--discover-accent)]"
                                />
                              ))}
                            </div>
                            <span>•</span>
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[var(--discover-text-secondary)] mb-4">
                        "{review.comment}"
                      </p>
                      {reviewFilter === 'pending' && (
                        <div className="flex gap-3">
                          <button className="flex-1 py-2 px-4 bg-[var(--discover-secondary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <Check className="w-5 h-5" />
                            {t('approve')}
                          </button>
                          <button className="flex-1 py-2 px-4 bg-[var(--discover-danger)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <XIcon className="w-5 h-5" />
                            {t('reject')}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Users Management */}
          {currentView === 'users' && (
            <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--discover-text-secondary)] text-center py-8">
                User management interface coming soon...
              </p>
            </div>
          )}

          {/* Admins Management */}
          {currentView === 'admins' && (
            <div className="space-y-6">
              {/* Add New Admin Form */}
              <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[var(--discover-text-primary)] mb-4">
                  {t('addNewAdmin')}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t('username')}
                    className="px-4 py-3 bg-[var(--discover-card)] rounded-xl border border-[var(--discover-border)] focus:border-[var(--discover-primary)] outline-none text-[var(--discover-text-primary)]"
                  />
                  <input
                    type="password"
                    placeholder={t('password')}
                    className="px-4 py-3 bg-[var(--discover-card)] rounded-xl border border-[var(--discover-border)] focus:border-[var(--discover-primary)] outline-none text-[var(--discover-text-primary)]"
                  />
                </div>
                <button className="mt-4 w-full md:w-auto py-3 px-8 bg-gradient-to-r from-[var(--discover-primary)] to-[var(--discover-secondary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                  {t('createAdmin')}
                </button>
              </div>

              {/* Current Admins */}
              <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[var(--discover-text-primary)] mb-4">
                  {t('currentAdmins')}
                </h2>
                <div className="space-y-3">
                  {mockAdmins.map((admin, index) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-4 bg-[var(--discover-card)] rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--discover-primary)] to-[var(--discover-secondary)] flex items-center justify-center text-white font-bold">
                          {admin.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[var(--discover-text-primary)]">
                            {admin.username} {index === 0 && `(${t('you')})`}
                          </div>
                          <div className="text-sm text-[var(--discover-text-secondary)]">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                      {index !== 0 && (
                        <button className="text-[var(--discover-danger)] hover:underline">
                          {t('delete')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {currentView === 'settings' && (
            <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--discover-text-secondary)] text-center py-8">
                Settings interface coming soon...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
