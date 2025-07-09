import React from 'react';
import { Filter, SortAsc, Sparkles, Clock, TrendingUp } from 'lucide-react';

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
  onTrendingToggle
}) => {
  const sortOptions = [
    { value: 'popularity', label: 'Popularność', icon: TrendingUp },
    { value: 'newest', label: 'Najnowsze', icon: Clock },
    { value: 'rating', label: 'Ocena', icon: Sparkles },
    { value: 'price-low', label: 'Cena: rosnąco', icon: SortAsc },
    { value: 'price-high', label: 'Cena: malejąco', icon: SortAsc }
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
      </div>
    </div>
  );
};