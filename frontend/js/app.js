// ============================================
// DISCOVER MADINA — Main App Logic
// ============================================
// API_BASE from data.js

let map, markers = [], currentFilter = 'all', currentPlace = null, currentRating = 0;
let chatbotOpen = false;
let chatHistory = []; // full conversation history for ChatGPT-style memory

// ── AUTH GUARD ────────────────────────────────
function getToken()    { return localStorage.getItem('token'); }
function getUsername() { return localStorage.getItem('username'); }
function getRole()     { return localStorage.getItem('role') || 'guest'; }
function isLoggedIn()  { return getRole() !== null; }
function isAdmin()     { return getRole() === 'admin' || getRole() === 'superadmin'; }

function toggleAdminBtn() {
  const adminBtn = document.getElementById('adminBtn');
  if (adminBtn) {
    adminBtn.classList.toggle('hidden', !isAdmin());
  }
}

function initAuthGuard() {
  const role = getRole();
  if (!isLoggedIn()) {
    // Hide splash immediately and redirect to login
    const splash = document.getElementById('splash');
    if (splash) splash.classList.add('hidden');
    window.location.href = 'pages/login.html';
    return false;
  }
  // Logged in - hide splash and check admin
  const splash = document.getElementById('splash');
  if (splash) splash.classList.add('hidden');
  toggleAdminBtn();
  return true;
}

function authFetch(url, options = {}) {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Auth guard first
  if (!initAuthGuard()) return;

// Update UI for logged-in user
  const role = getRole();
  const username = getUsername();
  
  // 1. Login button → Logout
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    if (isLoggedIn() && username) {
      loginBtn.innerHTML = `🔐 تسجيل الخروج (${username})`;
      loginBtn.onclick = logout;
    } else {
      loginBtn.textContent = '🔐 تسجيل الدخول';
      loginBtn.href = 'pages/login.html';
      loginBtn.onclick = null;
    }
  }
  
  // 2. Welcome message
  const welcomeMsg = document.getElementById('welcomeMsg');
  const userNameSpan = document.getElementById('userNameSpan');
  if (welcomeMsg && username && isLoggedIn()) {
    userNameSpan.textContent = username;
    welcomeMsg.style.display = 'block';
  }
  
  // 3. Topbar user icon
  const userBtn = document.querySelector('.icon-btn[title="حسابي"]');
  if (userBtn && username && role !== 'guest') {
    userBtn.textContent = username[0].toUpperCase();
    userBtn.title = username;
    userBtn.style.background = 'linear-gradient(135deg,var(--gold-dim),var(--gold))';
    userBtn.style.color = 'var(--bg-deep)';
    userBtn.style.fontWeight = '700';
    userBtn.style.fontSize = '.85rem';
    userBtn.href = '#';
    userBtn.onclick = (e) => { e.preventDefault(); showUserMenu(); };
  }
  
  // 4. Admin btn (already handled)
  toggleAdminBtn();

  // Init app
  initMap();
  
  try {
    await loadAttractionsFromAPI();
  } catch (e) {
    console.error('App init error:', e);
    // Fallback always works
  }

  // Ensure splash gone
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.classList.add('hidden');
      setTimeout(() => { if (map) map.invalidateSize(true); }, 100);
    }
  }, 100); // Fast hide for logged-in users
});

