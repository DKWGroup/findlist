import { CategoryMapping, TypeMapping } from '../types/productCode';

export const categoryMappings: CategoryMapping[] = [
  // Główne kategorie
  { id: 'elektronika', name: 'Elektronika', code: 'EL', description: 'Urządzenia elektroniczne i akcesoria', isActive: true },
  { id: 'dom-ogrod', name: 'Dom i Ogród', code: 'DO', description: 'Produkty do domu i ogrodu', isActive: true },
  { id: 'moda', name: 'Moda', code: 'MO', description: 'Odzież i dodatki modowe', isActive: true },
  { id: 'uroda', name: 'Uroda', code: 'UR', description: 'Kosmetyki i produkty do pielęgnacji', isActive: true },
  { id: 'zabawki', name: 'Zabawki', code: 'ZA', description: 'Zabawki i gry dla dzieci', isActive: true },
  { id: 'sport', name: 'Sport', code: 'SP', description: 'Sprzęt sportowy i fitness', isActive: true },
  { id: 'motoryzacja', name: 'Motoryzacja', code: 'AU', description: 'Akcesoria samochodowe i narzędzia', isActive: true },
  { id: 'zwierzeta', name: 'Zwierzęta', code: 'PE', description: 'Produkty dla zwierząt domowych', isActive: true },
  { id: 'torby', name: 'Torby i Podróże', code: 'TR', description: 'Bagaże i akcesoria podróżne', isActive: true },
  { id: 'okazje', name: 'Okazje', code: 'OC', description: 'Produkty okolicznościowe i prezenty', isActive: true }
];

export const typeMappings: TypeMapping[] = [
  // Elektronika
  { id: 'smartphone', name: 'Smartfony', code: 'SM', categoryId: 'elektronika', description: 'Telefony komórkowe', isActive: true },
  { id: 'headphones', name: 'Słuchawki', code: 'HP', categoryId: 'elektronika', description: 'Słuchawki i earbudy', isActive: true },
  { id: 'charger', name: 'Ładowarki', code: 'CH', categoryId: 'elektronika', description: 'Ładowarki i powerbanki', isActive: true },
  { id: 'smart-home', name: 'Smart Home', code: 'SH', categoryId: 'elektronika', description: 'Inteligentne urządzenia domowe', isActive: true },
  { id: 'gaming', name: 'Gaming', code: 'GM', categoryId: 'elektronika', description: 'Akcesoria do gier', isActive: true },

  // Dom i Ogród
  { id: 'kitchen', name: 'Kuchnia', code: 'KI', categoryId: 'dom-ogrod', description: 'Akcesoria kuchenne', isActive: true },
  { id: 'cleaning', name: 'Sprzątanie', code: 'CL', categoryId: 'dom-ogrod', description: 'Produkty do sprzątania', isActive: true },
  { id: 'organization', name: 'Organizacja', code: 'OR', categoryId: 'dom-ogrod', description: 'Organizery i pojemniki', isActive: true },
  { id: 'decoration', name: 'Dekoracje', code: 'DE', categoryId: 'dom-ogrod', description: 'Dekoracje wnętrz', isActive: true },
  { id: 'garden', name: 'Ogród', code: 'GA', categoryId: 'dom-ogrod', description: 'Narzędzia ogrodnicze', isActive: true },

  // Moda
  { id: 'clothing', name: 'Odzież', code: 'CL', categoryId: 'moda', description: 'Ubrania damskie i męskie', isActive: true },
  { id: 'accessories', name: 'Dodatki', code: 'AC', categoryId: 'moda', description: 'Biżuteria i dodatki', isActive: true },
  { id: 'shoes', name: 'Obuwie', code: 'SH', categoryId: 'moda', description: 'Buty i sandały', isActive: true },
  { id: 'bags', name: 'Torebki', code: 'BA', categoryId: 'moda', description: 'Torebki i plecaki', isActive: true },

  // Uroda
  { id: 'skincare', name: 'Pielęgnacja', code: 'SK', categoryId: 'uroda', description: 'Produkty do pielęgnacji skóry', isActive: true },
  { id: 'makeup', name: 'Makijaż', code: 'MK', categoryId: 'uroda', description: 'Kosmetyki do makijażu', isActive: true },
  { id: 'haircare', name: 'Włosy', code: 'HC', categoryId: 'uroda', description: 'Produkty do pielęgnacji włosów', isActive: true },
  { id: 'tools', name: 'Narzędzia', code: 'TO', categoryId: 'uroda', description: 'Narzędzia kosmetyczne', isActive: true },

  // Sport
  { id: 'fitness', name: 'Fitness', code: 'FI', categoryId: 'sport', description: 'Sprzęt fitness', isActive: true },
  { id: 'outdoor', name: 'Outdoor', code: 'OU', categoryId: 'sport', description: 'Sprzęt outdoor', isActive: true },
  { id: 'supplements', name: 'Suplementy', code: 'SU', categoryId: 'sport', description: 'Suplementy diety', isActive: true },

  // Zwierzęta
  { id: 'food', name: 'Karma', code: 'FO', categoryId: 'zwierzeta', description: 'Karma dla zwierząt', isActive: true },
  { id: 'toys-pet', name: 'Zabawki', code: 'TO', categoryId: 'zwierzeta', description: 'Zabawki dla zwierząt', isActive: true },
  { id: 'care-pet', name: 'Pielęgnacja', code: 'CA', categoryId: 'zwierzeta', description: 'Produkty pielęgnacyjne', isActive: true },

  // Zabawki
  { id: 'educational', name: 'Edukacyjne', code: 'ED', categoryId: 'zabawki', description: 'Zabawki edukacyjne', isActive: true },
  { id: 'creative', name: 'Kreatywne', code: 'CR', categoryId: 'zabawki', description: 'Zabawki kreatywne', isActive: true },
  { id: 'electronic-toys', name: 'Elektroniczne', code: 'EL', categoryId: 'zabawki', description: 'Zabawki elektroniczne', isActive: true }
];

// Mapowanie istniejących kategorii na nowe kody
export const legacyCategoryMapping: Record<string, { categoryCode: string; typeCode: string }> = {
  'elektronika': { categoryCode: 'EL', typeCode: 'SH' }, // Smart Home jako domyślny
  'dom-ogrod': { categoryCode: 'DO', typeCode: 'OR' }, // Organizacja jako domyślny
  'moda': { categoryCode: 'MO', typeCode: 'CL' }, // Clothing jako domyślny
  'uroda': { categoryCode: 'UR', typeCode: 'SK' }, // Skincare jako domyślny
  'zabawki': { categoryCode: 'ZA', typeCode: 'ED' }, // Educational jako domyślny
  'sport': { categoryCode: 'SP', typeCode: 'FI' }, // Fitness jako domyślny
  'motoryzacja': { categoryCode: 'AU', typeCode: 'AC' }, // Accessories jako domyślny
  'zwierzeta': { categoryCode: 'PE', typeCode: 'FO' }, // Food jako domyślny
  'torby': { categoryCode: 'TR', typeCode: 'BA' }, // Bags jako domyślny
  'okazje': { categoryCode: 'OC', typeCode: 'DE' } // Decoration jako domyślny
};