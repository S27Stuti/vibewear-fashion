import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Package,
  MapPin,
  Clock,
  Truck,
  RotateCcw,
  RefreshCw,
  Ban,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  FileText,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Bike,
  Plus,
  CreditCard,
  Wallet,
  AlertCircle,
  HelpCircle,
  Check,
  X
} from 'lucide-react';
import ReviewModal from '../components/common/ReviewModal';

const CustomerDashboardPage = ({
  onNavigateHome,
  onNavigateProducts,
  onTrackOrder,
  onNavigateDelivery,
  onNavigateAdmin
}) => {
  const {
    user,
    userOrders,
    updateUserProfile,
    cancelOrder,
    requestReturn,
    requestExchange,
    updateDeliveryStatus,
    switchDemoUser,
    logout
  } = useAuth();

  const customerUser = user || {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 91234 56789',
    role: 'Customer',
    address: {
      fullName: 'John Doe',
      street: '42 MG Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      phone: '+91 91234 56789'
    }
  };

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'wallet' | 'settings'
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'active' | 'delivered' | 'returns'
  const [actionSuccessNotice, setActionSuccessNotice] = useState('');

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(customerUser.name || '');
  const [editPhone, setEditPhone] = useState(customerUser.phone || '');

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [selectedOrderIdForReview, setSelectedOrderIdForReview] = useState(null);

  // Return Modal State
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnReason, setReturnReason] = useState("Size doesn't fit properly");
  const [returnComment, setReturnComment] = useState('');

  // Exchange Modal State
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedOrderForExchange, setSelectedOrderForExchange] = useState(null);
  const [exchangeReason, setExchangeReason] = useState('Size too loose / oversized');
  const [exchangeDesiredSize, setExchangeDesiredSize] = useState('L');
  const [exchangeDesiredColor, setExchangeDesiredColor] = useState('Obsidian Black');
  const [exchangeComment, setExchangeComment] = useState('');

  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake / found alternative');

  // Invoice Modal State
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const showNotice = (msg) => {
    setActionSuccessNotice(msg);
    setTimeout(() => setActionSuccessNotice(''), 4500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile({ name: editName, phone: editPhone });
    }
    setIsEditingProfile(false);
    showNotice('Profile updated successfully!');
  };

  // Filter orders
  const orders = Array.isArray(userOrders) ? userOrders : [];

  const formatOrderDate = (dateVal) => {
    if (!dateVal) return 'Recently';
    try {
      const d = new Date(dateVal);
      return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === 'active') {
      return ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery'].includes(order.orderStatus);
    }
    if (orderFilter === 'delivered') {
      return order.orderStatus === 'Delivered';
    }
    if (orderFilter === 'returns') {
      return [
        'Return Requested',
        'Return Approved',
        'Return In Progress',
        'Returned',
        'Exchange Requested',
        'Exchange Approved',
        'Exchange In Progress',
        'Exchanged'
      ].includes(order.orderStatus);
    }
    return true;
  });

  const activeOrdersCount = orders.filter((o) =>
    ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery'].includes(o.orderStatus)
  ).length;

  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

  // Handle return submit
  const handleReturnSubmit = async () => {
    if (!selectedOrderForReturn) return;
    const orderId = selectedOrderForReturn.id || selectedOrderForReturn._id;
    await requestReturn(orderId, returnReason, returnComment);
    setReturnModalOpen(false);
    showNotice(`Return request registered for Order #${orderId}. Rider will arrive for verification.`);
  };

  // Handle exchange submit
  const handleExchangeSubmit = async () => {
    if (!selectedOrderForExchange) return;
    const orderId = selectedOrderForExchange.id || selectedOrderForExchange._id;
    await requestExchange(orderId, exchangeReason, exchangeDesiredSize, exchangeDesiredColor, exchangeComment);
    setExchangeModalOpen(false);
    showNotice(`Exchange request confirmed for Order #${orderId} (Size: ${exchangeDesiredSize}, Color: ${exchangeDesiredColor})!`);
  };

  // Handle cancel submit
  const handleCancelSubmit = async () => {
    if (!selectedOrderForCancel) return;
    const orderId = selectedOrderForCancel.id || selectedOrderForCancel._id;
    await cancelOrder(orderId, cancelReason);
    setCancelModalOpen(false);
    showNotice(`Order #${orderId} has been cancelled successfully.`);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in text-slate-900 dark:text-white">
      {/* Toast Notice */}
      {actionSuccessNotice && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-white/95 dark:bg-[#0B0B14]/95 border-2 border-emerald-500 shadow-2xl backdrop-blur-xl text-slate-900 dark:text-white text-xs font-bold flex items-center gap-2.5 animate-slide-up max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{actionSuccessNotice}</span>
        </div>
      )}

      {/* CUSTOMER PROFILE HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-purple-200 dark:border-brand-500/40 p-6 sm:p-8 shadow-2xl mb-8">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-pink-500/20 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 pb-6 border-b border-purple-100 dark:border-white/10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-brand-600 via-pink-600 to-purple-600 p-1 shadow-xl shadow-pink-500/30 shrink-0">
              <div className="w-full h-full bg-white dark:bg-[#0B0B14] rounded-2xl flex items-center justify-center text-2xl font-black font-display text-slate-900 dark:text-white">
                {customerUser.name ? customerUser.name[0].toUpperCase() : 'C'}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                  {customerUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  VIP Platinum Shopper
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-white/70">
                <span className="flex items-center gap-1 font-medium">
                  <Mail className="w-3.5 h-3.5 text-pink-500" />
                  {customerUser.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Phone className="w-3.5 h-3.5 text-pink-500" />
                  {customerUser.phone || '+91 91234 56789'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Account
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onNavigateProducts}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/25 cursor-pointer transition-all"
            >
              <span>Explore New Drops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {orders.length > 0 && (
              <button
                type="button"
                onClick={() => onTrackOrder && onTrackOrder(orders[0]?.id || orders[0]?._id)}
                className="px-4 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-white/10 border border-purple-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white transition-all cursor-pointer flex items-center gap-1.5"
                title="Track Active Delivery"
              >
                <Truck className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                <span>Track Live Delivery</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-black/40 border border-purple-200/80 dark:border-white/10">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">Total Orders Placed</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black font-display text-slate-900 dark:text-white">{orders.length}</span>
              <Package className="w-5 h-5 text-brand-500" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-black/40 border border-pink-200/80 dark:border-white/10">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">Active In Transit</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black font-display text-pink-600 dark:text-pink-400">{activeOrdersCount}</span>
              <Truck className="w-5 h-5 text-pink-500 animate-pulse" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-black/40 border border-emerald-200/80 dark:border-white/10">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">Delivered Safely</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400">{deliveredCount}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-black/40 border border-amber-200/80 dark:border-white/10">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">Vibe Club Points</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black font-display text-amber-500">1,450 🪙</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      {/* NAVIGATION TABS - Swipeable on mobile */}
      <div className="flex items-center gap-2 border-b border-purple-200 dark:border-white/10 pb-4 mb-6 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md shadow-pink-500/25'
              : 'bg-white dark:bg-[#0B0B14] text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white border border-purple-200 dark:border-white/10'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('addresses')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'addresses'
              ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md shadow-pink-500/25'
              : 'bg-white dark:bg-[#0B0B14] text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white border border-purple-200 dark:border-white/10'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Addresses</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wallet')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'wallet'
              ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md shadow-pink-500/25'
              : 'bg-white dark:bg-[#0B0B14] text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white border border-purple-200 dark:border-white/10'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Wallet</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md shadow-pink-500/25'
              : 'bg-white dark:bg-[#0B0B14] text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white border border-purple-200 dark:border-white/10'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>

      {/* TAB CONTENT: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Sub-filter chips - Swipeable on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0B0B14] p-3 rounded-2xl border border-purple-200 dark:border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'all', label: 'All Orders', count: orders.length },
                { id: 'active', label: 'In Progress', count: activeOrdersCount },
                { id: 'delivered', label: 'Delivered', count: deliveredCount },
                { id: 'returns', label: 'Returns & Exchanges' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                    orderFilter === f.id
                      ? 'bg-pink-500 text-white shadow-sm'
                      : 'bg-purple-50 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label} {f.count !== undefined ? `(${f.count})` : ''}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 dark:text-white/50">
              Showing {filteredOrders.length} orders
            </span>
          </div>

          {/* Driver Accepted Live Celebration Banner */}
          {(() => {
            const acceptedOrder = orders.find(
              (o) => o.driverRequestStatus === 'accepted' && o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
            );
            if (!acceptedOrder) return null;
            return (
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-600/15 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-slide-up">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
                    <CheckCircle2 className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/40">
                        🎉 Driver Ne Request Accept Kar Li!
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-white/80">
                        Order #{acceptedOrder.id || acceptedOrder._id}
                      </span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                      Driver <span className="text-emerald-700 dark:text-emerald-400">{acceptedOrder.deliveryPartnerName || 'Vikram Malhotra'}</span> ne aapki delivery request accept kar li hai!
                    </p>
                    <p className="text-xs text-slate-600 dark:text-white/70 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>🛵 Vehicle: <strong className="text-slate-800 dark:text-white">{acceptedOrder.deliveryPartnerVehicle || 'Hero Electric Optima - MH 02 CW 9921'}</strong></span>
                      <span>📞 Direct Phone: <strong className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">{acceptedOrder.deliveryPartnerPhone || '+91 98201 55432'}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                  <a
                    href={`tel:${(acceptedOrder.deliveryPartnerPhone || '+919820155432').replace(/\s+/g, '')}`}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Driver</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onTrackOrder && onTrackOrder(acceptedOrder.id || acceptedOrder._id)}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white/10 dark:hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-emerald-500/40 transition-all cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Track Live</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#0B0B14] rounded-3xl border border-purple-200 dark:border-white/10 p-8">
              <Package className="w-16 h-16 text-slate-300 dark:text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No orders found in this view</h3>
              <p className="text-xs text-slate-500 dark:text-white/60 mt-1 max-w-sm mx-auto">
                Discover our latest fashion collection and treat yourself to premium streetwear drops.
              </p>
              <button
                type="button"
                onClick={onNavigateProducts}
                className="mt-5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-pink-600 text-white font-bold text-xs"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredOrders.map((order) => {
                const orderId = order.id || order._id;
                const isOutForDelivery = order.orderStatus === 'Out for Delivery';
                const isDelivered = order.orderStatus === 'Delivered';
                const isCancelled = order.orderStatus === 'Cancelled';
                const isReturnRequested = ['Return Requested', 'Return Approved', 'Return In Progress', 'Returned'].includes(order.orderStatus);
                const isExchangeRequested = ['Exchange Requested', 'Exchange Approved', 'Exchange In Progress', 'Exchanged'].includes(order.orderStatus);
                // Any active order before delivery can be cancelled by the customer
                const canCancel = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery'].includes(order.orderStatus);
                const canReturnOrExchange = order.orderStatus === 'Delivered';

                return (
                  <div
                    key={orderId}
                    className={`rounded-3xl bg-white dark:bg-[#0B0B14] border-2 transition-all p-5 sm:p-6 shadow-xl ${
                      isOutForDelivery
                        ? 'border-pink-500 shadow-pink-500/10 dark:shadow-pink-500/20'
                        : isDelivered
                        ? 'border-emerald-500/40'
                        : isCancelled
                        ? 'border-red-500/30 opacity-80'
                        : 'border-purple-200 dark:border-white/10'
                    }`}
                  >
                    {/* Order Top Bar with Prominent Action Options */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-purple-100 dark:border-white/10">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-sm font-black text-pink-600 dark:text-pink-400">
                            #{orderId}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                              isOutForDelivery
                                ? 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 animate-pulse border border-pink-400'
                                : isDelivered
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-400'
                                : isCancelled
                                ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 border border-red-400'
                                : isReturnRequested
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-400'
                                : isExchangeRequested
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-400'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-300'
                            }`}
                          >
                            {isOutForDelivery && <Truck className="w-3 h-3 text-pink-500 animate-bounce" />}
                            {isDelivered && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                            {isCancelled && <Ban className="w-3 h-3 text-red-500" />}
                            {isReturnRequested && <RotateCcw className="w-3 h-3 text-amber-500 animate-spin" />}
                            {isExchangeRequested && <RefreshCw className="w-3 h-3 text-purple-500 animate-spin" />}
                            <span>{order.orderStatus}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-white/50 mt-1">
                          Placed on {formatOrderDate(order.createdAt)} • Payment: {order.paymentMethod || 'Online'} ({order.paymentStatus || 'Pending'})
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                            ₹{order.totalAmount?.toLocaleString('en-IN') || 2499}
                          </span>
                        </div>

                        {/* Top Prominent Action Buttons */}
                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderForCancel(order);
                              setCancelModalOpen(true);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                            title="Cancel this order before delivery"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Cancel Order</span>
                          </button>
                        )}

                        {canReturnOrExchange && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrderForReturn(order);
                                setReturnModalOpen(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                              title="Return order at your doorstep"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Doorstep Return</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrderForExchange(order);
                                setExchangeModalOpen(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                              title="Exchange size or color"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Exchange Size</span>
                            </button>
                          </div>
                        )}

                        {/* Direct Track Live Button */}
                        <button
                          type="button"
                          onClick={() => onTrackOrder && onTrackOrder(orderId)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/20 cursor-pointer transition-all"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Live</span>
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Driver Status & Details Card for Customer */}
                    {!isCancelled && !isDelivered && (
                      <div
                        className={`my-4 p-4 rounded-2xl border space-y-3 transition-all ${
                          order.driverRequestStatus === 'accepted'
                            ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-600/10 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                            : order.driverRequestStatus === 'pending_acceptance'
                            ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 border-amber-500/40'
                            : order.driverRequestStatus === 'rejected'
                            ? 'bg-gradient-to-r from-red-500/10 via-rose-500/10 to-red-600/10 border-red-500/40'
                            : 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-brand-600/10 border-purple-300 dark:border-white/10'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center font-bold shrink-0 shadow-md ${
                                order.driverRequestStatus === 'accepted'
                                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/25'
                                  : order.driverRequestStatus === 'pending_acceptance'
                                  ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/25'
                                  : order.driverRequestStatus === 'rejected'
                                  ? 'bg-gradient-to-tr from-red-500 to-rose-600 shadow-red-500/25'
                                  : 'bg-gradient-to-tr from-brand-600 to-pink-500 shadow-pink-500/25'
                              }`}
                            >
                              <Bike className="w-6 h-6 animate-pulse" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {order.driverRequestStatus === 'accepted' ? (
                                  <>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">
                                      🎉 Driver {order.deliveryPartnerName || 'Vikram Malhotra'} ne request ACCEPT kar li hai!
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                                      ✅ Driver Confirmed
                                    </span>
                                  </>
                                ) : order.driverRequestStatus === 'pending_acceptance' ? (
                                  <>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">
                                      ⏳ Admin Assigned {order.deliveryPartnerName || 'Rider'} — Awaiting Driver Acceptance
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                                      ⏳ Driver Pending
                                    </span>
                                  </>
                                ) : order.driverRequestStatus === 'rejected' ? (
                                  <>
                                    <span className="text-xs font-black text-red-600 dark:text-red-400">
                                      ⚠️ Rider Unable to Accept — Admin Reassigning
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border border-red-300 dark:border-red-500/30">
                                      ❌ Driver Declined
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">
                                      📦 Order Confirmed & Packing at Hub
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30">
                                      Express Dispatch
                                    </span>
                                  </>
                                )}
                              </div>

                              {order.driverRequestStatus === 'rejected' ? (
                                <p className="text-[11px] text-red-600 dark:text-red-300 mt-0.5">
                                  Declined reason: <em>"{order.driverRejectionReason || 'Rider on leave / schedule clash'}"</em>. Store admin has been notified and is choosing another driver.
                                </p>
                              ) : (
                                <>
                                  <p className="text-[11px] text-slate-600 dark:text-white/70 mt-0.5">
                                    Vehicle: <strong className="text-slate-800 dark:text-white">{order.deliveryPartnerVehicle || 'Hero Electric Optima - MH 02 CW 9921'}</strong>
                                  </p>
                                  <p className="text-[11px] text-slate-500 dark:text-white/60">
                                    Direct Rider Contact: <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{order.deliveryPartnerPhone || '+91 98201 55432'}</span>
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          {order.driverRequestStatus === 'accepted' && (
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                              {/* Call Driver directly */}
                              <a
                                href={`tel:${(order.deliveryPartnerPhone || '+919820155432').replace(/\s+/g, '')}`}
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                                title="Call delivery driver directly"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Call Driver</span>
                              </a>

                              {/* Open GPS Radar */}
                              <button
                                type="button"
                                onClick={() => onTrackOrder && onTrackOrder(orderId)}
                                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 text-white text-xs font-bold cursor-pointer hover:shadow-md hover:shadow-pink-500/25 transition-all flex items-center gap-1.5"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Open Live GPS Radar</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Secret Delivery PIN & ETA Bar */}
                        <div className="pt-2.5 border-t border-purple-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500 dark:text-white/60">Delivery PIN / OTP:</span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-pink-100 dark:bg-pink-500/20 border border-pink-300 dark:border-pink-500/40 text-pink-700 dark:text-pink-300 font-mono font-black tracking-widest text-xs">
                              5821
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-white/40 hidden sm:inline">(Share with driver at doorstep)</span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-white/80">
                            ⏱️ {order.estimatedDeliveryTime || 'Expected today by 6:30 PM (Express)'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Order Items Preview */}
                    <div className="py-4 space-y-3">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 p-2.5 rounded-2xl bg-purple-50/50 dark:bg-white/5">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100'}
                              alt={item.title}
                              className="w-14 h-14 rounded-xl object-cover border border-purple-200 dark:border-white/10 shrink-0"
                            />
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-white/60">
                                Size: <span className="font-semibold text-pink-500">{item.size || 'M'}</span> • Color: {item.color || 'Standard'} • Qty: {item.qty || 1}
                              </p>
                              <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                                ₹{item.price?.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {isDelivered && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProductForReview(item);
                                setSelectedOrderIdForReview(orderId);
                                setReviewModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-purple-200 dark:border-white/20 text-xs font-bold text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-500/20 cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              <Star className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                              <span className="hidden sm:inline">Write Review</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Order Delivery Destination */}
                    <div className="pt-3 border-t border-purple-100 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-white/70">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                        <span>
                          Delivering to: <strong className="text-slate-900 dark:text-white">{order.shippingAddress?.fullName}</strong>, {order.shippingAddress?.street}, {order.shippingAddress?.city} ({order.shippingAddress?.postalCode})
                        </span>
                      </div>

                      {/* Dedicated Comprehensive Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 w-full pt-2">
                        {/* Status Notices */}
                        {isCancelled && (
                          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                            <Ban className="w-4 h-4 shrink-0" />
                            <span>This order was cancelled. Refund of ₹{order.totalAmount} will be refunded within 24-48 hours.</span>
                          </div>
                        )}

                        {isReturnRequested && (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
                            <RotateCcw className="w-4 h-4 shrink-0 animate-spin" />
                            <span>Return pickup requested. Rider {order.deliveryPartnerName || 'Vikram Malhotra'} will arrive at your doorstep for pickup.</span>
                          </div>
                        )}

                        {isExchangeRequested && (
                          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
                            <span>Exchange requested (Size: {order.exchangeDesiredSize || 'L'}, Color: {order.exchangeDesiredColor || 'Standard'}). Rider will swap item at doorstep.</span>
                          </div>
                        )}

                        {/* Interactive Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => setInvoiceOrder(order)}
                            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-white/10 border border-purple-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 cursor-pointer transition-all"
                            title="Download Tax Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-purple-500" />
                            <span>Invoice</span>
                          </button>

                          {canReturnOrExchange && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrderForReturn(order);
                                  setReturnModalOpen(true);
                                }}
                                className="px-3.5 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/40 text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-pink-500" />
                                <span>Doorstep Return</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrderForExchange(order);
                                  setExchangeModalOpen(true);
                                }}
                                className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-purple-500" />
                                <span>Exchange Size</span>
                              </button>

                              {/* Quick Test Helper for Demo */}
                              {updateDeliveryStatus && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateDeliveryStatus(orderId, 'Out for Delivery');
                                    showNotice(`Order #${orderId} reset to In-Transit (Out for Delivery) to test Cancel!`);
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[10px] font-semibold text-slate-500 dark:text-white/60 border border-dashed border-slate-300 dark:border-white/20 cursor-pointer"
                                  title="Click to reset order status to test Cancel order"
                                >
                                  ⚡ Test: Reset to In-Transit
                                </button>
                              )}
                            </>
                          )}

                          {canCancel && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrderForCancel(order);
                                  setCancelModalOpen(true);
                                }}
                                className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                              >
                                <Ban className="w-3.5 h-3.5 text-red-500" />
                                <span>Cancel Order</span>
                              </button>

                              {/* Quick Test Helper for Demo */}
                              {updateDeliveryStatus && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateDeliveryStatus(orderId, 'Delivered');
                                    showNotice(`Order #${orderId} marked as Delivered to test Return & Exchange!`);
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border border-dashed border-emerald-300 dark:border-emerald-500/30 cursor-pointer"
                                  title="Click to mark delivered and test Return & Exchange"
                                >
                                  ⚡ Test: Mark Delivered
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: DELIVERY ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Saved Delivery Addresses</h3>
            <button
              type="button"
              onClick={() => showNotice('New address dialog opened')}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-brand-600 to-pink-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-pink-500 shadow-xl relative">
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 text-[10px] font-black uppercase">
                Default Address
              </span>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-pink-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Home / Primary Residence</h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed">
                <strong>{customerUser.name}</strong><br />
                {customerUser.address?.street || '42 MG Road, Indiranagar'}<br />
                {customerUser.address?.city || 'Bengaluru'}, {customerUser.address?.state || 'Karnataka'} - {customerUser.address?.postalCode || '560038'}<br />
                Phone: {customerUser.phone || '+91 91234 56789'}
              </p>
              <div className="mt-4 pt-3 border-t border-purple-100 dark:border-white/10 flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => showNotice('Edit address modal')}
                  className="font-bold text-pink-600 dark:text-pink-400 hover:underline"
                >
                  Edit Address
                </button>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0B14] border border-purple-200 dark:border-white/10 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Office / Studio Workspace</h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed">
                <strong>{customerUser.name} (Tech Hub)</strong><br />
                Tower B, Level 6, Prestige Cyber Towers<br />
                Electronic City, Bengaluru - 560100<br />
                Phone: {customerUser.phone || '+91 91234 56789'}
              </p>
              <div className="mt-4 pt-3 border-t border-purple-100 dark:border-white/10 flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => showNotice('Set as default')}
                  className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Set as Default
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: VIBE WALLET & PAYMENTS */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-purple-700 via-brand-600 to-pink-600 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">Vibe Credits Balance</span>
                <Wallet className="w-6 h-6 text-pink-200" />
              </div>
              <p className="text-3xl font-black font-display">₹1,850.00</p>
              <p className="text-[11px] text-white/70 mt-1">Usable instantly on all checkout orders</p>
              <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
                <span>Vibe Card •••• 9821</span>
                <span className="font-bold text-pink-200">Active</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0B14] border border-purple-200 dark:border-white/10 shadow-xl col-span-2 space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-pink-500" />
                <span>Saved Payment Options</span>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-500/20 font-bold flex items-center justify-center text-xs">
                      UPI
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">john@okhdfcbank</p>
                      <p className="text-[10px] text-slate-500">Google Pay / Instant UPI Autopay</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 font-bold">
                    Primary
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-500/20 font-bold flex items-center justify-center text-xs">
                      COD
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-slate-500">Pay cash or scan QR when delivery agent arrives</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 font-bold">
                    Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PROFILE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white dark:bg-[#0B0B14] p-6 rounded-3xl border border-purple-200 dark:border-white/10 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Account Information</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-white/80 block mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-purple-50/50 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-white/80 block mb-1">Registered Email</label>
              <input
                type="email"
                value={customerUser.email}
                disabled
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-white/40 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-white/80 block mb-1">Mobile Phone</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-purple-50/50 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-pink-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-pink-600 text-white font-bold text-xs shadow-md shadow-pink-500/20 cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}



      {/* DOORSTEP RETURN MODAL */}
      {returnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0E0E18] border-2 border-purple-200 dark:border-pink-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-pink-500" />
                <span>Doorstep Return Request</span>
              </h3>
              <button
                type="button"
                onClick={() => setReturnModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-white/70">
              Our express delivery agent will arrive at your address within 24 hours to inspect and pick up the item.
              Full refund of <strong>₹{selectedOrderForReturn.totalAmount}</strong> will be refunded to your original payment mode or Vibe Wallet upon pickup!
            </p>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-white block mb-1">Reason for Return</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Size doesn't fit properly">Size doesn't fit properly</option>
                <option value="Item defective or quality issue">Item defective or quality issue</option>
                <option value="Color or style different than image">Color or style different than image</option>
                <option value="Delivered too late">Delivered too late</option>
                <option value="Changed my mind">Changed my mind</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-white block mb-1">Additional Notes</label>
              <textarea
                value={returnComment}
                onChange={(e) => setReturnComment(e.target.value)}
                placeholder="Mention any specific instructions for rider..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-2xl bg-purple-50 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReturnModalOpen(false)}
                className="flex-1 py-2.5 rounded-2xl border border-purple-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-white/70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturnSubmit}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-pink-600 text-white text-xs font-bold shadow-md shadow-pink-500/20"
              >
                Confirm Pickup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIZE / COLOR EXCHANGE MODAL */}
      {exchangeModalOpen && selectedOrderForExchange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0E0E18] border-2 border-purple-200 dark:border-purple-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-500" />
                <span>Instant Doorstep Exchange</span>
              </h3>
              <button
                type="button"
                onClick={() => setExchangeModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-white/70">
              Select your replacement size and color. Our rider will bring the new item and swap it on the spot at your doorstep with zero fees!
            </p>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-white block mb-2">
                Choose Replacement Size: <span className="font-extrabold text-pink-600 dark:text-pink-400 font-mono ml-1">{exchangeDesiredSize}</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setExchangeDesiredSize(sz)}
                    className={`min-w-[42px] h-9 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      exchangeDesiredSize === sz
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-500/25 scale-105'
                        : 'bg-purple-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:bg-purple-100 dark:hover:bg-white/10 border border-purple-200 dark:border-white/10'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-white block mb-2">
                Choose Replacement Color: <span className="font-extrabold text-purple-600 dark:text-purple-400 ml-1">{exchangeDesiredColor}</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {['Obsidian Black', 'Acid Lavender', 'Cyber Neon', 'Arctic White'].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setExchangeDesiredColor(col)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      exchangeDesiredColor === col
                        ? 'border-purple-500 bg-purple-500/20 text-purple-700 dark:text-purple-300 font-black'
                        : 'border-purple-200 dark:border-white/10 bg-purple-50/50 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setExchangeModalOpen(false)}
                className="flex-1 py-2.5 rounded-2xl border border-purple-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-white/70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExchangeSubmit}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-md shadow-purple-500/20"
              >
                Schedule Swap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL ORDER MODAL */}
      {cancelModalOpen && selectedOrderForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0E0E18] border-2 border-red-500/40 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Cancel Order #{selectedOrderForCancel.id || selectedOrderForCancel._id}?</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-white/70">
              Are you sure you want to cancel this order? This action cannot be reversed.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-2xl border border-purple-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-white/70"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelSubmit}
                className="flex-1 py-2.5 rounded-2xl bg-red-600 text-white text-xs font-bold shadow-md shadow-red-500/20"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0B0B14] border border-purple-200 dark:border-white/20 p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-white/10">
              <div>
                <h3 className="text-base font-black font-display">VibeWear Fashion Tax Invoice</h3>
                <p className="text-[10px] text-slate-500">GSTIN: 27AABCV1234F1Z5 • Invoice #{invoiceOrder.id || invoiceOrder._id}</p>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p><strong>Customer:</strong> {invoiceOrder.shippingAddress?.fullName || customerUser.name}</p>
              <p><strong>Address:</strong> {invoiceOrder.shippingAddress?.street}, {invoiceOrder.shippingAddress?.city}</p>
              <p><strong>Payment Status:</strong> {invoiceOrder.paymentStatus || 'Completed'}</p>
            </div>

            <div className="py-2 border-y border-purple-100 dark:border-white/10 text-xs space-y-2">
              {(invoiceOrder.items || []).map((it, i) => (
                <div key={i} className="flex justify-between">
                  <span>{it.title} (x{it.qty || 1})</span>
                  <span className="font-bold">₹{it.price?.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-sm pt-2 border-t border-purple-100 dark:border-white/10 text-pink-500">
                <span>Grand Total</span>
                <span>₹{invoiceOrder.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.print();
              }}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-pink-600 text-white font-bold text-xs"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModalOpen && selectedProductForReview && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          product={selectedProductForReview}
          orderId={selectedOrderIdForReview}
          onReviewSubmitted={() => {
            showNotice('Thank you! Your verified product review has been published.');
          }}
        />
      )}
    </div>
  );
};

export default CustomerDashboardPage;
