import { ArrowRight, Eye, Search, ShoppingCart } from "lucide-react";
import React from "react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: "Odkrywamy Trendy",
      description:
        "Nasze algorytmy skanują TikTok, Instagram i inne platformy w poszukiwaniu viralnych produktów.",
      color: "bg-blue-600",
    },
    {
      icon: Eye,
      title: "Weryfikujemy Jakość",
      description:
        "Każdy produkt przechodzi przez proces weryfikacji - sprawdzamy opinie, ceny i wiarygodność sprzedawców.",
      color: "bg-green-600",
    },
    {
      icon: ShoppingCart,
      title: "Kupujesz Bezpiecznie",
      description:
        "Przekierowujemy Cię do sprawdzonych sklepów z najlepszymi cenami i warunkami zakupu.",
      color: "bg-purple-600",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Jak to działa?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Prosty proces w trzech krokach - od odkrycia trendu do bezpiecznego
            zakupu
          </p>
        </div>

        <div className="relative">
          {/* Desktop/Tablet - Horizontal layout */}
          <div className="hidden md:flex md:items-start md:justify-center">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <React.Fragment key={index}>
                  <div className="text-center group flex-1 max-w-xs">
                    <div className="relative mb-6">
                      <div
                        className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}
                      >
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed px-2">
                      {step.description}
                    </p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex justify-center items-center px-4 mt-8">
                      <ArrowRight className="h-8 w-8 text-blue-300" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile - Vertical layout */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div
                      className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}
                    >
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm mx-auto px-4">
                    {step.description}
                  </p>

                  {index < steps.length - 1 && (
                    <div className="flex justify-center mt-8">
                      <ArrowRight className="h-8 w-8 text-blue-300 transform rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
