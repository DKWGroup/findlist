import { Eye, Plus, Save, Star, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { blogCategories, blogLabels } from "../../data/blogData";
import { BlogPost } from "../../types/blog";
import { ImageUploadZone } from "../upload/ImageUploadZone";

// Definicja predefiniowanych sekcji
const predefinedSections = [
  {
    id: "purpose",
    label: "Przeznaczenie",
    placeholder: "Do czego służy ten produkt i jaki problem rozwiązuje?",
  },
  {
    id: "quality",
    label: "Jakość wykonania",
    placeholder:
      "Jakie są materiały, jak produkt jest zbudowany, jakie są pierwsze wrażenia?",
  },
  {
    id: "functionality",
    label: "Funkcjonalność",
    placeholder: "Jak produkt działa w praktyce, czy spełnia swoje zadanie?",
  },
  {
    id: "price",
    label: "Cena",
    placeholder:
      "Czy cena jest adekwatna do jakości i funkcji? Czy są lepsze alternatywy?",
  },
  {
    id: "conclusions",
    label: "Wnioski",
    placeholder: "Kluczowe zalety i wady produktu.",
  },
  {
    id: "notForWho",
    label: "Dla kogo NIE jest ten produkt",
    placeholder:
      "W jakich sytuacjach lub dla jakich osób ten produkt się nie sprawdzi?",
  },
  {
    id: "summary",
    label: "Podsumowanie",
    placeholder: "Krótkie, końcowe podsumowanie i ostateczna rekomendacja.",
  },
];

// Funkcja do parsowania istniejącej treści na obiekt sekcji
const parseContentToSections = (
  content: string | undefined
): Record<string, string> => {
  const sections: Record<string, string> = {};
  if (!content) return sections;

  predefinedSections.forEach((sectionInfo) => {
    const regex = new RegExp(
      `## ${sectionInfo.label}\\n\\n([\\s\\S]*?)(?=\\n\\n##|$)`,
      "i"
    );
    const match = content.match(regex);
    sections[sectionInfo.id] = match ? match[1].trim() : "";
  });
  return sections;
};

interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: Partial<BlogPost>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  post,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    type: "review",
    title: "",
    excerpt: "",
    featuredImage: "",
    category: "",
    tags: [],
    labels: [],
    isPublished: false,
    isFeatured: false,
    sectionRatings: {
      purpose: 5,
      quality: 5,
      functionality: 5,
      price: 5,
      conclusions: 5,
    },
    overallRating: 5,
    pros: "",
    cons: "",
    notForWho: "",
    productLinks: {
      temu: "",
      aliexpress: "",
      amazon: "",
    },
    tiktokVideo: "",
    ...post,
  });

  // Stan dla treści poszczególnych sekcji
  const [sectionContent, setSectionContent] = useState<Record<string, string>>(
    parseContentToSections(post?.content)
  );

  const [newTag, setNewTag] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadedFeaturedImage, setUploadedFeaturedImage] =
    useState<string>("");

  const handleFeaturedImageUpload = (urls: string[]) => {
    if (urls.length > 0) {
      const imageUrl = urls[0];
      setUploadedFeaturedImage(imageUrl);
      setFormData((prev) => ({ ...prev, featuredImage: imageUrl }));
    }
  };

  const handleImageUploadError = (error: string) => {
    alert(`Błąd przesyłania obrazu: ${error}`);
  };

  const removeFeaturedImage = () => {
    setUploadedFeaturedImage("");
    setFormData((prev) => ({ ...prev, featuredImage: "" }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const slug =
      formData.title
        ?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim() || "";

    const postData = {
      ...formData,
      slug,
      updatedAt: new Date().toISOString(),
      publishedAt:
        formData.isPublished && !post
          ? new Date().toISOString()
          : post?.publishedAt,
    };

    onSave(postData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const toggleLabel = (labelId: string) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels?.includes(labelId)
        ? prev.labels.filter((id) => id !== labelId)
        : [...(prev.labels || []), labelId],
    }));
  };

  const getTemplateContent = (type: string) => {
    switch (type) {
      case "review":
        return `# Spis treści

## Przeznaczenie
## Jakość wykonania  
## Funkcjonalność
## Cena
## Wnioski
## Plusy i minusy
## Dla kogo NIE jest ten produkt
## Podsumowanie

---

![Zdjęcie produktu](URL_DO_ZDJECIA)

Wprowadzenie do recenzji produktu...

## Przeznaczenie

**Ocena: ⭐⭐⭐⭐⭐ (5/5)**

Opis przeznaczenia produktu...

## Jakość wykonania

**Ocena: ⭐⭐⭐⭐ (4/5)**

Opis jakości wykonania...

## Funkcjonalność

**Ocena: ⭐⭐⭐⭐⭐ (5/5)**

Opis funkcjonalności...

## Cena

**Ocena: ⭐⭐⭐ (3/5)**

Analiza ceny...

## Wnioski

**Ocena: ⭐⭐⭐⭐ (4/5)**

Wnioski z testowania...

## Plusy i minusy

**Plusy:** Opis pozytywnych aspektów produktu w formie ciągłego tekstu...

**Minusy:** Opis negatywnych aspektów produktu w formie ciągłego tekstu...

## Dla kogo NIE jest ten produkt

Opis grupy docelowej, dla której produkt nie jest odpowiedni...

## Podsumowanie

**Ostateczna ocena: ⭐⭐⭐⭐ (4/5)**

Podsumowanie recenzji...`;

      case "collection":
        return `# Spis treści

## Wprowadzenie
## Produkt 1
## Produkt 2
## Produkt 3
## Podsumowanie

---

![Zdjęcie kolekcji](URL_DO_ZDJECIA)

Wprowadzenie do kolekcji produktów...

## Produkt 1: Nazwa produktu

![Zdjęcie produktu 1](URL_DO_ZDJECIA)

Opis pierwszego produktu...

**Gdzie kupić:** [Link do sklepu](URL)

## Produkt 2: Nazwa produktu

![Zdjęcie produktu 2](URL_DO_ZDJECIA)

Opis drugiego produktu...

**Gdzie kupić:** [Link do sklepu](URL)

## Podsumowanie

Podsumowanie kolekcji i rekomendacje...`;

      case "scam-alert":
        return `# Spis treści

## Przeznaczenie
## Jakość wykonania  
## Funkcjonalność
## Cena
## Dlaczego to scam?
## Plusy i minusy
## Podsumowanie

---

![Zdjęcie produktu/scamu](URL_DO_ZDJECIA)

**⚠️ OSTRZEŻENIE:** Ten produkt może być scamem!

## Przeznaczenie

**Ocena: ⭐⭐ (2/5)**

Opis przeznaczenia produktu...

## Jakość wykonania

**Ocena: ⭐ (1/5)**

Opis problemów z jakością...

## Funkcjonalność

**Ocena: ⭐ (1/5)**

Opis problemów z funkcjonalnością...

## Cena

**Ocena: ⭐ (1/5)**

Analiza ceny vs rzeczywista wartość...

## Dlaczego to scam?

Szczegółowe wyjaśnienie, dlaczego produkt jest scamem...

## Plusy i minusy

**Plusy:** Ewentualne pozytywne aspekty (jeśli jakieś są)...

**Minusy:** Szczegółowy opis wszystkich problemów...

## Podsumowanie

**Ostateczna ocena: ⭐ (1/5)**

Ostrzeżenie i rekomendacje...`;

      default:
        return "";
    }
  };

  const handleTypeChange = (newType: string) => {
    setFormData((prev) => ({
      ...prev,
      type: newType as "review" | "collection" | "scam-alert",
      content: prev.content || getTemplateContent(newType),
    }));
  };

  const handleSectionChange = (id: string, value: string) => {
    setSectionContent((prev) => ({ ...prev, [id]: value }));
  };

  // Funkcja do łączenia sekcji w jeden string przed zapisem
  const combineSectionsToContent = (): string => {
    return predefinedSections
      .map((sectionInfo) => {
        const content = sectionContent[sectionInfo.id] || "";
        if (!content.trim()) return ""; // Pomiń puste sekcje
        return `## ${sectionInfo.label}\n\n${content}`;
      })
      .filter(Boolean) // Usuń puste wpisy
      .join("\n\n---\n\n");
  };

  const handleSave = () => {
    const finalContent = combineSectionsToContent();
    const dataToSave = { ...formData, content: finalContent };

    // --- DODANY LOG ---
    console.log('[BlogEditor] Dane przygotowane do zapisu:', dataToSave);
    // ------------------

    onSave(dataToSave);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {post ? "Edytuj wpis" : "Nowy wpis blogowy"}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              {previewMode ? "Edycja" : "Podgląd"}
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              Anuluj
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid  grid-cols-1 gap-8">
            {/* Main Content */}
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Podstawowe informacje
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typ wpisu
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="review">Recenzja produktu</option>
                    <option value="collection">Zbiór produktów</option>
                    <option value="scam-alert">Scam Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tytuł wpisu
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Wprowadź tytuł wpisu"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (krótki opis)
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Krótki opis wpisu (wyświetlany na liście)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zdjęcie główne (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featuredImage: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Treść wpisu
              </h2>
              <div className="space-y-6">
                {predefinedSections.map((section) => (
                  <div key={section.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {section.label}
                    </label>
                    <textarea
                      value={sectionContent[section.id] || ""}
                      onChange={(e) =>
                        handleSectionChange(section.id, e.target.value)
                      }
                      placeholder={section.placeholder}
                      rows={6}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Review Specific Fields */}
            {formData.type === "review" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Oceny szczegółowe
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {Object.entries(formData.sectionRatings || {}).map(
                    ([section, rating]) => (
                      <div key={section}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {section === "purpose"
                            ? "Przeznaczenie"
                            : section === "quality"
                            ? "Jakość"
                            : section === "functionality"
                            ? "Funkcjonalność"
                            : section === "price"
                            ? "Cena"
                            : section === "conclusions"
                            ? "Wnioski"
                            : section}
                        </label>
                        <div className="flex items-center gap-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  sectionRatings: {
                                    ...prev.sectionRatings!,
                                    [section]: i + 1,
                                  },
                                }))
                              }
                              className="p-1"
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  i < rating
                                    ? "text-yellow-500 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm font-medium">
                            {rating}/5
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plusy (tekst ciągły)
                    </label>
                    <textarea
                      value={formData.pros}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pros: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Opisz pozytywne aspekty w formie ciągłego tekstu..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minusy (tekst ciągły)
                    </label>
                    <textarea
                      value={formData.cons}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cons: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Opisz negatywne aspekty w formie ciągłego tekstu..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dla kogo NIE jest ten produkt
                    </label>
                    <textarea
                      value={formData.notForWho}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notForWho: e.target.value,
                        }))
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Opisz dla kogo produkt nie jest odpowiedni..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kategoria
              </h3>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Wybierz kategorię</option>
                {blogCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tagi</h3>

              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
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
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Dodaj tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Labels */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Etykiety
              </h3>
              <div className="space-y-2">
                {blogLabels.map((label) => (
                  <label key={label.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.labels?.includes(label.id)}
                      onChange={() => toggleLabel(label.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${label.color}`}
                    >
                      {label.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Product Links */}
            {(formData.type === "review" || formData.type === "scam-alert") && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Linki do produktu
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Temu
                    </label>
                    <input
                      type="url"
                      value={formData.productLinks?.temu || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          productLinks: {
                            ...prev.productLinks!,
                            temu: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="https://temu.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      AliExpress
                    </label>
                    <input
                      type="url"
                      value={formData.productLinks?.aliexpress || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          productLinks: {
                            ...prev.productLinks!,
                            aliexpress: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="https://aliexpress.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Amazon
                    </label>
                    <input
                      type="url"
                      value={formData.productLinks?.amazon || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          productLinks: {
                            ...prev.productLinks!,
                            amazon: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="https://amazon.com/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TikTok Video */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Zdjęcie główne
              </h3>

              {!uploadedFeaturedImage && !formData.featuredImage ? (
                <ImageUploadZone
                  key={post?.id || "new"}
                  onUploadComplete={handleFeaturedImageUpload}
                  onUploadError={handleImageUploadError}
                  maxFiles={1}
                  folder="blog"
                />
              ) : (
                <div className="relative">
                  <img
                    src={uploadedFeaturedImage || formData.featuredImage}
                    alt="Zdjęcie główne"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeFeaturedImage}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    aria-label="Usuń zdjęcie"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Zdjęcie główne będzie wyświetlane jako miniatura wpisu i na
                górze artykułu
              </p>
            </div>
          </div>
          {/* Publish Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Publikacja
            </h3>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublished: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Opublikuj wpis
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Wyróżniony wpis
                </span>
              </label>

              {formData.type === "review" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ocena ogólna
                  </label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            overallRating: i + 1,
                          }))
                        }
                        className="p-1"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            i < (formData.overallRating || 0)
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium">
                      {formData.overallRating}/5
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Zapisywanie...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Zapisz wpis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
