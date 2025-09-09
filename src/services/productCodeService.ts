import {
  categoryMappings,
  legacyCategoryMapping,
  typeMappings,
} from "../data/productCodeMappings";
import {
  CategoryMapping,
  ProductCode,
  ProductCodeStats,
  TypeMapping,
} from "../types/productCode";

class ProductCodeService {
  private productCodes: ProductCode[] = [];
  private codeSequences: Map<string, number> = new Map();

  constructor() {
    this.initializeSequences();
  }

  // Inicjalizacja sekwencji dla istniejących kombinacji
  private initializeSequences(): void {
    categoryMappings.forEach((category) => {
      const categoryTypes = typeMappings.filter(
        (type) => type.categoryId === category.id
      );
      categoryTypes.forEach((type) => {
        const key = `${category.code}-${type.code}`;
        this.codeSequences.set(key, 0);
      });
    });
  }

  // Generowanie nowego kodu produktu
  async generateCode(categoryId: string, typeId?: string): Promise<string> {
    const category = categoryMappings.find((c) => c.id === categoryId);
    if (!category) {
      throw new Error(`Nieznana kategoria: ${categoryId}`);
    }

    let type: TypeMapping | undefined;

    if (typeId) {
      type = typeMappings.find(
        (t) => t.id === typeId && t.categoryId === categoryId
      );
      if (!type) {
        throw new Error(`Nieznany typ: ${typeId} dla kategorii: ${categoryId}`);
      }
    } else {
      // Użyj domyślnego typu dla kategorii
      const legacy = legacyCategoryMapping[categoryId];
      if (legacy) {
        type = typeMappings.find(
          (t) => t.code === legacy.typeCode && t.categoryId === categoryId
        );
      }

      if (!type) {
        // Weź pierwszy dostępny typ dla kategorii
        type = typeMappings.find((t) => t.categoryId === categoryId);
      }
    }

    if (!type) {
      throw new Error(`Brak dostępnych typów dla kategorii: ${categoryId}`);
    }

    const sequenceNumber = await this.getNextSequenceNumber(
      category.code,
      type.code
    );
    const code = `${category.code}-${type.code}-${sequenceNumber
      .toString()
      .padStart(3, "0")}`;

    // Sprawdź unikalność (case-insensitive)
    if (
      this.productCodes.some(
        (pc) => pc.code.toLowerCase() === code.toLowerCase()
      )
    ) {
      throw new Error(`Kod ${code} już istnieje`);
    }

    return code;
  }

  // Pobieranie następnego numeru sekwencyjnego
  async getNextSequenceNumber(
    categoryCode: string,
    typeCode: string
  ): Promise<number> {
    const key = `${categoryCode}-${typeCode}`;
    const currentSequence = this.codeSequences.get(key) || 0;
    const nextSequence = currentSequence + 1;

    this.codeSequences.set(key, nextSequence);
    return nextSequence;
  }

