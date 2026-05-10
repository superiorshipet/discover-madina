// Force language on page load
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
  
  // Debug
  console.log('i18n: Applying translations for language:', lang);
  
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
  };
  
  walkAndTranslate(document.body, dict);
}

function walkAndTranslate(node, dict) {
  if (!node) return;
  if (node.nodeType === 3) {
    var text = node.textContent.trim();
    if (text && dict[text]) {
      node.textContent = dict[text];
    }
  } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && node.tagName !== 'INPUT' && node.tagName !== 'TEXTAREA') {
    for (var i = 0; i < node.childNodes.length; i++) {
      walkAndTranslate(node.childNodes[i], dict);
    }
  }
}
