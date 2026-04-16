I need a complete UI/UX design for a modern tourism/discovery web application called "Discover". The design must be completely different from any Islamic/Arabic-themed apps. This will bind to an existing .NET backend API.

═══════════════════════════════════════════════════════════
🎯 CORE REQUIREMENTS
═══════════════════════════════════════════════════════════

1. Bilingual Support: Arabic (RTL) and English (LTR) with smooth switching
2. Dark/Light Mode: Full theme support with CSS variables
3. No Chatbot: Remove completely
4. User Roles: Regular User + Admin only (no Super Admin)
5. Mobile-First: Responsive from 320px to 1440px+

═══════════════════════════════════════════════════════════
🎨 DESIGN SYSTEM
═══════════════════════════════════════════════════════════

COLORS:
Primary: #3B82F6 (Blue)
Secondary: #10B981 (Emerald)
Accent: #F59E0B (Amber)
Danger: #EF4444 (Red)
Neutral: #6B7280 (Gray)

DARK MODE:
- Background: #0F172A
- Surface: #1E293B
- Card: #334155
- Border: #475569
- Text Primary: #F8FAFC
- Text Secondary: #94A3B8

LIGHT MODE:
- Background: #F8FAFC
- Surface: #FFFFFF
- Card: #F1F5F9
- Border: #E2E8F0
- Text Primary: #0F172A
- Text Secondary: #64748B

TYPOGRAPHY:
- Font Family: 'Inter' or 'SF Pro Display' (Sans-serif)
- Arabic Font: 'Tajawal' or 'IBM Plex Sans Arabic'
- Headings: Bold, 24px/32px/40px
- Body: Regular, 14px/16px
- Small: 12px

SPACING:
- Base unit: 8px
- Padding: 8px, 16px, 24px, 32px
- Border Radius: 8px (small), 12px (medium), 16px (large), 9999px (pill)

SHADOWS:
- Card: 0 1px 3px rgba(0,0,0,0.1)
- Modal: 0 20px 25px -5px rgba(0,0,0,0.1)
- Floating: 0 10px 15px -3px rgba(0,0,0,0.1)

═══════════════════════════════════════════════════════════
📱 SCREEN 1: MAP VIEW (Main Screen)
═══════════════════════════════════════════════════════════

LAYOUT:
┌─────────────────────────────────────┐
│ [Search Bar - centered at top]      │  ← Floating search
│                                     │
│                                     │
│          [FULL SCREEN MAP]          │  ← Interactive map
│                                     │
│                                     │
│              [📍]                   │  ← Floating action buttons
│              [🌙]                   │  (bottom right, stacked)
│              [🌐]                   │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ≡  Nearby Places          [^]   │ │  ← Bottom sheet
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ │  (draggable)
│ │ [Card] [Card] [Card] ─────────→ │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

COMPONENTS:

1. SEARCH BAR (Floating)
   - Width: 90% (max 500px)
   - Position: Top center, 16px from top
   - Background: Glassmorphism (blur + semi-transparent)
   - Left icon: 🔍 Search
   - Placeholder: "Search for places..."
   - Right icon: ☰ Filter
   - Rounded: 9999px (full pill)

2. FLOATING ACTION BUTTONS (FABs)
   - Position: Bottom right, 80px from bottom (above sheet)
   - Stack vertically with 12px gap
   - Button 1: 📍 "My Location" (Blue)
   - Button 2: 🌙/☀️ "Theme Toggle" (Gray)
   - Button 3: 🌐 "Language" (Gray)
   - Size: 48x48px circular
   - Shadow: Medium

3. BOTTOM SHEET
   - 3 snap points: collapsed (120px), half (350px), full (90vh)
   - Drag handle: 36px width, 4px height, rounded
   - Header: "Nearby Places" + "View All" link
   - Collapsed: Horizontal scrollable cards (3 visible)
   - Half: 2-column grid of cards
   - Full: Vertical list with larger thumbnails

