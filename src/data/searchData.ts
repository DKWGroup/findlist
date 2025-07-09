import { ProductAssociation, SearchSuggestion } from '../types/search';

// Semantic mappings for better search understanding
export const semanticMappings = {
  // Synonyms and related terms
  synonyms: {
    'telefon': ['smartphone', 'komórka', 'mobile', 'phone'],
    'laptop': ['notebook', 'komputer', 'computer'],
    'słuchawki': ['headphones', 'earbuds', 'earphones'],
    'ładowarka': ['charger', 'powerbank', 'power bank'],
    'ubrania': ['clothes', 'clothing', 'odzież', 'garderoba'],
    'kosmetyki': ['cosmetics', 'makeup', 'beauty', 'uroda'],
    'dom': ['house', 'home', 'mieszkanie', 'wnętrze'],
    'ogród': ['garden', 'balkon', 'taras', 'rośliny'],
    'sport': ['fitness', 'trening', 'exercise', 'workout'],
    'gotowanie': ['cooking', 'kuchnia', 'kitchen', 'przepisy'],
    'czyszczenie': ['cleaning', 'sprzątanie', 'porządki'],
    'organizacja': ['organization', 'storage', 'przechowywanie'],
    'podróże': ['travel', 'vacation', 'wakacje', 'wyjazd'],
    'zima': ['winter', 'cold', 'snow', 'śnieg', 'mróz'],
    'lato': ['summer', 'hot', 'beach', 'plaża', 'upał'],
    'wiosna': ['spring', 'fresh', 'new', 'świeży'],
    'jesień': ['autumn', 'fall', 'leaves', 'liście']
  },

  // Seasonal associations
  seasonal: {
    winter: ['ciepłe', 'ogrzewanie', 'śnieg', 'mróz', 'święta', 'boże narodzenie', 'sylwester'],
    summer: ['chłodzenie', 'plaża', 'wakacje', 'słońce', 'upał', 'klimatyzacja', 'wentylator'],
    spring: ['sprzątanie', 'porządki', 'nowe', 'świeże', 'ogrody', 'rośliny'],
    autumn: ['szkoła', 'powrót', 'jesień', 'liście', 'przygotowania']
  },

  // Occasion-based associations
  occasions: {
    'boże narodzenie': ['prezenty', 'dekoracje', 'święta', 'rodzina', 'choinka'],
    'walentynki': ['miłość', 'romantyczne', 'prezenty', 'para', 'randka'],
    'wielkanoc': ['wiosna', 'dekoracje', 'rodzina', 'tradycja'],
    'urodziny': ['prezenty', 'party', 'zabawa', 'tort', 'dekoracje'],
    'ślub': ['eleganckie', 'formalne', 'białe', 'ceremonia', 'wesele'],
    'praca': ['biuro', 'profesjonalne', 'eleganckie', 'formalne'],
    'szkoła': ['nauka', 'dzieci', 'plecaki', 'przybory', 'organizacja'],
    'sport': ['aktywność', 'fitness', 'zdrowie', 'trening', 'outdoor'],
    'podróże': ['walizki', 'bagaż', 'comfort', 'praktyczne', 'portable']
  },

  // Use case mappings
  useCases: {
    'praca z domu': ['biuro', 'komputer', 'krzesło', 'oświetlenie', 'organizacja'],
    'gotowanie': ['kuchnia', 'naczynia', 'przybory', 'przepisy', 'jedzenie'],
    'sprzątanie': ['cleaning', 'porządki', 'organizacja', 'przechowywanie'],
    'relaks': ['comfort', 'wygoda', 'odpoczynek', 'spa', 'wellness'],
    'fitness': ['sport', 'trening', 'zdrowie', 'aktywność', 'siłownia'],
    'beauty': ['uroda', 'pielęgnacja', 'kosmetyki', 'makeup', 'skincare']
  }
};

