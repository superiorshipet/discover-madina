// Mock data for the Discover application

export interface Place {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: number;
  isOpen: boolean;
  thumbnail: string;
  images: string[];
  description: string;
  descriptionAr: string;
  hours: string;
  phone: string;
  website: string;
  price: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'pending' | 'inactive';
}

export interface Review {
  id: string;
  placeId: string;
  placeName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Grand Canyon National Park',
    nameAr: 'حديقة جراند كانيون الوطنية',
    category: 'nature',
    rating: 4.9,
    reviewCount: 2543,
    distance: 0.5,
    isOpen: true,
    thumbnail: 'https://images.unsplash.com/photo-1591823600156-25dfdce98423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuZCUyMGNhbnlvbiUyMG5hdGlvbmFsJTIwcGFya3xlbnwxfHx8fDE3NzYzNTI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: ['https://images.unsplash.com/photo-1591823600156-25dfdce98423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuZCUyMGNhbnlvbiUyMG5hdGlvbmFsJTIwcGFya3xlbnwxfHx8fDE3NzYzNTI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', '', '', ''],
    description: 'One of the most spectacular natural wonders in the world, featuring breathtaking views and hiking trails.',
    descriptionAr: 'واحدة من أكثر العجائب الطبيعية إثارة في العالم، تتميز بمناظر خلابة ومسارات للمشي.',
    hours: '24/7',
    phone: '+1 928-638-7888',
    website: 'www.nps.gov/grca',
    price: '$35 per vehicle',
    latitude: 36.0544,
    longitude: -112.1401,
    status: 'active',
  },
  {
    id: '2',
    name: 'Metropolitan Museum of Art',
    nameAr: 'متحف المتروبوليتان للفنون',
    category: 'museum',
    rating: 4.8,
    reviewCount: 5234,
    distance: 1.2,
    isOpen: true,
    thumbnail: 'https://images.unsplash.com/photo-1558113411-091f5bb877d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRyb3BvbGl0YW4lMjBtdXNldW0lMjBhcnR8ZW58MXx8fHwxNzc2MzUyNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: ['https://images.unsplash.com/photo-1558113411-091f5bb877d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRyb3BvbGl0YW4lMjBtdXNldW0lMjBhcnR8ZW58MXx8fHwxNzc2MzUyNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', '', '', ''],
    description: 'The largest art museum in the United States, housing over two million works spanning 5,000 years of art.',
    descriptionAr: 'أكبر متحف فني في الولايات المتحدة، يضم أكثر من مليوني عمل فني تمتد عبر 5000 عام.',
    hours: '10:00 AM - 5:00 PM',
    phone: '+1 212-535-7710',
    website: 'www.metmuseum.org',
    price: '$30',
    latitude: 40.7794,
    longitude: -73.9632,
    status: 'active',
  },
  {
    id: '3',
    name: 'Golden Gate Bridge',
    nameAr: 'جسر البوابة الذهبية',
    category: 'historical',
    rating: 4.7,
    reviewCount: 8932,
    distance: 2.1,
    isOpen: true,
    thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBnYXRlJTIwYnJpZGdlfGVufDF8fHx8MTc3NjM1MjU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: ['https://images.unsplash.com/photo-1501594907352-04cda38ebc29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBnYXRlJTIwYnJpZGdlfGVufDF8fHx8MTc3NjM1MjU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', '', '', ''],
    description: 'An iconic suspension bridge spanning the Golden Gate strait, connecting San Francisco to Marin County.',
    descriptionAr: 'جسر معلق شهير يمتد عبر مضيق البوابة الذهبية، يربط سان فرانسيسكو بمقاطعة مارين.',
    hours: '24/7',
    phone: '+1 415-921-5858',
    website: 'www.goldengatebridge.org',
    price: 'Free',
    latitude: 37.8199,
    longitude: -122.4783,
    status: 'active',
  },
  {
    id: '4',
    name: 'Central Park',
    nameAr: 'سنترال بارك',
    category: 'nature',
    rating: 4.8,
    reviewCount: 12453,
    distance: 0.8,
    isOpen: true,
    thumbnail: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW50cmFsJTIwcGFyayUyMG5ldyUyMHlvcmt8ZW58MXx8fHwxNzc2MzE1NzIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: ['https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW50cmFsJTIwcGFyayUyMG5ldyUyMHlvcmt8ZW58MXx8fHwxNzc2MzE1NzIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', '', '', ''],
    description: 'An urban park in Manhattan, offering a peaceful escape with lakes, trails, and cultural attractions.',
    descriptionAr: 'حديقة حضرية في مانهاتن، توفر ملاذاً هادئاً مع البحيرات والمسارات والمعالم الثقافية.',
    hours: '6:00 AM - 1:00 AM',
    phone: '+1 212-310-6600',
    website: 'www.centralparknyc.org',
    price: 'Free',
    latitude: 40.7829,
    longitude: -73.9654,
    status: 'active',
  },
  {
    id: '5',
    name: 'The French Laundry',
    nameAr: 'المغسلة الفرنسية',
    category: 'restaurant',
    rating: 4.9,
    reviewCount: 892,
    distance: 3.5,
    isOpen: false,
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzYzMzM1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzYzMzM1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', '', '', ''],
    description: 'A three-Michelin-star French restaurant offering an exceptional fine dining experience.',
    descriptionAr: 'مطعم فرنسي حائز على ثلاث نجوم ميشلان يقدم تجربة طعام فاخرة استثنائية.',
    hours: '5:00 PM - 9:00 PM',
    phone: '+1 707-944-2380',
    website: 'www.thomaskeller.com',
    price: '$$$$$',
    latitude: 38.4024,
    longitude: -122.4364,
    status: 'active',
  },
  {
    id: '6',
    name: 'Times Square',
    nameAr: 'تايمز سكوير',
    category: 'entertainment',
    rating: 4.5,
    reviewCount: 15234,
    distance: 1.0,
    isOpen: true,
    thumbnail: 'https://images.unsplash.com/photo-1695147383484-621b933811d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aW1lcyUyMHNxdWFyZSUyMG5ldyUyMHlvcmt8ZW58MXx8fHwxNzc2MzE1NzIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: ['https://images.unsplash.com/photo-1695147383484-621b933811d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aW1lcyUyMHNxdWFyZSUyMG5ldyUyMHlvcmt8ZW58MXx8fHwxNzc2MzE1NzIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', '', '', ''],
    description: 'The heart of New York City, known for its bright lights, Broadway theaters, and vibrant atmosphere.',
    descriptionAr: 'قلب مدينة نيويورك، المعروف بأضوائه الساطعة ومسارح برودواي وأجوائه النابضة بالحياة.',
    hours: '24/7',
    phone: '+1 212-768-1560',
    website: 'www.timessquarenyc.org',
    price: 'Free',
    latitude: 40.758,
    longitude: -73.9855,
    status: 'active',
  },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    placeId: '1',
    placeName: 'Grand Canyon National Park',
    userId: '101',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely breathtaking! The views are indescribable. A must-visit destination for nature lovers.',
    date: '2 days ago',
    status: 'approved',
  },
  {
    id: '2',
    placeId: '1',
    placeName: 'Grand Canyon National Park',
    userId: '102',
    userName: 'Mohammed Ali',
    rating: 5,
    comment: 'Amazing experience! The sunset view was spectacular. Highly recommend the South Rim trail.',
    date: '5 days ago',
    status: 'approved',
  },
  {
    id: '3',
    placeId: '2',
    placeName: 'Metropolitan Museum of Art',
    userId: '103',
    userName: 'Emily Chen',
    rating: 4,
    comment: 'Incredible collection of art. You need at least a full day to see everything. The Egyptian wing is a must-see!',
    date: '1 week ago',
    status: 'approved',
  },
  {
    id: '4',
    placeId: '3',
    placeName: 'Golden Gate Bridge',
    userId: '104',
    userName: 'Ahmed Hassan',
    rating: 5,
    comment: 'Iconic landmark! Walking across the bridge is an unforgettable experience. Great photo opportunities.',
    date: '2 hours ago',
    status: 'pending',
  },
  {
    id: '5',
    placeId: '4',
    placeName: 'Central Park',
    userId: '105',
    userName: 'Lisa Martinez',
    rating: 5,
    comment: 'Perfect place to relax and escape the city buzz. Beautiful in every season!',
    date: '3 days ago',
    status: 'pending',
  },
  {
    id: '6',
    placeId: '5',
    placeName: 'The French Laundry',
    userId: '106',
    userName: 'David Kim',
    rating: 5,
    comment: 'Once in a lifetime dining experience. Every dish was a masterpiece. Worth the reservation wait!',
    date: '1 week ago',
    status: 'pending',
  },
];

export const mockStats = {
  totalPlaces: 156,
  pendingPlaces: 12,
  totalUsers: 2543,
  totalPhotos: 8934,
  totalReviews: 4521,
  pendingReviews: 3,
};

export const mockAdmins = [
  { id: '1', username: 'admin', email: 'admin@discover.com' },
  { id: '2', username: 'moderator', email: 'moderator@discover.com' },
];

export const ratingDistribution = [
  { stars: 5, percentage: 70, count: 3165 },
  { stars: 4, percentage: 20, count: 904 },
  { stars: 3, percentage: 5, count: 226 },
  { stars: 2, percentage: 3, count: 136 },
  { stars: 1, percentage: 2, count: 90 },
];