import React from "react";

interface CategoryNavProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const categories = [
  { id: null, name: "Wszystkie", icon: "🏷️" },
  { id: "development", name: "Development", icon: "💻" },
  { id: "design", name: "Design", icon: "🎨" },
  { id: "marketing", name: "Marketing", icon: "📊" },
  { id: "productivity", name: "Produktywność", icon: "⚡" },
  { id: "health", name: "Zdrowie", icon: "🏃" },
  { id: "education", name: "Edukacja", icon: "📚" },
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto py-4">
          {categories.map((category) => (
            <button
              key={category.id || "all"}
              onClick={() => onCategorySelect(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors
                ${
                  selectedCategory === category.id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              <span className="text-lg">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
