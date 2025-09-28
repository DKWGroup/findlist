import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";
import { MetaTags } from "../components/SEO/MetaTags";

export const ContactPage: React.FC = () => {
  const breadcrumbItems = [{ label: "Kontakt", current: true }];

  return (
    <>
      <MetaTags
        title="Kontakt - FINDLIST | Znajdź nas w social mediach"
        description="Obserwuj nas na TikToku, Instagramie i Facebooku. Bądź na bieżąco z najnowszymi trendami i dodatkowymi treściami."
        canonical="https://findlist.net/kontakt"
      />

      <Layout>
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>

        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Jesteśmy w social mediach
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Znajdziesz nas na swoich ulubionych platformach. Obserwuj nas,
                  aby być na bieżąco z najnowszymi trendami i dodatkowymi
                  treściami!
                </p>
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-lg mx-auto text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Obserwuj nas i bądź w kontakcie
                </h2>
                <p className="text-gray-600 mb-8">
                  Cała nasza aktywność, dodatkowe treści i bezpośredni kontakt z
                  nami odbywa się przez media społecznościowe. Dołącz do naszej
                  społeczności!
                </p>

                {/* Social Media */}
                <div className="flex justify-center gap-6">
                  <a
                    href="https://www.tiktok.com/@findlist.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white p-4 rounded-full hover:bg-gray-800 transition-colors"
                    title="TikTok"
                  >
                    <svg
                      className="h-7 w-7"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"></path>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/findlistnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full hover:opacity-90 transition-opacity"
                    title="Instagram"
                  >
                    <svg
                      className="h-7 w-7"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
};