4. PLACE CARD (Horizontal)
   - Thumbnail: 60x60px, rounded-xl
   - Content:
     - Name (bold, 16px)
     - Category badge (pill, small)
     - ★ 4.5 (120 reviews)
     - 📍 0.5 km away
     - 🟢 Open Now
   - Hover: Scale 1.02, shadow lift

5. PLACE CARD (Vertical/Grid)
   - Thumbnail: 100% width, 140px height
   - Content stacked below image
   - Same metadata as horizontal

═══════════════════════════════════════════════════════════
📱 SCREEN 2: PLACE DETAIL (Modal/Sheet)
═══════════════════════════════════════════════════════════

LAYOUT (slides up from bottom):
┌─────────────────────────────────────┐
│ [✕]                                │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │    [HERO IMAGE CAROUSEL]        │ │  ← Swipeable images
│ │         ● ○ ○ ○ ○               │ │  ← Dot indicators
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🕌 Al-Masjid an-Nabawi              │  ← Place name
│ 🕌 Religious Site                   │  ← Category
│                                     │
│ ★ 4.8 (1,234 reviews)              │
│                                     │
│ ┌─────────┬─────────┬─────────┐    │
│ │ 🗺️      │ ⭐      │ 📤      │    │  ← Action buttons
│ │Directions│  Save   │  Share  │    │
│ └─────────┴─────────┴─────────┘    │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ 📋 Information                      │
│ ┌─────────────────────────────────┐ │
│ │ 🕐 Hours    │ 24/7              │ │
│ │ 📞 Phone    │ +966 XX XXX XXXX  │ │
│ │ 🌐 Website  │ www.example.com   │ │
│ │ 💰 Price    │ Free              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📝 Description                      │
│ The Prophet's Mosque is the second │
│ holiest site in Islam... [Read more]│
│                                     │
│ 📸 Photos                           │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ img │ │ img │ │ img │ │ +12 │   │  ← Photo grid
│ └─────┘ └─────┘ └─────┘ └─────┘   │
│                                     │
│ ⭐ Reviews                          │
│ ┌─────────────────────────────────┐ │
│ │ ★★★★★ 4.8 (1,234)              │ │  ← Rating summary
│ │ 5★ ████████░░ 70%              │ │
│ │ 4★ ████░░░░░░ 20%              │ │
│ │ 3★ ██░░░░░░░░ 5%               │ │
│ │ 2★ █░░░░░░░░░ 3%               │ │
│ │ 1★ ░░░░░░░░░░ 2%               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Ahmed M.    ★★★★★  2 days ago│ │
│ │ Amazing experience! The mosque  │ │
│ │ is beautiful and peaceful...    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [ ✏️ Write a Review ]               │  ← Button
│                                     │
└─────────────────────────────────────┘

INTERACTIONS:
- Carousel: Swipe left/right, dots update
- Photos grid: Tap to open lightbox gallery
- Reviews: Infinite scroll pagination
- "Read more": Expand/collapse description
- Action buttons: Hover/tap effects

═══════════════════════════════════════════════════════════
📱 SCREEN 3: AUTHENTICATION
═══════════════════════════════════════════════════════════

LAYOUT (centered card):
┌─────────────────────────────────────┐
│                                     │
│         [Logo/Illustration]         │  ← Abstract gradient blob
│                                     │
│           Discover                  │
│      Explore beautiful places       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Username or Email            │ │  ← Input with icon
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🔒 Password              👁️     │ │  ← Password with toggle
│ └─────────────────────────────────┘ │
│                                     │
│ [ ✓ Remember me ]   [Forgot?]      │
│                                     │
│ [ Sign In ]  ← Full width gradient  │
│                                     │
│ ──────────  or continue  ────────── │
│                                     │
│ [ G ] Sign in with Google           │  ← Social login
│ [  ] Sign in with Apple           │
│                                     │
│ Don't have an account? Sign Up →   │
│                                     │
│ [ Continue as Guest ]               │  ← Text link
│                                     │
└─────────────────────────────────────┘

