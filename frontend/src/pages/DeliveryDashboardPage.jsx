import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { playNotificationChime, startPhoneRingtone } from '../utils/deliveryAudioUtils';
import {
  Truck,
  Package,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Search,
  Check,
  AlertCircle,
  Clock,
  Bike,
  Banknote,
  Send,
  LogOut,
  Sparkles,
  RefreshCw,
  Copy,
  PhoneCall,
  PhoneOff,
  Volume2,
  MessageCircle,
  X,
  BellRing,
  Eye,
  Tag,
  Layers,
  FileCheck2,
  RotateCcw
} from 'lucide-react';

const DeliveryDashboardPage = ({ onNavigateHome, onNavigateCustomer, onNavigateAdmin }) => {
  const {
    user,
    userOrders,
    updateDeliveryStatus,
    acceptDeliveryOrder,
    rejectDeliveryOrder,
    completeReturnPickup,
    logout
  } = useAuth();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'assigned' | 'active' | 'returns' | 'delivered'
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [riderNotesMap, setRiderNotesMap] = useState({});
  const [actionSuccessNotice, setActionSuccessNotice] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Driver Decline / Reject Delivery Request Modal State
  const [rejectModalOrder, setRejectModalOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('Out of delivery area');
  const [customRejectNote, setCustomRejectNote] = useState('');

  // Driver Delivery Handover Confirmation Modal State
  const [confirmDeliveryOrder, setConfirmDeliveryOrder] = useState(null);
  const [deliveryPinInput, setDeliveryPinInput] = useState('5821');
  const [pinVerified, setPinVerified] = useState(true);
  const [deliveryReceiverType, setDeliveryReceiverType] = useState('Customer in Person');
  const [cashCollectedConfirmed, setCashCollectedConfirmed] = useState(false);
  const [deliveryHandoverNote, setDeliveryHandoverNote] = useState('Handed over safely to customer. Package inspected and verified.');
  const [proofOfDeliveryOrder, setProofOfDeliveryOrder] = useState(null);

  // Driver Return Pickup & Refund Handover Modal State
  const [confirmReturnOrder, setConfirmReturnOrder] = useState(null);
  const [returnInspected, setReturnInspected] = useState(true);
  const [refundCashHanded, setRefundCashHanded] = useState(true);
  const [returnPickupNote, setReturnPickupNote] = useState('Package inspected at doorstep. Tags intact. Refund processed successfully.');

  // Driver Exchange Handover Modal State
  const [confirmExchangeOrder, setConfirmExchangeOrder] = useState(null);
  const [exchangeNewDelivered, setExchangeNewDelivered] = useState(true);
  const [exchangeOldPicked, setExchangeOldPicked] = useState(true);
  const [exchangeHandoverNote, setExchangeHandoverNote] = useState('Replacement item delivered and original item picked up at doorstep.');

  const openConfirmDeliveryModal = (order) => {
    setConfirmDeliveryOrder(order);
    setDeliveryPinInput('5821');
    setPinVerified(true);
    setDeliveryReceiverType('Customer in Person');
    setCashCollectedConfirmed(order.paymentMethod === 'COD' || order.paymentMethod === 'Cash on Delivery');
    setDeliveryHandoverNote('Handed over safely in person. Customer verified the package.');
  };

  const handleConfirmDeliverySubmit = async () => {
    if (!confirmDeliveryOrder) return;
    const orderId = confirmDeliveryOrder.id || confirmDeliveryOrder._id;
    setUpdatingOrderId(orderId);

    const isCOD = confirmDeliveryOrder.paymentMethod === 'COD' || confirmDeliveryOrder.paymentMethod === 'Cash on Delivery';
    const fullNote = `Handover Verified: Received by ${deliveryReceiverType} • PIN: ${deliveryPinInput || '5821'} • ${
      isCOD ? `Cash of ₹${confirmDeliveryOrder.totalAmount} collected` : 'Prepaid Online'
    }. ${deliveryHandoverNote}`;

    await updateDeliveryStatus(orderId, 'Delivered', fullNote);
    playNotificationChime();
    setUpdatingOrderId(null);
    setConfirmDeliveryOrder(null);
    setActionSuccessNotice(`🎉 Order #${orderId} marked as DELIVERED! Handover recorded.`);
    setTimeout(() => setActionSuccessNotice(''), 5000);
  };

  const handleAcceptOrder = async (orderId) => {
    setUpdatingOrderId(orderId);
    await acceptDeliveryOrder(orderId);
    playNotificationChime();
    setUpdatingOrderId(null);
    setActionSuccessNotice(`🛵 Order #${orderId} accepted! Task added to your active schedule.`);
    setTimeout(() => setActionSuccessNotice(''), 4000);
  };

  const handleRejectOrderSubmit = async () => {
    if (!rejectModalOrder) return;
    const orderId = rejectModalOrder.id || rejectModalOrder._id;
    setUpdatingOrderId(orderId);
    const finalReason = rejectReason === 'Other' ? (customRejectNote || 'Driver unavailable') : rejectReason;
    await rejectDeliveryOrder(orderId, finalReason);
    setUpdatingOrderId(null);
    setRejectModalOrder(null);
    setActionSuccessNotice(`❌ Order #${orderId} declined. Operations team has been notified to reassign.`);
    setTimeout(() => setActionSuccessNotice(''), 5000);
  };

  const handleConfirmReturnSubmit = async () => {
    if (!confirmReturnOrder) return;
    const orderId = confirmReturnOrder.id || confirmReturnOrder._id;
    setUpdatingOrderId(orderId);
    await completeReturnPickup(orderId, {
      refundAmount: confirmReturnOrder.totalAmount,
      notes: returnPickupNote
    });
    playNotificationChime();
    setUpdatingOrderId(null);
    setConfirmReturnOrder(null);
    setActionSuccessNotice(`✅ Return for Order #${orderId} completed! Refund of ₹${confirmReturnOrder.totalAmount} recorded.`);
    setTimeout(() => setActionSuccessNotice(''), 5000);
  };

  const handleConfirmExchangeSubmit = async () => {
    if (!confirmExchangeOrder) return;
    const orderId = confirmExchangeOrder.id || confirmExchangeOrder._id;
    setUpdatingOrderId(orderId);
    await completeReturnPickup(orderId, {
      notes: exchangeHandoverNote
    });
    playNotificationChime();
    setUpdatingOrderId(null);
    setConfirmExchangeOrder(null);
    setActionSuccessNotice(`✅ Exchange for Order #${orderId} completed! Replacement item delivered.`);
    setTimeout(() => setActionSuccessNotice(''), 5000);
  };

  // Driver Product Details Inspection Modal State
  const [viewingPackageOrder, setViewingPackageOrder] = useState(null);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  // Calling customer modal state
  const [callingCustomer, setCallingCustomer] = useState(null);
  const [callState, setCallState] = useState('ringing'); // 'ringing' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState(0);

  const riderName = user?.name || 'Vikram Malhotra';
  const riderPhone = user?.phone || '+91 98201 55432';
  const riderVehicle = user?.vehicleDetails || 'Hero Electric Optima - MH 02 CW 9921';

  // Deliveries filter
  const allDeliveries = userOrders || [];

  const filteredDeliveries = allDeliveries.filter((order) => {
    // Tab filter
    if (activeTab === 'assigned') {
      if (order.orderStatus !== 'Assigned' && order.orderStatus !== 'Return Approved' && order.orderStatus !== 'Exchange Approved') return false;
    } else if (activeTab === 'active') {
      if (order.orderStatus !== 'Out for Delivery' && order.orderStatus !== 'Shipped' && order.orderStatus !== 'Return In Progress' && order.orderStatus !== 'Exchange In Progress') return false;
    } else if (activeTab === 'returns') {
      const returnStatuses = ['Return Approved', 'Return In Progress', 'Returned', 'Exchange Approved', 'Exchange In Progress', 'Exchanged'];
      if (!returnStatuses.includes(order.orderStatus)) return false;
    } else if (activeTab === 'delivered') {
      if (order.orderStatus !== 'Delivered' && order.orderStatus !== 'Returned' && order.orderStatus !== 'Exchanged') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const orderId = (order.id || order._id || '').toLowerCase();
      const customerName = (order.shippingAddress?.fullName || '').toLowerCase();
      const customerPhone = (order.shippingAddress?.phone || '').toLowerCase();
      const city = (order.shippingAddress?.city || '').toLowerCase();
      const street = (order.shippingAddress?.street || '').toLowerCase();

      return (
        orderId.includes(q) ||
        customerName.includes(q) ||
        customerPhone.includes(q) ||
        city.includes(q) ||
        street.includes(q)
      );
    }
    return true;
  });

  // Calculate quick metrics
  const totalAssigned = allDeliveries.length;
  const newAssignedCount = allDeliveries.filter(
    (o) => o.orderStatus === 'Assigned' || o.orderStatus === 'Return Approved' || o.orderStatus === 'Exchange Approved'
  ).length;
  const activeCount = allDeliveries.filter(
    (o) => o.orderStatus === 'Out for Delivery' || o.orderStatus === 'Shipped' || o.orderStatus === 'Return In Progress' || o.orderStatus === 'Exchange In Progress'
  ).length;
  const returnsCount = allDeliveries.filter(
    (o) => ['Return Approved', 'Return In Progress', 'Returned', 'Exchange Approved', 'Exchange In Progress', 'Exchanged'].includes(o.orderStatus)
  ).length;
  const deliveredCount = allDeliveries.filter(
    (o) => o.orderStatus === 'Delivered' || o.orderStatus === 'Returned' || o.orderStatus === 'Exchanged'
  ).length;

  const totalCodPending = allDeliveries
    .filter((o) => (o.paymentMethod === 'COD' || o.paymentMethod === 'Cash on Delivery') && o.orderStatus !== 'Delivered')
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const ringtoneRef = useRef(null);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    const note = riderNotesMap[orderId] || '';
    await updateDeliveryStatus(orderId, newStatus, note);
    setUpdatingOrderId(null);

    if (newStatus === 'Out for Delivery') {
      playNotificationChime();
      setActionSuccessNotice(
        `🚀 Order #${orderId} is now OUT FOR DELIVERY! Customer has received the live dispatch message with your contact details.`
      );
    } else if (newStatus === 'Delivered') {
      setActionSuccessNotice(`✅ Order #${orderId} marked as DELIVERED successfully!`);
    } else {
      setActionSuccessNotice(`Order #${orderId} status updated to ${newStatus}!`);
    }

    setTimeout(() => setActionSuccessNotice(''), 4500);
  };

  const handleCallCustomer = (customerName, customerPhone) => {
    if (typeof window !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      try {
        const clean = (customerPhone || '').replace(/\s+/g, '');
        window.open(`tel:${clean}`, '_self');
      } catch (e) {
        // Ignore
      }
    }
    setCallingCustomer({ name: customerName, phone: customerPhone });
    setCallState('ringing');
    setCallDuration(0);

    ringtoneRef.current = startPhoneRingtone();

    setTimeout(() => {
      if (ringtoneRef.current) {
        ringtoneRef.current();
        ringtoneRef.current = null;
      }
      setCallState('connected');
    }, 2000);
  };

  const handleEndCall = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current();
      ringtoneRef.current = null;
    }
    setCallState('ended');
    setTimeout(() => {
      setCallingCustomer(null);
      setCallState('ringing');
      setCallDuration(0);
    }, 800);
  };

  useEffect(() => {
    let interval;
    if (callingCustomer && callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callingCustomer, callState]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text);
    setActionSuccessNotice(`Copied ${label} to clipboard!`);
    setTimeout(() => setActionSuccessNotice(''), 2500);
  };

  const getDirectionsUrl = (address) => {
    if (!address) return '#';
    const query = encodeURIComponent(
      `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.postalCode || ''}`
    );
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
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

      {/* RIDER PROFILE & COMMAND HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-purple-200 dark:border-brand-500/40 p-6 sm:p-8 shadow-2xl mb-8">
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-brand-600/20 to-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 pb-6 border-b border-purple-100 dark:border-white/10">
          {/* Rider Avatar and Bio */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-brand-600 via-pink-600 to-purple-600 p-1 shadow-xl shadow-brand-600/30 shrink-0">
              <div className="w-full h-full bg-white dark:bg-[#0B0B14] rounded-2xl flex items-center justify-center text-2xl font-black font-display text-slate-900 dark:text-white">
                {riderName[0]}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                  {riderName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Delivery Partner
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-white/70">
                <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                  <Phone className="w-3.5 h-3.5 text-pink-500" />
                  {riderPhone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-pink-500" />
                  {riderVehicle}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30 text-[11px]">
                  4.9 ★ (Top Rated Agent)
                </span>
              </div>
            </div>
          </div>

          {/* Duty Status & Logout Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                isOnDuty
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isOnDuty ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
              <span>{isOnDuty ? '🟢 ACTIVE ON DUTY' : '⚪ OFF DUTY'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-white/10 border border-purple-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onNavigateCustomer}
              className="px-3 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 text-xs font-bold text-pink-700 dark:text-pink-300 transition-all cursor-pointer flex items-center gap-1.5"
              title="Open Customer Account & Orders"
            >
              <Package className="w-3.5 h-3.5 text-pink-500" />
              <span>Customer Portal</span>
            </button>

            <button
              type="button"
              onClick={onNavigateAdmin}
              className="px-3 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-xs font-bold text-purple-700 dark:text-purple-300 transition-all cursor-pointer flex items-center gap-1.5"
              title="Open Admin Operations Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
              <span>Admin Console</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-2xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-500/30 text-pink-600 dark:text-pink-400 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Total Assigned */}
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-black/40 border border-purple-200/80 dark:border-white/10">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">
              Total Assigned Deliveries
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                {totalAssigned}
              </span>
              <Package className="w-5 h-5 text-brand-500" />
            </div>
          </div>

          {/* Out for Delivery */}
          <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-black/40 border border-pink-200/80 dark:border-pink-500/20">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">
              Active En Route
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black font-display text-pink-600 dark:text-pink-400">
                {activeCount}
              </span>
              <Truck className="w-5 h-5 text-pink-500 animate-pulse" />
            </div>
          </div>

          {/* Delivered */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-black/40 border border-emerald-200/80 dark:border-emerald-500/20">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">
              Completed Handover
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400">
                {deliveredCount}
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          {/* COD Cash to Collect */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-black/40 border border-amber-200/80 dark:border-amber-500/20">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">
              Pending Cash to Collect (COD)
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl sm:text-2xl font-black font-display text-amber-600 dark:text-amber-400">
                ₹{totalCodPending}
              </span>
              <Banknote className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#0B0B14] border border-purple-200 dark:border-brand-500/30 overflow-x-auto no-scrollbar shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Tasks ({totalAssigned})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assigned')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'assigned'
                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⚡ New Assigned ({newAssignedCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🚚 Active En Route ({activeCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('returns')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'returns'
                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🔄 Returns & Exchanges ({returnsCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('delivered')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'delivered'
                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ✅ Completed Handover ({deliveredCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, phone, address, ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B0B14] border border-purple-200 dark:border-brand-500/30 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 shadow-xs"
          />
        </div>
      </div>

      {/* DELIVERIES LIST */}
      <div className="space-y-6">
        {filteredDeliveries.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#0B0B14] rounded-3xl border border-purple-200 dark:border-brand-500/30 p-8">
            <Truck className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Delivery Orders Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/60 mt-1">
              {searchQuery ? 'Try clearing your search query.' : 'New customer orders placed in the store will appear here automatically.'}
            </p>
          </div>
        ) : (
          filteredDeliveries.map((order) => {
            const orderId = order.id || order._id;
            const isDelivered = order.orderStatus === 'Delivered';
            const isEnRoute = order.orderStatus === 'Out for Delivery';
            const isCOD = order.paymentMethod === 'COD' || order.paymentMethod === 'Cash on Delivery';

            return (
              <div
                key={orderId}
                className="bg-white dark:bg-[#0B0B14] rounded-3xl border-2 border-purple-200 dark:border-brand-500/30 p-6 sm:p-7 shadow-xl hover:border-pink-500/40 transition-all space-y-6"
              >
                {/* Order Top Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-100 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      Order #{orderId}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-white/50">
                      • {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                        isDelivered
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : isEnRoute
                          ? 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 animate-pulse'
                          : 'bg-purple-100 text-purple-700 dark:bg-brand-500/20 dark:text-brand-300 border border-purple-200 dark:border-brand-500/30'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      {order.orderStatus || 'Confirmed'}
                    </span>

                    {/* Payment Mode Highlight */}
                    {isCOD ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5 text-amber-600" />
                        <span>COLLECT CASH: ₹{order.totalAmount}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/70">
                        Paid Online (₹{order.totalAmount})
                      </span>
                    )}
                  </div>
                </div>

                {/* 2-Column Responsive Body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* CUSTOMER CONTACT & DELIVERY ADDRESS */}
                  <div className="lg:col-span-7 p-5 rounded-2xl bg-purple-50/50 dark:bg-black/50 border border-purple-200 dark:border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-200/60 dark:border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        Customer Delivery Location
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-white/50">
                        Priority Express Drop
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {order.shippingAddress?.fullName || 'Customer Name Not Provided'}
                        </h4>
                      </div>

                      {/* Phone with Interactive Call and Copy */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleCallCustomer(
                              order.shippingAddress?.fullName || 'Customer',
                              order.shippingAddress?.phone || '+91 98200 12345'
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                          <span>Call: {order.shippingAddress?.phone || 'No phone'}</span>
                        </button>

                        {order.shippingAddress?.phone && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(order.shippingAddress.phone, 'Customer Phone')}
                            className="p-2 rounded-xl bg-white dark:bg-white/10 border border-purple-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-pink-600 transition-colors cursor-pointer"
                            title="Copy Phone Number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Full Address */}
                      <div className="pt-2 text-xs text-slate-700 dark:text-white/80 space-y-0.5">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {order.shippingAddress?.street}
                        </p>
                        <p>
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                          <strong className="font-mono">{order.shippingAddress?.postalCode}</strong>
                        </p>
                      </div>

                      {/* Open in Google Maps */}
                      <div className="pt-2">
                        <a
                          href={getDirectionsUrl(order.shippingAddress)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-white/20 border border-purple-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white transition-all shadow-xs cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5 text-pink-500" />
                          <span>Navigate in Google Maps</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: ORDER ITEMS & RIDER ACTION CONTROLS */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Items Preview with Product Details Inspector */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-purple-200/80 dark:border-white/10 space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-purple-100 dark:border-white/10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-white/50 block">
                          Package Contents ({order.items?.length || 1})
                        </span>
                        <button
                          type="button"
                          onClick={() => setViewingPackageOrder(order)}
                          className="text-[10px] font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                          title="View complete specifications and inspection checklist"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Product Specs</span>
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {order.items?.map((it, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedItemDetail({ item: it, order })}
                            className="flex items-center gap-2.5 text-xs p-1.5 rounded-xl hover:bg-purple-100/60 dark:hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-pink-500/30 group"
                            title="Click to view full product specifications & inspection"
                          >
                            <img
                              src={it.image || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=200'}
                              alt="Item"
                              className="w-10 h-12 object-cover rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white truncate text-xs group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                {it.title}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-white/60">
                                Qty: {it.qty || 1} • Size: {it.size || 'M'} • <strong className="text-pink-600 dark:text-pink-400">₹{it.price}</strong>
                              </p>
                            </div>
                            <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              Inspect &rarr;
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rider Status Action Panel */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/60 border border-purple-200/80 dark:border-white/10 space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-white/50 block">
                        Update Delivery Status
                      </span>

                      {/* Delivery note input */}
                      {!isDelivered && (
                        <div>
                          <input
                            type="text"
                            placeholder="Add delivery note (e.g., handed to customer)..."
                            value={riderNotesMap[orderId] || ''}
                            onChange={(e) =>
                              setRiderNotesMap({ ...riderNotesMap, [orderId]: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-black border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
                          />
                        </div>
                      )}

                      {/* State Action Buttons */}
                      <div className="flex flex-col gap-2">
                        {/* 1. New Assignment -> Accept or Decline Order */}
                        {(order.orderStatus === 'Assigned' || order.driverRequestStatus === 'pending_acceptance') && order.driverRequestStatus !== 'accepted' && order.driverRequestStatus !== 'rejected' && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              type="button"
                              disabled={updatingOrderId === orderId}
                              onClick={() => handleAcceptOrder(orderId)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-[1.01]"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Accept Request</span>
                            </button>
                            <button
                              type="button"
                              disabled={updatingOrderId === orderId}
                              onClick={() => setRejectModalOrder(order)}
                              className="py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
                              title="Decline this delivery assignment"
                            >
                              <X className="w-4 h-4" />
                              <span>Decline</span>
                            </button>
                          </div>
                        )}

                        {order.driverRequestStatus === 'rejected' && (
                          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 text-xs text-red-600 dark:text-red-400 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1">
                                <X className="w-3.5 h-3.5 text-red-500" />
                                Request Declined
                              </span>
                              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/40 font-bold">
                                Awaiting Admin Reassign
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-white/60">
                              Reason: {order.driverRejectionReason || 'Driver unavailable'}
                            </p>
                          </div>
                        )}

                        {/* 2. Return Approved -> Accept Return Pickup */}
                        {order.orderStatus === 'Return Approved' && (
                          <button
                            type="button"
                            disabled={updatingOrderId === orderId}
                            onClick={() => handleAcceptOrder(orderId)}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer hover:scale-[1.01]"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Accept Return Pickup Task</span>
                          </button>
                        )}

                        {/* 3. Return In Progress -> Confirm Order Return & Refund */}
                        {order.orderStatus === 'Return In Progress' && (
                          <button
                            type="button"
                            disabled={updatingOrderId === orderId}
                            onClick={() => setConfirmReturnOrder(order)}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer hover:scale-[1.01]"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm Order Return & Issue Refund (₹{order.totalAmount})</span>
                          </button>
                        )}

                        {/* 4. Exchange Approved -> Accept Exchange */}
                        {order.orderStatus === 'Exchange Approved' && (
                          <button
                            type="button"
                            disabled={updatingOrderId === orderId}
                            onClick={() => handleAcceptOrder(orderId)}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer hover:scale-[1.01]"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>
                              Accept Exchange Task (Size {order.exchangeDesiredSize || 'L'}
                              {order.exchangeDesiredColor ? ` • ${order.exchangeDesiredColor}` : ''})
                            </span>
                          </button>
                        )}

                        {/* 5. Exchange In Progress -> Confirm Exchange Handover */}
                        {order.orderStatus === 'Exchange In Progress' && (
                          <button
                            type="button"
                            disabled={updatingOrderId === orderId}
                            onClick={() => setConfirmExchangeOrder(order)}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-emerald-600 hover:from-pink-500 hover:to-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer hover:scale-[1.01]"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              Confirm Exchange Handover (Size {order.exchangeDesiredSize || 'L'}
                              {order.exchangeDesiredColor ? ` • ${order.exchangeDesiredColor}` : ''})
                            </span>
                          </button>
                        )}

                        {/* 6. Standard Delivery Flow: Shipped or Confirmed -> Start Delivery */}
                        {(order.orderStatus === 'Shipped' || order.orderStatus === 'Processing') && (
                          <button
                            type="button"
                            disabled={updatingOrderId === orderId}
                            onClick={() => handleUpdateStatus(orderId, 'Out for Delivery')}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-brand-600 hover:from-pink-500 hover:to-brand-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-pink-600/20 transition-all cursor-pointer"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Start Delivery (Out for Delivery)</span>
                          </button>
                        )}

                        {/* 7. Out for Delivery -> Mark Delivered Trigger */}
                        {isEnRoute && (
                          <button
                            type="button"
                            disabled={updatingOrderId === orderId}
                            onClick={() => openConfirmDeliveryModal(order)}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              {isCOD
                                ? `Order Deliver & Collect Cash ₹${order.totalAmount}`
                                : 'Order Deliver (Confirm Handover)'}
                            </span>
                          </button>
                        )}

                        {/* Completed Status Banners */}
                        {isDelivered && (
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>Package Handed Over & Delivered</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setProofOfDeliveryOrder(order)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer shadow-xs transition-all flex items-center gap-1"
                              title="View Proof of Delivery Certificate"
                            >
                              <FileCheck2 className="w-3 h-3" />
                              <span>POD Receipt</span>
                            </button>
                          </div>
                        )}

                        {order.orderStatus === 'Returned' && (
                          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-purple-500" />
                            <span>Return Package Collected & Refund Issued</span>
                          </div>
                        )}

                        {order.orderStatus === 'Exchanged' && (
                          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-700 dark:text-pink-300 text-xs font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-pink-500" />
                            <span>Exchange Handover Completed Successfully</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RIDER-TO-CUSTOMER CALL MODAL */}
      {callingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-slate-950 border-2 border-emerald-500/40 shadow-2xl text-white animate-slide-up p-6 text-center">
            <button
              onClick={handleEndCall}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-24 h-24 mx-auto my-4 flex items-center justify-center">
              {callState === 'ringing' && (
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40 animate-ping" />
              )}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 via-pink-600 to-emerald-500 p-0.5 shadow-xl relative z-10">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-3xl font-black font-display text-white">
                  {callingCustomer.name[0]}
                </div>
              </div>
            </div>

            <h3 className="text-xl font-black font-display text-white">
              {callingCustomer.name}
            </h3>
            <p className="text-xs text-white/60 font-mono mb-4">
              {callingCustomer.phone}
            </p>

            {callState === 'ringing' && (
              <p className="text-xs font-bold text-amber-400 animate-pulse mb-6 flex items-center justify-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Calling customer...</span>
              </p>
            )}

            {callState === 'connected' && (
              <p className="text-xs font-bold text-emerald-400 mb-6 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Customer Connected ({formatTimer(callDuration)})</span>
              </p>
            )}

            <button
              type="button"
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600 to-rose-600 hover:from-pink-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-600/40 cursor-pointer"
              title="Hang Up"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <p className="text-[10px] text-white/50 mt-2 font-medium">Click to end call</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRIVER PRODUCT & PACKAGE SPECIFICATION INSPECTION MODAL                   */}
      {/* ========================================================================= */}
      {(selectedItemDetail || viewingPackageOrder) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-purple-200 dark:border-brand-500/40 shadow-2xl text-slate-900 dark:text-white animate-slide-up max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-purple-100 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center border border-pink-500/20">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-display text-slate-900 dark:text-white">
                    Driver Package & Product Inspection
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-white/60">
                    Order #{(selectedItemDetail?.order?.id || viewingPackageOrder?.id || 'VW-98241')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedItemDetail(null);
                  setViewingPackageOrder(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Product Card */}
              {(() => {
                const item =
                  selectedItemDetail?.item ||
                  viewingPackageOrder?.items?.[0] || {
                    title: 'Midnight Shadow Cyberpunk Hoodie',
                    price: 2499,
                    size: 'L',
                    qty: 1,
                    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600'
                  };

                const order = selectedItemDetail?.order || viewingPackageOrder;
                const isCOD = order?.paymentMethod === 'COD' || order?.paymentMethod === 'Cash on Delivery';

                return (
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 rounded-2xl bg-purple-50/60 dark:bg-white/[0.03] border border-purple-200/80 dark:border-white/10">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300'}
                        alt={item.title}
                        className="w-24 h-28 object-cover rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0 shadow-md"
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300">
                          Apparel Garment
                        </span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs font-extrabold text-pink-600 dark:text-pink-400">
                          ₹{item.price} <span className="text-[10px] text-slate-400 font-normal">per unit</span>
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                          <div className="p-1.5 rounded-lg bg-white dark:bg-black/50 border border-purple-100 dark:border-white/5">
                            <span className="text-slate-400 block text-[9px]">Size</span>
                            <span className="font-bold">{item.size || 'L'}</span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-white dark:bg-black/50 border border-purple-100 dark:border-white/5">
                            <span className="text-slate-400 block text-[9px]">Quantity</span>
                            <span className="font-bold">{item.qty || 1} pcs</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Specifications */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-purple-200/60 dark:border-white/10 space-y-2 text-xs">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-white/60 block">
                        Fabric & Manufacturing Specs (For Driver)
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">GSM Weight:</span>
                          <span className="font-bold">240 GSM Heavyweight</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Material Composition:</span>
                          <span className="font-bold">100% Combed Cotton</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Package Barcode:</span>
                          <span className="font-mono font-bold text-pink-600 dark:text-pink-400">VW-APPAR-98241</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Hub Inspection:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">Passed Quality Check</span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Handover & Security Checklist */}
                    <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Driver Doorstep Verification Protocol</span>
                      </div>
                      <ul className="text-[11px] space-y-1 text-slate-700 dark:text-white/80">
                        <li>• Verify Delivery PIN: <strong className="font-mono font-black text-pink-600 dark:text-pink-400">5821</strong></li>
                        {isCOD && (
                          <li className="font-bold text-amber-700 dark:text-amber-400">
                            • 💵 Cash to Collect: <strong>₹{order?.totalAmount || 2499}</strong>
                          </li>
                        )}
                        <li>• Do not hand over package if tamper-evident seal is broken.</li>
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-purple-100 dark:border-white/10 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedItemDetail(null);
                  setViewingPackageOrder(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRIVER DELIVERY HANDOVER CONFIRMATION MODAL                               */}
      {/* ========================================================================= */}
      {confirmDeliveryOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-900 dark:text-white">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-emerald-500/50 shadow-2xl animate-scale-up max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black font-display tracking-tight text-white">
                    Confirm Product Delivery Handover
                  </h3>
                  <span className="text-xs text-white/80 font-mono">
                    Order #{confirmDeliveryOrder.id || confirmDeliveryOrder._id}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmDeliveryOrder(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Customer & Address Overview */}
              <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-white/50 tracking-wider">
                    Recipient Details
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {confirmDeliveryOrder.shippingAddress?.fullName}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-white/70">
                  {confirmDeliveryOrder.shippingAddress?.street}, {confirmDeliveryOrder.shippingAddress?.city} - {confirmDeliveryOrder.shippingAddress?.postalCode}
                </p>
                <p className="text-slate-500 dark:text-white/50 font-mono">
                  📞 {confirmDeliveryOrder.shippingAddress?.phone}
                </p>
              </div>

              {/* Step 1: Customer Delivery PIN Verification */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-purple-200/80 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-pink-500" />
                    <span>Customer 4-Digit Delivery PIN</span>
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    PIN Match: 5821
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={deliveryPinInput}
                    onChange={(e) => {
                      setDeliveryPinInput(e.target.value);
                      setPinVerified(e.target.value === '5821');
                    }}
                    placeholder="Enter customer PIN..."
                    className="w-36 px-3 py-2 text-center font-mono font-black text-sm tracking-widest rounded-xl bg-white dark:bg-black border border-purple-200 dark:border-white/10 focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryPinInput('5821');
                      setPinVerified(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Auto-Fill PIN (5821)
                  </button>
                </div>
              </div>

              {/* Step 2: Handed Over To Selection */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-purple-200/80 dark:border-white/10 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Package Handed Over To:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'Customer in Person',
                    'Family Member',
                    'Security / Guard Desk'
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDeliveryReceiverType(type)}
                      className={`p-2 rounded-xl text-[11px] font-bold text-center border transition-all cursor-pointer ${
                        deliveryReceiverType === type
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                          : 'bg-white dark:bg-white/5 border-purple-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:bg-purple-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Cash on Delivery Collection Checkbox */}
              {(confirmDeliveryOrder.paymentMethod === 'COD' || confirmDeliveryOrder.paymentMethod === 'Cash on Delivery') ? (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between text-amber-800 dark:text-amber-300">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Banknote className="w-4 h-4" />
                      <span>Cash on Delivery (COD) Collection</span>
                    </span>
                    <strong className="text-sm font-black">₹{confirmDeliveryOrder.totalAmount}</strong>
                  </div>
                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={cashCollectedConfirmed}
                      onChange={(e) => setCashCollectedConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                      I confirm that I have collected full payment of <strong>₹{confirmDeliveryOrder.totalAmount}</strong> in cash or UPI from the customer.
                    </span>
                  </label>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Prepaid Order: ₹{confirmDeliveryOrder.totalAmount} was paid online. No cash collection required.</span>
                </div>
              )}

              {/* Step 4: Handover Notes / Remarks */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-white/80 block">
                  Delivery Handover Notes:
                </label>
                <input
                  type="text"
                  value={deliveryHandoverNote}
                  onChange={(e) => setDeliveryHandoverNote(e.target.value)}
                  placeholder="e.g. Handed over at doorstep, package intact..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/50 border border-purple-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 dark:bg-black/60 border-t border-purple-100 dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmDeliveryOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 text-slate-800 dark:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  updatingOrderId === (confirmDeliveryOrder.id || confirmDeliveryOrder._id) ||
                  ((confirmDeliveryOrder.paymentMethod === 'COD' || confirmDeliveryOrder.paymentMethod === 'Cash on Delivery') && !cashCollectedConfirmed)
                }
                onClick={handleConfirmDeliverySubmit}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {updatingOrderId === (confirmDeliveryOrder.id || confirmDeliveryOrder._id)
                    ? 'Recording Delivery...'
                    : 'Confirm & Complete Delivery'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROOF OF DELIVERY (POD) RECEIPT MODAL                                     */}
      {/* ========================================================================= */}
      {proofOfDeliveryOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-900 dark:text-white">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-emerald-500/50 shadow-2xl animate-scale-up max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-6 h-6 text-emerald-200" />
                <div>
                  <h3 className="text-base font-black font-display text-white">
                    Proof of Delivery (POD) Receipt
                  </h3>
                  <span className="text-xs text-white/80 font-mono">
                    Order #{proofOfDeliveryOrder.id || proofOfDeliveryOrder._id}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setProofOfDeliveryOrder(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-purple-100 dark:border-white/10">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Handover Completed Successfully
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-white/60 mt-0.5">
                  Delivered on{' '}
                  {proofOfDeliveryOrder.deliveredAt
                    ? new Date(proofOfDeliveryOrder.deliveredAt).toLocaleString()
                    : new Date().toLocaleString()}
                </p>
              </div>

              {/* Delivery Details Grid */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/50 border border-purple-200 dark:border-white/10 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Partner:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{riderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="font-mono text-slate-700 dark:text-white/80">{riderVehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {proofOfDeliveryOrder.shippingAddress?.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {proofOfDeliveryOrder.paymentMethod === 'COD'
                      ? `COD Cash Collected (₹${proofOfDeliveryOrder.totalAmount})`
                      : `Prepaid Online (₹${proofOfDeliveryOrder.totalAmount})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verification PIN:</span>
                  <span className="font-mono font-black text-pink-600 dark:text-pink-400">Verified (5821)</span>
                </div>
              </div>

              {/* Handover Note */}
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-white/5 border border-purple-200/60 dark:border-white/10 text-[11px] text-slate-700 dark:text-white/80">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Handover Remarks:</span>
                <p>{proofOfDeliveryOrder.deliveryNotes || 'Package delivered safely to customer. Quality and tamper seal verified.'}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-black/60 border-t border-purple-100 dark:border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Official VibeWear Digital POD Seal</span>
              <button
                type="button"
                onClick={() => setProofOfDeliveryOrder(null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRIVER RETURN PICKUP & REFUND HANDOVER MODAL                              */}
      {/* ========================================================================= */}
      {confirmReturnOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-900 dark:text-white">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-purple-500/50 shadow-2xl animate-scale-up max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-purple-700 via-brand-600 to-pink-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-6 h-6 text-pink-200" />
                <div>
                  <h3 className="text-base font-black font-display text-white">
                    Return Pickup & Refund Handover
                  </h3>
                  <span className="text-xs text-white/80 font-mono">
                    Order #{confirmReturnOrder.id || confirmReturnOrder._id}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmReturnOrder(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-black/50 border border-purple-200 dark:border-purple-500/20 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/60">Customer:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {confirmReturnOrder.shippingAddress?.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/60">Address:</span>
                  <span className="font-medium text-slate-700 dark:text-white/80 text-right max-w-[200px]">
                    {confirmReturnOrder.shippingAddress?.street}, {confirmReturnOrder.shippingAddress?.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/60">Return Reason:</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400">
                    {confirmReturnOrder.returnReason || 'Fit Issue / Size'}
                  </span>
                </div>
              </div>

              {/* Refund Handover Verification Checkboxes */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-black/60 border border-purple-200 dark:border-white/10">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={returnInspected}
                    onChange={(e) => setReturnInspected(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                  />
                  <span className="font-semibold text-slate-800 dark:text-white/90">
                    Package Inspected: Garment tags intact, unwashed, original condition verified.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={refundCashHanded}
                    onChange={(e) => setRefundCashHanded(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    Refund of ₹{confirmReturnOrder.totalAmount} handed over in cash / UPI to customer.
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  Return Handover Remarks:
                </label>
                <input
                  type="text"
                  value={returnPickupNote}
                  onChange={(e) => setReturnPickupNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/50 border border-purple-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-black/60 border-t border-purple-100 dark:border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setConfirmReturnOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!returnInspected || !refundCashHanded || updatingOrderId}
                onClick={handleConfirmReturnSubmit}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Return & Refund Handover</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRIVER EXCHANGE HANDOVER MODAL                                            */}
      {/* ========================================================================= */}
      {confirmExchangeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-900 dark:text-white">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-pink-500/50 shadow-2xl animate-scale-up max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-pink-600 via-purple-600 to-brand-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-6 h-6 text-pink-200" />
                <div>
                  <h3 className="text-base font-black font-display text-white">
                    Exchange Handover & Doorstep Swap
                  </h3>
                  <span className="text-xs text-white/80 font-mono">
                    Order #{confirmExchangeOrder.id || confirmExchangeOrder._id}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmExchangeOrder(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-black/50 border border-pink-200 dark:border-pink-500/20 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/60">Customer:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {confirmExchangeOrder.shippingAddress?.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/60">New Replacement Size:</span>
                  <span className="font-black text-pink-600 dark:text-pink-400 text-sm bg-pink-100 dark:bg-pink-950/40 px-2 py-0.5 rounded-md">
                    Size {confirmExchangeOrder.exchangeDesiredSize || 'L'}
                  </span>
                </div>
                {confirmExchangeOrder.exchangeDesiredColor && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-white/60">New Replacement Color:</span>
                    <span className="font-black text-purple-600 dark:text-purple-400 text-sm bg-purple-100 dark:bg-purple-950/40 px-2 py-0.5 rounded-md">
                      {confirmExchangeOrder.exchangeDesiredColor}
                    </span>
                  </div>
                )}
              </div>

              {/* Verification Checkboxes */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-black/60 border border-pink-200 dark:border-white/10">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={exchangeNewDelivered}
                    onChange={(e) => setExchangeNewDelivered(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-pink-600 focus:ring-pink-500 accent-pink-600"
                  />
                  <span className="font-semibold text-slate-800 dark:text-white/90">
                    Handed over new replacement item (Size {confirmExchangeOrder.exchangeDesiredSize || 'L'}
                    {confirmExchangeOrder.exchangeDesiredColor ? ` • ${confirmExchangeOrder.exchangeDesiredColor}` : ''}).
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={exchangeOldPicked}
                    onChange={(e) => setExchangeOldPicked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                  />
                  <span className="font-semibold text-slate-800 dark:text-white/90">
                    Collected original garment item from customer into return bag.
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  Exchange Handover Remarks:
                </label>
                <input
                  type="text"
                  value={exchangeHandoverNote}
                  onChange={(e) => setExchangeHandoverNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/50 border border-purple-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-black/60 border-t border-purple-100 dark:border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setConfirmExchangeOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!exchangeNewDelivered || !exchangeOldPicked || updatingOrderId}
                onClick={handleConfirmExchangeSubmit}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Exchange Handover</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRIVER DECLINE / REJECT MODAL */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0E0C18] border-2 border-red-500/40 shadow-2xl p-6 text-slate-900 dark:text-white animate-slide-up space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-purple-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 font-bold">
                  ✕
                </span>
                <h3 className="text-base font-black font-display text-slate-900 dark:text-white">
                  Decline Delivery Request
                </h3>
              </div>
              <button
                onClick={() => setRejectModalOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-white/70">
              Please specify the reason why you cannot deliver Order #{rejectModalOrder.id || rejectModalOrder._id}. Admin will be instantly notified to reassign another driver.
            </p>

            <div className="space-y-2">
              {[
                'Out of delivery area',
                'Heavy rain / vehicle breakdown',
                'Occupied with another delivery',
                'End of shift / EV battery low',
                'Other'
              ].map((reasonOption) => (
                <label
                  key={reasonOption}
                  onClick={() => setRejectReason(reasonOption)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    rejectReason === reasonOption
                      ? 'border-red-500 bg-red-50/70 dark:bg-red-950/30'
                      : 'border-purple-100 dark:border-white/10 hover:border-red-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reasonOption}
                    onChange={() => setRejectReason(reasonOption)}
                    className="accent-red-600"
                  />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{reasonOption}</span>
                </label>
              ))}
            </div>

            {rejectReason === 'Other' && (
              <div>
                <input
                  type="text"
                  placeholder="Type specific reason for declining..."
                  value={customRejectNote}
                  onChange={(e) => setCustomRejectNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-black/50 border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingOrderId}
                onClick={handleRejectOrderSubmit}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all cursor-pointer"
              >
                {updatingOrderId ? 'Declining...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboardPage;
