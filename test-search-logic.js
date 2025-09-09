// Test wyszukiwania po kodach produktów
const testSearchByCodes = async () => {
  // Symulujemy zapytania o różne kody
  const testCodes = [
    "ZA-ED-001",
    "ZA-ED-003",
    "KU-WY",
    "SP-GR-001",
    "test",
    "produkt",
  ];

  for (const code of testCodes) {
    console.log(`\n--- Testowanie zapytania: "${code}" ---`);

    // Sprawdź czy query wygląda jak kod produktu
    const isProductCodeQuery = /^[A-Z]{2}-[A-Z]{2}-\d{1,3}$/i.test(code.trim());
    console.log(`Czy to kod produktu? ${isProductCodeQuery}`);

    if (isProductCodeQuery) {
      console.log("Wyszukiwanie po kodzie produktu...");
    } else {
      console.log("Standardowe wyszukiwanie po tytule...");
    }
  }
};

testSearchByCodes();
