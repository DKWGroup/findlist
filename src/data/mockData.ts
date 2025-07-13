import { Product, Category } from '../types';

export const categories: Category[] = [
  { id: 'dom-ogrod', name: 'Dom i ogród', icon: 'Home', productCount: 124, code: 'DO' },
  { id: 'elektronika', name: 'Elektronika i akcesoria', icon: 'Smartphone', productCount: 89, code: 'EL' },
  { id: 'moda', name: 'Moda i dodatki', icon: 'Shirt', productCount: 156, code: 'MO' },
  { id: 'uroda', name: 'Uroda i zdrowie', icon: 'Heart', productCount: 67, code: 'UR' },
  { id: 'zabawki', name: 'Zabawki i dzieci', icon: 'Baby', productCount: 43, code: 'ZA' },
  { id: 'sport', name: 'Sport i hobby', icon: 'Dumbbell', productCount: 78, code: 'SP' },
  { id: 'motoryzacja', name: 'Motoryzacja i narzędzia', icon: 'Car', productCount: 34, code: 'AU' },
  { id: 'zwierzeta', name: 'Zwierzęta', icon: 'Dog', productCount: 29, code: 'PE' },
  { id: 'torby', name: 'Torby i podróże', icon: 'Luggage', productCount: 52, code: 'TR' },
  { id: 'okazje', name: 'Okazje i przebrania', icon: 'Gift', productCount: 38, code: 'OC' }
];

