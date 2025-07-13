export interface ProductCode {
  id: string;
  code: string;
  categoryCode: string;
  typeCode: string;
  sequenceNumber: number;
  productId: string;
  createdAt: string;
  isActive: boolean;
}

export interface CategoryMapping {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  description: string;
  isActive: boolean;
}

export interface TypeMapping {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  description: string;
  isActive: boolean;
}

export interface ProductCodeGenerator {
  generateCode(categoryCode: string, typeCode: string): Promise<string>;
  validateCode(code: string): boolean;
  parseCode(code: string): { categoryCode: string; typeCode: string; sequenceNumber: number } | null;
  getNextSequenceNumber(categoryCode: string, typeCode: string): Promise<number>;
}

export interface ProductCodeStats {
  totalCodes: number;
  codesByCategory: Record<string, number>;
  codesByType: Record<string, number>;
  lastGeneratedCodes: ProductCode[];
}