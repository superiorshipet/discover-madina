export interface Place {
  id: number;
  name: string;
  nameAr: string;
  category: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  distance: string;
  isOpen: boolean;
  hours: string;
  phone: string;
  website: string;
  price: string;
  description: string;
  descriptionAr: string;
  thumbnail: string | null;
  photos: string[];
  isFeatured?: boolean;
}

export interface Review {
  id: number;
  placeId: number;
  placeName: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const mockStats = {
  totalPlaces: 8,
  pendingPlaces: 0,
  totalUsers: 156,
  totalPhotos: 24,
};

export const mockAdmins: Admin[] = [
  { id: 1, username: 'admin', email: 'admin@discovermadinah.com', role: 'admin' },
];

// Real Madinah Locations
export const mockPlaces: Place[] = [
  {
    id: 1,
    name: "Al-Masjid an-Nabawi",
    nameAr: "المسجد النبوي الشريف",
    category: "religious",
    lat: 24.4672,
    lng: 39.6111,
    rating: 5.0,
    reviewCount: 12453,
    distance: "0.0",
    isOpen: true,
    hours: "24/7",
    phone: "+966 14 823 2400",
    website: "https://wmn.gov.sa",
    price: "Free",
    description: "The Prophet's Mosque is the second holiest site in Islam and houses the tomb of Prophet Muhammad (PBUH). It can accommodate over 1 million worshippers and features the iconic Green Dome.",
    descriptionAr: "المسجد النبوي الشريف هو ثاني أقدس مكان في الإسلام ويضم قبر النبي محمد ﷺ. يتسع لأكثر من مليون مصل ويتميز بالقبة الخضراء الشهيرة.",
    thumbnail: null,
    photos: [],
    isFeatured: true,
  },
  {
    id: 2,
    name: "Masjid Quba",
    nameAr: "مسجد قباء",
    category: "religious",
    lat: 24.4397,
    lng: 39.6151,
    rating: 4.9,
    reviewCount: 3890,
    distance: "3.5",
    isOpen: true,
    hours: "24/7",
    phone: "+966 14 848 1111",
    website: "https://wmn.gov.sa",
    price: "Free",
    description: "The first mosque built in Islam. The Prophet Muhammad (PBUH) used to visit it every Saturday. Praying two rak'ahs here equals the reward of one Umrah.",
    descriptionAr: "أول مسجد بُني في الإسلام. كان النبي محمد ﷺ يزوره كل يوم سبت. صلاة ركعتين فيه تعدل أجر عمرة.",
    thumbnail: null,
    photos: [],
    isFeatured: true,
  },
  {
    id: 3,
    name: "Mount Uhud",
    nameAr: "جبل أحد",
    category: "historical",
    lat: 24.5267,
    lng: 39.6411,
    rating: 4.8,
    reviewCount: 2156,
    distance: "5.5",
    isOpen: true,
    hours: "Always open",
    phone: "+966 14 823 4567",
    website: "https://www.visitsaudi.com",
    price: "Free",
    description: "Historic mountain site of the Battle of Uhud. Visit the Martyrs' Cemetery and the Archers' Hill. A significant location in Islamic history where 70 companions were martyred.",
    descriptionAr: "موقع جبل أحد التاريخي، مكان غزوة أحد. قم بزيارة مقبرة الشهداء وجبل الرماة. موقع هام في التاريخ الإسلامي حيث استشهد 70 من الصحابة.",
    thumbnail: null,
    photos: [],
    isFeatured: true,
  },
  {
    id: 4,
    name: "Masjid Al-Qiblatayn",
    nameAr: "مسجد القبلتين",
    category: "religious",
    lat: 24.4847,
    lng: 39.5789,
    rating: 4.7,
    reviewCount: 1876,
    distance: "4.2",
    isOpen: true,
    hours: "24/7",
    phone: "+966 14 848 2222",
    website: "https://wmn.gov.sa",
    price: "Free",
    description: "The Mosque of the Two Qiblas. This is where the Prophet Muhammad (PBUH) received revelation to change the prayer direction from Jerusalem to Makkah.",
    descriptionAr: "مسجد القبلتين. هنا تلقى النبي محمد ﷺ الوحي بتغيير اتجاه القبلة من القدس إلى مكة.",
    thumbnail: null,
    photos: [],
    isFeatured: true,
  },
  {
    id: 5,
    name: "Al-Baik Restaurant",
    nameAr: "مطعم البيك",
    category: "restaurant",
    lat: 24.4680,
    lng: 39.6090,
    rating: 4.7,
    reviewCount: 8932,
    distance: "1.2",
    isOpen: true,
    hours: "11:00 - 02:00",
    phone: "+966 14 823 9876",
    website: "https://www.albaik.com",
    price: "$",
    description: "Famous Saudi fast food chain known for its broasted chicken and seafood. A must-try when visiting Madinah. Very affordable and delicious.",
    descriptionAr: "سلسلة مطاعم سعودية شهيرة معروفة بالدجاج المقلي والمأكولات البحرية. تجربة لا تفوت عند زيارة المدينة. لذيذ وبأسعار معقولة.",
    thumbnail: null,
    photos: [],
    isFeatured: false,
  },
  {
    id: 6,
    name: "Dar Al Madinah Museum",
    nameAr: "متحف دار المدينة",
    category: "historical",
    lat: 24.4710,
    lng: 39.6125,
    rating: 4.6,
    reviewCount: 1234,
    distance: "1.0",
    isOpen: true,
    hours: "09:00 - 21:00",
    phone: "+966 14 823 1122",
    website: "https://www.daralmadinah.com",
    price: "25 SAR",
    description: "Museum showcasing the rich history and heritage of Madinah. Features detailed models of the Prophet's Mosque through different eras and exhibits on Madinah's history.",
    descriptionAr: "متحف يعرض تاريخ وتراث المدينة المنورة الغني. يضم نماذج مفصلة للمسجد النبوي عبر العصور المختلفة ومعروضات عن تاريخ المدينة.",
    thumbnail: null,
    photos: [],
    isFeatured: false,
  },
  {
    id: 7,
    name: "The Seven Mosques",
    nameAr: "المساجد السبعة",
    category: "religious",
    lat: 24.5019,
    lng: 39.6078,
    rating: 4.5,
    reviewCount: 987,
    distance: "6.5",
    isOpen: true,
    hours: "24/7",
    phone: "+966 14 823 4567",
    website: "https://wmn.gov.sa",
    price: "Free",
    description: "A complex of six small historic mosques (originally seven) located near the site of the Battle of the Trench. Includes Al-Fath Mosque, Salman Al-Farsi Mosque, and others.",
    descriptionAr: "مجمع من ستة مساجد تاريخية صغيرة (كانت سبعة في الأصل) تقع بالقرب من موقع غزوة الخندق. تشمل مسجد الفتح ومسجد سلمان الفارسي وغيرها.",
    thumbnail: null,
    photos: [],
    isFeatured: false,
  },
  {
    id: 8,
    name: "King Fahd Central Park",
    nameAr: "حديقة الملك فهد المركزية",
    category: "nature",
    lat: 24.4800,
    lng: 39.5960,
    rating: 4.4,
    reviewCount: 1567,
    distance: "4.5",
    isOpen: true,
    hours: "07:00 - 23:00",
    phone: "+966 14 823 4567",
    website: "https://www.madinah.gov.sa",
    price: "Free",
    description: "The largest public park in Madinah with beautiful gardens, walking paths, children's play areas, and family picnic spots. Great for evening relaxation.",
    descriptionAr: "أكبر حديقة عامة في المدينة المنورة مع حدائق جميلة وممرات للمشي ومناطق ألعاب للأطفال وأماكن للتنزه العائلي. مكان رائع للاسترخاء في المساء.",
    thumbnail: null,
    photos: [],
    isFeatured: false,
  },
];

export const mockReviews: Review[] = [
  {
    id: 1,
    placeId: 1,
    placeName: "Al-Masjid an-Nabawi",
    userName: "Ahmed M.",
    rating: 5,
    comment: "The most peaceful place on earth. The Rawdah is truly a piece of paradise. May Allah accept our prayers.",
    date: "2 days ago",
    status: "approved",
  },
  {
    id: 2,
    placeId: 1,
    placeName: "Al-Masjid an-Nabawi",
    userName: "Fatima A.",
    rating: 5,
    comment: "Visiting the Prophet's Mosque is an indescribable feeling. The expansions have made it so spacious and comfortable.",
    date: "1 week ago",
    status: "approved",
  },
  {
    id: 3,
    placeId: 2,
    placeName: "Masjid Quba",
    userName: "Omar K.",
    rating: 5,
    comment: "Beautiful mosque with so much history. Prayed 2 rak'ahs here. Very peaceful atmosphere.",
    date: "3 days ago",
    status: "approved",
  },
  {
    id: 4,
    placeId: 5,
    placeName: "Al-Baik Restaurant",
    userName: "Sarah J.",
    rating: 5,
    comment: "Best fast food in Saudi! The nuggets and shrimp are amazing. Always busy but worth the wait.",
    date: "5 days ago",
    status: "approved",
  },
];

export const ratingDistribution = [
  { stars: 5, percentage: 78 },
  { stars: 4, percentage: 15 },
  { stars: 3, percentage: 5 },
  { stars: 2, percentage: 1 },
  { stars: 1, percentage: 1 },
];
