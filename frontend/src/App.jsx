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
import OrderTrackingPage from './pages/OrderTrackingPage';
import DeliveryDashboardPage from './pages/DeliveryDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import ProductQuickViewModal from './components/common/ProductQuickViewModal';
import OutForDeliveryGlobalBanner from './components/delivery/OutForDeliveryGlobalBanner';
import CallDeliveryHeroModal from './components/delivery/CallDeliveryHeroModal';
import DeliveryLiveChatModal from './components/delivery/DeliveryLiveChatModal';
import SupportModal from './components/common/SupportModal';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import apiClient from './api/apiClient';
import { FALLBACK_PRODUCTS } from './data/fallbackProducts';
import { CheckCircle2, Sparkles, User, Truck, ShieldCheck } from 'lucide-react';

function App() {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('vibewear_store_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return FALLBACK_PRODUCTS;
  });
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activePage, setActivePage] = useState('home'); // 'home' | 'products' | 'detail' | 'checkout' | 'track' | 'delivery' | 'admin'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [activeCallOrder, setActiveCallOrder] = useState(null);
  const [activeChatOrder, setActiveChatOrder] = useState(null);

  const { toastMessage, showToast, openCart } = useCart();
  const { user, isDeliveryPartner, isAdmin, switchDemoUser } = useAuth();

  // Helper to synchronize browser address bar with current view
  const updateUrlParam = (page, paramName = null, paramVal = null) => {
    try {
      const url = new URL(window.location.href);
      ['page', 'product', 'track', 'delivery', 'admin', 'customer', 'driver'].forEach((k) =>
        url.searchParams.delete(k)
      );
      if (page === 'customer') {
        url.searchParams.set('page', 'customer');
      } else if (page === 'delivery') {
        url.searchParams.set('page', 'driver');
      } else if (page === 'admin') {
        url.searchParams.set('page', 'admin');
      } else if (page === 'track') {
        url.searchParams.set('page', 'track');
        if (paramVal) url.searchParams.set('track', paramVal);
      } else if (page === 'products') {
        url.searchParams.set('page', 'products');
      } else if (page === 'detail' && paramVal) {
        url.searchParams.set('product', paramVal);
      } else if (page === 'checkout') {
        url.searchParams.set('page', 'checkout');
      }

      window.history.pushState({ page }, '', url.pathname + url.search + window.location.hash);
    } catch {
      // Ignore
    }
  };

  // Immediate role login router: Admin -> Admin Console, Driver -> Driver Hub, Customer -> Customer Dashboard
  const handleRoleLogin = (role) => {
    if (role === 'Admin') {
      setActivePage('admin');
      updateUrlParam('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Welcome to Operations Console, ${user?.name || 'Admin'}!`);
    } else if (role === 'DeliveryPartner') {
      setActivePage('delivery');
      updateUrlParam('delivery');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Welcome to Rider Hub, ${user?.name || 'Partner'}!`);
    } else {
      setActivePage('customer');
      updateUrlParam('customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Welcome to Customer Portal, ${user?.name || 'Customer'}!`);
    }
  };

  // Full-page checkout navigation
  const handleOpenCheckout = () => {
    setActivePage('checkout');
    setCheckoutModalOpen(false);
    updateUrlParam('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open dedicated customer dashboard portal
  const handleOpenCustomer = () => {
    setActivePage('customer');
    updateUrlParam('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open live order tracking page
  const handleOpenTracking = (orderId = null) => {
    if (orderId) setTrackingOrderId(orderId);
    setActivePage('track');
    updateUrlParam('track', 'track', orderId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open dedicated delivery partner portal
  const handleOpenDelivery = () => {
    setActivePage('delivery');
    updateUrlParam('delivery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open dedicated admin dashboard portal
  const handleOpenAdmin = () => {
    setActivePage('admin');
    updateUrlParam('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setActivePage('home');
    updateUrlParam('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateProducts = () => {
    setActivePage('products');
    updateUrlParam('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product Catalog Synchronization Handlers
  const handleAddProduct = async (newProduct) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    try {
      localStorage.setItem('vibewear_store_catalog', JSON.stringify(updated));
      await apiClient.post('/products', {
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        stock: newProduct.stock,
        images: [newProduct.image],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White']
      });
    } catch {
      console.info('[VibeWear] Product added to local catalog.');
    }
    showToast(`✨ Product "${newProduct.title}" added to store catalog!`);
  };

  const handleDeleteProduct = async (productId) => {
    const updated = products.filter((p) => p.id !== productId && p._id !== productId);
    setProducts(updated);
    try {
      localStorage.setItem('vibewear_store_catalog', JSON.stringify(updated));
      await apiClient.delete(`/products/${productId}`);
    } catch {
      console.info('[VibeWear] Product deleted from local catalog.');
    }
    showToast('🗑️ Product removed from store catalog.');
  };

  const handleUpdateProductStock = async (productId, newStock) => {
    const updated = products.map((p) =>
      p.id === productId || p._id === productId ? { ...p, stock: newStock } : p
    );
    setProducts(updated);
    try {
      localStorage.setItem('vibewear_store_catalog', JSON.stringify(updated));
      await apiClient.put(`/products/${productId}`, { stock: newStock });
    } catch {
      console.info('[VibeWear] Stock level updated locally.');
    }
    showToast('Stock level updated.');
  };

  // Fetch products from backend API with local cache fallback
  useEffect(() => {
    const fetchBackendProducts = async () => {
      try {
        const response = await apiClient.get('/products?limit=150');
        if (response.data && response.data.data && response.data.data.length > 0) {
          const enhanced = response.data.data.map((p) => {
            const fallbackMatch = FALLBACK_PRODUCTS.find(
              (fp) => fp.title.toLowerCase() === p.title.toLowerCase() || fp.id === p.id
            );
            return {
              ...p,
              colorImages: p.colorImages || fallbackMatch?.colorImages || null
            };
          });

          try {
            const saved = localStorage.getItem('vibewear_store_catalog');
            if (saved) {
              const parsed = JSON.parse(saved);
              const customLocal = parsed.filter(
                (p) => String(p.id).startsWith('prod_') && !enhanced.some((ep) => ep.id === p.id || ep._id === p.id)
              );
              const merged = [...customLocal, ...enhanced];
              setProducts(merged);
              localStorage.setItem('vibewear_store_catalog', JSON.stringify(merged));
              return;
            }
          } catch {}

          setProducts(enhanced);
          localStorage.setItem('vibewear_store_catalog', JSON.stringify(enhanced));
        }
      } catch (err) {
        console.info('[VibeWear] Operating on local catalog cache.');
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

  const handleNavigateFullPage = (product) => {
    setSelectedProduct(product);
    setQuickViewProduct(null);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    handleNavigateFullPage(product);
  };

  // Support URL share deep link (?page=admin, ?page=driver, ?page=customer, ?page=track, ?product=prod_1)
  useEffect(() => {
    const parseUrlAndRoute = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = (window.location.hash || '').toLowerCase();
      const pageParam = params.get('page');
      const productId = params.get('product');
      const trackParam = params.get('track');
      const deliveryParam = params.get('delivery');
      const adminParam = params.get('admin');
      const customerParam = params.get('customer');
      const driverParam = params.get('driver');

      if (pageParam === 'admin' || adminParam === 'true' || hash === '#admin') {
        setActivePage('admin');
      } else if (
        pageParam === 'driver' ||
        pageParam === 'delivery' ||
        deliveryParam === 'true' ||
        driverParam === 'true' ||
        hash === '#driver' ||
        hash === '#delivery'
      ) {
        setActivePage('delivery');
      } else if (
        pageParam === 'customer' ||
        customerParam === 'true' ||
        hash === '#customer'
      ) {
        setActivePage('customer');
      } else if (pageParam === 'track' || trackParam) {
        if (trackParam) setTrackingOrderId(trackParam);
        setActivePage('track');
      } else if (pageParam === 'products') {
        setActivePage('products');
      } else if (pageParam === 'checkout') {
        setActivePage('checkout');
      } else if (productId && products.length > 0) {
        const found = products.find((p) => (p.id || p._id) === productId);
        if (found) {
          setSelectedProduct(found);
          setActivePage('detail');
        }
      }
    };

    parseUrlAndRoute();
    window.addEventListener('popstate', parseUrlAndRoute);
    window.addEventListener('hashchange', parseUrlAndRoute);
    return () => {
      window.removeEventListener('popstate', parseUrlAndRoute);
      window.removeEventListener('hashchange', parseUrlAndRoute);
    };
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

      {/* Interactive Platform Role Switcher Bar (Only visible if Admin or Driver logged in) */}
      {(isAdmin || isDeliveryPartner) && (
        <div className="bg-slate-950 text-white text-xs py-1.5 px-3 sm:px-6 border-b border-purple-500/30 flex items-center justify-between gap-2 z-50 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-extrabold uppercase tracking-wider text-[10px] text-pink-400 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-pink-400" />
            Live Portals:
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleNavigateHome}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                activePage === 'home' || activePage === 'products' || activePage === 'detail'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              🛍️ Storefront
            </button>
            <button
              type="button"
              onClick={handleOpenCustomer}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                activePage === 'customer'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              👤 Customer Portal
            </button>
            <button
              type="button"
              onClick={handleOpenDelivery}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                activePage === 'delivery'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              🛵 Driver Hub
            </button>
            <button
              type="button"
              onClick={handleOpenAdmin}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                activePage === 'admin'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              👑 Admin Console
            </button>
          </div>
        </div>

        {/* 1-Click Role Logins */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px]">
          <span className="text-slate-400">Instant Demo Login:</span>
          <button
            type="button"
            onClick={() => {
              if (switchDemoUser) switchDemoUser('Customer');
              handleOpenCustomer();
              showToast('Switched to Customer account: John Doe');
            }}
            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-pink-500 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            John (Customer)
          </button>
          <button
            type="button"
            onClick={() => {
              if (switchDemoUser) switchDemoUser('DeliveryPartner');
              handleOpenDelivery();
              showToast('Switched to Driver account: Vikram Malhotra');
            }}
            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-purple-600 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            Vikram (Driver)
          </button>
          <button
            type="button"
            onClick={() => {
              if (switchDemoUser) switchDemoUser('Admin');
              handleOpenAdmin();
              showToast('Switched to Admin account: VibeWear HQ');
            }}
            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            Admin (VibeWear)
          </button>
        </div>
      </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        products={products}
        onSelectProduct={handleSelectProduct}
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        onOpenAI={() => setAiModalOpen(true)}
        onNavigateHome={handleNavigateHome}
        onNavigateProducts={handleNavigateProducts}
        onNavigateCustomer={handleOpenCustomer}
        onNavigateTrack={handleOpenTracking}
        onNavigateDelivery={handleOpenDelivery}
        onNavigateAdmin={handleOpenAdmin}
        onOpenSupport={() => setSupportModalOpen(true)}
        activePage={activePage}
      />

      {/* Main Content Pages */}
      <main className="flex-1 pb-24 md:pb-0">
        {activePage === 'home' && (
          <HomePage
            products={products}
            onSelectProduct={handleSelectProduct}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onSelectCategory={handleSelectCategory}
            onOpenAI={() => setAiModalOpen(true)}
            onNavigateProducts={handleNavigateProducts}
            onNavigateCustomer={handleOpenCustomer}
            onTrackOrder={handleOpenTracking}
          />
        )}

        {activePage === 'products' && (
          <ProductListingPage
            products={products}
            currentCategory={currentCategory}
            onSelectCategory={setCurrentCategory}
            onSelectProduct={handleSelectProduct}
            onQuickView={(prod) => setQuickViewProduct(prod)}
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
            onNavigateCustomer={handleOpenCustomer}
            onOrderComplete={(order) => {
              showToast(`Order ${order.id} placed successfully!`);
            }}
            onTrackOrder={handleOpenTracking}
          />
        )}

        {activePage === 'track' && (
          <OrderTrackingPage
            orderId={trackingOrderId}
            onNavigateBack={() => {
              setActivePage(isAdmin ? 'admin' : isDeliveryPartner ? 'delivery' : 'home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateProducts={handleNavigateProducts}
          />
        )}

        {activePage === 'customer' && (
          <CustomerDashboardPage
            onNavigateHome={handleNavigateHome}
            onNavigateProducts={handleNavigateProducts}
            onTrackOrder={handleOpenTracking}
            onNavigateDelivery={handleOpenDelivery}
            onNavigateAdmin={handleOpenAdmin}
          />
        )}

        {activePage === 'delivery' && (
          <DeliveryDashboardPage
            onNavigateHome={handleNavigateHome}
            onNavigateCustomer={handleOpenCustomer}
            onNavigateAdmin={handleOpenAdmin}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboardPage
            onNavigateHome={handleNavigateHome}
            onNavigateCustomer={handleOpenCustomer}
            onNavigateDelivery={handleOpenDelivery}
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProductStock={handleUpdateProductStock}
          />
        )}
      </main>

      {/* Floating VibeAI Trigger Button */}
      {activePage !== 'delivery' && activePage !== 'admin' && (
        <button
          type="button"
          onClick={() => setAiModalOpen(true)}
          className="fixed bottom-20 sm:bottom-6 right-3.5 sm:right-6 z-40 p-3 sm:py-3 sm:px-4.5 rounded-full bg-gradient-to-r from-brand-600 via-pink-600 to-purple-600 hover:from-brand-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl sm:shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/70 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-pink-400/50 group"
          aria-label="Open AI Fashion Stylist"
          title="Open VibeAI Fashion Stylist"
        >
          <Sparkles className="w-5 h-5 sm:w-4 sm:h-4 text-white animate-spin-slow group-hover:rotate-180 transition-transform shrink-0" />
          <span className="hidden sm:inline font-display tracking-wide">VibeAI Stylist</span>
          <span className="w-2 h-2 rounded-full bg-pink-300 animate-ping hidden sm:block shrink-0" />
        </button>
      )}

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* Native-style Mobile Bottom Navigation Bar (iOS & Android) */}
      <MobileBottomNav
        activePage={activePage}
        onNavigateHome={handleNavigateHome}
        onNavigateProducts={handleNavigateProducts}
        onNavigateCustomer={handleOpenCustomer}
        onNavigateDelivery={handleOpenDelivery}
        onNavigateAdmin={handleOpenAdmin}
      />

      {/* Global Modals & Drawers */}
      <AuthModal onLoginSuccess={handleRoleLogin} />
      <CartDrawer
        onNavigateToProducts={() => setActivePage('products')}
        onOpenCheckout={handleOpenCheckout}
      />
      <WishlistDrawer
        onNavigateToProducts={() => setActivePage('products')}
        onSelectProduct={handleSelectProduct}
      />
      <ProfileModal onTrackOrder={handleOpenTracking} />
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onOrderComplete={(order) => {
          showToast(`Order ${order.id} placed successfully!`);
          handleOpenTracking(order.id);
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

      {/* Out for Delivery Global Dispatch Alert Banner across all screens */}
      <OutForDeliveryGlobalBanner
        onOpenTracking={handleOpenTracking}
        onOpenCall={(order) => setActiveCallOrder(order)}
        onOpenChat={(order) => setActiveChatOrder(order)}
      />

      {/* Global Call Delivery Hero Modal */}
      {activeCallOrder && (
        <CallDeliveryHeroModal
          isOpen={Boolean(activeCallOrder)}
          onClose={() => setActiveCallOrder(null)}
          deliveryPartner={{
            name: activeCallOrder.deliveryPartnerName || 'Vikram Malhotra',
            phone: activeCallOrder.deliveryPartnerPhone || '+91 98201 55432',
            vehicle: activeCallOrder.deliveryPartnerVehicle || 'Hero Electric Optima - MH 02 CW 9921',
            rating: '4.9 ★'
          }}
          orderId={activeCallOrder.id || activeCallOrder._id}
          customerName={activeCallOrder.shippingAddress?.fullName || 'Customer'}
          deliveryPin="5821"
        />
      )}

      {/* Global Delivery Live Chat Modal */}
      {activeChatOrder && (
        <DeliveryLiveChatModal
          isOpen={Boolean(activeChatOrder)}
          onClose={() => setActiveChatOrder(null)}
          onStartCall={() => {
            const orderToCall = activeChatOrder;
            setActiveChatOrder(null);
            setActiveCallOrder(orderToCall);
          }}
          deliveryPartner={{
            name: activeChatOrder.deliveryPartnerName || 'Vikram Malhotra',
            phone: activeChatOrder.deliveryPartnerPhone || '+91 98201 55432',
            vehicle: activeChatOrder.deliveryPartnerVehicle || 'Hero Electric Optima - MH 02 CW 9921',
            rating: '4.9 ★'
          }}
          orderId={activeChatOrder.id || activeChatOrder._id}
          customerName={activeChatOrder.shippingAddress?.fullName || 'Customer'}
          deliveryPin="5821"
          totalAmount={activeChatOrder.totalAmount || 2499}
          isCod={activeChatOrder.paymentMethod === 'COD'}
        />
      )}

      {/* 24/7 Support Desk Modal */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        onNavigateTrack={handleOpenTracking}
        onNavigateDelivery={handleOpenDelivery}
      />
    </div>
  );
}

export default App;
