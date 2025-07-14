import { CategoryMapping, TypeMapping } from '../types/productCode';

export const categoryMappings: CategoryMapping[] = [
  // Główne kategorie
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Elektronika', code: 'EL', description: 'Urządzenia elektroniczne i akcesoria', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Dom i Ogród', code: 'DO', description: 'Produkty do domu i ogrodu', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Moda', code: 'MO', description: 'Odzież i dodatki modowe', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Uroda', code: 'UR', description: 'Kosmetyki i produkty do pielęgnacji', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Zabawki', code: 'ZA', description: 'Zabawki i gry dla dzieci', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Sport', code: 'SP', description: 'Sprzęt sportowy i fitness', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Motoryzacja', code: 'AU', description: 'Akcesoria samochodowe i narzędzia', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Zwierzęta', code: 'PE', description: 'Produkty dla zwierząt domowych', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Torby i Podróże', code: 'TR', description: 'Bagaże i akcesoria podróżne', isActive: true },
  { id: '550e8400-e29b-41d4-a716-44665544000a', name: 'Okazje', code: 'OC', description: 'Produkty okolicznościowe i prezenty', isActive: true }
];

export const typeMappings: TypeMapping[] = [
  // Elektronika
  { id: 'smartphone', name: 'Smartfony', code: 'SM', categoryId: '550e8400-e29b-41d4-a716-446655440001', description: 'Telefony komórkowe', isActive: true },
  { id: 'headphones', name: 'Słuchawki', code: 'HP', categoryId: '550e8400-e29b-41d4-a716-446655440001', description: 'Słuchawki i earbudy', isActive: true },
  { id: 'charger', name: 'Ładowarki', code: 'CH', categoryId: '550e8400-e29b-41d4-a716-446655440001', description: 'Ładowarki i powerbanki', isActive: true },
  { id: 'smart-home', name: 'Smart Home', code: 'SH', categoryId: '550e8400-e29b-41d4-a716-446655440001', description: 'Inteligentne urządzenia domowe', isActive: true },
  { id: 'gaming', name: 'Gaming', code: 'GM', categoryId: '550e8400-e29b-41d4-a716-446655440001', description: 'Akcesoria do gier', isActive: true },

  // Dom i Ogród
  { id: 'kitchen', name: 'Kuchnia', code: 'KI', categoryId: '550e8400-e29b-41d4-a716-446655440002', description: 'Akcesoria kuchenne', isActive: true },
  { id: 'cleaning', name: 'Sprzątanie', code: 'CL', categoryId: '550e8400-e29b-41d4-a716-446655440002', description: 'Produkty do sprzątania', isActive: true },
  { id: 'organization', name: 'Organizacja', code: 'OR', categoryId: '550e8400-e29b-41d4-a716-446655440002', description: 'Organizery i pojemniki', isActive: true },
  { id: 'decoration', name: 'Dekoracje', code: 'DE', categoryId: '550e8400-e29b-41d4-a716-446655440002', description: 'Dekoracje wnętrz', isActive: true },
  { id: 'garden', name: 'Ogród', code: 'GA', categoryId: '550e8400-e29b-41d4-a716-446655440002', description: 'Narzędzia ogrodnicze', isActive: true },

  // Moda
  { id: 'clothing', name: 'Odzież', code: 'CL', categoryId: '550e8400-e29b-41d4-a716-446655440003', description: 'Ubrania damskie i męskie', isActive: true },
  { id: 'accessories', name: 'Dodatki', code: 'AC', categoryId: '550e8400-e29b-41d4-a716-446655440003', description: 'Biżuteria i dodatki', isActive: true },
  { id: 'shoes', name: 'Obuwie', code: 'SH', categoryId: '550e8400-e29b-41d4-a716-446655440003', description: 'Buty i sandały', isActive: true },
  { id: 'bags', name: 'Torebki', code: 'BA', categoryId: '550e8400-e29b-41d4-a716-446655440003', description: 'Torebki i plecaki', isActive: true },

  // Uroda
  { id: 'skincare', name: 'Pielęgnacja', code: 'SK', categoryId: '550e8400-e29b-41d4-a716-446655440004', description: 'Produkty do pielęgnacji skóry', isActive: true },
  { id: 'makeup', name: 'Makijaż', code: 'MK', categoryId: '550e8400-e29b-41d4-a716-446655440004', description: 'Kosmetyki do makijażu', isActive: true },
  { id: 'haircare', name: 'Włosy', code: 'HC', categoryId: '550e8400-e29b-41d4-a716-446655440004', description: 'Produkty do pielęgnacji włosów', isActive: true },
  { id: 'tools', name: 'Narzędzia', code: 'TO', categoryId: '550e8400-e29b-41d4-a716-446655440004', description: 'Narzędzia kosmetyczne', isActive: true },

  // Sport
  { id: 'fitness', name: 'Fitness', code: 'FI', categoryId: '550e8400-e29b-41d4-a716-446655440006', description: 'Sprzęt fitness', isActive: true },
  { id: 'outdoor', name: 'Outdoor', code: 'OU', categoryId: '550e8400-e29b-41d4-a716-446655440006', description: 'Sprzęt outdoor', isActive: true },
  { id: 'supplements', name: 'Suplementy', code: 'SU', categoryId: '550e8400-e29b-41d4-a716-446655440006', description: 'Suplementy diety', isActive: true },

  // Zwierzęta
  { id: 'food', name: 'Karma', code: 'FO', categoryId: '550e8400-e29b-41d4-a716-446655440008', description: 'Karma dla zwierząt', isActive: true },
  { id: 'toys-pet', name: 'Zabawki', code: 'TO', categoryId: '550e8400-e29b-41d4-a716-446655440008', description: 'Zabawki dla zwierząt', isActive: true },
  { id: 'care-pet', name: 'Pielęgnacja', code: 'CA', categoryId: '550e8400-e29b-41d4-a716-446655440008', description: 'Produkty pielęgnacyjne', isActive: true },

  // Zabawki
  { id: 'educational', name: 'Edukacyjne', code: 'ED', categoryId: '550e8400-e29b-41d4-a716-446655440005', description: 'Zabawki edukacyjne', isActive: true },
  { id: 'creative', name: 'Kreatywne', code: 'CR', categoryId: '550e8400-e29b-41d4-a716-446655440005', description: 'Zabawki kreatywne', isActive: true },
  { id: 'electronic-toys', name: 'Elektroniczne', code: 'EL', categoryId: '550e8400-e29b-41d4-a716-446655440005', description: 'Zabawki elektroniczne', isActive: true }
];

