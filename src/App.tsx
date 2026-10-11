import React from 'react';
import { BeautyProvider, useBeauty } from './context/BeautyContext';
import { TransparencyBanner } from './components/common/TransparencyBanner';
import { Navbar } from './components/common/Navbar';
import { HomeView } from './components/home/HomeView';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { RecommendationsView } from './components/recommendations/RecommendationsView';
import { BasketPlanner } from './components/basket/BasketPlanner';
import { TransparencyPage } from './components/transparency/TransparencyPage';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { BeautyProfileModal } from './components/profile/BeautyProfileModal';
import { Footer } from './components/common/Footer';

const AppContent: React.FC = () => {
  const { activeTab } = useBeauty();

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100 text-espresso-950 font-sans">
      {/* Top Demonstration Notice Banner */}
      <TransparencyBanner />

      {/* Primary Navigation */}
      <Navbar />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'catalog' && <ProductCatalog />}
        {activeTab === 'recommendations' && <RecommendationsView />}
        {activeTab === 'basket' && <BasketPlanner />}
        {activeTab === 'transparency' && <TransparencyPage />}
      </main>

      {/* Global Modals */}
      <ProductDetailModal />
      <BeautyProfileModal />

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BeautyProvider>
      <AppContent />
    </BeautyProvider>
  );
};

export default App;
