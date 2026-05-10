// ============================================
// AUTO TRANSLATION FOR ALL PAGES
// ============================================

(function() {
  var saved = localStorage.getItem('language');
  if (saved && saved !== 'ar') {
    document.documentElement.lang = saved;
    document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    applyTranslations();
  }, 500);
});

function applyTranslations() {
  var lang = localStorage.getItem('language') || 'ar';
  
  if (lang !== 'en') return;
  
  var dict = {
    'تسجيل الدخول': 'Sign In',
    'تسجيل الخروج': 'Logout',
    'إنشاء حساب': 'Sign Up',
    'المتابعة كضيف': 'Continue as Guest',
    'تصفح كضيف': 'Browse as Guest',
    'اسم المستخدم أو البريد الإلكتروني': 'Username or Email',
    'كلمة المرور': 'Password',
    'تأكيد كلمة المرور': 'Confirm Password',
    'أدخل اسم المستخدم': 'Enter username',
    'أدخل كلمة المرور': 'Enter password',
    'مستخدم': 'User',
    'مشرف': 'Admin',
    'أو': 'or',
    'جاري التحقق...': 'Verifying...',
    'جاري الإنشاء...': 'Creating...',
    'أضف تقييمك': 'Write Review',
    'شاركنا تجربتك...': 'Share your experience...',
    'إرسال التقييم': 'Submit Review',
    'إلغاء': 'Cancel',
    'أماكن مقترحة': 'Suggested Places',
    'اليوم': 'Today',
    'ابحث عن مسجد، متحف، مطعم...': 'Search mosques, museums...',
    'الكل': 'All',
    'موقعي': 'My Location',
    'ديني': 'Religious',
    'ثقافي': 'Cultural',
    'ترفيه': 'Entertainment',
    'مطاعم': 'Dining',
    'نظرة عامة': 'Overview',
    'الأماكن': 'Places',
    'التقييمات': 'Reviews',
    'المستخدمون': 'Users',
    'المشرفون': 'Admins',
    'العودة للخريطة': 'Back to Map',
    'لوحة الإدارة': 'Admin Panel',
    'الكشف المدينة': 'Discover Madina',
    'مرحبا': 'Welcome',
    'لا توجد نتائج': 'No results',
    'لا توجد أماكن': 'No places',
    'جاري التحميل': 'Loading...',
    'حفظ': 'Save',
    'مسح': 'Clear',
    'حذف': 'Delete',
    'تعديل': 'Edit',
    'موافقة': 'Approve',
    'رفض': 'Reject',
    'معلّق': 'Pending',
    'تمت الموافقة': 'Approved',
    'مرفوض': 'Rejected',
    'إضافة': 'Add',
    'إغلاق': 'Close',
    '← العودة للخريطة': 'back to map',
    '🚪 تسجيل الخروج': 'logout',
    '⚙️ لوحة الإدارة': 'Admin Panel',
  };
  
  walkText(document.body, dict);
}

function walkText(node, dict) {
  if (!node) return;
  
  if (node.nodeType === 3) {
    var text = node.textContent.trim();
    if (text && dict[text]) {
      node.textContent = dict[text];
    }
  } else if (node.nodeType === 1) {
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
      return;
    }
    
    for (var i = 0; i < node.childNodes.length; i++) {
      walkText(node.childNodes[i], dict);
    }
  }
}
