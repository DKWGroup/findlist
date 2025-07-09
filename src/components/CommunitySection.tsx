import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Star, MessageSquare, TrendingUp, ArrowRight, Instagram, Music } from 'lucide-react';

export const CommunitySection: React.FC = () => {
  const communityStats = [
    { icon: Users, label: 'Aktywnych użytkowników', value: '10,000+', color: 'bg-blue-100 text-blue-600' },
    { icon: Heart, label: 'Produktów w wishlistach', value: '50,000+', color: 'bg-red-100 text-red-600' },
    { icon: Star, label: 'Wystawionych ocen', value: '25,000+', color: 'bg-yellow-100 text-yellow-600' },
    { icon: MessageSquare, label: 'Recenzji społeczności', value: '15,000+', color: 'bg-green-100 text-green-600' }
  ];

  const socialFeatures = [
    {
      icon: Heart,
      title: 'Twórz Wishlisty',
      description: 'Zapisuj ulubione produkty i organizuj je w kolekcje. Śledź zmiany cen i dostępność.',
      color: 'text-red-600'
    },
    {
      icon: Star,
      title: 'Oceniaj i Recenzuj',
      description: 'Dziel się swoimi opiniami o produktach. Pomóż innym w podejmowaniu lepszych decyzji zakupowych.',
      color: 'text-yellow-600'
    },
    {
      icon: Users,
      title: 'Dołącz do Społeczności',
      description: 'Poznaj innych miłośników viralowych produktów. Wymieniaj się opiniami i odkryciami.',
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Bądź Pierwszy',
      description: 'Otrzymuj powiadomienia o najnowszych trendach i produktach zanim staną się popularne.',
      color: 'text-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Dołącz do Społeczności VIRALIST
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Społeczność, która wie, co jest na topie! Odkrywaj trendy, dziel się opiniami 
            i bądź pierwszą osobą, która pozna najnowsze viralowe hity.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Social Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {socialFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Gotowy na odkrywanie najlepszych viralowych produktów?
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Dołącz do tysięcy użytkowników, którzy już odkrywają najgorętsze trendy z TikToka i Instagrama. 
                Twórz wishlisty, oceniaj produkty i bądź częścią społeczności, która wie, co jest warte uwagi!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/rejestracja"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Users className="h-5 w-5" />
                  <span>Załóż Darmowe Konto</span>
                </Link>
                <Link
                  to="/produkty"
                  className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Przeglądaj Produkty</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
                <div className="flex justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Instagram className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Śledź nas w social mediach!
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Bądź na bieżąco z najnowszymi trendami i produktami
                </p>
                <div className="flex justify-center gap-3">
                  <a href="#" className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    @viralist_pl
                  </a>
                  <a href="#" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    @viralist.pl
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            📧 Newsletter z najgorętszymi trendami
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Otrzymuj cotygodniowe zestawienie najlepszych viralowych produktów, 
            ekskluzywne promocje i ostrzeżenia przed scamami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Twój adres email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
              Zapisz się
            </button>
          </div>
          <p className="text-xs text-blue-200 mt-3">
            Bez spamu. Możesz się wypisać w każdej chwili.
          </p>
        </div>
      </div>
    </section>
  );
};