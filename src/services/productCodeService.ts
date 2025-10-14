import { categoryMappings, typeMappings } from "../data/productCodeMappings";
import {
  CategoryMapping,
  ProductCode,
  ProductCodeStats,
  TypeMapping,
} from "../types/productCode";
import { productService } from "./productService";

class ProductCodeService {
  private productCodes: ProductCode[] = [];
  private codeSequences: Map<string, number> = new Map();
  private categories: CategoryMapping[] = categoryMappings.filter(
    (c) => c.isActive
  );
  private categoriesLoadedFromSupabase = false;
  private categoriesLoadingPromise: Promise<CategoryMapping[]> | null = null;

  constructor() {
    this.initializeSequences();
    this.ensureSequencesForCategories(this.categories);
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

  private ensureSequencesForCategories(categories: CategoryMapping[]): void {
    categories.forEach((category) => {
      const categoryTypes = typeMappings.filter(
        (type) => type.categoryId === category.id
      );
      categoryTypes.forEach((type) => {
        const key = `${category.code}-${type.code}`;
        if (!this.codeSequences.has(key)) {
          this.codeSequences.set(key, 0);
        }
      });
    });
  }

  private mapDatabaseCategory(record: any): CategoryMapping {
    const fallback = categoryMappings.find((c) => c.id === record.id);
    return {
      id: record.id,
      name: record.name || fallback?.name || "",
      code: (record.code || fallback?.code || "").toUpperCase(),
      parentId: record.parent_id ?? fallback?.parentId,
      description: record.description || fallback?.description || "",
      isActive: record.is_active !== false,
    };
  }

  async loadCategories(): Promise<CategoryMapping[]> {
    if (this.categoriesLoadedFromSupabase && this.categories.length > 0) {
      return this.categories;
    }

    if (this.categoriesLoadingPromise) {
      return this.categoriesLoadingPromise;
    }

    this.categoriesLoadingPromise = productService
      .getCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data
            .filter((category) => category)
            .map((category) => this.mapDatabaseCategory(category))
            .filter((category) => category.isActive);

          if (mapped.length > 0) {
            this.categories = mapped;
            this.categoriesLoadedFromSupabase = true;
            this.ensureSequencesForCategories(this.categories);
          }
        }

        if (!this.categories.length) {
          this.categories = categoryMappings.filter((c) => c.isActive);
          this.ensureSequencesForCategories(this.categories);
        }

        return this.categories;
      })
      .catch((error) => {
        console.error(
          "Failed to load product categories from Supabase, using fallback mappings:",
          error
        );

        if (!this.categories.length) {
          this.categories = categoryMappings.filter((c) => c.isActive);
          this.ensureSequencesForCategories(this.categories);
        }

        return this.categories;
      })
      .finally(() => {
        this.categoriesLoadingPromise = null;
      });

    return this.categoriesLoadingPromise;
  }

  // Generowanie nowego kodu produktu
  async generateCode(categoryId: string): Promise<string> {
    await this.loadCategories();
    const category = this.categories.find((c) => c.id === categoryId);
    if (!category) {
      throw new Error(`Nieznana kategoria: ${categoryId}`);
    }

    // Nowy format: tylko kategoria + sekwencja (bez typu)
    const sequenceNumber = await this.getNextSequenceNumber(category.code);
    const code = `${category.code}-${sequenceNumber
      .toString()
      .padStart(4, "0")}`;

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
  async getNextSequenceNumber(categoryCode: string): Promise<number> {
    const key = categoryCode; // Tylko kod kategorii bez typu
    const currentSequence = this.codeSequences.get(key) || 0;
    const nextSequence = currentSequence + 1;

    this.codeSequences.set(key, nextSequence);
    return nextSequence;
  }

  // Rejestracja nowego kodu produktu
  async registerProductCode(
    productId: string,
    categoryId: string
  ): Promise<ProductCode> {
    const code = await this.generateCode(categoryId);
    const parsedCode = this.parseCode(code);

    if (!parsedCode) {
      throw new Error(`Nieprawidłowy format kodu: ${code}`);
    }

    const productCode: ProductCode = {
      id: Date.now().toString(),
      code,
      categoryCode: parsedCode.categoryCode,
      typeCode: "", // Pusty w nowym formacie
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
    const regex = /^[A-Z]{2}-\d{4}$/;
    return regex.test(code);
  }

  // Parsowanie kodu na komponenty
  parseCode(
    code: string
  ): { categoryCode: string; sequenceNumber: number } | null {
    if (!this.validateCode(code)) {
      return null;
    }

    const parts = code.split("-");
    return {
      categoryCode: parts[0],
      sequenceNumber: parseInt(parts[1], 10),
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
  generateUrlAlias(productTitle: string): string {
    if (!productTitle || !productTitle.trim()) {
      throw new Error(
        "Tytuł produktu jest wymagany do wygenerowania aliasu URL"
      );
    }

    const titleSlug = productTitle
      .toLowerCase()
      .replace(/ą/g, "a")
      .replace(/ć/g, "c")
      .replace(/ę/g, "e")
      .replace(/ł/g, "l")
      .replace(/ń/g, "n")
      .replace(/ó/g, "o")
      .replace(/ś/g, "s")
      .replace(/ź|ż/g, "z")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .replace(/^-+|-+$/g, ""); // Usuń myślniki z początku i końca

    if (!titleSlug) {
      throw new Error("Nie można wygenerować aliasu URL z podanego tytułu");
    }

    return titleSlug;
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
      typeCode: "", // Pusty w nowym formacie
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
    return [...this.categories];
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