TABS (toggle between):
[ Login ] [ Register ]

REGISTER FORM adds:
- Email field
- Confirm Password field
- Language preference (Arabic/English)

═══════════════════════════════════════════════════════════
📱 SCREEN 4: USER PROFILE
═══════════════════════════════════════════════════════════

LAYOUT:
┌─────────────────────────────────────┐
│ ←  Profile                          │
│ ─────────────────────────────────── │
│                                     │
│         [Avatar - 80px]             │
│          Ahmed Mohamed              │
│        ahmed@email.com              │
│                                     │
│ ┌─────────┬─────────┬─────────┐    │
│ │   12    │   45    │   8     │    │  ← Stats cards
│ │  Saved  │ Reviews │ Photos  │    │
│ └─────────┴─────────┴─────────┘    │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ Settings                            │
│ ┌─────────────────────────────────┐ │
│ │ 🌐 Language    English  🇺🇸  > │ │  ← Menu items
│ │ 🎨 Theme       Dark     🌙  > │ │
│ │ 🔔 Notifications        [Toggle]│ │
│ └─────────────────────────────────┘ │
│                                     │
│ Support                             │
│ ┌─────────────────────────────────┐ │
│ │ ❓ Help Center                > │ │
│ │ 📧 Contact Us                 > │ │
│ │ 📄 Privacy Policy             > │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [ Log Out ]  ← Red text button      │
│                                     │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════
📱 SCREEN 5: ADMIN DASHBOARD
═══════════════════════════════════════════════════════════

LAYOUT (Desktop - with collapsible sidebar):
┌──────────┬────────────────────────────────────────┐
│          │  Dashboard                              │
│  Discover│  ┌──────┬──────┬──────┬──────┐        │
│          │  │  12  │  3   │ 156  │ 45  │        │
│  ≡ Menu  │  │Places│Pending│Users│Photos│        │
│          │  └──────┴──────┴──────┴──────┘        │
│ 📊 Overview│                                        │
│ 📍 Places │  ─────────────────────────────────────  │
│ ⭐ Reviews │  Recent Activity                       │
│ 👥 Users  │  • New place added                     │
│ 👑 Admins │  • Review approved                     │
│ ⚙️ Settings│  • User registered                     │
│          │                                        │
│          │  [+ Add New Place]  ← Floating button  │
│          │                                        │
│ [Logout] │                                        │
└──────────┴────────────────────────────────────────┘

PLACES MANAGEMENT TABLE:
┌────┬──────────┬────────┬────────┬────────┬────────┐
│ 📷 │ Name     │Category│ Rating │ Status │ Actions│
├────┼──────────┼────────┼────────┼────────┼────────┤
│ 🖼️ │ Al-Masjid│Religious│ ★ 5.0 │ Active │ ✏️ 🗑️  │
│ 🖼️ │ Quba    │Religious│ ★ 4.9 │ Active │ ✏️ 🗑️  │
└────┴──────────┴────────┴────────┴────────┴────────┘

REVIEWS MODERATION:
Tabs: [Pending (3)] [Approved] [Rejected]

┌─────────────────────────────────────┐
│ 🕌 Al-Masjid an-Nabawi              │
│ 👤 Ahmed M.  ★★★★★  2 hours ago   │
│ "Amazing spiritual experience..."   │
│                                     │
│ [✓ Approve]  [✗ Reject]            │
└─────────────────────────────────────┘

ADMINS MANAGEMENT:
┌─────────────────────────────────────┐
│ [+ Add New Admin]                   │
│                                     │
│ Username: [________]                │
│ Password: [________]                │
│                                     │
│ [Create Admin]                      │
│ ─────────────────────────────────── │
│ Current Admins:                     │
│ • admin (you)                       │
│ • moderator    [Delete]             │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════
🧩 COMPONENTS LIBRARY (Create in Figma)
═══════════════════════════════════════════════════════════

