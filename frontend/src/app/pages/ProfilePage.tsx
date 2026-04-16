import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Globe, Sun, Moon, Bell, HelpCircle, Mail, FileText, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const ProfilePage: React.FC = () => {
  const { user, logout, language, setLanguage, theme, toggleTheme, t } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const stats = [
    { value: 12, label: t('saved') },
    { value: 45, label: t('reviews') },
    { value: 8, label: t('photos_count') },
  ];

  const ChevronIcon = language === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-[var(--discover-bg)]">
      {/* Header */}
      <div className="bg-white dark:bg-[var(--discover-surface)] border-b border-[var(--discover-border)] px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            {language === 'ar' ? (
              <ChevronRight className="w-6 h-6 text-[var(--discover-text-primary)]" />
            ) : (
              <ChevronLeft className="w-6 h-6 text-[var(--discover-text-primary)]" />
            )}
          </button>
          <h1 className="text-2xl font-bold text-[var(--discover-text-primary)]">
            {t('profile')}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[var(--discover-surface)] rounded-3xl shadow-sm p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--discover-primary)] to-[var(--discover-secondary)] flex items-center justify-center text-white text-3xl font-bold mb-4">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-[var(--discover-text-primary)] mb-1">
              {user?.username || 'Guest User'}
            </h2>
            <p className="text-[var(--discover-text-secondary)]">
              {user?.email || 'guest@discover.com'}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 bg-[var(--discover-card)] rounded-xl"
              >
                <div className="text-2xl font-bold text-[var(--discover-text-primary)] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--discover-text-secondary)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-[var(--discover-surface)] rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--discover-border)]">
            <h3 className="font-semibold text-[var(--discover-text-primary)]">
              {t('settings')}
            </h3>
          </div>

          <div className="divide-y divide-[var(--discover-border)]">
            {/* Language */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[var(--discover-text-secondary)]" />
                <span className="text-[var(--discover-text-primary)]">{t('language')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--discover-text-secondary)]">
                  {language === 'en' ? 'English 🇺🇸' : 'العربية 🇸🇦'}
                </span>
                <ChevronIcon className="w-5 h-5 text-[var(--discover-text-secondary)]" />
              </div>
            </button>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="w-5 h-5 text-[var(--discover-text-secondary)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--discover-text-secondary)]" />
                )}
                <span className="text-[var(--discover-text-primary)]">{t('theme')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--discover-text-secondary)]">
                  {theme === 'dark' ? t('dark') : t('light')} {theme === 'dark' ? '🌙' : '☀️'}
                </span>
                <ChevronIcon className="w-5 h-5 text-[var(--discover-text-secondary)]" />
              </div>
            </button>

            {/* Notifications */}
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[var(--discover-text-secondary)]" />
                <span className="text-[var(--discover-text-primary)]">{t('notifications')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--discover-primary)]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white dark:bg-[var(--discover-surface)] rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--discover-border)]">
            <h3 className="font-semibold text-[var(--discover-text-primary)]">
              {t('support')}
            </h3>
          </div>

          <div className="divide-y divide-[var(--discover-border)]">
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[var(--discover-text-secondary)]" />
                <span className="text-[var(--discover-text-primary)]">{t('helpCenter')}</span>
              </div>
              <ChevronIcon className="w-5 h-5 text-[var(--discover-text-secondary)]" />
            </button>

            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--discover-text-secondary)]" />
                <span className="text-[var(--discover-text-primary)]">{t('contactUs')}</span>
              </div>
              <ChevronIcon className="w-5 h-5 text-[var(--discover-text-secondary)]" />
            </button>

            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--discover-text-secondary)]" />
                <span className="text-[var(--discover-text-primary)]">{t('privacyPolicy')}</span>
              </div>
              <ChevronIcon className="w-5 h-5 text-[var(--discover-text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 px-6 bg-white dark:bg-[var(--discover-surface)] rounded-3xl shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 text-[var(--discover-danger)] font-medium"
        >
          <LogOut className="w-5 h-5" />
          {t('logOut')}
        </button>
      </div>
    </div>
  );
};
