import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Lock, Eye, EyeOff, Mail } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { API_BASE } from '../config/api';

export const AuthPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isLogin) {
      // Login
      const success = await login(formData.username, formData.password);
      setLoading(false);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } else {
      // Register
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      try {
        console.log('Registering with:', { 
          username: formData.username, 
          email: formData.email,
          password: '***' 
        });

        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            preferredLanguage: 'ar',
          }),
        });

        const data = await res.json();

        if (res.ok) {
          console.log('Registration successful:', data);
          setSuccess('Account created! You can now sign in.');
          // Switch to login form
          setIsLogin(true);
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        } else {
          console.error('Registration failed:', data);
          setError(data.message || 'Registration failed. Please try again.');
        }
      } catch (err) {
        console.error('Network error:', err);
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGuestContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-3xl">
            🗺️
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h1>

        <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          <button
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${isLogin ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${!isLogin ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-blue-500 outline-none text-gray-900 dark:text-white"
              required
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-blue-500 outline-none text-gray-900 dark:text-white"
                required
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-blue-500 outline-none text-gray-900 dark:text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-blue-500 outline-none text-gray-900 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handleGuestContinue}
            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Continue as Guest →
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Back to Map
          </button>
        </div>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-center text-gray-600 dark:text-gray-400">
          Demo: admin / admin123
        </div>
      </div>
    </div>
  );
};
