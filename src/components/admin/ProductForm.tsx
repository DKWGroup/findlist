import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Link as LinkIcon, Hash, Copy } from 'lucide-react';
import { Product } from '../../types';
import { categories } from '../../data/mockData';
import { productCodeService } from '../../services/productCodeService';
import { CategoryMapping, TypeMapping } from '../../types/productCode';
import { ImageUploadZone } from '../upload/ImageUploadZone';

interface ProductFormProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    images: [''],
    category: '',
    productType: '',
    tags: [],
    price: {
      original: 0,
      discounted: 0,
      currency: 'PLN'
    },
    affiliateLinks: {
      temu: '',
      aliexpress: '',
      amazon: ''
    },
    socialLinks: {
      tiktok: '',
      instagram: ''
    },
    isVerified: false,
    isTrending: false,
    code: '',
    urlAlias: ''
  });

  const [newTag, setNewTag] = useState('');
  const [availableCategories, setAvailableCategories] = useState<CategoryMapping[]>([]);
  const [availableTypes, setAvailableTypes] = useState<TypeMapping[]>([]);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEffect(() => {
    // Załaduj dostępne kategorie i typy
    const cats = productCodeService.getCategories();
    setAvailableCategories(cats);

    if (product) {
      setFormData({
        ...product,
        images: product.images.length > 0 ? product.images : []
      });
      setUploadedImages(product.images || []);
      
      // Załaduj typy dla kategorii produktu
      if (product.category) {
        const types = productCodeService.getTypesForCategory(product.category);
        setAvailableTypes(types);
      }
    } else {
      // Reset form for new product
      setFormData({
        title: '',
        description: '',
        images: [],
        category: '',
        productType: '',
        tags: [],
        price: {
          original: 0,
          discounted: 0,
          currency: 'PLN'
        },
        affiliateLinks: {
          temu: '',
          aliexpress: '',
          amazon: ''
        },
        socialLinks: {
          tiktok: '',
          instagram: ''
        },
        isVerified: false,
        isTrending: false,
        code: '',
        urlAlias: ''
      });
      setAvailableTypes([]);
    }
  }, [product, isOpen]);

  const handleImageUpload = (urls: string[]) => {
    const newImages = [...uploadedImages, ...urls];
    setUploadedImages(newImages);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleImageUploadError = (error: string) => {
    alert(`Błąd przesyłania obrazów: ${error}`);
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      category: categoryId,
      productType: '' // Reset typu przy zmianie kategorii
    }));
    
    if (categoryId) {
      const types = productCodeService.getTypesForCategory(categoryId);
      setAvailableTypes(types);
    } else {
      setAvailableTypes([]);
    }
  };

  const generateProductCode = async () => {
    if (!formData.category) {
      alert('Wybierz kategorię przed generowaniem kodu');
      return;
    }

    setIsGeneratingCode(true);
    try {
      const code = await productCodeService.generateCode(
        formData.category,
        formData.productType || undefined
      );
      
      const alias = productCodeService.generateUrlAlias(code, formData.title);
      
      setFormData(prev => ({
        ...prev,
        code,
        urlAlias: alias
      }));
    } catch (error) {
      alert(`Błąd generowania kodu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setFormData(prev => ({ ...prev, code: newCode }));
    
    if (newCode && productCodeService.validateCode(newCode)) {
      const alias = productCodeService.generateUrlAlias(newCode, formData.title);
      setFormData(prev => ({ ...prev, urlAlias: alias }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Można dodać toast notification
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title?.trim() || !formData.description?.trim() || !formData.category) {
      alert('Wypełnij wszystkie wymagane pola');
      return;
    }

    // Validate product code if provided
    if (formData.code && !productCodeService.validateCode(formData.code)) {
      alert('Nieprawidłowy format kodu produktu (wymagany format: XX-XX-XXX)');
      return;
    }

    // Clean up empty images
    const cleanedData = {
      ...formData,
      images: uploadedImages,
     dateAdded: product?.dateAdded || new Date().toISOString().split('T')[0],
     popularity: product?.popularity || {
       views: 0,
       likes: 0,
       shares: 0
     },
     ratings: product?.ratings || {
       average: 0,
       count: 0
     }
    };

    onSave(cleanedData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edytuj produkt' : 'Dodaj nowy produkt'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6 space-y-6">
            {/* Kod produktu i alias URL */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-600" />
                Kod produktu i alias URL
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kod produktu
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code || ''}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="XX-XX-XXX"
                      pattern="[A-Z]{2}-[A-Z]{2}-\d{3}"
                    />
                    <button
                      type="button"
                      onClick={generateProductCode}
                      disabled={isGeneratingCode || !formData.category}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isGeneratingCode ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Hash className="h-4 w-4" />
                      )}
                      {isGeneratingCode ? 'Generowanie...' : 'Generuj'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Format: KK-TT-NNN (Kategoria-Typ-Numer)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alias URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.urlAlias || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, urlAlias: e.target.value }))}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="kod-produktu-nazwa"
                    />
                    {formData.urlAlias && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`${window.location.origin}/${formData.urlAlias}`)}
                        className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Kopiuj link"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {formData.urlAlias && (
                    <p className="text-xs text-blue-600 mt-1">
                      Link: {window.location.origin}/{formData.urlAlias}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tytuł produktu *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Wprowadź tytuł produktu"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoria *
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Wybierz kategorię</option>
                  {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Typ produktu */}
            {availableTypes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typ produktu
                </label>
                <select
                  value={formData.productType || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Domyślny typ</option>
                  {availableTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opis produktu *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Opisz produkt szczegółowo..."
                required
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zdjęcia produktu
              </label>
              
              <ImageUploadZone
                onUploadComplete={handleImageUpload}
                onUploadError={handleImageUploadError}
                maxFiles={5}
                folder="products"
                className="mb-4"
              />

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Przesłane obrazy:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Produkt ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          aria-label="Usuń obraz"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>


            {/* Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cena oryginalna
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price?.original || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    price: { ...prev.price!, original: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cena promocyjna
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price?.discounted || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    price: { ...prev.price!, discounted: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waluta
                </label>
                <select
                  value={formData.price?.currency || 'PLN'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    price: { ...prev.price!, currency: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PLN">PLN</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagi
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dodaj tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dodaj
                </button>
              </div>
            </div>

            {/* Affiliate Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Linki afiliacyjne
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Temu</label>
                  <input
                    type="url"
                    value={formData.affiliateLinks?.temu || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      affiliateLinks: { ...prev.affiliateLinks!, temu: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://temu.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">AliExpress</label>
                  <input
                    type="url"
                    value={formData.affiliateLinks?.aliexpress || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      affiliateLinks: { ...prev.affiliateLinks!, aliexpress: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://aliexpress.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Amazon</label>
                  <input
                    type="url"
                    value={formData.affiliateLinks?.amazon || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      affiliateLinks: { ...prev.affiliateLinks!, amazon: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://amazon.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Linki społecznościowe
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">TikTok</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.tiktok || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks!, tiktok: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://tiktok.com/@user/video/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.instagram || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks!, instagram: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://instagram.com/p/..."
                  />
                </div>
              </div>
            </div>

            {/* Status Flags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Status produktu
              </label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isVerified || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isVerified: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Zweryfikowany</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isTrending || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isTrending: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Trending</span>
                </label>
              </div>
            </div>
            </div>

            {/* Footer */}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Zapisywanie...</span>
                </>
              ) : (
                <span>{product ? 'Zapisz zmiany' : 'Dodaj produkt'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};