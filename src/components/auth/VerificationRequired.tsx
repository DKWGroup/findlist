import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Info } from 'lucide-react';

export const VerificationRequired: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sprawdź swoją skrzynkę email</h2>
          <p className="text-gray-600">
            Wysłaliśmy link weryfikacyjny na Twój adres email
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Co dalej?</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Sprawdź swoją skrzynkę odbiorczą</li>
                <li>Kliknij w link weryfikacyjny w wiadomości</li>
                <li>Po weryfikacji będziesz mógł się zalogować</li>
              </ol>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Nie widzisz wiadomości?</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Sprawdź folder spam/junk</li>
                <li>Upewnij się, że podałeś prawidłowy adres email</li>
                <li>Wiadomość może dotrzeć z opóźnieniem (do 5 minut)</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Link
              to="/logowanie"
              className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Wróć do strony logowania</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};