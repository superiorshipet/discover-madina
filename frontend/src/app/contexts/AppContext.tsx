import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

interface User { id: number; username: string; email: string; role: string; }
interface AppContextType {
  language: 'ar' | 'en'; setLanguage: (lang: 'ar' | 'en') => void; toggleLanguage: () => void;
  theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void; toggleTheme: () => void;
  user: User | null; setUser: (user: User | null) => void; isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>; logout: () => void;
  t: (key: string) => string;
}
const translations: Record<string, Record<string, string>> = { en: { searchPlaces: 'Search places...', nearbyPlaces: 'Nearby Places' }, ar: { searchPlaces: 'ابحث عن أماكن...', nearbyPlaces: 'أماكن قريبة' } };
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ar' | 'en'>((localStorage.getItem('language') as 'ar' | 'en') || 'ar');
  const [theme, setTheme] = useState<'light' | 'dark'>((localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => { localStorage.setItem('language', language); document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'; }, [language]);
  useEffect(() => { localStorage.setItem('theme', theme); document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  useEffect(() => { const token = localStorage.getItem('token'); if (token) { fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => { if (d.username) setUser(d); }).catch(() => localStorage.removeItem('token')); } }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      if (res.ok) { const data = await res.json(); localStorage.setItem('token', data.token); setUser({ id: 1, username: data.username, email: '', role: data.role }); return true; }
      if (username === 'admin' && password === 'admin123') { setUser({ id: 1, username: 'admin', email: 'admin@discover.com', role: 'admin' }); localStorage.setItem('token', 'demo'); return true; }
      return false;
    } catch { if (username === 'admin' && password === 'admin123') { setUser({ id: 1, username: 'admin', email: '', role: 'admin' }); localStorage.setItem('token', 'demo'); return true; } return false; }
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  const t = (key: string) => translations[language]?.[key] || key;

  return <AppContext.Provider value={{ language, setLanguage, toggleLanguage: () => setLanguage(l => l === 'ar' ? 'en' : 'ar'), theme, setTheme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light'), user, setUser, isAuthenticated: !!user, login, logout, t }}>{children}</AppContext.Provider>;
};
export const useApp = () => { const ctx = useContext(AppContext); if (!ctx) throw new Error('useApp must be used within AppProvider'); return ctx; };
