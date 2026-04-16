import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Lock, Eye, EyeOff, Mail } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const AuthPage: React.FC = () => {
  const { login, t, language, setLanguage } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    languagePreference: 'en' as 'en' | 'ar',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = await login(formData.username, formData.password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Try admin/admin123 or user/user123');
      }
    } else {
      // Registration logic
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      // In real app, would call registration API
      setError('Registration successful! Please login.');
      setIsLogin(true);
    }
  };

  const handleGuestContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md bg-white dark:bg-[var(--discover-surface)] rounded-3xl shadow-2xl p-8">
        {/* Logo/Illustration */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--discover-primary)] via-[var(--discover-secondary)] to-[var(--discover-accent)] flex items-center justify-center">
            <span className="text-5xl">🗺️</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--discover-text-primary)] mb-2">
            {t('discover')}
          </h1>
          <p className="text-[var(--discover-text-secondary)]">
            {t('exploreBeautifulPlaces')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-[var(--discover-card)] rounded-xl p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              isLogin
                ? 'bg-white dark:bg-[var(--discover-surface)] text-[var(--discover-primary)] shadow-sm'
                : 'text-[var(--discover-text-secondary)]'
            }`}
          >
            {t('signIn')}
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              !isLogin
                ? 'bg-white dark:bg-[var(--discover-surface)] text-[var(--discover-primary)] shadow-sm'
                : 'text-[var(--discover-text-secondary)]'
            }`}
          >
            {t('signUp')}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username/Email */}
          <div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--discover-text-secondary)]" />
              <input
                type="text"
                placeholder={t('usernameOrEmail')}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-[var(--discover-card)] rounded-xl border border-[var(--discover-border)] focus:border-[var(--discover-primary)] outline-none text-[var(--discover-text-primary)] transition-colors"
                required
              />
            </div>
          </div>

          {/* Email (Register only) */}
          {!isLogin && (
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--discover-text-secondary)]" />
                <input
                  type="email"
                  placeholder={t('email')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[var(--discover-card)] rounded-xl border border-[var(--discover-border)] focus:border-[var(--discover-primary)] outline-none text-[var(--discover-text-primary)] transition-colors"
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--discover-text-secondary)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-12 py-3 bg-[var(--discover-card)] rounded-xl border border-[var(--discover-border)] focus:border-[var(--discover-primary)] outline-none text-[var(--discover-text-primary)] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--discover-text-secondary)] hover:text-[var(--discover-text-primary)]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Register only) */}
          {!isLogin && (
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--discover-text-secondary)]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('confirmPassword')}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-[var(--discover-card)] rounded-xl border border-[var(--discover-border)] focus:border-[var(--discover-primary)] outline-none text-[var(--discover-text-primary)] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--discover-text-secondary)] hover:text-[var(--discover-text-primary)]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Language Preference (Register only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm text-[var(--discover-text-secondary)] mb-2">
                {t('languagePreference')}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, languagePreference: 'en' })}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                    formData.languagePreference === 'en'
                      ? 'bg-[var(--discover-primary)] text-white'
                      : 'bg-[var(--discover-card)] text-[var(--discover-text-secondary)]'
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, languagePreference: 'ar' })}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                    formData.languagePreference === 'ar'
                      ? 'bg-[var(--discover-primary)] text-white'
                      : 'bg-[var(--discover-card)] text-[var(--discover-text-secondary)]'
                  }`}
                >
                  🇸🇦 العربية
                </button>
              </div>
            </div>
          )}

          {/* Remember Me & Forgot Password (Login only) */}
          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-[var(--discover-primary)] rounded"
                />
                <span className="text-sm text-[var(--discover-text-secondary)]">
                  {t('rememberMe')}
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-[var(--discover-primary)] hover:underline"
              >
                {t('forgotPassword')}
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-sm text-[var(--discover-danger)] bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-[var(--discover-primary)] to-[var(--discover-secondary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg"
          >
            {isLogin ? t('signIn') : t('signUp')}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[var(--discover-border)]" />
          <span className="text-sm text-[var(--discover-text-secondary)]">
            {t('orContinue')}
          </span>
          <div className="flex-1 h-px bg-[var(--discover-border)]" />
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button className="w-full py-3 px-6 bg-white dark:bg-[var(--discover-card)] border-2 border-[var(--discover-border)] rounded-xl font-medium text-[var(--discover-text-primary)] hover:bg-gray-50 dark:hover:bg-[var(--discover-surface)] transition-colors flex items-center justify-center gap-2">
            <span className="text-xl">G</span>
            {t('signInWithGoogle')}
          </button>
          <button className="w-full py-3 px-6 bg-white dark:bg-[var(--discover-card)] border-2 border-[var(--discover-border)] rounded-xl font-medium text-[var(--discover-text-primary)] hover:bg-gray-50 dark:hover:bg-[var(--discover-surface)] transition-colors flex items-center justify-center gap-2">
            <span className="text-xl"></span>
            {t('signInWithApple')}
          </button>
        </div>

        {/* Switch Mode */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-[var(--discover-text-secondary)]"
          >
            {isLogin ? t('dontHaveAccount') : t('haveAccount')}{' '}
            <span className="text-[var(--discover-primary)] hover:underline font-medium">
              {isLogin ? t('signUp') : t('signIn')} →
            </span>
          </button>
        </div>

        {/* Guest Continue */}
        <div className="text-center mt-4">
          <button
            onClick={handleGuestContinue}
            className="text-sm text-[var(--discover-text-secondary)] hover:text-[var(--discover-primary)] transition-colors"
          >
            {t('continueAsGuest')}
          </button>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-center text-[var(--discover-text-secondary)]">
          Demo: admin/admin123 or user/user123
        </div>
      </div>
    </div>
  );
};
