// ============================================
// DISCOVER MADINA — API Configuration
// Auto-detects local vs production environment
// ============================================

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? `http://localhost:${window.location.port || 8080}/api`
  : '/api';   // On Railway: same origin, no hardcoded host needed

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