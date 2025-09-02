import {
  AlertCircle,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";
import { MetaTags } from "../components/SEO/MetaTags";

export const ContactPage: React.FC = () => {
  const breadcrumbItems = [{ label: "Kontakt", current: true }];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real implementation, you would send the form data to your backend
      console.log("Form submitted:", formData);

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        "Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MetaTags
        title="Kontakt - VIRALIST | Skontaktuj się z nami"
        description="Masz pytania dotyczące VIRALIST? Skontaktuj się z nami poprzez formularz kontaktowy lub bezpośrednio przez e-mail."
        canonical="https://viralist.pl/kontakt"
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
                  Skontaktuj się z nami
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Masz pytania, sugestie lub chcesz zaproponować współpracę?
                  Jesteśmy tutaj, aby Ci pomóc!
                </p>
              </div>
            </div>
          </section>

          {/* Contact Form & Info */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Napisz do nas
                  </h2>

                  {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Wiadomość wysłana!</p>
                        <p>
                          Dziękujemy za kontakt. Odpowiemy najszybciej jak to
                          możliwe.
                        </p>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-800">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Wystąpił błąd</p>
                        <p>{submitError}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Imię i nazwisko
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Twoje imię i nazwisko"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Adres e-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="twoj@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Temat
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Wybierz temat</option>
                        <option value="pytanie">Pytanie ogólne</option>
                        <option value="wspolpraca">
                          Propozycja współpracy
                        </option>
                        <option value="produkt">Propozycja produktu</option>
                        <option value="problem">Zgłoszenie problemu</option>
                        <option value="inne">Inne</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Wiadomość
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Twoja wiadomość..."
                      ></textarea>
                    </div>

                    <div className="flex items-start">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        required
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="privacy"
                        className="ml-2 block text-sm text-gray-600"
                      >
                        Akceptuję{" "}
                        <a
                          href="/polityka-prywatnosci"
                          className="text-blue-600 hover:underline"
                        >
                          politykę prywatności
                        </a>{" "}
                        i wyrażam zgodę na przetwarzanie moich danych osobowych
                        w celu udzielenia odpowiedzi na moje zapytanie.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Wysyłanie...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Wyślij wiadomość</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Contact Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Informacje kontaktowe
                  </h2>

                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          E-mail
                        </h3>
                        <p className="text-gray-600 mb-1">Ogólne zapytania:</p>
                        <a
                          href="mailto:kontakt@viralist.pl"
                          className="text-blue-600 hover:underline"
                        >
                          kontakt@viralist.pl
                        </a>
                        <p className="text-gray-600 mt-2 mb-1">
                          Współpraca biznesowa:
                        </p>
                        <a
                          href="mailto:biznes@viralist.pl"
                          className="text-blue-600 hover:underline"
                        >
                          biznes@viralist.pl
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="mt-10">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Znajdź nas w social mediach
                    </h3>
                    <div className="flex gap-4">
                      <a
                        href="https://tiktok.com/@viralist_pl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"></path>
                        </svg>
                      </a>
                      <a
                        href="https://instagram.com/viralist.pl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                      <a
                        href="https://facebook.com/viralist.pl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Często zadawane pytania
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Odpowiedzi na najczęściej zadawane pytania dotyczące kontaktu
                  z nami.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Jak szybko odpowiadacie na wiadomości?
                  </h3>
                  <p className="text-gray-600">
                    Staramy się odpowiadać na wszystkie wiadomości w ciągu 24-48
                    godzin w dni robocze. W weekendy i święta czas odpowiedzi
                    może być dłuższy.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Czy mogę zaproponować produkt do dodania na platformę?
                  </h3>
                  <p className="text-gray-600">
                    Oczywiście! Zachęcamy do przesyłania propozycji produktów,
                    które Twoim zdaniem powinny znaleźć się na VIRALIST.
                    Wystarczy wypełnić formularz kontaktowy, wybierając temat
                    "Propozycja produktu".
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Jak mogę zgłosić problem techniczny?
                  </h3>
                  <p className="text-gray-600">
                    Problemy techniczne możesz zgłosić poprzez formularz
                    kontaktowy, wybierając temat "Zgłoszenie problemu". Prosimy
                    o dokładny opis problemu, w tym informacje o używanej
                    przeglądarce i urządzeniu.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Czy oferujecie współpracę dla influencerów?
                  </h3>
                  <p className="text-gray-600">
                    Tak, współpracujemy z influencerami, którzy pasują do
                    profilu naszej platformy. Jeśli jesteś zainteresowany
                    współpracą, napisz do nas na adres biznes@viralist.pl lub
                    wypełnij formularz kontaktowy, wybierając temat "Propozycja
                    współpracy".
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
};
