// Test wyszukiwania po kodach produktów
const testSearchByCodes = async () => {
  // Symulujemy zapytania o różne kody z różną wielkością liter
  const testCodes = [
    "ZA-ED-001", // uppercase
    "za-ed-001", // lowercase
    "Za-Ed-001", // mixed case
    "ZA-ED-003", // uppercase
    "za-ed-003", // lowercase
    "KU-WY", // partial code uppercase
    "ku-wy", // partial code lowercase
    "SP-GR-001", // uppercase
    "sp-gr-001", // lowercase
    "test", // regular search
    "produkt", // regular search
  ];

  for (const code of testCodes) {
    console.log(`\n--- Testowanie zapytania: "${code}" ---`);

    // Sprawdź czy query wygląda jak kod produktu (case-insensitive)
    const isProductCodeQuery = /^[A-Z]{2}-[A-Z]{2}-\d{1,3}$/i.test(code.trim());
    console.log(`Czy to kod produktu? ${isProductCodeQuery}`);

    if (isProductCodeQuery) {
      console.log("Wyszukiwanie po kodzie produktu (case-insensitive)...");
      console.log(`Znormalizowany kod: ${code.toUpperCase()}`);
    } else {
      console.log("Standardowe wyszukiwanie po tytule...");
    }
  }
};

testSearchByCodes();
