import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { useNavigate } from 'react-router-dom';

interface SessionTimeoutWarningProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
}

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  timeoutMinutes = 30,
  warningMinutes = 5
}) => {
  const navigate = useNavigate();
  const { showWarning, timeRemaining, extendSession } = useSessionTimeout({
    timeoutMinutes,
    warningMinutes,
    onTimeout: () => {
      navigate('/logowanie', { replace: true });
    }
  });
  
  if (!showWarning) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 max-w-md animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-100 rounded-full">
          <Clock className="h-5 w-5 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-yellow-900 mb-1">Twoja sesja wygaśnie wkrótce</h3>
          <p className="text-sm text-yellow-800 mb-3">
            Z powodu braku aktywności zostaniesz wylogowany za{' '}
            <span className="font-medium">{timeRemaining} {timeRemaining === 1 ? 'minutę' : timeRemaining && timeRemaining < 5 ? 'minuty' : 'minut'}</span>.
          </p>
          <button
            onClick={extendSession}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Przedłuż sesję</span>
          </button>
        </div>
      </div>
    </div>
  );
};