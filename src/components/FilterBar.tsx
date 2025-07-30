import {
  ChevronDown,
  Clock,
  Filter,
  SortAsc,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import React from "react";

interface FilterBarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  showTrendingOnly: boolean;
  onTrendingToggle: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  sortBy,
  onSortChange,
  showTrendingOnly,
  onTrendingToggle,
}) => {
  const sortOptions = [
    { value: "popularity", label: "Popularność", icon: TrendingUp },
    { value: "newest", label: "Najnowsze", icon: Clock },
    { value: "rating", label: "Ocena", icon: Sparkles },
    { value: "price-low", label: "Cena: rosnąco", icon: SortAsc },
    { value: "price-high", label: "Cena: malejąco", icon: SortAsc },
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Desktop version - separate sort and filter controls */}
          <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
            {/* Left side - Sort options */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Sortuj:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        sortBy === option.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <IconComponent className="h-3 w-3" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side - Filter toggles */}
            <div className="flex items-center gap-4">
              <button
                onClick={onTrendingToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  showTrendingOnly
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="text-base">🔥</span>
                <span>Tylko trendy</span>
                {showTrendingOnly && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    Aktywne
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile version - combined dropdown */}
          <div className="sm:hidden flex items-center gap-4 w-full">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filtruj:</span>
            </div>

            <div className="flex gap-2 flex-1">
              {/* Sort dropdown */}
              <div className="relative flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="appearance-none bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer w-full"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Trending filter dropdown */}
              <div className="relative">
                <select
                  value={showTrendingOnly ? "trending" : "all"}
                  onChange={(e) => {
                    const newValue = e.target.value === "trending";
                    if (newValue !== showTrendingOnly) {
                      onTrendingToggle();
                    }
                  }}
                  className={`appearance-none border rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${
                    showTrendingOnly
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  <option value="all">Wszystkie</option>
                  <option value="trending">🔥 Trendy</option>
                </select>
                <ChevronDown
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
                    showTrendingOnly ? "text-white/70" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
