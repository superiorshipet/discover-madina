import React from 'react';
import { useNavigate } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-9xl">🗺️</div>
        <h1 className="text-6xl font-bold text-[var(--discover-text-primary)]">404</h1>
        <h2 className="text-2xl font-semibold text-[var(--discover-text-primary)]">
          Page Not Found
        </h2>
        <p className="text-[var(--discover-text-secondary)]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="py-3 px-6 bg-white dark:bg-[var(--discover-surface)] border-2 border-[var(--discover-border)] rounded-xl font-medium text-[var(--discover-text-primary)] hover:bg-gray-50 dark:hover:bg-[var(--discover-card)] transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="py-3 px-6 bg-gradient-to-r from-[var(--discover-primary)] to-[var(--discover-secondary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};
