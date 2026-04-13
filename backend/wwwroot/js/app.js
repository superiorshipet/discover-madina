// ============================================
// DISCOVER MADINA — Main App Logic
// ============================================

let map, markers = [], currentFilter = 'all', currentPlace = null, currentRating = 0;
let chatbotOpen = false;
let chatHistory = [];

// Routing state
let userLocation = null;
let userLocationMarker = null;
let routeLayer = null;

// Gallery state
let currentPhotoIndex = 0;
let currentPhotos = [];

// Auth functions
function getToken()    { return localStorage.getItem('token'); }
function getUsername() { return localStorage.getItem('username'); }
function getRole()     { return localStorage.getItem('role') || 'guest'; }
function isLoggedIn()  { return getRole() !== 'guest' && getToken(); }
function isAdmin()     { return getRole() === 'admin' || getRole() === 'superadmin'; }

function toggleAdminBtn() {
  const adminBtn = document.getElementById('adminBtn');
  if (adminBtn) {
    adminBtn.classList.toggle('hidden', !isAdmin());
  }
}

function initAuthGuard() {
  const role = getRole();
  if (!localStorage.getItem('role')) {
    localStorage.setItem('role', 'guest');
  }
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

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  if (!initAuthGuard()) return;

  const role = getRole();
  const username = getUsername();

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    if (isLoggedIn() && username) {
      loginBtn.innerHTML = `🚪 تسجيل الخروج (${username})`;
      loginBtn.onclick = logout;
      loginBtn.href = '#';
    } else {
      loginBtn.textContent = '🔐 تسجيل الدخول';
      loginBtn.href = 'pages/login.html';
      loginBtn.onclick = null;
    }
  }

  const welcomeMsg = document.getElementById('welcomeMsg');
  const userNameSpan = document.getElementById('userNameSpan');
  if (welcomeMsg && username && isLoggedIn()) {
    userNameSpan.textContent = username;
    welcomeMsg.style.display = 'block';
  }

  toggleAdminBtn();
  initMap();

  try {
    await loadAttractionsFromAPI();
  } catch (e) {
    console.error('App init error:', e);
  }

  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.classList.add('hidden');
      setTimeout(() => { if (map) map.invalidateSize(true); }, 100);
    }
  }, 100);
});

