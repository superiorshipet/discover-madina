// ============================================
// DISCOVER MADINA — API Configuration
// ============================================

// On Railway: window.location.origin = https://discover-madina-production.up.railway.app
// Locally:    window.location.origin = http://localhost:8080
// Using relative /api means it ALWAYS hits the same server — no hardcoding needed.
const API_BASE = '/api';

const PLACES = [];

const CATEGORY_LABELS = {
  all: 'الكل',
  religious: 'ديني',
  cultural: 'ثقافي',
  entertainment: 'ترفيه',
  dining: 'مطاعم'
};

const CHATBOT_RESPONSES = {
  'أماكن مناسبة للعائلة': 'بالطبع! 🌟 أنصحك بحديقة الملك فهد للتنزه وسوق المدينة المركزي للتسوق العائلي.',
  'أقرب مطعم': 'قريباً منك يوجد مطعم البيك الشهير ومطعم مندي الدخيل للمأكولات التقليدية. 🍽️',
  'المسجد النبوي': 'المسجد النبوي مفتوح 24/7 في قلب المدينة المنورة. 🕌 يمكنك الوصول سيراً من معظم الفنادق.',
  'default': 'شكراً لسؤالك! 😊 يمكنني مساعدتك في إيجاد الأماكن الدينية والثقافية والمطاعم. ماذا تريد؟'
};