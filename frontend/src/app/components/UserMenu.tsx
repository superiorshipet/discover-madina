import React, { useState, useRef, useEffect } from 'react';
import { User, LogIn, UserCircle, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';

export const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout, t } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => navigate('/auth')}
        className="w-12 h-12 rounded-full bg-white dark:bg-[var(--discover-surface)] shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
        aria-label="Login"
      >
        <LogIn className="w-5 h-5 text-[var(--discover-neutral)]" />
      </button>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--discover-primary)] to-[var(--discover-secondary)] text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center font-bold"
      >
        {user?.username.charAt(0).toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-56 bg-white dark:bg-[var(--discover-surface)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--discover-border)]">
          {/* User Info */}
          <div className="p-4 border-b border-[var(--discover-border)]">
            <div className="font-semibold text-[var(--discover-text-primary)]">
              {user?.username}
            </div>
            <div className="text-sm text-[var(--discover-text-secondary)]">
              {user?.email}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--discover-card)] transition-colors text-left"
            >
              <UserCircle className="w-5 h-5 text-[var(--discover-text-secondary)]" />
              <span className="text-[var(--discover-text-primary)]">{t('profile')}</span>
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => {
                  navigate('/admin');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--discover-card)] transition-colors text-left"
              >
                <Shield className="w-5 h-5 text-[var(--discover-text-secondary)]" />
                <span className="text-[var(--discover-text-primary)]">{t('dashboard')}</span>
              </button>
            )}

            <button
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate('/');
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-[var(--discover-danger)]"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('logOut')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