// Map initialization
function initMap() {
  map = L.map('map', { zoomControl: false, attributionControl: false }).setView([24.4672, 39.6111], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  window.addEventListener('resize', () => { if (map) map.invalidateSize(); });
}

// Load attractions from API
async function loadAttractionsFromAPI() {
  try {
    const res = await fetch(`${API_BASE}/attractions`);
    if (res.ok) {
      const data = await res.json();
      if (data.length > 0) {
        window.LIVE_PLACES = data.map(a => ({
          id: a.id, name: a.name, nameEn: a.nameEn,
          category: a.category, icon: a.icon,
          lat: parseFloat(a.latitude), lng: parseFloat(a.longitude),
          rating: a.ratingAvg || 0, reviews: 0, hours: a.openingHours,
          description: a.description, imageUrl: a.imageUrl,
          photos: a.photos || [],
          tags: [a.category], featured: a.isFeatured
        }));
        renderPlacesList(window.LIVE_PLACES);
        renderMarkers(window.LIVE_PLACES);
        renderBottomSheet(window.LIVE_PLACES.filter(p => p.featured));
        return;
      }
    }
  } catch(e) { console.warn('API unavailable, using local data'); }
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

// Sidebar
function toggleSidebar() {
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.toggle('mobile-open');
    setTimeout(() => map.invalidateSize(), 220);
  }
}

// Filter
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

// Places list
function renderPlacesList(places) {
  const el = document.getElementById('placesList');
  if (!places.length) {
    el.innerHTML = '<p style="color:var(--text-dim);font-size:.85rem;padding:16px;text-align:center">لا توجد نتائج</p>';
    return;
  }
  el.innerHTML = places.map(p => `
    <div class="place-card" onclick="openDetailById(${p.id})">
      <div class="pc-icon ${p.category}">${p.imageUrl
        ? `<img src="${window.location.origin}${p.imageUrl}" onerror="this.parentElement.textContent='${p.icon}'">`
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

// Detail panel with gallery
function openDetailById(id) {
  const place = getActivePlaces().find(p => p.id === id);
  if (place) openDetail(place);
}

function openDetail(place) {
  currentPlace = place;
  currentPhotos = place.photos || [];
  currentPhotoIndex = 0;
  
  updateDetailContent();
  document.getElementById('detailPanel').classList.add('open');
  map.setView([place.lat, place.lng], 15, { animate: true });
  clearRoute();
}

function updateDetailContent() {
  const place = currentPlace;
  const imgEl = document.getElementById('detailImg');
  
  if (currentPhotos.length > 0) {
    renderGallery();
  } else if (place.imageUrl) {
    imgEl.innerHTML = `<img src="${window.location.origin}${place.imageUrl}" onerror="this.parentElement.textContent='${place.icon}'">`;
  } else {
    imgEl.textContent = place.icon;
  }
  
  document.getElementById('detailCat').textContent = CATEGORY_LABELS[place.category];
  document.getElementById('detailName').textContent = place.name;
  document.getElementById('detailRating').textContent = `★ ${place.rating}`;
  document.getElementById('detailHours').textContent = `⏰ ${place.hours}`;
  document.getElementById('detailDesc').textContent = place.description;
}

function renderGallery() {
  const imgEl = document.getElementById('detailImg');
  const currentPhoto = currentPhotos[currentPhotoIndex];
  
  let html = `
    <div style="position:relative;width:100%;height:100%;">
      <img src="${currentPhoto.imageUrl}" 
           style="width:100%;height:100%;object-fit:cover;" 
           onerror="this.parentElement.parentElement.textContent='${currentPlace.icon}'">
  `;
  
  if (currentPhotos.length > 1) {
    html += `
      <button class="gallery-nav prev" onclick="prevPhoto()">←</button>
      <button class="gallery-nav next" onclick="nextPhoto()">→</button>
      <div class="photo-counter">${currentPhotoIndex + 1} / ${currentPhotos.length}</div>
      <div class="gallery-dots">
        ${currentPhotos.map((_, i) => `
          <div class="gallery-dot ${i === currentPhotoIndex ? 'active' : ''}" onclick="goToPhoto(${i})"></div>
        `).join('')}
      </div>
    `;
  }
  
  html += '</div>';
  imgEl.innerHTML = html;
}

function nextPhoto() {
  if (currentPhotos.length > 0) {
    currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
    renderGallery();
  }
}

function prevPhoto() {
  if (currentPhotos.length > 0) {
    currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
    renderGallery();
  }
}

function goToPhoto(index) {
  if (currentPhotos.length > 0 && index >= 0 && index < currentPhotos.length) {
    currentPhotoIndex = index;
    renderGallery();
  }
}

function closeDetail() {
  document.getElementById('detailPanel').classList.remove('open');
  clearRoute();
  currentPlace = null;
  currentPhotos = [];
  currentPhotoIndex = 0;
}

// Geolocation
function locateUser() {
  if (!navigator.geolocation) { showToast('الموقع غير مدعوم في هذا المتصفح'); return; }
  showToast('📍 جاري تحديد موقعك...');

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      userLocation = { lat, lng };

      if (userLocationMarker) map.removeLayer(userLocationMarker);

      userLocationMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          html: `<div style="position:relative;width:22px;height:22px;">
              <div style="position:absolute;top:0;left:0;width:22px;height:22px;border-radius:50%;background:rgba(74,144,217,0.25);animation:userPulse 1.8s ease-out infinite;"></div>
              <div style="position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#4A90D9;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);"></div>
            </div>`,
          className: '', iconSize: [22, 22], iconAnchor: [11, 11]
        })
      }).addTo(map).bindPopup('📍 أنت هنا').openPopup();

      map.setView([lat, lng], 15, { animate: true });
      showToast('✅ تم تحديد موقعك — اضغط "اتجاهاتي" لأي مكان');
    },
    err => {
      if (err.code === 1) showToast('❌ يرجى السماح بالوصول للموقع في المتصفح');
      else showToast('تعذّر الحصول على موقعك، حاول مرة أخرى');
    },
    { enableHighAccuracy: true, timeout: 12000 }
  );
}

// Directions
async function getDirections() {
  if (!currentPlace) return;

  if (!userLocation) {
    showToast('📍 يتم تحديد موقعك أولاً...');
    navigator.geolocation.getCurrentPosition(
      pos => {
        userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (userLocationMarker) map.removeLayer(userLocationMarker);
        userLocationMarker = L.marker([userLocation.lat, userLocation.lng], {
          icon: L.divIcon({
            html: `<div style="position:relative;width:22px;height:22px;">
              <div style="position:absolute;top:0;left:0;width:22px;height:22px;border-radius:50%;background:rgba(74,144,217,0.25);animation:userPulse 1.8s ease-out infinite;"></div>
              <div style="position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#4A90D9;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);"></div>
            </div>`,
            className: '', iconSize: [22, 22], iconAnchor: [11, 11]
          })
        }).addTo(map).bindPopup('📍 أنت هنا').openPopup();
        drawRoute();
      },
      () => showToast('❌ يرجى تفعيل الموقع أولاً بالضغط على 📍'),
      { enableHighAccuracy: true, timeout: 12000 }
    );
    return;
  }
  drawRoute();
}

async function drawRoute() {
  if (!userLocation || !currentPlace) return;

  clearRoute();
  showToast('🗺️ جاري حساب أقصر طريق...');

  const start = [userLocation.lng, userLocation.lat];
  const end   = [currentPlace.lng, currentPlace.lat];

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Route service error');
    const data = await res.json();

    if (!data.routes || data.routes.length === 0) {
      showToast('⚠️ لم يتم العثور على مسار');
      return;
    }

    const route = data.routes[0];
    const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
    const distKm  = (route.distance / 1000).toFixed(1);
    const distMin = Math.round(route.duration / 60);

    routeLayer = L.polyline(coords, {
      color: '#4A90D9', weight: 5, opacity: 0.85, lineJoin: 'round', lineCap: 'round'
    }).addTo(map);

    map.fitBounds(routeLayer.getBounds(), { padding: [60, 60] });
    showRouteBanner(distKm, distMin);
  } catch (e) {
    console.error('Routing error:', e);
    showToast('❌ فشل تحميل المسار، تحقق من الاتصال بالإنترنت');
  }
}

function clearRoute() {
  if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
  const banner = document.getElementById('routeBanner');
  if (banner) banner.remove();
}

function showRouteBanner(distKm, distMin) {
  const old = document.getElementById('routeBanner');
  if (old) old.remove();

  const banner = document.createElement('div');
  banner.id = 'routeBanner';
  banner.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:var(--bg-mid);border:1px solid var(--border);border-radius:16px;padding:12px 20px;display:flex;align-items:center;gap:16px;z-index:800;box-shadow:0 4px 20px rgba(0,0,0,0.5);direction:rtl;font-family:'Cairo',sans-serif;min-width:260px;`;
  banner.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:2px;">
      <span style="font-size:1rem;font-weight:700;color:var(--gold);">🗺️ ${distKm} كم</span>
      <span style="font-size:.8rem;color:var(--text-muted);">⏱ ${distMin} دقيقة تقريباً</span>
    </div>
    <div style="width:1px;height:36px;background:var(--border);"></div>
    <div style="font-size:.82rem;color:var(--text-main);flex:1;">إلى <strong>${currentPlace.name}</strong></div>
    <button onclick="clearRoute()" style="background:none;border:none;color:var(--text-muted);font-size:1.1rem;cursor:pointer;">✕</button>
  `;
  document.body.appendChild(banner);
}

// Save place
function savePlace() {
  if (!currentPlace) return;
  if (!isLoggedIn()) {
    showToast('🔐 سجّل دخولك أولاً لحفظ الأماكن');
    setTimeout(() => window.location.href = 'pages/login.html', 1500);
    return;
  }
  showToast(`✅ تم حفظ "${currentPlace.name}"`);
}

// Multiple image upload
function triggerImageUpload() {
  if (!currentPlace) return;
  if (!getToken()) { showToast('🔐 يجب تسجيل الدخول لرفع صورة'); return; }
  
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg,image/png,image/webp';
  input.multiple = true;
  input.onchange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (files.length > 5) {
      showToast('⚠️ الحد الأقصى 5 صور');
      return;
    }
    
    showToast(`⏳ جاري رفع ${files.length} صور...`);
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));
    
    try {
      const res = await fetch(`${API_BASE}/attractions/${currentPlace.id}/photos`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData
      });
      
      if (res.ok) {
        showToast('✅ تم رفع الصور بنجاح');
        await loadAttractionsFromAPI();
        const updated = getActivePlaces().find(p => p.id === currentPlace.id);
        if (updated) openDetail(updated);
      } else {
        showToast('❌ فشل رفع الصور');
      }
    } catch { showToast('❌ خطأ في الاتصال'); }
  };
  input.click();
}

// Chatbot
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

  const input = document.getElementById('chatInput');
  const sendBtn = document.querySelector('.send-btn');
  input.disabled = true;
  sendBtn.style.opacity = '0.5';
  sendBtn.disabled = true;

  const typingId = 'typing-' + Date.now();
  const body = document.getElementById('chatbotBody');
  body.innerHTML += `<div class="cb-msg bot" id="${typingId}"><div class="cb-bubble typing-indicator"><span></span><span></span><span></span></div></div>`;
  body.scrollTop = body.scrollHeight;

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory.slice(-8) })
    });

    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    if (response.ok) {
      const data = await response.json();
      const reply = data.reply || 'عذراً، لم أتمكن من الإجابة.';
      chatHistory.push({ role: 'assistant', content: reply });
      appendChatMsg(reply, 'bot');
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Chat API error:', error);
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    const fallback = 'عذراً، مشكلة في الاتصال بالمساعد الذكي.';
    appendChatMsg(fallback, 'bot');
    chatHistory.push({ role: 'assistant', content: fallback });
  } finally {
    input.disabled = false;
    sendBtn.style.opacity = '1';
    sendBtn.disabled = false;
    input.focus();
  }
}

function appendChatMsg(text, role) {
  const body = document.getElementById('chatbotBody');
  const div = document.createElement('div');
  div.className = `cb-msg ${role}`;
  div.innerHTML = `<div class="cb-bubble">${text.replace(/\n/g, '<br>')}</div>`;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

// User menu
function showUserMenu() {
  const existing = document.getElementById('userMenu');
  if (existing) { existing.remove(); return; }
  const menu = document.createElement('div');
  menu.id = 'userMenu';
  menu.style.cssText = `position:fixed;top:64px;left:20px;background:var(--bg-mid);border:1px solid var(--border);border-radius:var(--radius);padding:12px;z-index:1000;min-width:160px;box-shadow:var(--shadow);direction:rtl;`;
  menu.innerHTML = `
    <div style="font-size:.82rem;color:var(--text-muted);margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)">👤 ${getUsername()}</div>
    <button onclick="logout()" style="width:100%;background:none;border:none;color:var(--red);font-family:'Cairo',sans-serif;font-size:.88rem;cursor:pointer;text-align:right;padding:4px 0;">تسجيل الخروج</button>
  `;
  document.body.appendChild(menu);
  setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 10);
}

function logout() {
  localStorage.clear();
  window.location.href = 'pages/login.html';
}

// Review modal
function openReview() {
  if (!isLoggedIn()) {
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

// Toast
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}