export const products: Product[] = [
  {
    id: '1',
    code: 'EL-SH-001',
    title: 'Inteligentna Lampa LED z Bluetooth',
    description: 'Rewolucyjna lampa LED z głośnikiem Bluetooth, która zmienia kolory w rytm muzyki. Idealna do sypialni, salonu czy jako lampka nocna.',
    images: [
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg',
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg'
    ],
    category: 'elektronika',
    productType: 'smart-home',
    tags: ['smart home', 'bluetooth', 'led', 'muzyka', 'dekoracja'],
    price: {
      original: 89.99,
      discounted: 39.99,
      currency: 'PLN'
    },
    affiliateLinks: {
      temu: 'https://temu.com/product-123',
      aliexpress: 'https://aliexpress.com/item/123',
      amazon: 'https://amazon.com/dp/123'
    },
    socialLinks: {
      tiktok: 'https://tiktok.com/@user/video/123',
      instagram: 'https://instagram.com/p/123'
    },
    popularity: {
      views: 156420,
      likes: 12340,
      shares: 2340
    },
    ratings: {
      average: 4.7,
      count: 234
    },
    dateAdded: '2024-01-15',
    isVerified: true,
    isTrending: true,
    urlAlias: 'el-sh-001-inteligentna-lampa-led-bluetooth'
  },
  {
    id: '2',
    code: 'DO-OR-001',
    title: 'Magiczny Organizer do Szafy',
    description: 'Składany organizer do szafy, który podwaja przestrzeń na ubrania. Łatwy montaż, trwały materiał, idealne rozwiązanie dla małych mieszkań.',
    images: [
      'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
      'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg'
    ],
    category: 'dom-ogrod',
    productType: 'organization',
    tags: ['organizacja', 'szafa', 'przechowywanie', 'dom'],
    price: {
      original: 45.99,
      discounted: 19.99,
      currency: 'PLN'
    },
    affiliateLinks: {
      temu: 'https://temu.com/product-124',
      aliexpress: 'https://aliexpress.com/item/124'
    },
    socialLinks: {
      tiktok: 'https://tiktok.com/@user/video/124'
    },
    popularity: {
      views: 89340,
      likes: 8920,
      shares: 1230
    },
    ratings: {
      average: 4.5,
      count: 156
    },
    dateAdded: '2024-01-14',
    isVerified: false,
    isTrending: true,
    urlAlias: 'do-or-001-magiczny-organizer-szafy'
  },
  {
    id: '3',
    code: 'UR-SK-001',
    title: 'Zestaw Silikonowych Masek do Twarzy',
    description: 'Wielorazowe silikonowe maski do twarzy, które maksymalizują wchłanianie składników aktywnych. Zestaw 3 sztuk w różnych kolorach.',
    images: [
      'https://images.pexels.com/photos/3997369/pexels-photo-3997369.jpeg',
      'https://images.pexels.com/photos/3852577/pexels-photo-3852577.jpeg'
    ],
    category: 'uroda',
    productType: 'skincare',
    tags: ['skincare', 'maski', 'uroda', 'pielęgnacja'],
    price: {
      original: 29.99,
      discounted: 15.99,
      currency: 'PLN'
    },
    affiliateLinks: {
      temu: 'https://temu.com/product-125',
      amazon: 'https://amazon.com/dp/125'
    },
    socialLinks: {
      instagram: 'https://instagram.com/p/125'
    },
    popularity: {
      views: 67890,
      likes: 5670,
      shares: 890
    },
    ratings: {
      average: 4.3,
      count: 89
    },
    dateAdded: '2024-01-13',
    isVerified: true,
    isTrending: false,
    urlAlias: 'ur-sk-001-silikonowe-maski-twarzy'
  },
  {
    id: '4',
    code: 'EL-CH-001',
    title: 'Bezprzewodowy Powerbank z Ładowaniem Indukcyjnym',
    description: 'Kompaktowy powerbank 10000mAh z funkcją ładowania bezprzewodowego. Obsługuje szybkie ładowanie USB-C i wyświetlacz LCD.',
    images: [
      'https://images.pexels.com/photos/163143/mobile-phone-battery-charging-station-163143.jpeg',
      'https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg'
    ],
    category: 'elektronika',
    productType: 'charger',
    tags: ['powerbank', 'bezprzewodowe', 'ładowanie', 'usb-c'],
    price: {
      original: 119.99,
      discounted: 69.99,
      currency: 'PLN'
    },
    affiliateLinks: {
      temu: 'https://temu.com/product-126',
      aliexpress: 'https://aliexpress.com/item/126',
      amazon: 'https://amazon.com/dp/126'
    },
    socialLinks: {
      tiktok: 'https://tiktok.com/@user/video/126'
    },
    popularity: {
      views: 134520,
      likes: 11200,
      shares: 1890
    },
    ratings: {
      average: 4.8,
      count: 312
    },
    dateAdded: '2024-01-12',
    isVerified: true,
    isTrending: true,
    urlAlias: 'el-ch-001-bezprzewodowy-powerbank'
  },
  {
    id: '5',
    code: 'MO-CL-001',
    title: 'Sukienka Satynowa z Bufiastymi Rękawami',
    description: 'Elegancka sukienka satynowa w stylu vintage z bufiastymi rękawami. Dostępna w 5 kolorach, idealnie dopasowuje się do sylwetki.',
    images: [
      'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg',
      'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg'
    ],
    category: 'moda',
    productType: 'clothing',
    tags: ['sukienka', 'elegancka', 'vintage', 'satyna'],
    price: {
      original: 79.99,
      discounted: 49.99,
      currency: 'PLN'
    },
    affiliateLinks: {
      temu: 'https://temu.com/product-127',
      aliexpress: 'https://aliexpress.com/item/127'
    },
    socialLinks: {
      instagram: 'https://instagram.com/p/127',
      tiktok: 'https://tiktok.com/@user/video/127'
    },
    popularity: {
      views: 98760,
      likes: 9230,
      shares: 1450
    },
    ratings: {
      average: 4.6,
      count: 187
    },
    dateAdded: '2024-01-11',
    isVerified: false,
    isTrending: true,
    urlAlias: 'mo-cl-001-sukienka-satynowa-bufiaste-rekawy'
  },
  {
    id: '6',
    code: 'PE-FO-001',
    title: 'Inteligentny Dozownik Karmy dla Zwierząt',
    description: 'Automatyczny dozownik karmy z aplikacją mobilną. Programowalne porcje, kamera HD, powiadomienia push. Idealny dla kotów i psów.',
    images: [
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg'
    ],
    category: 'zwierzeta',
    productType: 'food',
    tags: ['smart', 'dozownik', 'karma', 'aplikacja', 'zwierzęta'],
    price: {
      original: 199.99,
      discounted: 129.99,
      currency: 'PLN'
    },
    affiliateLinks: {
      amazon: 'https://amazon.com/dp/128',
      aliexpress: 'https://aliexpress.com/item/128'
    },
    socialLinks: {
      tiktok: 'https://tiktok.com/@user/video/128'
    },
    popularity: {
      views: 76540,
      likes: 6890,
      shares: 1120
    },
    ratings: {
      average: 4.4,
      count: 134
    },
    dateAdded: '2024-01-10',
    isVerified: true,
    isTrending: false,
    urlAlias: 'pe-fo-001-inteligentny-dozownik-karmy'
  }
];