// ── MAP ───────────────────────────────────────
function initMap() {
  map = L.map('map', { zoomControl: false, attributionControl: false }).setView([24.4672, 39.6111], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  window.addEventListener('resize', () => { if (map) map.invalidateSize(); });
}

// ── LOAD FROM API ─────────────────────────────
async function loadAttractionsFromAPI() {
  try {
    const res = await fetch(`${API_BASE}/attractions`);
    if (res.ok) {
      const data = await res.json();
      if (data.length > 0) {
        // Merge with local PLACES for map coords compatibility
        window.LIVE_PLACES = data.map(a => ({
          id: a.id, name: a.name, nameEn: a.nameEn,
          category: a.category, icon: a.icon,
          lat: parseFloat(a.latitude), lng: parseFloat(a.longitude),
          rating: a.ratingAvg || 0, reviews: 0, hours: a.openingHours,
          description: a.description, imageUrl: a.imageUrl,
          tags: [a.category], featured: a.isFeatured
        }));
        // Auto refresh LIVE_PLACES every 30s for admin changes
        setInterval(loadAttractionsFromAPI, 30000);
        renderPlacesList(window.LIVE_PLACES);
        renderMarkers(window.LIVE_PLACES);
        renderBottomSheet(window.LIVE_PLACES.filter(p => p.featured));
        return;
      }
    }
  } catch(e) { console.warn('API unavailable, using local data'); }
  // Fallback to static data
  renderPlacesList(PLACES);
  renderMarkers(PLACES);
  renderBottomSheet(PLACES.filter(p => p.featured));
}

function getActivePlaces() { return window.LIVE_PLACES || PLACES; }

function renderMarkers(places) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  places.forEach(p => {
    const icon = L.divIcon({
      html: `<div class="custom-marker ${p.category}">${p.icon}</div>`,
      className: '', iconSize: [36,36], iconAnchor: [18,18]
    });
    const m = L.marker([p.lat, p.lng], { icon })
      .addTo(map)
      .on('click', () => openDetail(p));
    markers.push(m);
  });
}

// ── SIDEBAR ───────────────────────────────────
function toggleSidebar() {
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.toggle('mobile-open');
    setTimeout(() => map.invalidateSize(), 220);
  }
}

// ── FILTER ────────────────────────────────────
function filterCat(btn, cat) {
  currentFilter = cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  applyFilter();
}
function filterCatMobile(btn, cat) {
  currentFilter = cat;
  document.querySelectorAll('.cat-tab').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  applyFilter();
}
function applyFilter() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const all = getActivePlaces();
  let filtered = all.filter(p => {
    const matchCat = currentFilter === 'all' || p.category === currentFilter;
    const matchQ   = !q || p.name.includes(q) || (p.nameEn||'').toLowerCase().includes(q);
    return matchCat && matchQ;
  });
  renderPlacesList(filtered);
  renderMarkers(filtered);
}
function doSearch() { applyFilter(); }

// ── PLACES LIST ───────────────────────────────
function renderPlacesList(places) {
  const el = document.getElementById('placesList');
  if (!places.length) {
    el.innerHTML = '<p style="color:var(--text-dim);font-size:.85rem;padding:16px;text-align:center">لا توجد نتائج</p>';
    return;
  }
  el.innerHTML = places.map(p => `
    <div class="place-card" onclick="openDetailById(${p.id})">
      <div class="pc-icon ${p.category}">${p.imageUrl
        ? `<img src="http://localhost:5001${p.imageUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" onerror="this.parentElement.textContent='${p.icon}'">`
        : p.icon}</div>
      <div class="pc-body">
        <div class="pc-name">${p.name}</div>
        <div class="pc-sub">${CATEGORY_LABELS[p.category]} · ${p.hours}</div>
      </div>
      <div class="pc-rating">★ ${p.rating}</div>
    </div>
  `).join('');
}

function renderBottomSheet(places) {
  const el = document.getElementById('bsCards');
  el.innerHTML = places.map(p => `
    <div class="bs-card" onclick="openDetailById(${p.id})">
      <div class="bs-card-icon">${p.icon}</div>
      <div class="bs-card-name">${p.name}</div>
      <div class="bs-card-meta">${p.hours}</div>
      <div class="bs-card-rating">★ ${p.rating}</div>
    </div>
  `).join('');
}

// ── DETAIL PANEL ──────────────────────────────
function openDetailById(id) {
  const place = getActivePlaces().find(p => p.id === id);
  if (place) openDetail(place);
}

function openDetail(place) {
  currentPlace = place;
  const imgEl = document.getElementById('detailImg');
  if (place.imageUrl) {
    imgEl.innerHTML = `<img src="http://localhost:5001${place.imageUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.textContent='${place.icon}'">`;
  } else {
    imgEl.textContent = place.icon;
  }
  document.getElementById('detailCat').textContent = CATEGORY_LABELS[place.category];
  document.getElementById('detailName').textContent = place.name;
  document.getElementById('detailRating').textContent = `★ ${place.rating}`;
  document.getElementById('detailHours').textContent = `⏰ ${place.hours}`;
  document.getElementById('detailDesc').textContent = place.description;
  document.getElementById('detailPanel').classList.add('open');
  map.setView([place.lat, place.lng], 15, { animate: true });
}

