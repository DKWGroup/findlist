import {
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import React, { useState } from "react";
import {
  migrateProductUrls,
  runCompleteMigration,
  validateProductUrls,
} from "../../utils/migrateProductUrls";

interface MigrationResult {
  success: boolean;
  migrated: number;
  errors: string[];
}

interface ValidationResult {
  valid: boolean;
  issues: string[];
}

export const ProductUrlManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResult, setMigrationResult] =
    useState<MigrationResult | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleMigration = async () => {
    setIsLoading(true);
    setLastAction("migration");
    try {
      const result = await migrateProductUrls();
      setMigrationResult(result);
    } catch (error) {
      console.error("Migration error:", error);
      setMigrationResult({
        success: false,
        migrated: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidation = async () => {
    setIsLoading(true);
    setLastAction("validation");
    try {
      const result = await validateProductUrls();
      setValidationResult(result);
    } catch (error) {
      console.error("Validation error:", error);
      setValidationResult({
        valid: false,
        issues: [error instanceof Error ? error.message : "Unknown error"],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteMigration = async () => {
    setIsLoading(true);
    setLastAction("complete");
    try {
      await runCompleteMigration();
      // Refresh validation after complete migration
      const validation = await validateProductUrls();
      setValidationResult(validation);

      // Show success message
      setMigrationResult({
        success: true,
        migrated: 0, // This will be logged in console
        errors: [],
      });
    } catch (error) {
      console.error("Complete migration error:", error);
      setMigrationResult({
        success: false,
        migrated: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Zarządzanie URLami Produktów
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Validation */}
          <button
            onClick={handleValidation}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            {isLoading && lastAction === "validation"
              ? "Sprawdzanie..."
              : "Sprawdź URLe"}
          </button>

          {/* Migration */}
          <button
            onClick={handleMigration}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            {isLoading && lastAction === "migration"
              ? "Migrowanie..."
              : "Migruj URLe"}
          </button>

          {/* Complete Migration */}
          <button
            onClick={handleCompleteMigration}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            {isLoading && lastAction === "complete"
              ? "Wykonywanie..."
              : "Pełna Migracja"}
          </button>
        </div>

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">
            System dwóch linków:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              <strong>Długi link (główny):</strong> /produkty/nazwa-produktu
            </li>
            <li>
              <strong>Krótki link (alias):</strong> /KK-TT-001
            </li>
            <li>Krótki link automatycznie przekierowuje do długiego linku</li>
            <li>Długi link jest używany jako canonical URL dla SEO</li>
          </ul>
        </div>

        {/* Validation Results */}
        {validationResult && (
          <div
            className={`border rounded-lg p-4 mb-4 ${
              validationResult.valid
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {validationResult.valid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <h3
                className={`font-medium ${
                  validationResult.valid ? "text-green-900" : "text-red-900"
                }`}
              >
                Wynik walidacji
              </h3>
            </div>

            {validationResult.valid ? (
              <p className="text-green-700 text-sm">
                ✅ Wszystkie produkty mają prawidłowe URLe
              </p>
            ) : (
              <div className="space-y-1">
                {validationResult.issues.map((issue, index) => (
                  <p key={index} className="text-red-700 text-sm">
                    ❌ {issue}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Migration Results */}
        {migrationResult && (
          <div
            className={`border rounded-lg p-4 mb-4 ${
              migrationResult.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {migrationResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <h3
                className={`font-medium ${
                  migrationResult.success ? "text-green-900" : "text-red-900"
                }`}
              >
                Wynik migracji
              </h3>
            </div>

            {migrationResult.success ? (
              <p className="text-green-700 text-sm">
                ✅ Migracja zakończona pomyślnie: {migrationResult.migrated}{" "}
                produktów zaktualizowanych
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-red-700 text-sm">
                  ⚠️ Migracja zakończona z błędami: {migrationResult.migrated}{" "}
                  produktów zaktualizowanych
                </p>
                {migrationResult.errors.map((error, index) => (
                  <p key={index} className="text-red-700 text-sm">
                    ❌ {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* URL Examples */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Przykłady URLi:</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white rounded border p-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Długi link (główny):
                </p>
                <p className="text-sm text-blue-600 font-mono">
                  https://findlist.net/produkty/dlugi-pasek-do-telefonu
                </p>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    "https://findlist.net/produkty/dlugi-pasek-do-telefonu"
                  )
                }
                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                title="Kopiuj link"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-white rounded border p-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Krótki link (alias):
                </p>
                <p className="text-sm text-green-600 font-mono">
                  https://findlist.net/EL-AC-001
                </p>
              </div>
              <button
                onClick={() =>
                  copyToClipboard("https://findlist.net/EL-AC-001")
                }
                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                title="Kopiuj link"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-gray-500 mt-2">
              💡 Krótki link automatycznie przekierowuje do długiego linku
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
