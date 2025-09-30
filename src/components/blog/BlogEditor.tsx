import { Eye, Plus, Save, Star, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { blogLabels } from "../../data/blogData";
import { productService } from "../../services/productService";
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

const SECTION_DELIMITER = "\n\n---\n\n";

const delimiterPattern = "\\r?\\n\\r?\\n---\\r?\\n\\r?\\n";

// Funkcja do parsowania istniejącej treści na obiekt sekcji
const parseContentToSections = (
  content: string | undefined
): Record<string, string> => {
  const sections: Record<string, string> = {};
  if (!content) return sections;

  predefinedSections.forEach((sectionInfo) => {
    const regex = new RegExp(
      `## ${sectionInfo.label}\\r?\\n\\r?\\n([\\s\\S]*?)(?=\\r?\\n\\r?\\n##|${delimiterPattern}|$)`,
      "i"
    );
    const match = content.match(regex);
    if (match && match[1]) {
      const lines = match[1].replace(/\s+$/, "").split(/\r?\n/);
      while (lines.length > 0 && lines[lines.length - 1].trim() === "---") {
        lines.pop();
      }
      sections[sectionInfo.id] = lines.join("\n").trim();
    } else {
      sections[sectionInfo.id] = "";
    }
  });
  return sections;
};

const defaultSectionRatings = {
  purpose: 5,
  quality: 5,
  functionality: 5,
  price: 5,
  conclusions: 5,
};

const defaultRatings = {
  quality: 0,
  priceQuality: 0,
  functionality: 0,
};

const defaultProductLinks = {
  temu: "",
  aliexpress: "",
  amazon: "",
};

const defaultProductLinkKeys = ["temu", "aliexpress", "amazon"] as const;

const defaultSeo = {
  metaTitle: "",
  metaDescription: "",
  keywords: [] as string[],
};

const generateTempId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const toDateTimeLocalValue = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (num: number) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const fromDateTimeLocalValue = (value: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

const createInitialFormData = (post?: BlogPost): Partial<BlogPost> => ({
  type: post?.type ?? "review",
  title: post?.title ?? "",
  slug: post?.slug ?? "",
  excerpt: post?.excerpt ?? "",
  content: post?.content ?? "",
  featuredImage: post?.featuredImage ?? "",
  category: post?.category ?? "",
  tags: post?.tags ?? [],
  labels: post?.labels ?? [],
  isPublished: post?.isPublished ?? false,
  isFeatured: post?.isFeatured ?? false,
  sectionRatings: {
    ...defaultSectionRatings,
    ...(post?.sectionRatings ?? {}),
  },
  overallRating: post?.overallRating ?? 5,
  pros: post?.pros ?? [],
  cons: post?.cons ?? [],
  notForWho: post?.notForWho ?? "",
  productLinks: {
    ...defaultProductLinks,
    ...(post?.productLinks ?? {}),
  },
  tiktokVideo: post?.tiktokVideo ?? "",
  productId: post?.productId ?? "",
  ratings: {
    ...defaultRatings,
    ...(post?.ratings ?? {}),
  },
  seo: {
    ...defaultSeo,
    ...(post?.seo ?? {}),
    keywords: [...(post?.seo?.keywords ?? [])],
  },
  products: post?.products ?? [],
  scamReason: post?.scamReason ?? "",
  originalProductLink: post?.originalProductLink ?? "",
  publishedAt: post?.publishedAt,
  updatedAt: post?.updatedAt,
  author: post?.author,
  id: post?.id,
});

type CollectionProduct = NonNullable<BlogPost["products"]>[number];

const createEmptyCollectionProduct = (): CollectionProduct => ({
  id: generateTempId(),
  title: "",
  image: "",
  description: "",
  reviewLink: "",
  shopLink: "",
  tiktokLink: "",
});

interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: Partial<BlogPost>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  // Usunięto: categories: ProductCategory[];
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  post,
  onSave,
  onCancel,
  isLoading = false,
  // Usunięto: categories,
}) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>(() =>
    createInitialFormData(post)
  );

  // Nowy stan dla nazw kategorii
  const [categoryNames, setCategoryNames] = useState<string[]>([]);

  // Stan dla treści poszczególnych sekcji
  const [sectionContent, setSectionContent] = useState<Record<string, string>>(
    parseContentToSections(post?.content)
  );

  const [newTag, setNewTag] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadedFeaturedImage, setUploadedFeaturedImage] =
    useState<string>("");
  const [keywordsInput, setKeywordsInput] = useState(() =>
    (post?.seo?.keywords ?? []).join(", ")
  );
  const [newProductLink, setNewProductLink] = useState({
    platform: "",
    url: "",
  });
  const [newRatingKey, setNewRatingKey] = useState("");
  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");

  // Pobieranie nazw kategorii przy pierwszym renderowaniu
  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        const names = await productService.getCategoryNames();
        const uniqueNames = Array.from(
          new Map(
            names.map((name) => [name.trim().toLowerCase(), name.trim()])
          ).values()
        );
        setCategoryNames(uniqueNames);
      } catch (error) {
        console.error("Nie udało się załadować nazw kategorii:", error);
      }
    };
    fetchCategoryNames();
  }, []);

  useEffect(() => {
    setFormData(createInitialFormData(post));
    setSectionContent(parseContentToSections(post?.content));
    setKeywordsInput((post?.seo?.keywords ?? []).join(", "));
    setUploadedFeaturedImage("");
    setNewPro("");
    setNewCon("");
  }, [post]);

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

    const generatedSlug =
      formData.title
        ?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim() || "";

    const manualSlug = formData.slug?.trim();
    const slug =
      manualSlug && manualSlug.length > 0 ? manualSlug : generatedSlug;

    const finalContent = combineSectionsToContent();

    const sanitizedProductLinksEntries = Object.entries(
      formData.productLinks ?? {}
    )
      .map(([platform, url]) => [platform, url?.trim() || ""] as const)
      .filter(([, url]) => url.length > 0);

    const sanitizedProductLinks = sanitizedProductLinksEntries.length
      ? sanitizedProductLinksEntries.reduce<Record<string, string>>(
          (acc, [platform, url]) => {
            acc[platform] = url;
            return acc;
          },
          {}
        )
      : undefined;

    const sanitizedRatings = Object.entries(formData.ratings ?? {}).reduce<
      Record<string, number>
    >((acc, [key, value]) => {
      const numericValue =
        typeof value === "number" ? value : parseFloat(String(value));
      if (!Number.isNaN(numericValue)) {
        acc[key] = numericValue;
      }
      return acc;
    }, {});

    const sanitizedProducts =
      formData.products && formData.products.length > 0
        ? formData.products
            .map((product) => ({
              ...product,
              id:
                product?.id && product.id.length > 0
                  ? product.id
                  : generateTempId(),
            }))
            .filter((product) =>
              Boolean(
                product.title ||
                  product.description ||
                  product.image ||
                  product.shopLink ||
                  product.reviewLink ||
                  product.tiktokLink
              )
            )
        : undefined;

    const sanitizedKeywords = (formData.seo?.keywords ?? []).filter(Boolean);

    const sanitizedPros = (formData.pros ?? [])
      .map((item) => item.trim())
      .filter(Boolean);

    const sanitizedCons = (formData.cons ?? [])
      .map((item) => item.trim())
      .filter(Boolean);

    const postData = {
      ...formData,
      slug,
      updatedAt: new Date().toISOString(),
      publishedAt:
        formData.isPublished && !post
          ? new Date().toISOString()
          : formData.publishedAt,
      content: finalContent.trim().length > 0 ? finalContent : formData.content,
      productLinks: sanitizedProductLinks,
      ratings:
        Object.keys(sanitizedRatings).length > 0 ? sanitizedRatings : undefined,
      products: sanitizedProducts,
      pros: sanitizedPros,
      cons: sanitizedCons,
      seo: {
        metaTitle: formData.seo?.metaTitle?.trim() || undefined,
        metaDescription: formData.seo?.metaDescription?.trim() || undefined,
        keywords: sanitizedKeywords,
      },
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
      products:
        newType === "collection" &&
        (!prev.products || prev.products.length === 0)
          ? [createEmptyCollectionProduct()]
          : prev.products,
    }));
  };

  const handleSectionChange = (id: string, value: string) => {
    setSectionContent((prev) => ({ ...prev, [id]: value }));
  };

  // Funkcja do łączenia sekcji w jeden string przed zapisem
  const combineSectionsToContent = (): string => {
    const combined = predefinedSections
      .map((sectionInfo) => {
        const content = sectionContent[sectionInfo.id] || "";
        if (!content.trim()) return ""; // Pomiń puste sekcje
        return `## ${sectionInfo.label}\n\n${content}`;
      })
      .filter(Boolean) // Usuń puste wpisy
      .join(SECTION_DELIMITER)
      .trim();

    return combined;
  };

  const handleProsItemChange = (index: number, value: string) => {
    setFormData((prev) => {
      const pros = [...(prev.pros ?? [])];
      pros[index] = value;
      return {
        ...prev,
        pros,
      };
    });
  };

  const handleConsItemChange = (index: number, value: string) => {
    setFormData((prev) => {
      const cons = [...(prev.cons ?? [])];
      cons[index] = value;
      return {
        ...prev,
        cons,
      };
    });
  };

  const handleAddProsItem = () => {
    const trimmed = newPro.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      pros: [...(prev.pros ?? []), trimmed],
    }));
    setNewPro("");
  };

  const handleAddConsItem = () => {
    const trimmed = newCon.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      cons: [...(prev.cons ?? []), trimmed],
    }));
    setNewCon("");
  };

  const handleRemoveProsItem = (index: number) => {
    setFormData((prev) => {
      const pros = [...(prev.pros ?? [])];
      pros.splice(index, 1);
      return {
        ...prev,
        pros,
      };
    });
  };

  const handleRemoveConsItem = (index: number) => {
    setFormData((prev) => {
      const cons = [...(prev.cons ?? [])];
      cons.splice(index, 1);
      return {
        ...prev,
        cons,
      };
    });
  };

  // --- DODAJ TĘ FUNKCJĘ ---
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // -------------------------

  const handleSeoChange = (
    field: "metaTitle" | "metaDescription",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...defaultSeo,
        ...(prev.seo ?? {}),
        [field]: value,
      },
    }));
  };

  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value);
    const keywords = value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...defaultSeo,
        ...(prev.seo ?? {}),
        keywords,
      },
    }));
  };

  const handleProductLinkChange = (platform: string, url: string) => {
    setFormData((prev) => {
      const current: Record<string, string> = {
        ...(prev.productLinks ?? {}),
      } as Record<string, string>;
      current[platform] = url;
      return {
        ...prev,
        productLinks: current,
      };
    });
  };

  const handleAddProductLink = () => {
    const platform = newProductLink.platform.trim().toLowerCase();
    const url = newProductLink.url.trim();
    if (!platform || !url) {
      return;
    }

    setFormData((prev) => {
      const current: Record<string, string> = {
        ...(prev.productLinks ?? {}),
      } as Record<string, string>;
      current[platform] = url;
      return {
        ...prev,
        productLinks: current,
      };
    });
    setNewProductLink({ platform: "", url: "" });
  };

  const handleRemoveProductLink = (platform: string) => {
    if (defaultProductLinkKeys.includes(platform as any)) {
      return;
    }

    setFormData((prev) => {
      const current: Record<string, string> = {
        ...(prev.productLinks ?? {}),
      } as Record<string, string>;
      delete current[platform];
      return {
        ...prev,
        productLinks: current,
      };
    });
  };

  const handleRatingValueChange = (ratingKey: string, value: number) => {
    const normalized = Number.isNaN(value)
      ? 0
      : Math.max(0, Math.min(5, value));
    setFormData((prev) => ({
      ...prev,
      ratings: {
        ...(prev.ratings ?? {}),
        [ratingKey]: normalized,
      },
    }));
  };

  const handleAddRating = () => {
    const key = newRatingKey.trim();
    if (!key) {
      return;
    }

    setFormData((prev) => {
      if (
        prev.ratings &&
        Object.prototype.hasOwnProperty.call(prev.ratings, key)
      ) {
        return prev;
      }
      return {
        ...prev,
        ratings: {
          ...(prev.ratings ?? {}),
          [key]: 0,
        },
      };
    });
    setNewRatingKey("");
  };

  const handleRemoveRating = (ratingKey: string) => {
    if (Object.prototype.hasOwnProperty.call(defaultRatings, ratingKey)) {
      return;
    }

    setFormData((prev) => {
      const current = { ...(prev.ratings ?? {}) };
      delete current[ratingKey];
      return {
        ...prev,
        ratings: current,
      };
    });
  };

  const handleCollectionProductChange = (
    index: number,
    field: keyof CollectionProduct,
    value: string
  ) => {
    setFormData((prev) => {
      const products = [...(prev.products ?? [])] as CollectionProduct[];
      const existing = products[index] ?? createEmptyCollectionProduct();
      products[index] = {
        ...existing,
        [field]: value,
      };
      return {
        ...prev,
        products,
      };
    });
  };

  const handleAddCollectionProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...(prev.products ?? []), createEmptyCollectionProduct()],
    }));
  };

  const handleRemoveCollectionProduct = (index: number) => {
    setFormData((prev) => {
      const products = [...(prev.products ?? [])];
      products.splice(index, 1);
      return {
        ...prev,
        products,
      };
    });
  };

  const mergedProductLinks = {
    ...defaultProductLinks,
    ...(formData.productLinks ?? {}),
  } as Record<string, string>;

  const productLinkEntries = Object.entries(mergedProductLinks);

  const mergedRatings = {
    ...defaultRatings,
    ...(formData.ratings ?? {}),
  } as Record<string, number>;

  const ratingEntries = Object.entries(mergedRatings);

  const collectionProducts = (formData.products ?? []) as CollectionProduct[];
  const isCollection = formData.type === "collection";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
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
                    Slug (opcjonalnie)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug ?? ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="np. viralny-produkt-2025"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Jeśli pozostawisz puste pole, slug zostanie wygenerowany
                    automatycznie na podstawie tytułu.
                  </p>
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

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Parametry wpisu
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data publikacji
                  </label>
                  <input
                    type="datetime-local"
                    value={toDateTimeLocalValue(formData.publishedAt)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        publishedAt: fromDateTimeLocalValue(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Pozostaw puste, aby ustawić datę podczas publikacji.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TikTok video (URL)
                  </label>
                  <input
                    type="url"
                    name="tiktokVideo"
                    value={formData.tiktokVideo || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.tiktok.com/..."
                  />
                </div>

                {formData.type === "scam-alert" && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Przyczyna scam alertu
                      </label>
                      <textarea
                        name="scamReason"
                        value={formData.scamReason || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dlaczego produkt został oznaczony jako scam?"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Oryginalny link do produktu
                      </label>
                      <input
                        type="url"
                        name="originalProductLink"
                        value={formData.originalProductLink || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}
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

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID powiązanego produktu
                  </label>
                  <input
                    type="text"
                    name="productId"
                    value={formData.productId || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="np. produkt-123"
                  />
                </div>

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

            {/* Additional ratings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dodatkowe oceny
              </h3>
              <div className="space-y-4">
                {ratingEntries.map(([ratingKey, ratingValue]) => (
                  <div
                    key={ratingKey}
                    className="flex flex-col gap-2 md:flex-row md:items-center"
                  >
                    <div className="md:w-48">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {ratingKey}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={0.1}
                        min={0}
                        max={5}
                        value={ratingValue}
                        onChange={(e) =>
                          handleRatingValueChange(
                            ratingKey,
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <span className="text-sm text-gray-500">/ 5</span>
                    </div>
                    {!Object.prototype.hasOwnProperty.call(
                      defaultRatings,
                      ratingKey
                    ) && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRating(ratingKey)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Usuń
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center">
                <input
                  type="text"
                  value={newRatingKey}
                  onChange={(e) => setNewRatingKey(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Nazwa dodatkowej oceny"
                />
                <button
                  type="button"
                  onClick={handleAddRating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  Dodaj ocenę
                </button>
              </div>
            </div>

            {(formData.type === "review" || formData.type === "scam-alert") && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Plusy i minusy
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plusy
                    </label>
                    <div className="space-y-3">
                      {(formData.pros ?? []).length === 0 && (
                        <p className="text-sm text-gray-500">
                          Dodaj pierwszy plus, aby go wyświetlić na liście.
                        </p>
                      )}
                      {(formData.pros ?? []).map((pro, index) => (
                        <div key={`pro-${index}`} className="flex gap-2">
                          <input
                            type="text"
                            value={pro}
                            onChange={(e) =>
                              handleProsItemChange(index, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder={`Plus #${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveProsItem(index)}
                            className="px-3 py-2 text-sm text-red-600 hover:text-red-700"
                          >
                            Usuń
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPro}
                          onChange={(e) => setNewPro(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddProsItem();
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Dodaj nowy plus"
                        />
                        <button
                          type="button"
                          onClick={handleAddProsItem}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                        >
                          Dodaj
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minusy
                    </label>
                    <div className="space-y-3">
                      {(formData.cons ?? []).length === 0 && (
                        <p className="text-sm text-gray-500">
                          Dodaj pierwszy minus, aby go wyświetlić na liście.
                        </p>
                      )}
                      {(formData.cons ?? []).map((con, index) => (
                        <div key={`con-${index}`} className="flex gap-2">
                          <input
                            type="text"
                            value={con}
                            onChange={(e) =>
                              handleConsItemChange(index, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder={`Minus #${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveConsItem(index)}
                            className="px-3 py-2 text-sm text-red-600 hover:text-red-700"
                          >
                            Usuń
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCon}
                          onChange={(e) => setNewCon(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddConsItem();
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Dodaj nowy minus"
                        />
                        <button
                          type="button"
                          onClick={handleAddConsItem}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                        >
                          Dodaj
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isCollection && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Produkty w kolekcji
                </h3>

                <div className="space-y-6">
                  {collectionProducts.length === 0 && (
                    <p className="text-sm text-gray-600">
                      Dodaj pierwszy produkt do kolekcji, aby rozpocząć.
                    </p>
                  )}

                  {collectionProducts.map((product, index) => (
                    <div
                      key={product.id || index}
                      className="border border-gray-200 rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-800">
                          Produkt #{index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveCollectionProduct(index)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Usuń
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            ID (opcjonalnie)
                          </label>
                          <input
                            type="text"
                            value={product.id || ""}
                            onChange={(e) =>
                              handleCollectionProductChange(
                                index,
                                "id",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Tytuł
                          </label>
                          <input
                            type="text"
                            value={product.title}
                            onChange={(e) =>
                              handleCollectionProductChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Nazwa produktu"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Zdjęcie (URL)
                          </label>
                          <input
                            type="url"
                            value={product.image || ""}
                            onChange={(e) =>
                              handleCollectionProductChange(
                                index,
                                "image",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Link do sklepu
                          </label>
                          <input
                            type="url"
                            value={product.shopLink || ""}
                            onChange={(e) =>
                              handleCollectionProductChange(
                                index,
                                "shopLink",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="https://..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Link do recenzji (opcjonalnie)
                          </label>
                          <input
                            type="url"
                            value={product.reviewLink || ""}
                            onChange={(e) =>
                              handleCollectionProductChange(
                                index,
                                "reviewLink",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            TikTok (opcjonalnie)
                          </label>
                          <input
                            type="url"
                            value={product.tiktokLink || ""}
                            onChange={(e) =>
                              handleCollectionProductChange(
                                index,
                                "tiktokLink",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="https://www.tiktok.com/..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Opis
                        </label>
                        <textarea
                          value={product.description || ""}
                          onChange={(e) =>
                            handleCollectionProductChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Krótki opis produktu"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddCollectionProduct}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  <Plus className="h-4 w-4" /> Dodaj produkt
                </button>
              </div>
            )}

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kategoria
              </h3>
              <select
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Wybierz kategorię...
                </option>
                {/* Dynamicznie renderowane nazwy kategorii */}
                {categoryNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
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

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ustawienia SEO
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta title
                  </label>
                  <input
                    type="text"
                    value={formData.seo?.metaTitle || ""}
                    onChange={(e) =>
                      handleSeoChange("metaTitle", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tytuł wyświetlany w wynikach wyszukiwania"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta description
                  </label>
                  <textarea
                    value={formData.seo?.metaDescription || ""}
                    onChange={(e) =>
                      handleSeoChange("metaDescription", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Krótki opis wpisu dla wyszukiwarek"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Słowa kluczowe (oddzielone przecinkami)
                  </label>
                  <input
                    type="text"
                    value={keywordsInput}
                    onChange={(e) => handleKeywordsChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="np. viral, recenzja, trend"
                  />
                </div>
              </div>
            </div>

            {/* Product Links */}
            {(formData.type === "review" || formData.type === "scam-alert") && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Linki do produktu
                </h3>

                <div className="space-y-3">
                  {productLinkEntries.map(([platform, url]) => (
                    <div
                      key={platform}
                      className="flex flex-col gap-2 md:flex-row md:items-center"
                    >
                      <div className="md:w-40">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {platform === "aliexpress" ? "AliExpress" : platform}
                        </span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="url"
                          value={url || ""}
                          onChange={(e) =>
                            handleProductLinkChange(platform, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      {!defaultProductLinkKeys.includes(platform as any) && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProductLink(platform)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Usuń
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-2 md:flex-row">
                  <input
                    type="text"
                    value={newProductLink.platform}
                    onChange={(e) =>
                      setNewProductLink((prev) => ({
                        ...prev,
                        platform: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Platforma (np. sklep)"
                  />
                  <input
                    type="url"
                    value={newProductLink.url}
                    onChange={(e) =>
                      setNewProductLink((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={handleAddProductLink}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    Dodaj link
                  </button>
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
