import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Calendar,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Navigation,
  Check,
  BadgeCheck,
  Bike,
  PhoneCall,
  PhoneOff,
  Volume2,
  MessageSquare,
  MessageCircle,
  Copy,
  X,
  Smartphone,
  Send,
  BellRing
} from 'lucide-react';
import CallDeliveryHeroModal from '../components/delivery/CallDeliveryHeroModal';
import DeliveryLiveChatModal from '../components/delivery/DeliveryLiveChatModal';
import EmailComposerModal from '../components/common/EmailComposerModal';
import { playNotificationChime } from '../utils/deliveryAudioUtils';

const OrderTrackingPage = ({
  orderId = null,
  onNavigateBack,
  onNavigateProducts
}) => {
  const { userOrders, updateDeliveryStatus, triggerDriverDeparture } = useAuth();

  // Selected order state: default to given orderId or first available order
  const [selectedOrderId, setSelectedOrderId] = useState(() => {
    if (orderId) return orderId;
    if (userOrders && userOrders.length > 0) return userOrders[0].id || userOrders[0]._id;
    return null;
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copyNotice, setCopyNotice] = useState('');

  // Modals
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);

  const currentOrder =
    userOrders.find((o) => o.id === selectedOrderId || o._id === selectedOrderId) ||
    userOrders[0] ||
    null;

  // Sound chime when an order is Out for Delivery
  useEffect(() => {
    if (currentOrder?.orderStatus === 'Out for Delivery' && !hasNotified) {
      playNotificationChime();
      setHasNotified(true);
    }
  }, [currentOrder?.orderStatus, hasNotified]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    setCopyNotice(`Copied ${label}!`);
    setTimeout(() => setCopyNotice(''), 2000);
  };

  // Trigger call delivery hero (works seamlessly on desktop + mobile)
  const handleStartCall = () => {
    if (typeof window !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      try {
        const cleanPhone = (currentOrder?.deliveryPartnerPhone || '+91 98201 55432').replace(/\s+/g, '');
        window.open(`tel:${cleanPhone}`, '_self');
      } catch (e) {
        // Ignore
      }
    }
    setCallModalOpen(true);
  };

  if (!currentOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-pink-100 dark:bg-pink-950/40 border border-pink-300 dark:border-pink-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
          No Orders Placed Yet
        </h2>
        <p className="text-xs text-slate-500 dark:text-white/60 mt-1 mb-6">
          When you place an order, live tracking details and delivery partner contact information will appear here automatically.
        </p>
        <button
          onClick={onNavigateProducts}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-pink-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 cursor-pointer"
        >
          Explore Fashion Catalog
        </button>
      </div>
    );
  }

  // Determine current timeline progress index
  const statusOrder = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = statusOrder.indexOf(currentOrder.orderStatus);
  const isOutForDelivery = currentOrder.orderStatus === 'Out for Delivery';
  const isDelivered = currentOrder.orderStatus === 'Delivered';

  // Delivery partner details fallback
  const deliveryPartner = {
    name: currentOrder.deliveryPartnerName || 'Vikram Malhotra',
    phone: currentOrder.deliveryPartnerPhone || '+91 98201 55432',
    email: currentOrder.deliveryPartnerEmail || 'delivery@vibewear.com',
    vehicle: currentOrder.deliveryPartnerVehicle || 'Hero Electric Optima - MH 02 CW 9921',
    rating: '4.9 ★',
    deliveriesCount: '1,420+ Deliveries'
  };

  const cleanPhone = deliveryPartner.phone.replace(/\s+/g, '');
  const whatsAppUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
    `Hello ${deliveryPartner.name}, I am inquiring about my VibeWear delivery for Order #${currentOrder.id || currentOrder._id}.`
  )}`;

  const timelineSteps = currentOrder.trackingTimeline || [
    {
      step: 1,
      status: 'Confirmed',
      title: 'Order Confirmed & Placed',
      location: 'VibeWear Digital Fashion Hub, Mumbai',
      timestamp: currentOrder.createdAt,
      completed: true,
      description: 'Your payment was verified and order dispatch instructions were generated.'
    },
    {
      step: 2,
      status: 'Processing',
      title: 'Quality Inspected & Packed',
      location: 'Central Fulfilment Center, Warehouse 4',
      timestamp: new Date(new Date(currentOrder.createdAt).getTime() + 15 * 60 * 1000).toISOString(),
      completed: currentStatusIndex >= 1,
      description: 'Items passed multi-point quality check and packed in sustainable packaging.'
    },
    {
      step: 3,
      status: 'Shipped',
      title: 'Dispatched to Delivery Partner',
      location: 'Local Sorting & Logistics Terminal',
      timestamp: currentStatusIndex >= 2 ? new Date(new Date(currentOrder.createdAt).getTime() + 45 * 60 * 1000).toISOString() : null,
      completed: currentStatusIndex >= 2,
      description: `Package handed over to rider ${deliveryPartner.name} (${deliveryPartner.vehicle}).`
    },
    {
      step: 4,
      status: 'Out for Delivery',
      title: 'Out for Delivery',
      location: currentOrder.shippingAddress?.city || 'Local Sector Route',
      timestamp: currentStatusIndex >= 3 ? new Date(new Date(currentOrder.createdAt).getTime() + 2 * 3600 * 1000).toISOString() : null,
      completed: currentStatusIndex >= 3,
      description: `Delivery partner ${deliveryPartner.name} is on the way to your shipping address.`
    },
    {
      step: 5,
      status: 'Delivered',
      title: 'Delivered Successfully',
      location: currentOrder.shippingAddress?.city || 'Customer Shipping Address',
      timestamp: currentOrder.deliveredAt || (currentStatusIndex >= 4 ? new Date().toISOString() : null),
      completed: currentStatusIndex >= 4,
      description: 'Package delivered safely to customer with delivery confirmation.'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in text-slate-900 dark:text-white">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-purple-200/80 dark:border-white/10">
        <button
          type="button"
          onClick={onNavigateBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 dark:text-white/70 dark:hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600 dark:text-pink-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Store / Orders</span>
        </button>

        <div className="flex items-center gap-3">
          {copyNotice && (
            <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 animate-fade-in">
              {copyNotice}
            </span>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-white dark:bg-white/5 border border-purple-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:text-pink-600 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs"
            title="Refresh Order Live Status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-pink-500' : ''}`} />
            <span className="hidden sm:inline">Refresh Status</span>
          </button>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Satellite Tracking</span>
          </span>
        </div>
      </div>

      {/* SPECIAL NOTICE: "jab product out of delivery ho toh message aana chahiye" */}
      {isOutForDelivery && (
        <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-pink-500/15 via-purple-600/15 to-brand-600/15 border-2 border-pink-500/50 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-brand-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/30 animate-bounce">
                  <BellRing className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-600 text-white shadow-xs">
                      Live Dispatch Update
                    </span>
                    <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
                      Rider En Route (~1.5 km away)
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-display text-slate-900 dark:text-white">
                    🚨 Your VibeWear Package is OUT FOR DELIVERY!
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-white/80 max-w-2xl">
                    Delivery Hero <strong>{deliveryPartner.name}</strong> ({deliveryPartner.vehicle}) has left the local hub and is heading to your doorstep. Please keep your phone reachable.
                    {currentOrder.paymentMethod === 'COD' && (
                      <span className="font-bold text-amber-700 dark:text-amber-300 block mt-0.5">
                        💵 Cash on Delivery: Please keep exact cash of ₹{currentOrder.totalAmount} ready.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Quick Actions directly on the alert banner */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleStartCall}
                  className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Phone className="w-4 h-4 animate-pulse" />
                  <span>Call Delivery Hero</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChatModalOpen(true)}
                  className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message Hero</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSmsModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-white/20 border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="View Official SMS Dispatch Notice"
                >
                  <Smartphone className="w-4 h-4 text-pink-500" />
                  <span>SMS Notice</span>
                </button>
              </div>
            </div>

            {/* In-banner Message Preview Bubble from Delivery Hero */}
            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-black/50 border border-purple-200/80 dark:border-white/10 text-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-pink-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                {deliveryPartner.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Message from {deliveryPartner.name} (Delivery Hero):</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold">Just now</span>
                </div>
                <p className="text-slate-700 dark:text-white/80 italic">
                  "Namaste! Main Vikram bol raha hoon VibeWear express delivery se. Main aapke delivery address ke paas hoon. Please keep your delivery PIN <strong className="font-bold text-pink-600 dark:text-pink-400 not-italic">5821</strong> ready!"
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChatModalOpen(true)}
                    className="text-[11px] font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Click to reply or chat live with Vikram &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Driver Departure Trigger (When order is ready at hub) */}
      {!isOutForDelivery && !isDelivered && (
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0C0C16] border-2 border-purple-200 dark:border-white/10 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 text-pink-500 flex items-center justify-center shrink-0 border border-pink-500/30">
              <Bike className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  Ready At Bandra Logistics Hub
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-white/60">
                  Assigned Driver: {deliveryPartner.name}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                Package Inspected & Ready for Delivery Handover
              </h4>
              <p className="text-xs text-slate-600 dark:text-white/70">
                Click below to start driver departure. The live dispatch alert and driver message will be triggered immediately.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => triggerDriverDeparture(currentOrder.id || currentOrder._id)}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-brand-600 hover:from-pink-500 hover:to-brand-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 border border-pink-400/50"
          >
            <Send className="w-4 h-4" />
            <span>🛵 Driver Nikale (Start Delivery)</span>
          </button>
        </div>
      )}
      {userOrders.length > 1 && (
        <div className="mb-6 overflow-x-auto pb-2 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-white/50 shrink-0">Your Orders:</span>
          {userOrders.map((ord) => {
            const isSelected = (ord.id || ord._id) === selectedOrderId;
            return (
              <button
                key={ord.id || ord._id}
                onClick={() => setSelectedOrderId(ord.id || ord._id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                    : 'bg-white dark:bg-white/5 border border-purple-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-pink-500/40'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>{ord.id || ord._id}</span>
                <span className="text-[10px] opacity-80">({ord.orderStatus || 'Confirmed'})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Grid: Left Timeline & Tracking; Right Delivery Agent & Customer Address */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Order Status Banner & Interactive Visual Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Hero Status Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B14] border border-purple-200 dark:border-brand-500/30 p-6 sm:p-7 shadow-xl">
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-pink-500/10 dark:bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-100 dark:border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400 block mb-0.5">
                  Shipment Tracking ID
                </span>
                <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{currentOrder.id || currentOrder._id}</span>
                  <button
                    onClick={() => handleCopy(currentOrder.id || currentOrder._id, 'Order ID')}
                    className="text-slate-400 hover:text-pink-600 text-xs font-mono font-normal transition-colors cursor-pointer"
                    title="Copy Order ID"
                  >
                    [Copy]
                  </button>
                </h1>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-white/50 block font-semibold">
                  Estimated Delivery:
                </span>
                <span className="text-xs sm:text-sm font-black text-pink-600 dark:text-pink-400">
                  {currentOrder.estimatedDeliveryTime || 'Today by 7:30 PM'}
                </span>
              </div>
            </div>

            {/* Current Status Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/20 animate-pulse-subtle">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-white/60 font-semibold">Current Shipment State</p>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{currentOrder.orderStatus || 'Confirmed'}</span>
                    {isDelivered ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        Completed
                      </span>
                    ) : isOutForDelivery ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 animate-pulse">
                        Rider On The Road
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-brand-500/20 text-purple-700 dark:text-brand-300 border border-purple-200 dark:border-brand-500/30">
                        In Progress
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-white/70 space-y-0.5 text-right sm:text-left">
                <p>Payment Mode: <strong className="font-bold text-slate-900 dark:text-white">{currentOrder.paymentMethod}</strong> ({currentOrder.paymentStatus})</p>
                <p>Order Amount: <strong className="font-bold text-pink-600 dark:text-pink-400">₹{currentOrder.totalAmount}</strong></p>
              </div>
            </div>

            {/* Live Rider Note if any */}
            {currentOrder.deliveryNotes && (
              <div className="mt-4 p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 text-xs text-slate-800 dark:text-purple-200 flex items-start gap-2.5">
                <Bike className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Delivery Rider Note:</span>
                  <span>{currentOrder.deliveryNotes}</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Step-by-Step Delivery Progress Tracker */}
          <div className="bg-white dark:bg-[#0B0B14] rounded-3xl border border-purple-200 dark:border-brand-500/30 p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-white/10">
              <h2 className="text-sm sm:text-base font-bold font-display uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span>Live Route & Timeline Journey</span>
              </h2>
              <span className="text-[11px] font-bold text-slate-500 dark:text-white/50">
                5-Stage Express Logistics
              </span>
            </div>

            {/* Vertical Animated Timeline */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-brand-600 before:via-pink-500 before:to-slate-200 dark:before:to-white/10">
              {timelineSteps.map((step, idx) => {
                const isCurrent = currentOrder.orderStatus === step.status;
                const isDone = step.completed || idx <= currentStatusIndex;

                return (
                  <div key={idx} className="relative group">
                    {/* Step Icon / Dot */}
                    <div
                      className={`absolute -left-[30px] top-0 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all shadow-md ${
                        isCurrent
                          ? 'bg-gradient-to-tr from-brand-600 to-pink-600 text-white ring-4 ring-pink-500/30 scale-110 animate-pulse'
                          : isDone
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-white/40'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>

                    {/* Step Content Card */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4
                          className={`text-sm font-bold transition-colors ${
                            isCurrent
                              ? 'text-pink-600 dark:text-pink-400 font-extrabold'
                              : isDone
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-400 dark:text-white/40'
                          }`}
                        >
                          {step.title}
                        </h4>

                        {step.timestamp && (
                          <span className="text-[11px] font-mono text-slate-500 dark:text-white/50 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-pink-500" />
                            {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                            {new Date(step.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-white/70">
                        {step.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-white/50 pt-0.5">
                        <MapPin className="w-3 h-3 text-pink-500 shrink-0" />
                        <span>{step.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Delivery Partner Details & Customer Shipping Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* DELIVERY PARTNER CARD */}
          <div className="bg-white dark:bg-[#0B0B14] rounded-3xl border-2 border-purple-300 dark:border-brand-500/40 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-brand-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-2xl shadow-sm">
              Assigned Delivery Partner
            </div>

            <div className="flex items-start gap-4 mb-5 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-pink-600 to-purple-600 p-0.5 shadow-xl shadow-pink-500/20 shrink-0">
                <div className="w-full h-full bg-white dark:bg-[#0B0B14] rounded-2xl flex items-center justify-center text-xl font-black text-slate-900 dark:text-white font-display">
                  {deliveryPartner.name[0]}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-black font-display text-slate-900 dark:text-white">
                    {deliveryPartner.name}
                  </h3>
                  <BadgeCheck className="w-4 h-4 text-pink-500 fill-pink-500/20" />
                </div>
                <p className="text-xs text-slate-500 dark:text-white/60">
                  VibeWear Express Certified Rider
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-bold">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    {deliveryPartner.rating}
                  </span>
                  <span className="text-slate-400 dark:text-white/40">• {deliveryPartner.deliveriesCount}</span>
                </div>
              </div>
            </div>

            {/* Delivery Partner Contact & Details Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/50 border border-purple-200 dark:border-white/10 space-y-3 text-xs mb-5">
              {/* Phone */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-white/60 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-pink-500" />
                  Rider Contact:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {deliveryPartner.phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(deliveryPartner.phone, 'Rider Phone')}
                    className="text-slate-400 hover:text-pink-600 p-1 cursor-pointer"
                    title="Copy Phone Number"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-white/60 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-pink-500" />
                  Official Email:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
                  {deliveryPartner.email}
                </span>
              </div>

              {/* Vehicle */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-white/60 flex items-center gap-2">
                  <Bike className="w-3.5 h-3.5 text-pink-500" />
                  Vehicle Reg:
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                  {deliveryPartner.vehicle}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS: "Call Delivery Hero" & "Message Hero" */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleStartCall}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-white animate-pulse" />
                <span>Call Delivery Hero ({deliveryPartner.name.split(' ')[0]})</span>
              </button>

              <button
                type="button"
                onClick={() => setChatModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message / Chat with Hero</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setEmailModalOpen(true)}
                  className="py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-white/10 border border-purple-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5 text-pink-500" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>
          </div>

          {/* CUSTOMER DELIVERY ADDRESS & PACKAGE SUMMARY */}
          <div className="bg-white dark:bg-[#0B0B14] rounded-3xl border border-purple-200 dark:border-brand-500/30 p-6 shadow-xl space-y-4 text-xs">
            <h3 className="font-bold font-display uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-purple-100 dark:border-white/10">
              <MapPin className="w-4 h-4 text-pink-500" />
              <span>Delivering To Your Address</span>
            </h3>

            <div className="space-y-1">
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                {currentOrder.shippingAddress?.fullName || 'Customer'}
              </p>
              <p className="text-slate-600 dark:text-white/70">
                {currentOrder.shippingAddress?.street}
              </p>
              <p className="text-slate-600 dark:text-white/70">
                {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} - {currentOrder.shippingAddress?.postalCode}
              </p>
              <p className="text-slate-600 dark:text-white/70 font-semibold pt-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-pink-500" />
                Phone: {currentOrder.shippingAddress?.phone}
              </p>
            </div>

            {/* Order Items Preview */}
            <div className="pt-3 border-t border-purple-100 dark:border-white/10 space-y-2.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-white/50 block">
                Items In This Package ({currentOrder.items?.length || 1})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {currentOrder.items?.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-purple-100 dark:border-white/5">
                    <img
                      src={it.image || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=200'}
                      alt={it.title}
                      className="w-12 h-14 object-cover rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate text-xs">{it.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-white/60">
                        Size: <strong className="text-slate-800 dark:text-white">{it.size || 'M'}</strong> • Qty: {it.qty || 1}
                      </p>
                      <p className="text-pink-600 dark:text-pink-400 font-bold text-xs mt-0.5">₹{it.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. INTERACTIVE "CALL DELIVERY HERO" MODAL                                 */}
      {/* ========================================================================= */}
      <CallDeliveryHeroModal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        deliveryPartner={deliveryPartner}
        orderId={currentOrder.id || currentOrder._id}
        customerName={currentOrder.shippingAddress?.fullName || 'Customer'}
        deliveryPin="5821"
      />

      {/* ========================================================================= */}
      {/* 2. REAL-TIME LIVE CHAT / MESSAGE DRAWER WITH DELIVERY HERO                */}
      {/* ========================================================================= */}
      <DeliveryLiveChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        onStartCall={handleStartCall}
        deliveryPartner={deliveryPartner}
        orderId={currentOrder.id || currentOrder._id}
        customerName={currentOrder.shippingAddress?.fullName || 'Customer'}
        deliveryPin="5821"
        totalAmount={currentOrder.totalAmount || 2499}
        isCod={currentOrder.paymentMethod === 'COD'}
      />

      {/* ========================================================================= */}
      {/* 2. OFFICIAL SMS DISPATCH NOTICE MODAL                                     */}
      {/* ========================================================================= */}
      {smsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0E0E18] border-2 border-purple-200 dark:border-brand-500/40 shadow-2xl text-slate-900 dark:text-white animate-slide-up p-6">
            <button
              onClick={() => setSmsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-purple-100 dark:border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-pink-600 text-white flex items-center justify-center shadow-md">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Official SMS Dispatch Notification
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-white/60 font-mono">
                  Sender: VM-VIBEWR • Verified Gateway
                </p>
              </div>
            </div>

            {/* Simulated Phone SMS Bubble */}
            <div className="my-5 p-4 rounded-2xl bg-slate-100 dark:bg-black/60 border border-purple-200/80 dark:border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-white/50 font-semibold">
                <span>VibeWear Logistics SMS</span>
                <span>Just now</span>
              </div>
              <p className="text-slate-800 dark:text-white/90 leading-relaxed">
                Dear <strong>{currentOrder.shippingAddress?.fullName || 'Customer'}</strong>, your VibeWear Fashion Order <strong>#{currentOrder.id || currentOrder._id}</strong> is <strong>OUT FOR DELIVERY</strong> today!
              </p>
              <p className="text-slate-800 dark:text-white/90 leading-relaxed">
                Your designated delivery executive is <strong>{deliveryPartner.name}</strong> (Ph: <strong className="text-pink-600 dark:text-pink-400">{deliveryPartner.phone}</strong>, Vehicle: {deliveryPartner.vehicle}).
              </p>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 text-[11px]">
                <span className="font-bold text-pink-600 dark:text-pink-400">Security Delivery PIN / OTP: </span>
                <span className="font-mono font-black text-sm text-slate-900 dark:text-white">5821</span>
                <p className="text-[10px] text-slate-500 dark:text-white/50 mt-0.5">Share this PIN with Vikram upon receiving your parcel.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleStartCall}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Delivery Hero</span>
              </button>

              <button
                type="button"
                onClick={() => setSmsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Official Email Composer Modal */}
      {currentOrder && (
        <EmailComposerModal
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          recipientEmail={deliveryPartner.email || 'delivery@vibewear.com'}
          recipientName={`Delivery Hero ${deliveryPartner.name || 'Vikram'}`}
          defaultSubject={`Inquiry regarding VibeWear Order #${currentOrder.id || currentOrder._id}`}
          orderId={currentOrder.id || currentOrder._id}
        />
      )}
    </div>
  );
};

export default OrderTrackingPage;
