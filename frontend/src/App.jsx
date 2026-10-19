import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/common/AuthModal';
import CartDrawer from './components/common/CartDrawer';
import WishlistDrawer from './components/common/WishlistDrawer';
import ProfileModal from './components/common/ProfileModal';
import CheckoutModal from './components/common/CheckoutModal';
import MobileBottomNav from './components/layout/MobileBottomNav';
import VibeAIModal from './components/ai/VibeAIModal';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductQuickViewModal from './components/common/ProductQuickViewModal';
import { useCart } from './context/CartContext';
import apiClient from './api/apiClient';
import { FALLBACK_PRODUCTS } from './data/fallbackProducts';
import { CheckCircle2, Sparkles } from 'lucide-react';

function App() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activePage, setActivePage] = useState('home'); // 'home' | 'products' | 'detail' | 'checkout'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const { toastMessage, showToast, openCart } = useCart();

  // Full-page checkout navigation (replaces cramped popup modal box)
  const handleOpenCheckout = () => {
    setActivePage('checkout');
    setCheckoutModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch products from backend API with fallback
  useEffect(() => {
    const fetchBackendProducts = async () => {
      try {
        const response = await apiClient.get('/products?limit=150');
        if (response.data && response.data.data && response.data.data.length > 0) {
          // Merge with fallback colorImages if backend records don't have them yet
          const enhanced = response.data.data.map((p) => {
            const fallbackMatch = FALLBACK_PRODUCTS.find(
              (fp) => fp.title.toLowerCase() === p.title.toLowerCase() || fp.id === p.id
            );
            return {
              ...p,
              colorImages: p.colorImages || fallbackMatch?.colorImages || null
            };
          });
          setProducts(enhanced);
        }
      } catch (err) {
        console.info('[VibeWear] Backend not responding yet, operating on offline catalog.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchBackendProducts();
  }, []);

  // Handlers
  const handleSelectCategory = (category) => {
    setCurrentCategory(category);
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation to dedicated full product page
  const handleNavigateFullPage = (product) => {
    setSelectedProduct(product);
    setQuickViewProduct(null);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User requested: "ye box me nahi aana chhaiye full screen me aana chahiye"
  // Clicking any product card immediately opens the immersive full-screen detail view
  const handleSelectProduct = (product) => {
    handleNavigateFullPage(product);
  };

  // Support URL share deep link (?product=prod_1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId && products.length > 0) {
      const found = products.find((p) => (p.id || p._id) === productId);
      if (found) {
        handleNavigateFullPage(found);
      }
    }
  }, [products]);

  const handleBackToListing = () => {
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      setActivePage('products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#06060A] text-slate-900 dark:text-white selection:bg-pink-500 selection:text-white transition-colors duration-200">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/95 dark:bg-[#0B0B12]/95 border border-purple-300 dark:border-pink-500/40 text-slate-900 dark:text-white text-xs font-semibold shadow-2xl backdrop-blur-xl animate-slide-up shadow-glow-pink">
          <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        onOpenAI={() => setAiModalOpen(true)}
        onNavigateHome={() => {
          setActivePage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateProducts={() => {
          setActivePage('products');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Pages */}
      <main className="flex-1 pb-16 md:pb-0">
        {activePage === 'home' && (
          <HomePage
            products={products}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
            onOpenAI={() => setAiModalOpen(true)}
            onNavigateProducts={() => {
              setActivePage('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'products' && (
          <ProductListingPage
            products={products}
            currentCategory={currentCategory}
            onSelectCategory={setCurrentCategory}
            onSelectProduct={handleSelectProduct}
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm('')}
          />
        )}

        {activePage === 'detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={handleBackToListing}
            onSelectProduct={handleSelectProduct}
            onOpenCheckout={handleOpenCheckout}
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage
            onNavigateBack={() => {
              setActivePage(selectedProduct ? 'detail' : 'products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrderComplete={(order) => {
              showToast(`Order ${order.id} placed successfully!`);
            }}
          />
        )}
      </main>

      {/* Floating VibeAI Trigger Button */}
      <button
        type="button"
        onClick={() => setAiModalOpen(true)}
        className="fixed bottom-20 sm:bottom-6 right-5 z-40 py-3 px-4 rounded-full bg-gradient-to-r from-brand-600 via-pink-600 to-purple-600 hover:from-brand-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/70 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-pink-400/50 group"
        aria-label="Open AI Fashion Stylist"
      >
        <Sparkles className="w-4 h-4 text-white animate-spin-slow group-hover:rotate-180 transition-transform" />
        <span className="font-display tracking-wide">VibeAI Stylist</span>
        <span className="w-2 h-2 rounded-full bg-pink-300 animate-ping" />
      </button>

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* Native-style Mobile Bottom Navigation Bar (iOS & Android) */}
      <MobileBottomNav
        activePage={activePage}
        onNavigateHome={() => {
          setActivePage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateProducts={() => {
          setActivePage('products');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Modals & Drawers */}
      <AuthModal />
      <CartDrawer
        onNavigateToProducts={() => setActivePage('products')}
        onOpenCheckout={handleOpenCheckout}
      />
      <WishlistDrawer
        onNavigateToProducts={() => setActivePage('products')}
        onSelectProduct={handleSelectProduct}
      />
      <ProfileModal />
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onOrderComplete={(order) => {
          showToast(`Order ${order.id} placed successfully!`);
        }}
      />
      <VibeAIModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        products={products}
        onSelectProduct={(product) => {
          setAiModalOpen(false);
          handleNavigateFullPage(product);
        }}
        onQuickView={(product) => {
          setAiModalOpen(false);
          setQuickViewProduct(product);
        }}
        onOpenCart={() => {
          setAiModalOpen(false);
          openCart();
        }}
      />
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onOpenCheckout={handleOpenCheckout}
        onNavigateFullPage={handleNavigateFullPage}
      />
    </div>
  );
}

export default App;
