import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';
type Theme = 'light' | 'dark';
type UserRole = 'user' | 'admin' | null;

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    search: 'Search for places...',
    filter: 'Filter',
    nearbyPlaces: 'Nearby Places',
    viewAll: 'View All',
    myLocation: 'My Location',
    themeToggle: 'Toggle Theme',
    language: 'Language',
    openNow: 'Open Now',
    closedNow: 'Closed Now',
    kmAway: 'km away',
    reviews: 'reviews',
    
    // Place Details
    directions: 'Directions',
    save: 'Save',
    share: 'Share',
    information: 'Information',
    hours: 'Hours',
    phone: 'Phone',
    website: 'Website',
    price: 'Price',
    description: 'Description',
    readMore: 'Read more',
    photos: 'Photos',
    writeReview: 'Write a Review',
    
    // Auth
    discover: 'Discover',
    exploreBeautifulPlaces: 'Explore beautiful places',
    usernameOrEmail: 'Username or Email',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot?',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    orContinue: 'or continue',
    signInWithGoogle: 'Sign in with Google',
    signInWithApple: 'Sign in with Apple',
    dontHaveAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    continueAsGuest: 'Continue as Guest',
    email: 'Email',
    confirmPassword: 'Confirm Password',
    languagePreference: 'Language Preference',
    
    // Profile
    profile: 'Profile',
    saved: 'Saved',
    photos_count: 'Photos',
    settings: 'Settings',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    notifications: 'Notifications',
    support: 'Support',
    helpCenter: 'Help Center',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    logOut: 'Log Out',
    
    // Admin
    dashboard: 'Dashboard',
    places: 'Places',
    pending: 'Pending',
    users: 'Users',
    overview: 'Overview',
    admins: 'Admins',
    recentActivity: 'Recent Activity',
    addNewPlace: 'Add New Place',
    placesManagement: 'Places Management',
    name: 'Name',
    category: 'Category',
    rating: 'Rating',
    status: 'Status',
    actions: 'Actions',
    active: 'Active',
    reviewsModeration: 'Reviews Moderation',
    approved: 'Approved',
    rejected: 'Rejected',
    approve: 'Approve',
    reject: 'Reject',
    adminsManagement: 'Admins Management',
    addNewAdmin: 'Add New Admin',
    username: 'Username',
    createAdmin: 'Create Admin',
    currentAdmins: 'Current Admins',
    you: 'you',
    delete: 'Delete',
    
    // Categories
    religious: 'Religious Site',
    historical: 'Historical Site',
    nature: 'Nature & Parks',
    restaurant: 'Restaurant',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    museum: 'Museum',
    hotel: 'Hotel',
  },
  ar: {
    // Common
    search: 'ابحث عن الأماكن...',
    filter: 'تصفية',
    nearbyPlaces: 'الأماكن القريبة',
    viewAll: 'عرض الكل',
    myLocation: 'موقعي',
    themeToggle: 'تبديل المظهر',
    language: 'اللغة',
    openNow: 'مفتوح الآن',
    closedNow: 'مغلق الآن',
    kmAway: 'كم بعيداً',
    reviews: 'تقييم',
    
    // Place Details
    directions: 'الاتجاهات',
    save: 'حفظ',
    share: 'مشاركة',
    information: 'معلومات',
    hours: 'ساعات العمل',
    phone: 'الهاتف',
    website: 'الموقع الإلكتروني',
    price: 'السعر',
    description: 'الوصف',
    readMore: 'اقرأ المزيد',
    photos: 'الصور',
    writeReview: 'اكتب تقييماً',
    
    // Auth
    discover: 'اكتشف',
    exploreBeautifulPlaces: 'استكشف الأماكن الجميلة',
    usernameOrEmail: 'اسم المستخدم أو البريد الإلكتروني',
    password: 'كلمة المرور',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت؟',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    orContinue: 'أو المتابعة',
    signInWithGoogle: 'تسجيل الدخول بواسطة Google',
    signInWithApple: 'تسجيل الدخول بواسطة Apple',
    dontHaveAccount: 'ليس لديك حساب؟',
    haveAccount: 'لديك حساب بالفعل؟',
    continueAsGuest: 'المتابعة كضيف',
    email: 'البريد الإلكتروني',
    confirmPassword: 'تأكيد كلمة المرور',
    languagePreference: 'تفضيل اللغة',
    
    // Profile
    profile: 'الملف الشخصي',
    saved: 'المحفوظة',
    photos_count: 'الصور',
    settings: 'الإعدادات',
    theme: 'المظهر',
    dark: 'داكن',
    light: 'فاتح',
    notifications: 'الإشعارات',
    support: 'الدعم',
    helpCenter: 'مركز المساعدة',
    contactUs: 'اتصل بنا',
    privacyPolicy: 'سياسة الخصوصية',
    logOut: 'تسجيل الخروج',
    
    // Admin
    dashboard: 'لوحة التحكم',
    places: 'الأماكن',
    pending: 'قيد الانتظار',
    users: 'المستخدمون',
    overview: 'نظرة عامة',
    admins: 'المشرفون',
    recentActivity: 'النشاط الأخير',
    addNewPlace: 'إضافة مكان جديد',
    placesManagement: 'إدارة الأماكن',
    name: 'الاسم',
    category: 'الفئة',
    rating: 'التقييم',
    status: 'الحالة',
    actions: 'الإجراءات',
    active: 'نشط',
    reviewsModeration: 'مراجعة التقييمات',
    approved: 'موافق عليها',
    rejected: 'مرفوضة',
    approve: 'موافقة',
    reject: 'رفض',
    adminsManagement: 'إدارة المشرفين',
    addNewAdmin: 'إضافة مشرف جديد',
    username: 'اسم المستخدم',
    createAdmin: 'إنشاء مشرف',
    currentAdmins: 'المشرفون الحاليون',
    you: 'أنت',
    delete: 'حذف',
    
    // Categories
    religious: 'موقع ديني',
    historical: 'موقع تاريخي',
    nature: 'الطبيعة والمتنزهات',
    restaurant: 'مطعم',
    shopping: 'تسوق',
    entertainment: 'ترفيه',
    museum: 'متحف',
    hotel: 'فندق',
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('light');
  const [user, setUser] = useState<User | null>(null);

  // Load saved preferences
  useEffect(() => {
    const savedLang = localStorage.getItem('discover-language') as Language;
    const savedTheme = localStorage.getItem('discover-theme') as Theme;
    const savedUser = localStorage.getItem('discover-user');
    
    if (savedLang) setLanguageState(savedLang);
    if (savedTheme) setThemeState(savedTheme);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Apply language direction
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('discover-language', lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('discover-theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call the API
    // Admin credentials: admin/admin123
    // User credentials: user/user123
    
    if (username === 'admin' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        username: 'admin',
        email: 'admin@discover.com',
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('discover-user', JSON.stringify(adminUser));
      return true;
    } else if (username === 'user' && password === 'user123') {
      const regularUser: User = {
        id: '2',
        username: 'user',
        email: 'user@discover.com',
        role: 'user',
      };
      setUser(regularUser);
      localStorage.setItem('discover-user', JSON.stringify(regularUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('discover-user');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        user,
        setUser,
        isAuthenticated: !!user,
        login,
        logout,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
