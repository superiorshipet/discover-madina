// ============================================
// DISCOVER MADINA — Static Demo Data
// Replace with API calls to .NET backend
// ============================================

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8080/api'
  : `${window.location.origin}/api`;
// Mock data removed - use only DB
const PLACES = [
  {
    id: 1, name: "المسجد النبوي", nameEn: "Al-Masjid an-Nabawi", category: "religious", icon: "🕌",
    lat: 24.5242, lng: 39.6111, rating: 5.0, reviews: 1200, hours: "24/7", 
    description: "الجامع الأنور، قبلة المسلمين الثانية.", imageUrl: "", tags: ["religious"], featured: true
  },
  {
    id: 2, name: "مسجد قباء", nameEn: "Quba Mosque", category: "religious", icon: "🕌",
    lat: 24.4594, lng: 39.5953, rating: 4.9, reviews: 450, hours: "5ص - 11م", 
    description: "أول مسجد في الإسلام، بني بيدي الرسول ﷺ.", imageUrl: "", tags: ["religious"], featured: true
  },
  {
    id: 3, name: "جبل أحد", nameEn: "Mount Uhud", category: "cultural", icon: "⛰️",
    lat: 24.5267, lng: 39.6411, rating: 4.7, reviews: 320, hours: "دائماً", 
    description: "موقع غزوة أحد التاريخية.", imageUrl: "", tags: ["cultural"], featured: true
  },
  {
    id: 4, name: "قلعة أحد", nameEn: "Uhud Castle", category: "cultural", icon: "🏰",
    lat: 24.5205, lng: 39.6402, rating: 4.6, reviews: 280, hours: "9ص - 6م", 
    description: "متحف ومعلم عثماني تاريخي.", imageUrl: "", tags: ["cultural"], featured: false
  },
  {
    id: 5, name: "حديقة الملك فهد", nameEn: "King Fahd Park", category: "entertainment", icon: "🌳",
    lat: 24.4700, lng: 39.6200, rating: 4.4, reviews: 150, hours: "8ص - 11م", 
    description: "حديقة عامة واسعة للتنزه واللعب.", imageUrl: "", tags: ["entertainment"], featured: true
  },
  {
    id: 6, name: "مطعم مندي الدخيل", nameEn: "Mandi Al Dukheil", category: "dining", icon: "🍗",
    lat: 24.4750, lng: 39.6150, rating: 4.5, reviews: 89, hours: "11ص - 1ص", 
    description: "مندي وكبسة أصيلة.", imageUrl: "", tags: ["dining"], featured: false
  }
];

const CATEGORY_LABELS = { all:'الكل', religious:'ديني', cultural:'ثقافي', entertainment:'ترفيه', dining:'مطاعم' };

const CHATBOT_RESPONSES = {
  'أماكن مناسبة للعائلة': 'بالطبع! 🌟 أنصحك بحديقة الملك فهد للتنزه وسوق المدينة المركزي للتسوق العائلي.',
  'أقرب مطعم': 'قريباً منك يوجد مطعم البيك الشهير ومطعم مندي الدخيل للمأكولات التقليدية. 🍽️',
  'المسجد النبوي': 'المسجد النبوي مفتوح 24/7 في قلب المدينة المنورة. 🕌 يمكنك الوصول سيراً من معظم الفنادق.',
  'default': 'شكراً لسؤالك! 😊 يمكنني مساعدتك في إيجاد الأماكن الدينية والثقافية والمطاعم. ماذا تريد؟'
};
