import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  User, 
  Info, 
  Layers, 
  Search, 
  Menu, 
  X,
  Compass
} from 'lucide-react';
import { useBeauty } from '../../context/BeautyContext';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    basket, 
    setIsProfileOpen, 
    profile, 
    setFilterState 
  } = useBeauty();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const basketCount = basket.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      setFilterState(prev => ({ ...prev, search: navSearch.trim() }));
      setActiveTab('catalog');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Discover', icon: Compass },
    { id: 'catalog', label: 'Product Catalog', icon: Layers },
    { id: 'recommendations', label: 'My Matches', icon: Sparkles },
    { id: 'basket', label: 'Basket Planner', icon: ShoppingBag, badge: basketCount },
    { id: 'transparency', label: 'Transparency', icon: Info },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-ivory-100/95 backdrop-blur-md border-b border-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-plum-800 to-plum-950 flex items-center justify-center text-ivory-100 shadow-soft group-hover:scale-105 transition-transform duration-200">
              <span className="font-serif font-bold text-lg text-champagne-300">BP</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-2xl text-espresso-950 tracking-tight">BeautyPrice</span>
                <span className="text-[10px] font-sans font-semibold tracking-widest uppercase bg-plum-100 text-plum-800 px-1.5 py-0.5 rounded">
                  India
                </span>
              </div>
              <p className="text-[11px] text-espresso-500 font-sans tracking-wide -mt-0.5 hidden sm:block">
                Beauty & Skincare Shopping Intelligence
              </p>
            </div>
          </div>

          {/* Quick Search on Desktop */}
          <form 
            onSubmit={handleNavSearch} 
            className="hidden md:flex items-center flex-1 max-w-xs mx-8 relative"
          >
            <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search serum, sunscreen, brand..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-ivory-200 border border-ivory-300 rounded-full text-xs text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:border-plum-400 focus:bg-white transition-all shadow-inner"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 relative cursor-pointer ${
                    isActive
                      ? 'text-plum-900 bg-blush-100 font-semibold shadow-xs'
                      : 'text-espresso-700 hover:text-espresso-950 hover:bg-ivory-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-plum-700' : 'text-espresso-500'}`} />
                  <span>{link.label}</span>
                  {'badge' in link && (link.badge ?? 0) > 0 && (
                    <span className="ml-1 bg-plum-800 text-ivory-100 text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Beauty Profile Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-plum-200 bg-white hover:bg-blush-50 text-espresso-900 text-xs sm:text-sm font-medium shadow-xs transition-all hover:border-plum-400 cursor-pointer"
              title="Personalize your skin type and concerns"
            >
              <div className="w-6 h-6 rounded-full bg-blush-200 text-plum-800 flex items-center justify-center font-semibold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-plum-700">Skin Profile</span>
                <span className="text-xs font-semibold text-espresso-900 truncate max-w-[110px] block">
                  {profile.skinType} Skin
                </span>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-espresso-700 hover:bg-ivory-200 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ivory-100 border-b border-ivory-300 px-4 pt-2 pb-6 space-y-3">
          <form onSubmit={handleNavSearch} className="relative mb-3">
            <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, brands, or ingredients..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-ivory-300 rounded-lg text-sm text-espresso-900 focus:outline-none focus:border-plum-600"
            />
          </form>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between text-left ${
                    isActive
                      ? 'bg-plum-800 text-ivory-100 font-semibold'
                      : 'text-espresso-800 hover:bg-ivory-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {'badge' in link && (link.badge ?? 0) > 0 && (
                    <span className="bg-blush-200 text-plum-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-ivory-300 flex items-center justify-between">
            <span className="text-xs text-espresso-500 font-medium">Beauty Profile</span>
            <button
              onClick={() => {
                setIsProfileOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-plum-700 font-semibold underline"
            >
              Edit Preferences ({profile.skinType})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
