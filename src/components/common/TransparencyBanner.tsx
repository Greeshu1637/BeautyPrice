import React from 'react';
import { AlertCircle, X, ExternalLink } from 'lucide-react';
import { useBeauty } from '../../context/BeautyContext';

export const TransparencyBanner: React.FC = () => {
  const { noticeDismissed, dismissNotice, setActiveTab } = useBeauty();

  if (noticeDismissed) return null;

  return (
    <aside 
      aria-label="Demonstration Notice" 
      className="bg-blush-100 border-b border-blush-200 text-espresso-800 px-4 py-2.5 text-xs sm:text-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-plum-700 shrink-0" />
          <p className="leading-snug">
            <strong className="font-semibold text-plum-900">Demonstration Notice:</strong> All retailer prices, offers, and inventory on BeautyPrice are illustrative sample data for demonstration. Prices are not live or verified.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('transparency')}
            className="text-plum-800 underline hover:text-plum-950 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Learn more</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={dismissNotice}
            className="p-1 text-espresso-600 hover:text-espresso-950 rounded-md hover:bg-blush-200 transition-colors"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
