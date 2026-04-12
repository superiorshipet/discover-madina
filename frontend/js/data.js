// ============================================
// DISCOVER MADINA — Static Demo Data
// ============================================

// ✅ Auto-detect: Railway in production, localhost in development
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8080/api'
  : `${window.location.origin}/api`;

// Mock data removed - use only DB
const PLACES = [];

const CATEGORY_LABELS = { all:'الكل', religious:'ديني', cultural:'ثقافي', entertainment:'ترفيه', dining:'مطاعم' };

const CHATBOT_RESPONSES = {
  'أماكن مناسبة للعائلة': 'بالطبع! 🌟 أنصحك بحديقة الملك فهد للتنزه وسوق المدينة المركزي للتسوق العائلي.',
  'أقرب مطعم': 'قريباً منك يوجد مطعم البيك الشهير ومطعم مندي الدخيل للمأكولات التقليدية. 🍽️',
  'المسجد النبوي': 'المسجد النبوي مفتوح 24/7 في قلب المدينة المنورة. 🕌 يمكنك الوصول سيراً من معظم الفنادق.',
  'default': 'شكراً لسؤالك! 😊 يمكنني مساعدتك في إيجاد الأماكن الدينية والثقافية والمطاعم. ماذا تريد؟'
};