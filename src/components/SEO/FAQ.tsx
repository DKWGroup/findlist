import React from "react";
import { Helmet } from "react-helmet-async";
import { generateFAQSchema } from "./SchemaMarkup";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  className?: string;
}

const FAQ: React.FC<FAQProps> = ({ faqs, className = "" }) => {
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className={`space-y-6 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Często zadawane pytania
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <h3 className="text-lg">{faq.question}</h3>
                <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>

              <div className="mt-4 text-gray-600 prose prose-sm max-w-none">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