// Mapowanie istniejących kategorii na nowe kody
export const legacyCategoryMapping: Record<string, { categoryCode: string; typeCode: string }> = {
  '550e8400-e29b-41d4-a716-446655440001': { categoryCode: 'EL', typeCode: 'SH' }, // Smart Home jako domyślny
  '550e8400-e29b-41d4-a716-446655440002': { categoryCode: 'DO', typeCode: 'OR' }, // Organizacja jako domyślny
  '550e8400-e29b-41d4-a716-446655440003': { categoryCode: 'MO', typeCode: 'CL' }, // Clothing jako domyślny
  '550e8400-e29b-41d4-a716-446655440004': { categoryCode: 'UR', typeCode: 'SK' }, // Skincare jako domyślny
  '550e8400-e29b-41d4-a716-446655440005': { categoryCode: 'ZA', typeCode: 'ED' }, // Educational jako domyślny
  '550e8400-e29b-41d4-a716-446655440006': { categoryCode: 'SP', typeCode: 'FI' }, // Fitness jako domyślny
  '550e8400-e29b-41d4-a716-446655440007': { categoryCode: 'AU', typeCode: 'AC' }, // Accessories jako domyślny
  '550e8400-e29b-41d4-a716-446655440008': { categoryCode: 'PE', typeCode: 'FO' }, // Food jako domyślny
  '550e8400-e29b-41d4-a716-446655440009': { categoryCode: 'TR', typeCode: 'BA' }, // Bags jako domyślny
  '550e8400-e29b-41d4-a716-44665544000a': { categoryCode: 'OC', typeCode: 'DE' } // Decoration jako domyślny
};