function closeDetail() {
  document.getElementById('detailPanel').classList.remove('open');
  currentPlace = null;
}

function getDirections() {
  if (!currentPlace) return;
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${currentPlace.lat},${currentPlace.lng}`, '_blank');
}

function savePlace() {
  if (!currentPlace) return;
  if (!isLoggedIn() || getRole() === 'guest') {
    showToast('🔐 سجّل دخولك أولاً لحفظ الأماكن');
    setTimeout(() => window.location.href = 'pages/login.html', 1500);
    return;
  }
  showToast(`✅ تم حفظ "${currentPlace.name}"`);
}

// ── IMAGE UPLOAD ──────────────────────────────
function triggerImageUpload() {
  if (!currentPlace) return;
  if (!getToken()) { showToast('🔐 يجب تسجيل الدخول لرفع صورة'); return; }
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg,image/png,image/webp';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    showToast('⏳ جاري رفع الصورة...');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/attractions/${currentPlace.id}/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        currentPlace.imageUrl = data.imageUrl;
        openDetail(currentPlace);
        showToast('✅ تم رفع الصورة بنجاح');
        loadAttractionsFromAPI();
      } else {
        showToast('❌ فشل رفع الصورة');
      }
    } catch { showToast('❌ خطأ في الاتصال'); }
  };
  input.click();
}

// ── GEOLOCATION ───────────────────────────────
function locateUser() {
  if (!navigator.geolocation) { showToast('الموقع غير مدعوم'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    map.setView([pos.coords.latitude, pos.coords.longitude], 15);
    L.marker([pos.coords.latitude, pos.coords.longitude], {
      icon: L.divIcon({ html: '<div style="background:#4A90D9;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.5)"></div>', className:'', iconSize:[16,16] })
    }).addTo(map).bindPopup('أنت هنا').openPopup();
  }, () => showToast('تعذّر الحصول على موقعك'));
}

// ── CHATBOT (ChatGPT-style with memory) ───────
function openChatbot() {
  chatbotOpen = true;
  document.getElementById('chatbot').classList.add('open');
  document.getElementById('chatbotFab').classList.add('hidden');
  document.getElementById('chatInput').focus();
}
function closeChatbot() {
  chatbotOpen = false;
  document.getElementById('chatbot').classList.remove('open');
  document.getElementById('chatbotFab').classList.remove('hidden');
}
function clearChat() {
  chatHistory = [];
  const body = document.getElementById('chatbotBody');
  body.innerHTML = `
    <div class="cb-msg bot"><div class="cb-bubble">مرحباً مجدداً! 🌙 كيف أقدر أساعدك؟</div></div>
    <div class="cb-suggestions">
      <button onclick="sendSuggestion(this)">أماكن مناسبة للعائلة</button>
      <button onclick="sendSuggestion(this)">أقرب مطعم</button>
      <button onclick="sendSuggestion(this)">المسجد النبوي</button>
    </div>`;
}

function sendSuggestion(btn) {
  const text = btn.textContent;
  btn.parentElement.remove();
  sendChatMessage(text);
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  await sendChatMessage(text);
}

async function sendChatMessage(text) {
  appendChatMsg(text, 'user');
  chatHistory.push({ role: 'user', content: text });

  // Local GPT-like responses - no API needed
  const typingId = 'typing-' + Date.now();
  const body = document.getElementById('chatbotBody');
  body.innerHTML += `<div class="cb-msg bot" id="${typingId}"><div class="cb-bubble typing-indicator"><span></span><span></span><span></span></div></div>`;
  body.scrollTop = body.scrollHeight;

  // Simulate thinking delay
  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    // GPT-style response based on context + history
    let reply = generateGPTResponse(text, chatHistory);
    chatHistory.push({ role: 'assistant', content: reply });
    appendChatMsg(reply, 'bot');
    document.getElementById('chatInput').focus();
  }, 800 + Math.random() * 1200);
}

function generateGPTResponse(query, history) {
  const madinaContext = `You are مرشد المدينة, expert guide for Madinah attractions (religious, cultural, entertainment, dining). Respond in fluent Arabic. Be helpful, detailed, recommend based on location/family etc. Key places: المسجد النبوي, مسجد قباء, متحف المدينة, حديقة الملك فهد, مطعم البيك. Always suggest nearby or featured.`;

  const keywords = {
    'مسجد': '🕌 المسجد النبوي الأقرب، مفتوح 24 ساعة. مساجد أخرى: قباء (24.4397,39.6151), القبلتين.',
    'مطعم': '🍽️ أقرب: البيك (24.468,39.609), مندي الدخيل. للعائلة: مطاعم قريبة من الحديقة.',
    'عائلة': '👨‍👩‍👧 حديقة الملك فهد مثالية للأطفال, سوق المدينة المركزي للتسوق.',
    'متحف': '🏛️ متحف المدينة المنورة (24.471,39.6125) - تاريخ وتراث.',
    'ساعات': 'معظم الأماكن مفتوحة 9ص-10م, المساجد 24/7.'
  };

  // Simple matching + context
  query = query.toLowerCase();
  for (let k in keywords) if (query.includes(k)) return keywords[k];

  // Fallback based on history
  if (history.length > 1) return 'بناءً على استفسارك السابق, أنصح بالمسجد النبوي كأفضل وجهة. 🌙 ماذا تريد بالتفصيل؟';

  return 'مرحبا! 🌙 أخبرني ما تبحث: أماكن دينية, ثقافية, مطاعم, عائلية? أقرب مكان لك أو أفضل التقييمات?';
}

function appendChatMsg(text, role) {
  const body = document.getElementById('chatbotBody');
  const div = document.createElement('div');
  div.className = `cb-msg ${role}`;
  // Support newlines in replies
  div.innerHTML = `<div class="cb-bubble">${text.replace(/\n/g, '<br>')}</div>`;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

// ── USER MENU ─────────────────────────────────
function showUserMenu() {
  const existing = document.getElementById('userMenu');
  if (existing) { existing.remove(); return; }
  const menu = document.createElement('div');
  menu.id = 'userMenu';
  menu.style.cssText = `position:fixed;top:64px;left:20px;background:var(--bg-mid);border:1px solid var(--border);border-radius:var(--radius);padding:12px;z-index:1000;min-width:160px;box-shadow:var(--shadow);direction:rtl;`;
  menu.innerHTML = `
    <div style="font-size:.82rem;color:var(--text-muted);margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)">👤 ${getUsername()}</div>
    <button onclick="logout()" style="width:100%;background:none;border:none;color:var(--red,#e05555);font-family:'Cairo',sans-serif;font-size:.88rem;cursor:pointer;text-align:right;padding:4px 0;">تسجيل الخروج</button>
  `;
  document.body.appendChild(menu);
  setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 10);
}

function logout() {
  localStorage.clear();
  window.location.href = 'pages/login.html';
}

// ── REVIEW MODAL ──────────────────────────────
function openReview() {
  if (!isLoggedIn() || getRole() === 'guest') {
    showToast('🔐 سجّل دخولك أولاً للتقييم');
    setTimeout(() => window.location.href = 'pages/login.html', 1500);
    return;
  }
  document.getElementById('reviewOverlay').classList.add('open');
  currentRating = 0;
  updateStars(0);
}
function closeReview() { document.getElementById('reviewOverlay').classList.remove('open'); }
function setRating(v)  { currentRating = v; updateStars(v); }
function updateStars(v) {
  document.querySelectorAll('#starsInput span').forEach((s, i) => s.classList.toggle('active', i < v));
}
async function submitReview() {
  const text = document.getElementById('reviewText').value.trim();
  if (!currentRating) { showToast('الرجاء اختيار تقييم'); return; }
  try {
    await authFetch(`${API_BASE}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating: currentRating, comment: text, attractionId: currentPlace?.id, userId: 1 })
    });
  } catch(e) {}
  closeReview();
  document.getElementById('reviewText').value = '';
  showToast('✅ تم إرسال تقييمك، شكراً!');
}

// ── TOAST ─────────────────────────────────────
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
