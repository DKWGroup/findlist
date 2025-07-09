import React from 'react';
import { Search, Eye, ShoppingCart, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: 'Odkrywamy Trendy',
      description: 'Nasze algorytmy skanują TikTok, Instagram i inne platformy w poszukiwaniu viralnych produktów.',
      color: 'bg-blue-600'
    },
    {
      icon: Eye,
      title: 'Weryfikujemy Jakość',
      description: 'Każdy produkt przechodzi przez proces weryfikacji - sprawdzamy opinie, ceny i wiarygodność sprzedawców.',
      color: 'bg-green-600'
    },
    {
      icon: ShoppingCart,
      title: 'Kupujesz Bezpiecznie',
      description: 'Przekierowujemy Cię do sprawdzonych sklepów z najlepszymi cenami i warunkami zakupu.',
      color: 'bg-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Jak to działa?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Prosty proces w trzech krokach - od odkrycia trendu do bezpiecznego zakupu
          </p>
        </div>
        
        <div className="relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="flex justify-between items-center px-32">
              <ArrowRight className="h-8 w-8 text-blue-300" />
              <ArrowRight className="h-8 w-8 text-blue-300" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};