import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-blue-800 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
          <TrendingUp className="h-4 w-4" />
          <span>Dołącz do społeczności trendsetterów</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Gotowy na odkrywanie <br />
          <span className="text-blue-200">najgorętszych trendów?</span>
        </h2>
        
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Nie czekaj, aż produkty staną się mainstream. Odkryj je już dziś i bądź o krok przed innymi!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/produkty"
            className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
          >
            <span>Zacznij Przeglądać</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/rejestracja"
            className="bg-transparent hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-200 flex items-center gap-2"
          >
            <span>Załóż Konto</span>
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto text-white/80">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">500+</div>
            <div className="text-sm">Produktów</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm">Aktualizacje</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">100%</div>
            <div className="text-sm">Za Darmo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">10+</div>
            <div className="text-sm">Kategorii</div>
          </div>
        </div>
      </div>
    </section>
  );
};