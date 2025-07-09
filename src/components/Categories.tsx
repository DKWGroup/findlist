import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { categories } from '../data/mockData';

export const Categories: React.FC = () => {
  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
  };

  const featuredCategories = categories.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Popularne Kategorie
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Odkryj viralne produkty w swoich ulubionych kategoriach
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              to={`/produkty?kategoria=${category.id}`}
              className="group p-6 bg-gray-50 hover:bg-blue-50 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg text-center"
            >
              <div className="text-blue-600 group-hover:text-blue-700 mb-4 flex justify-center">
                {getIcon(category.icon)}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-blue-700">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 group-hover:text-blue-600">
                {category.productCount} produktów
              </p>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Link
            to="/produkty"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Zobacz Wszystkie Kategorie</span>
            <Icons.ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};