  // Rejestracja nowego kodu produktu
  async registerProductCode(
    productId: string,
    categoryId: string,
    typeId?: string
  ): Promise<ProductCode> {
    const code = await this.generateCode(categoryId, typeId);
    const parsedCode = this.parseCode(code);

    if (!parsedCode) {
      throw new Error(`Nieprawidłowy format kodu: ${code}`);
    }

    const productCode: ProductCode = {
      id: Date.now().toString(),
      code,
      categoryCode: parsedCode.categoryCode,
      typeCode: parsedCode.typeCode,
      sequenceNumber: parsedCode.sequenceNumber,
      productId,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    this.productCodes.push(productCode);
    return productCode;
  }

  // Walidacja formatu kodu
  validateCode(code: string): boolean {
    const regex = /^[A-Z]{2}-[A-Z]{2}-\d{3}$/;
    return regex.test(code);
  }

  // Parsowanie kodu na komponenty
  parseCode(
    code: string
  ): { categoryCode: string; typeCode: string; sequenceNumber: number } | null {
    if (!this.validateCode(code)) {
      return null;
    }

    const parts = code.split("-");
    return {
      categoryCode: parts[0],
      typeCode: parts[1],
      sequenceNumber: parseInt(parts[2], 10),
    };
  }

  // Wyszukiwanie produktu po kodzie
  findProductByCode(code: string): ProductCode | null {
    return (
      this.productCodes.find(
        (pc) => pc.code.toLowerCase() === code.toLowerCase() && pc.isActive
      ) || null
    );
  }

  // Wyszukiwanie kodów po kategorii
  findCodesByCategory(categoryCode: string): ProductCode[] {
    return this.productCodes.filter(
      (pc) => pc.categoryCode === categoryCode && pc.isActive
    );
  }

  // Wyszukiwanie kodów po typie
  findCodesByType(categoryCode: string, typeCode: string): ProductCode[] {
    return this.productCodes.filter(
      (pc) =>
        pc.categoryCode === categoryCode &&
        pc.typeCode === typeCode &&
        pc.isActive
    );
  }

  // Generowanie aliasu URL
  generateUrlAlias(code: string, productTitle?: string): string {
    const baseAlias = code.toLowerCase();

    if (productTitle) {
      const titleSlug = productTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      return `${baseAlias}-${titleSlug}`;
    }

    return baseAlias;
  }

  // Aktualizacja kodu produktu (tylko dla administratorów)
  async updateProductCode(
    productId: string,
    newCode: string
  ): Promise<boolean> {
    if (!this.validateCode(newCode)) {
      throw new Error("Nieprawidłowy format kodu");
    }

    const existingCode = this.productCodes.find(
      (pc) =>
        pc.code.toLowerCase() === newCode.toLowerCase() &&
        pc.productId !== productId
    );
    if (existingCode) {
      throw new Error("Kod już istnieje dla innego produktu");
    }

    const productCodeIndex = this.productCodes.findIndex(
      (pc) => pc.productId === productId
    );
    if (productCodeIndex === -1) {
      throw new Error("Nie znaleziono kodu dla produktu");
    }

    const parsedCode = this.parseCode(newCode);
    if (!parsedCode) {
      throw new Error("Błąd parsowania kodu");
    }

    this.productCodes[productCodeIndex] = {
      ...this.productCodes[productCodeIndex],
      code: newCode,
      categoryCode: parsedCode.categoryCode,
      typeCode: parsedCode.typeCode,
      sequenceNumber: parsedCode.sequenceNumber,
    };

    return true;
  }

  // Pobieranie statystyk kodów
  getCodeStats(): ProductCodeStats {
    const codesByCategory: Record<string, number> = {};
    const codesByType: Record<string, number> = {};

    this.productCodes.forEach((pc) => {
      if (pc.isActive) {
        codesByCategory[pc.categoryCode] =
          (codesByCategory[pc.categoryCode] || 0) + 1;
        const typeKey = `${pc.categoryCode}-${pc.typeCode}`;
        codesByType[typeKey] = (codesByType[typeKey] || 0) + 1;
      }
    });

    return {
      totalCodes: this.productCodes.filter((pc) => pc.isActive).length,
      codesByCategory,
      codesByType,
      lastGeneratedCodes: this.productCodes
        .filter((pc) => pc.isActive)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10),
    };
  }

  // Pobieranie dostępnych kategorii
  getCategories(): CategoryMapping[] {
    return categoryMappings.filter((c) => c.isActive);
  }

  // Pobieranie typów dla kategorii
  getTypesForCategory(categoryId: string): TypeMapping[] {
    return typeMappings.filter(
      (t) => t.categoryId === categoryId && t.isActive
    );
  }

  // Migracja istniejących produktów
  async migrateExistingProducts(
    products: Array<{ id: string; category: string }>
  ): Promise<void> {
    for (const product of products) {
      try {
        await this.registerProductCode(product.id, product.category);
      } catch (error) {
        console.error(`Błąd migracji produktu ${product.id}:`, error);
      }
    }
  }

  // Eksport/Import kodów (dla backup)
  exportCodes(): string {
    return JSON.stringify({
      productCodes: this.productCodes,
      sequences: Array.from(this.codeSequences.entries()),
    });
  }

  importCodes(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.productCodes = parsed.productCodes || [];
      this.codeSequences = new Map(parsed.sequences || []);
    } catch (error) {
      throw new Error("Błąd importu kodów produktów");
    }
  }
}

export const productCodeService = new ProductCodeService();
