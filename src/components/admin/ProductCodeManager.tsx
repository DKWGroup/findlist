import React, { useState, useEffect } from 'react';
import { 
  Hash, 
  Search, 
  Plus, 
  Edit, 
  Download, 
  Upload, 
  BarChart3,
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { productCodeService } from '../../services/productCodeService';
import { ProductCode, CategoryMapping, TypeMapping, ProductCodeStats } from '../../types/productCode';

export const ProductCodeManager: React.FC = () => {
  const [productCodes, setProductCodes] = useState<ProductCode[]>([]);
  const [categories, setCategories] = useState<CategoryMapping[]>([]);
  const [types, setTypes] = useState<TypeMapping[]>([]);
  const [stats, setStats] = useState<ProductCodeStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newCodeForm, setNewCodeForm] = useState({
    categoryId: '',
    typeId: '',
    productId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const categoriesData = productCodeService.getCategories();
      const statsData = productCodeService.getCodeStats();
      
      setCategories(categoriesData);
      setStats(statsData);
      setProductCodes(statsData.lastGeneratedCodes);
    } catch (error) {
      console.error('Błąd ładowania danych:', error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setNewCodeForm(prev => ({ ...prev, categoryId, typeId: '' }));
    
    if (categoryId) {
      const categoryTypes = productCodeService.getTypesForCategory(categoryId);
      setTypes(categoryTypes);
    } else {
      setTypes([]);
    }
  };

  const generateNewCode = async () => {
    if (!newCodeForm.categoryId) {
      alert('Wybierz kategorię');
      return;
    }

    setIsGenerating(true);
    try {
      const productCode = await productCodeService.registerProductCode(
        newCodeForm.productId || `temp_${Date.now()}`,
        newCodeForm.categoryId,
        newCodeForm.typeId || undefined
      );

      alert(`Wygenerowano kod: ${productCode.code}`);
      setNewCodeForm({ categoryId: '', typeId: '', productId: '' });
      loadData();
    } catch (error) {
      alert(`Błąd generowania kodu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Można dodać toast notification
  };

  const filteredCodes = productCodes.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         code.productId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || code.categoryCode === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hash className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Zarządzanie kodami produktów</h1>
            <p className="text-gray-600">System unikalnych kodów i aliasów URL</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Eksport
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4" />
            Import
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Łączna liczba kodów</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCodes}</p>
              </div>
              <Hash className="h-12 w-12 text-blue-600 bg-blue-100 rounded-lg p-3" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Aktywne kategorie</p>
                <p className="text-3xl font-bold text-gray-900">{Object.keys(stats.codesByCategory).length}</p>
              </div>
              <BarChart3 className="h-12 w-12 text-green-600 bg-green-100 rounded-lg p-3" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Typy produktów</p>
                <p className="text-3xl font-bold text-gray-900">{Object.keys(stats.codesByType).length}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-purple-600 bg-purple-100 rounded-lg p-3" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ostatni kod</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.lastGeneratedCodes[0]?.code || 'Brak'}
                </p>
              </div>
              <AlertCircle className="h-12 w-12 text-orange-600 bg-orange-100 rounded-lg p-3" />
            </div>
          </div>
        </div>
      )}

      {/* Generator nowych kodów */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Generator nowych kodów</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
            <select
              value={newCodeForm.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Wybierz kategorię</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Typ produktu</label>
            <select
              value={newCodeForm.typeId}
              onChange={(e) => setNewCodeForm(prev => ({ ...prev, typeId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!newCodeForm.categoryId}
            >
              <option value="">Domyślny typ</option>
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Produktu (opcjonalne)</label>
            <input
              type="text"
              value={newCodeForm.productId}
              onChange={(e) => setNewCodeForm(prev => ({ ...prev, productId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Zostaw puste dla tymczasowego"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={generateNewCode}
              disabled={isGenerating || !newCodeForm.categoryId}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generowanie...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Generuj kod
                </>
              )}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Format kodu:</strong> KK-TT-NNN (Kategoria-Typ-Numer)</p>
          <p><strong>Przykład:</strong> EL-SH-001 (Elektronika-Smart Home-001)</p>
        </div>
      </div>

      {/* Wyszukiwanie i filtry */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj po kodzie lub ID produktu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Wszystkie kategorie</option>
            {categories.map(category => (
              <option key={category.code} value={category.code}>
                {category.name} ({category.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista kodów */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Lista kodów produktów ({filteredCodes.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Kod produktu</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Kategoria</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Typ</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Numer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID Produktu</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Data utworzenia</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filteredCodes.map((code) => (
                <tr key={code.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600">{code.code}</span>
                      <button
                        onClick={() => copyToClipboard(code.code)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Kopiuj kod"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {code.categoryCode}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {code.typeCode}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono">{code.sequenceNumber.toString().padStart(3, '0')}</td>
                  <td className="py-4 px-4 text-gray-600">{code.productId}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {new Date(code.createdAt).toLocaleDateString('pl-PL')}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edytuj"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/${code.code.toLowerCase()}`)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Kopiuj link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCodes.length === 0 && (
          <div className="text-center py-12">
            <Hash className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Brak kodów</h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory 
                ? 'Nie znaleziono kodów spełniających kryteria wyszukiwania'
                : 'Wygeneruj pierwszy kod produktu'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};