// Product associations for smart recommendations
export const productAssociations: ProductAssociation[] = [
  {
    productId: '1', // Inteligentna Lampa LED
    associatedWith: ['sypialnia', 'relaks', 'muzyka', 'smart home'],
    seasons: ['autumn', 'winter'],
    occasions: ['relaks', 'party', 'randka'],
    useCase: ['oświetlenie nastrojowe', 'muzyka', 'dekoracja'],
    complementaryProducts: ['2', '4'], // Organizer, Powerbank
    frequentlyBoughtTogether: ['4', '6'] // Powerbank, Dozownik
  },
  {
    productId: '2', // Organizer do szafy
    associatedWith: ['organizacja', 'dom', 'porządki', 'małe mieszkanie'],
    seasons: ['spring', 'autumn'],
    occasions: ['sprzątanie', 'przeprowadzka', 'organizacja'],
    useCase: ['przechowywanie', 'organizacja', 'oszczędność miejsca'],
    complementaryProducts: ['1', '3'], // Lampa, Maski
    frequentlyBoughtTogether: ['3', '5'] // Maski, Sukienka
  },
  {
    productId: '3', // Maski silikonowe
    associatedWith: ['uroda', 'pielęgnacja', 'skincare', 'spa'],
    seasons: ['winter', 'spring'],
    occasions: ['pielęgnacja', 'relaks', 'spa w domu'],
    useCase: ['beauty', 'pielęgnacja twarzy', 'anti-aging'],
    complementaryProducts: ['2', '5'], // Organizer, Sukienka
    frequentlyBoughtTogether: ['5', '1'] // Sukienka, Lampa
  },
  {
    productId: '4', // Powerbank
    associatedWith: ['elektronika', 'podróże', 'praca', 'telefon'],
    seasons: ['summer', 'spring'],
    occasions: ['podróże', 'praca', 'szkoła', 'outdoor'],
    useCase: ['ładowanie', 'mobilność', 'backup power'],
    complementaryProducts: ['1', '6'], // Lampa, Dozownik
    frequentlyBoughtTogether: ['1', '2'] // Lampa, Organizer
  },
  {
    productId: '5', // Sukienka
    associatedWith: ['moda', 'elegancja', 'wyjście', 'party'],
    seasons: ['spring', 'summer'],
    occasions: ['randka', 'party', 'praca', 'wyjście'],
    useCase: ['eleganckie wyjście', 'praca', 'special occasions'],
    complementaryProducts: ['3', '2'], // Maski, Organizer
    frequentlyBoughtTogether: ['3', '1'] // Maski, Lampa
  },
  {
    productId: '6', // Dozownik karmy
    associatedWith: ['zwierzęta', 'smart home', 'automatyzacja', 'pets'],
    seasons: ['all'],
    occasions: ['codzienność', 'podróże', 'praca'],
    useCase: ['opieka nad zwierzętami', 'automatyzacja', 'wygoda'],
    complementaryProducts: ['1', '4'], // Lampa, Powerbank
    frequentlyBoughtTogether: ['4', '2'] // Powerbank, Organizer
  }
];

// Trending searches and suggestions
export const trendingSearches: SearchSuggestion[] = [
  { id: '1', text: 'smart home', type: 'trending', count: 1250 },
  { id: '2', text: 'organizacja domu', type: 'trending', count: 980 },
  { id: '3', text: 'beauty routine', type: 'trending', count: 850 },
  { id: '4', text: 'powerbank bezprzewodowy', type: 'trending', count: 720 },
  { id: '5', text: 'sukienki na lato', type: 'trending', count: 650 },
  { id: '6', text: 'gadżety dla zwierząt', type: 'trending', count: 580 }
];

// Popular categories for suggestions
export const popularCategories: SearchSuggestion[] = [
  { id: 'elektronika', text: 'Elektronika', type: 'category', icon: 'Smartphone' },
  { id: 'dom-ogrod', text: 'Dom i ogród', type: 'category', icon: 'Home' },
  { id: 'uroda', text: 'Uroda', type: 'category', icon: 'Heart' },
  { id: 'moda', text: 'Moda', type: 'category', icon: 'Shirt' },
  { id: 'sport', text: 'Sport', type: 'category', icon: 'Dumbbell' },
  { id: 'zwierzeta', text: 'Zwierzęta', type: 'category', icon: 'Dog' }
];

// Search analytics data (mock)
export const searchAnalytics = {
  popularQueries: [
    { query: 'lampa led', count: 2340, trend: 'up' },
    { query: 'organizer', count: 1890, trend: 'up' },
    { query: 'powerbank', count: 1650, trend: 'stable' },
    { query: 'maski do twarzy', count: 1420, trend: 'up' },
    { query: 'sukienka', count: 1200, trend: 'down' }
  ],
  
  seasonalTrends: {
    winter: ['ogrzewanie', 'ciepłe ubrania', 'święta', 'dekoracje'],
    spring: ['sprzątanie', 'organizacja', 'rośliny', 'fresh start'],
    summer: ['chłodzenie', 'plaża', 'wakacje', 'outdoor'],
    autumn: ['szkoła', 'organizacja', 'przygotowania', 'jesienne trendy']
  },

  userBehavior: {
    averageSearchLength: 2.3,
    mostCommonFilters: ['category', 'price', 'rating'],
    clickThroughRate: 0.23,
    conversionRate: 0.045
  }
};