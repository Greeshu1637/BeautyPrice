import React from 'react';
import { 
  AlertTriangle, 
  Calculator, 
  HeartHandshake, 
  Database 
} from 'lucide-react';
import { useBeauty } from '../../context/BeautyContext';

export const TransparencyPage: React.FC = () => {
  const { setActiveTab } = useBeauty();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-plum-800 bg-blush-100 px-3 py-1 rounded-full border border-blush-300">
          Consumer Trust & Methodology
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-950 mt-3 leading-tight">
          Transparency & Sample Data Disclosures
        </h1>
        <p className="text-base text-espresso-600 mt-3 leading-relaxed">
          BeautyPrice is designed to bring analytical clarity and true unit-cost awareness to beauty shopping in India. Here is exactly how this prototype works.
        </p>
      </div>

      {/* 4 Pillars of Disclosure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Sample Data Limitation */}
        <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blush-100 flex items-center justify-center text-plum-800">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-espresso-950">
            1. Illustrative Demonstration Data
          </h3>
          <p className="text-sm text-espresso-700 leading-relaxed">
            All prices, promotional tags, flash discounts, stock levels, and historical data points shown on this website are <strong>demonstration sample records</strong> created to test and validate frontend user flows. BeautyPrice does not currently scrape or connect to live merchant APIs.
          </p>
          <div className="bg-ivory-100 p-3 rounded-lg border border-ivory-200 text-xs text-espresso-600">
            <strong>Key Note:</strong> Never make real purchasing commitments assuming prices shown here match today’s checkout cart on external retailers.
          </div>
        </div>

        {/* Card 2: Medical Disclaimer */}
        <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blush-100 flex items-center justify-center text-plum-800">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-espresso-950">
            2. Strictly Non-Medical Cosmetic Information
          </h3>
          <p className="text-sm text-espresso-700 leading-relaxed">
            Our recommendation scoring matches user preference inputs with published cosmetic ingredients (e.g. Ceramides for barrier repair, Salicylic Acid for oily pores). We <strong>never diagnose skin conditions</strong>, treat dermatological illnesses, or prescribe pharmaceuticals.
          </p>
          <div className="bg-ivory-100 p-3 rounded-lg border border-ivory-200 text-xs text-espresso-600">
            Always consult a board-certified dermatologist for cystic acne, severe dermatitis, rosacea, or persistent skin flare-ups.
          </div>
        </div>

        {/* Card 3: Unit-Cost Calculation Methodology */}
        <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blush-100 flex items-center justify-center text-plum-800">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-espresso-950">
            3. The ₹/ml & ₹/g True Value Metric
          </h3>
          <p className="text-sm text-espresso-700 leading-relaxed">
            Beauty packaging often disguises true volume. A ₹499 serum with 15ml costs ₹33.27/ml, whereas a ₹699 serum with 50ml costs only ₹13.98/ml. BeautyPrice calculates exact price per unit across all recorded sizes:
          </p>
          <div className="bg-ivory-100 p-3 rounded-lg border border-ivory-200 font-mono text-xs text-plum-900">
            Unit Price = Recorded Offer Price (₹) ÷ Net Quantity (ml or g)
          </div>
        </div>

        {/* Card 4: Independence & Zero Paid Bias */}
        <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blush-100 flex items-center justify-center text-plum-800">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-espresso-950">
            4. Unbiased & Independent Intelligence
          </h3>
          <p className="text-sm text-espresso-700 leading-relaxed">
            This prototype does not accept sponsored brand placements, pay-to-win recommendation ranks, or affiliate bias. When a product is tagged as the lowest recorded sample offer, it is mathematically verified against the recorded dataset.
          </p>
          <div className="bg-ivory-100 p-3 rounded-lg border border-ivory-200 text-xs text-espresso-600">
            Designed from the perspective of an Indian beauty consumer who values quality, science, and smart budgeting.
          </div>
        </div>

      </div>

      {/* Scoring Engine Breakdown Section */}
      <div className="bg-ivory-200/70 rounded-2xl border border-ivory-300 p-8 space-y-6">
        <h3 className="font-serif text-2xl font-bold text-espresso-950">
          How Recommendation Scoring Works
        </h3>
        <p className="text-sm text-espresso-700 leading-relaxed">
          When you set your Beauty Profile, our client-side rule engine evaluates candidate products across 5 transparent criteria:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-ivory-300">
            <span className="text-xs font-bold text-plum-800 uppercase tracking-wider block mb-1">
              Skin Compatibility (30%)
            </span>
            <p className="text-xs text-espresso-600">
              Matches oily, dry, normal, combination, or sensitive skin suitability indicated by the brand formulation.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-ivory-300">
            <span className="text-xs font-bold text-plum-800 uppercase tracking-wider block mb-1">
              Target Concerns (35%)
            </span>
            <p className="text-xs text-espresso-600">
              Compares your selected concerns against published active ingredients (e.g. Niacinamide, BHA, Ceramides).
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-ivory-300">
            <span className="text-xs font-bold text-plum-800 uppercase tracking-wider block mb-1">
              Budget Alignment (15%)
            </span>
            <p className="text-xs text-espresso-600">
              Ensures candidate formulations fall directly within your selected price threshold (Budget, Mid, Luxury).
            </p>
          </div>
        </div>
      </div>

      {/* CTA Return */}
      <div className="text-center pt-4">
        <button
          onClick={() => setActiveTab('catalog')}
          className="px-6 py-3 bg-plum-800 hover:bg-plum-900 text-ivory-100 rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer"
        >
          Explore Catalog with Confidence
        </button>
      </div>

    </div>
  );
};