1. Buttons
   - Primary: Gradient blue, rounded-lg
   - Secondary: Outlined, blue border
   - Ghost: Text only, hover background
   - Danger: Red text/background
   - Icon: 44x44px circular

2. Inputs
   - Text: With icon, rounded-lg, border
   - Password: With show/hide toggle
   - Search: Pill-shaped, glass background
   - Select: Dropdown with chevron

3. Cards
   - Place Card (Horizontal)
   - Place Card (Vertical)
   - Review Card
   - Stat Card

4. Modals & Sheets
   - Bottom Sheet (with snap points)
   - Centered Modal
   - Side Panel (desktop)
   - Toast Notification

5. Navigation
   - Top Bar (with back button)
   - Bottom Tab Bar (mobile)
   - Sidebar (desktop, collapsible)

6. States
   - Loading skeleton
   - Empty state (illustration + message)
   - Error state
   - Success state

═══════════════════════════════════════════════════════════
📐 RESPONSIVE BREAKPOINTS
═══════════════════════════════════════════════════════════

Mobile (< 768px):
- Stack everything vertically
- Bottom sheet for place list
- Full-screen modals
- Bottom tab navigation

Tablet (768px - 1024px):
- Side drawer for filters
- 2-column grid for cards
- Persistent search bar

Desktop (> 1024px):
- Persistent sidebar (collapsible)
- Detail panel on right side
- 3-4 column grid
- Hover effects enabled

═══════════════════════════════════════════════════════════
🎬 MICRO-INTERACTIONS (Specify in prototype)
═══════════════════════════════════════════════════════════

- Card hover: scale(1.02) + shadow transition (0.2s ease)
- Button press: scale(0.98)
- Sheet drag: Smooth rubber-band effect
- Image carousel: Swipe with momentum
- Pull-to-refresh: Custom spinner
- Skeleton loading: Pulse animation
- Toast: Slide in from bottom, auto-dismiss 3s
- Modal: Fade in + slide up
- Theme switch: Instant color transition
- Language switch: RTL/LTR flip animation

═══════════════════════════════════════════════════════════
🔗 API INTEGRATION NOTES
═══════════════════════════════════════════════════════════

These endpoints are available from the backend:

GET    /api/attractions          → List all places
GET    /api/attractions/{id}     → Get single place details
GET    /api/attractions/featured → Get featured places
POST   /api/attractions          → Admin: Create place
PUT    /api/attractions/{id}     → Admin: Update place
DELETE /api/attractions/{id}     → Admin: Delete place
POST   /api/attractions/{id}/photos → Upload images

GET    /api/reviews/attraction/{id} → Get reviews for place
POST   /api/reviews              → Submit review
PATCH  /api/reviews/{id}/status  → Admin: Approve/Reject
DELETE /api/reviews/{id}         → Admin: Delete review

POST   /api/auth/register        → User registration
POST   /api/auth/login           → User/Admin login
GET    /api/auth/me              → Get current user

GET    /api/users                → Admin: List users
DELETE /api/users/{id}           → Admin: Delete user

GET    /api/admins               → Admin: List admins
POST   /api/admins               → Admin: Create admin
DELETE /api/admins/{id}          → Admin: Delete admin

═══════════════════════════════════════════════════════════
✅ DELIVERABLES REQUIRED
═══════════════════════════════════════════════════════════

1. Complete Figma file with:
   - All 5 screens (Map, Detail, Auth, Profile, Admin)
   - Light AND Dark mode for each screen
   - Mobile AND Desktop versions
   - Interactive prototype links

2. Component library page with all variants

3. Design tokens exported (colors, typography, spacing, shadows)

4. Icon set (SVG format, 24x24px, stroke-based)

5. Illustrations for empty states

6. RTL versions of all Arabic screens

═══════════════════════════════════════════════════════════