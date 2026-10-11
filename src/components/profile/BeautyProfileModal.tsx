import React, { useState, useEffect } from 'react';
import { useBeauty } from '../../context/BeautyContext';
import { SKIN_TYPES, SKIN_CONCERNS, CATEGORIES } from '../../data/products';
import { SkinType, Concern, Category } from '../../types';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  Wallet 
} from 'lucide-react';

export const BeautyProfileModal: React.FC = () => {
  const { isProfileOpen, setIsProfileOpen, profile, updateProfile, resetProfile, setActiveTab } = useBeauty();

  const [localSkinType, setLocalSkinType] = useState<SkinType>(profile.skinType);
  const [localConcerns, setLocalConcerns] = useState<Concern[]>(profile.concerns);
  const [localBudget, setLocalBudget] = useState(profile.budgetTier);
  const [localCategories, setLocalCategories] = useState<Category[]>(profile.preferredCategories);
  const [localFragranceFree, setLocalFragranceFree] = useState(profile.fragranceFreeOnly);

  // Sync state when opened
  useEffect(() => {
    if (isProfileOpen) {
      setLocalSkinType(profile.skinType);
      setLocalConcerns(profile.concerns);
      setLocalBudget(profile.budgetTier);
      setLocalCategories(profile.preferredCategories);
      setLocalFragranceFree(profile.fragranceFreeOnly);
    }
  }, [isProfileOpen, profile]);

  if (!isProfileOpen) return null;

  const toggleConcern = (concern: Concern) => {
    if (localConcerns.includes(concern)) {
      setLocalConcerns(localConcerns.filter(c => c !== concern));
    } else {
      if (localConcerns.length < 5) {
        setLocalConcerns([...localConcerns, concern]);
      }
    }
  };

  const toggleCategory = (cat: Category) => {
    if (localCategories.includes(cat)) {
      if (localCategories.length > 1) {
        setLocalCategories(localCategories.filter(c => c !== cat));
      }
    } else {
      setLocalCategories([...localCategories, cat]);
    }
  };

  const handleSave = () => {
    updateProfile({
      skinType: localSkinType,
      concerns: localConcerns,
      budgetTier: localBudget,
      preferredCategories: localCategories,
      fragranceFreeOnly: localFragranceFree,
    });
    setIsProfileOpen(false);
    setActiveTab('recommendations'); // Seamlessly direct user to their newly scored recommendations!
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-espresso-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div 
        className="bg-ivory-100 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-modal border border-ivory-300 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-ivory-300 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-plum-700" />
              <h3 id="profile-modal-title" className="font-serif text-2xl font-bold text-espresso-950">
                Personal Beauty Profile
              </h3>
            </div>
            <p className="text-xs text-espresso-500 mt-1">
              Customize preferences stored locally in your browser for transparent match scoring
            </p>
          </div>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="w-8 h-8 rounded-full bg-ivory-100 hover:bg-ivory-200 text-espresso-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-7">
          
          {/* Transparent Non-Medical Banner */}
          <div className="bg-blush-50 border border-blush-200 rounded-xl p-3.5 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-plum-700 shrink-0 mt-0.5" />
            <div className="text-xs text-espresso-700 leading-relaxed">
              <strong className="text-plum-950 font-semibold">Non-Medical Disclaimer:</strong> Preferences are used solely for algorithmic rule-based cosmetic matching and shopping intelligence. BeautyPrice does not diagnose dermatological medical conditions or provide clinical prescriptions.
            </div>
          </div>

          {/* 1. Skin Type */}
          <div>
            <label className="block font-serif text-base font-bold text-espresso-950 mb-1">
              1. What is your primary skin type?
            </label>
            <p className="text-xs text-espresso-500 mb-3">
              Helps our recommendation engine score texture formulations (gel vs cream vs lotion).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SKIN_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLocalSkinType(type)}
                  className={`py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    localSkinType === type
                      ? 'bg-plum-800 text-ivory-100 border-plum-900 shadow-xs'
                      : 'bg-white text-espresso-800 border-ivory-300 hover:border-plum-300 hover:bg-blush-50'
                  }`}
                >
                  <span>{type} Skin</span>
                  {localSkinType === type && <Check className="w-3.5 h-3.5 text-champagne-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Top Concerns (Multi-select up to 5) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-serif text-base font-bold text-espresso-950">
                2. Select your main skin & hair focuses
              </label>
              <span className="text-[11px] text-espresso-500 font-medium">
                {localConcerns.length}/5 selected
              </span>
            </div>
            <p className="text-xs text-espresso-500 mb-3">
              Matched against active cosmetic ingredients (e.g. Niacinamide, Salicylic Acid, Ceramides).
            </p>
            <div className="flex flex-wrap gap-2">
              {SKIN_CONCERNS.map(concern => {
                const isSelected = localConcerns.includes(concern);
                return (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => toggleConcern(concern)}
                    className={`py-1.5 px-3 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-plum-100 text-plum-900 border-plum-400 font-semibold'
                        : 'bg-white text-espresso-700 border-ivory-300 hover:border-ivory-400'
                    }`}
                  >
                    <span>{concern}</span>
                    {isSelected && <Check className="w-3 h-3 text-plum-800" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Budget Tier Preference */}
          <div>
            <label className="block font-serif text-base font-bold text-espresso-950 mb-1 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-plum-700" />
              <span>3. Target pricing preference</span>
            </label>
            <p className="text-xs text-espresso-500 mb-3">
              Tune recommendation scores to prioritize your desired expenditure tier.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'all', label: 'All Tiers', desc: 'Any price range' },
                { id: 'budget', label: 'Budget Pick', desc: '≤ ₹550' },
                { id: 'mid-range', label: 'Mid-Range', desc: '₹400 – ₹1,400' },
                { id: 'luxury', label: 'Luxury Prestige', desc: '₹1,200+' },
              ].map(tier => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setLocalBudget(tier.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    localBudget === tier.id
                      ? 'bg-plum-800 text-ivory-100 border-plum-900 shadow-xs'
                      : 'bg-white text-espresso-800 border-ivory-300 hover:border-plum-300'
                  }`}
                >
                  <span className="text-xs font-bold block">{tier.label}</span>
                  <span className={`text-[10px] mt-1 ${localBudget === tier.id ? 'text-champagne-300' : 'text-espresso-500'}`}>
                    {tier.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Preferred Categories */}
          <div>
            <label className="block font-serif text-base font-bold text-espresso-950 mb-1">
              4. Categories of interest
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {CATEGORIES.map(cat => {
                const isSelected = localCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blush-200 border-plum-300 text-plum-900 font-bold'
                        : 'bg-white border-ivory-300 text-espresso-600'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-plum-800" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Formulation Strictness (Fragrance-Free Toggle) */}
          <div className="bg-white p-4 rounded-xl border border-ivory-300 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-espresso-900 block">
                Filter for Fragrance-Free Formulations Only
              </span>
              <p className="text-[11px] text-espresso-500 mt-0.5">
                Exclude formulations with added artificial perfume or essential oils.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLocalFragranceFree(!localFragranceFree)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                localFragranceFree ? 'bg-plum-800' : 'bg-ivory-300'
              }`}
              role="switch"
              aria-checked={localFragranceFree}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-xs ${
                  localFragranceFree ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-ivory-300 flex items-center justify-between">
          <button
            type="button"
            onClick={resetProfile}
            className="text-xs text-espresso-600 hover:text-espresso-900 font-medium underline cursor-pointer"
          >
            Reset to Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsProfileOpen(false)}
              className="px-4 py-2 border border-ivory-300 rounded-xl text-xs font-semibold text-espresso-700 hover:bg-ivory-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-plum-800 hover:bg-plum-900 text-ivory-100 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-champagne-300" />
              <span>Save & View Recommendations</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
