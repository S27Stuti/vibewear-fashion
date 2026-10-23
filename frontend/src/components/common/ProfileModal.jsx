import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ReviewModal from './ReviewModal';
import {
  X,
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ShieldCheck,
  Phone,
  Mail,
  CheckCircle2,
  Truck,
  RotateCcw,
  RefreshCw,
  Ban,
  Star,
  Camera,
  Mic,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const ProfileModal = ({ onTrackOrder }) => {
  const {
    user,
    isAuthenticated,
    isProfileOpen,
    closeProfile,
    logout,
    updateUserProfile,
    userOrders,
    cancelOrder,
    requestReturn,
    requestExchange,
    updateDeliveryStatus,
    profileActiveTab
  } = useAuth();

  const safeOrders = Array.isArray(userOrders) ? userOrders : [];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const effectiveUser = user || {
    name: safeOrders?.[0]?.shippingAddress?.fullName || 'Valued Fashion Shopper',
    email: safeOrders?.[0]?.deliveryPartnerEmail ? 'shopper@vibewear.com' : 'customer@vibewear.com',
    phone: safeOrders?.[0]?.shippingAddress?.phone || '+91 98765 43210',
    role: 'Shopper'
  };

  const [activeTab, setActiveTab] = useState(profileActiveTab || 'orders'); // 'orders' | 'address' | 'settings'
  const [editName, setEditName] = useState(effectiveUser.name);
  const [editPhone, setEditPhone] = useState(effectiveUser.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Keep active tab and profile fields in sync
  useEffect(() => {
    if (profileActiveTab) {
      setActiveTab(profileActiveTab);
    }
  }, [profileActiveTab, isProfileOpen]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '+91 98765 43210');
    }
  }, [user]);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState(null);
  const [reviewingOrderId, setReviewingOrderId] = useState(null);

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
  const [cancelReason, setCancelReason] = useState('Changed my mind / ordered by mistake');

  if (!isProfileOpen) return null;

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      phone: editPhone
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Open Review modal for product
  const handleOpenReview = (product, orderId) => {
    setReviewingProduct(product);
    setReviewingOrderId(orderId);
    setReviewModalOpen(true);
  };

  // Trigger Return Request
  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if (!selectedOrderForReturn) return;
    const orderId = selectedOrderForReturn.id || selectedOrderForReturn._id;
    await requestReturn(orderId, { reason: returnReason, comment: returnComment });
    setReturnModalOpen(false);
    setSelectedOrderForReturn(null);
    setReturnComment('');
    showToast(`🔄 Return request for Order #${orderId} submitted! Admin will assign delivery partner.`);
  };

  // Trigger Exchange Request
  const handleSubmitExchange = async (e) => {
    e.preventDefault();
    if (!selectedOrderForExchange) return;
    const orderId = selectedOrderForExchange.id || selectedOrderForExchange._id;
    await requestExchange(orderId, {
      reason: exchangeReason,
      desiredSize: exchangeDesiredSize,
      desiredColor: exchangeDesiredColor,
      comment: exchangeComment
    });
    setExchangeModalOpen(false);
    setSelectedOrderForExchange(null);
    setExchangeComment('');
    showToast(`🔁 Exchange request for Order #${orderId} (Size: ${exchangeDesiredSize}, Color: ${exchangeDesiredColor}) submitted!`);
  };

  // Trigger Cancel Order
  const handleSubmitCancel = async (e) => {
    e.preventDefault();
    if (!selectedOrderForCancel) return;
    const orderId = selectedOrderForCancel.id || selectedOrderForCancel._id;
    await cancelOrder(orderId, cancelReason);
    setCancelModalOpen(false);
    setSelectedOrderForCancel(null);
    showToast(`❌ Order #${orderId} has been cancelled successfully.`);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-[#07070E] border-2 border-purple-200 dark:border-brand-500/30 shadow-2xl text-slate-900 dark:text-white animate-slide-up max-h-[92vh] flex flex-col">
          {/* Glowing Ambient Backdrop */}
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-brand-600/20 dark:bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-pink-600/20 dark:bg-pink-600/25 rounded-full blur-3xl pointer-events-none" />

          {/* Action Success Toast */}
          {actionNotice && (
            <div className="absolute top-4 left-6 right-16 z-30 p-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl animate-slide-down">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* Modal Header */}
          <div className="p-6 border-b border-purple-200 dark:border-brand-500/20 bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-[#0D091A] dark:via-[#07070E] dark:to-[#150A1A] relative shrink-0">
            <button
              onClick={closeProfile}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-pink-600 to-purple-600 p-0.5 shadow-xl shadow-brand-600/30">
                <div className="w-full h-full bg-white dark:bg-[#0B0B12] rounded-2xl flex items-center justify-center text-xl font-black font-display text-slate-900 dark:text-white">
                  {effectiveUser.name ? effectiveUser.name[0] : 'U'}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">{effectiveUser.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30">
                    {effectiveUser.role || 'Customer'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-white/60 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-pink-500" />
                  <span>{effectiveUser.email}</span>
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mt-5 pt-3 border-t border-purple-200/80 dark:border-white/10">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Orders ({safeOrders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('address')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'address'
                    ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Address Book</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Profile Settings</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {/* ========================================================================= */}
            {/* ORDERS HISTORY TAB WITH RETURN, EXCHANGE, CANCEL & REVIEW                 */}
            {/* ========================================================================= */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {safeOrders.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 dark:bg-brand-600/10 border border-purple-200 dark:border-brand-500/20 flex items-center justify-center mx-auto dark:text-pink-400">
                      <Package className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">No orders placed yet</p>
                    <p className="text-xs text-slate-500 dark:text-white/60">
                      Explore trending Men, Women & Kids streetwear styles to place an order.
                    </p>
                  </div>
                ) : (
                  safeOrders.map((order) => {
                    const orderId = order.id || order._id;
                    const st = order.orderStatus || 'Confirmed';
                    const isDelivered = st === 'Delivered';
                    const isReturned = st === 'Returned';
                    const isExchanged = st === 'Exchanged';
                    const isCancelled = st === 'Cancelled';
                    const isReturnPending = st === 'Return Requested' || st === 'Return Approved' || st === 'Return In Progress';
                    const isExchangePending = st === 'Exchange Requested' || st === 'Exchange Approved' || st === 'Exchange In Progress';
                    const canCancel = !isDelivered && !isReturned && !isExchanged && !isCancelled && !isReturnPending && !isExchangePending;

                    return (
                      <div
                        key={orderId}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0E0C18] border-2 border-purple-200/80 dark:border-brand-500/30 hover:border-pink-500/50 transition-all space-y-3.5 shadow-md"
                      >
                        {/* Order Header Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-purple-200 dark:border-white/10 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                              #{orderId}
                            </span>
                            <span className="text-slate-500 dark:text-white/50">• {formatDate(order.createdAt)}</span>
                          </div>

                          {/* Dynamic Status Badge */}
                          <div className="flex items-center gap-2">
                            {isDelivered && (
                              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-1.5 shadow-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                Order Delivered Successfully
                              </span>
                            )}
                            {isReturned && (
                              <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 flex items-center gap-1.5 shadow-xs">
                                <RotateCcw className="w-3.5 h-3.5 text-purple-500" />
                                Returned Successfully (Refunded)
                              </span>
                            )}
                            {isExchanged && (
                              <span className="px-3 py-1 rounded-full text-xs font-black bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300 border border-pink-300 dark:border-pink-500/40 flex items-center gap-1.5 shadow-xs">
                                <RefreshCw className="w-3.5 h-3.5 text-pink-500" />
                                Exchanged Successfully
                              </span>
                            )}
                            {isCancelled && (
                              <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border border-red-300 dark:border-red-500/40 flex items-center gap-1.5 shadow-xs">
                                <Ban className="w-3.5 h-3.5 text-red-500" />
                                Cancelled
                              </span>
                            )}
                            {isReturnPending && (
                              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 flex items-center gap-1.5 shadow-xs">
                                <RotateCcw className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                                {st}
                              </span>
                            )}
                            {isExchangePending && (
                              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 flex items-center gap-1.5 shadow-xs">
                                <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                                {st}
                              </span>
                            )}
                            {!isDelivered && !isReturned && !isExchanged && !isCancelled && !isReturnPending && !isExchangePending && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                {st}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer Dashboard Notice Banner */}
                        {isDelivered && (
                          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>
                              🎉 Order Delivered Successfully! Delivered by {order.deliveryPartnerName || 'Vikram Malhotra'}.
                            </span>
                          </div>
                        )}
                        {isReturned && (
                          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-2 text-xs font-bold text-purple-800 dark:text-purple-300">
                            <RotateCcw className="w-4 h-4 text-purple-500 shrink-0" />
                            <span>
                              ✅ Returned Successfully! Package collected by {order.deliveryPartnerName || 'Vikram Malhotra'} and refund processed.
                            </span>
                          </div>
                        )}
                        {isExchanged && (
                          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center gap-2 text-xs font-bold text-pink-800 dark:text-pink-300">
                            <RefreshCw className="w-4 h-4 text-pink-500 shrink-0" />
                            <span>
                              ✅ Exchanged Successfully! Replacement delivered by {order.deliveryPartnerName || 'Vikram Malhotra'}.
                            </span>
                          </div>
                        )}
                        {isReturnPending && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>
                              🚚 Return Pickup in progress with {order.deliveryPartnerName || 'Delivery Hero'}. Rider will collect package & issue refund.
                            </span>
                          </div>
                        )}
                        {isExchangePending && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>
                              🔄 Exchange in progress with {order.deliveryPartnerName || 'Delivery Hero'}. Replacement size {order.exchangeDesiredSize || 'requested'} is being arranged.
                            </span>
                          </div>
                        )}
                        {isCancelled && (
                          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs font-bold text-red-800 dark:text-red-300">
                            <Ban className="w-4 h-4 text-red-500 shrink-0" />
                            <span>
                              ❌ Order Cancelled: {order.cancellationReason || 'Customer requested cancellation.'}
                            </span>
                          </div>
                        )}

                        {/* Items in the Order */}
                        <div className="space-y-2 py-1">
                          {order.items?.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 bg-white dark:bg-black/80 p-2.5 rounded-xl border border-purple-200 dark:border-brand-500/20 shadow-xs"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={it.image || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=200'}
                                  alt="Item"
                                  className="w-12 h-14 object-cover rounded-lg bg-slate-100 dark:bg-black shrink-0 border border-purple-200 dark:border-white/10"
                                />
                                <div className="text-xs">
                                  <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                    {it.title}
                                  </p>
                                  <p className="text-slate-500 dark:text-white/60 text-[11px] mt-0.5">
                                    Qty: {it.qty || 1} • Size: <strong className="text-slate-900 dark:text-white">{it.size || 'M'}</strong> • Price: <strong className="text-pink-600 dark:text-pink-400">₹{it.price}</strong>
                                  </p>
                                </div>
                              </div>

                              {/* Customer Review Button with Photo & Audio support */}
                              {isDelivered && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenReview(it, orderId)}
                                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer shrink-0"
                                  title="Add Review with Photo and Audio Voice note"
                                >
                                  <Star className="w-3.5 h-3.5 fill-white" />
                                  <span>Review</span>
                                  <span className="flex items-center gap-0.5 text-[10px] opacity-90">
                                    <Camera className="w-2.5 h-2.5" />
                                    <Mic className="w-2.5 h-2.5" />
                                  </span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Order Summary line */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="text-slate-500 dark:text-white/60">
                            Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus || 'Completed'})
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            Total: <strong className="text-pink-600 dark:text-pink-400 font-black">₹{order.totalAmount}</strong>
                          </span>
                        </div>

                        {/* Actions Row: Track, Return, Exchange, Cancel */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-100 dark:border-white/10">
                          {/* Live Track Button */}
                          <button
                            type="button"
                            onClick={() => {
                              closeProfile();
                              if (onTrackOrder) onTrackOrder(orderId);
                            }}
                            className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-600/20 transition-all cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Package</span>
                          </button>

                          {/* Return Button (Only if delivered and not already returned/exchanged) */}
                          {isDelivered && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrderForReturn(order);
                                setReturnModalOpen(true);
                              }}
                              className="py-2 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 border border-purple-300 dark:border-purple-500/30 transition-all cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-purple-500" />
                              <span>Return</span>
                            </button>
                          )}

                          {/* Exchange Button (Only if delivered and not already returned/exchanged) */}
                          {isDelivered && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrderForExchange(order);
                                setExchangeModalOpen(true);
                              }}
                              className="py-2 px-3 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/40 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 font-bold text-xs flex items-center gap-1.5 border border-pink-300 dark:border-pink-500/30 transition-all cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-pink-500" />
                              <span>Exchange</span>
                            </button>
                          )}

                          {/* Cancel Order Button (Only if not delivered/shipped) */}
                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrderForCancel(order);
                                setCancelModalOpen(true);
                              }}
                              className="py-2 px-3 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/40 dark:hover:bg-red-950/70 text-red-700 dark:text-red-300 font-bold text-xs flex items-center gap-1.5 border border-red-300 dark:border-red-500/30 transition-all cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5 text-red-500" />
                              <span>Cancel Order</span>
                            </button>
                          )}
                        </div>

                        {/* Interactive Testing Helper for Return/Exchange and Cancel */}
                        <div className="flex flex-wrap items-center justify-between text-[11px] pt-1">
                          <span className="text-[10px] text-slate-400 dark:text-white/40">
                            {(Array.isArray(order.trackingTimeline) && order.trackingTimeline.length > 0 && order.trackingTimeline[order.trackingTimeline.length - 1]?.description) || 'Delivery guaranteed on schedule'}
                          </span>
                          {!isDelivered && !isCancelled && !isReturnPending && !isExchangePending && (
                            <button
                              type="button"
                              onClick={async () => {
                                await updateDeliveryStatus(orderId, 'Delivered', 'Doorstep Delivery Complete');
                                showToast(`🎉 Order #${orderId} marked as Delivered! Return and Exchange buttons are now active.`);
                              }}
                              className="text-[10px] text-pink-600 dark:text-pink-400 hover:text-pink-700 font-bold flex items-center gap-1 cursor-pointer bg-pink-500/10 hover:bg-pink-500/20 px-2 py-0.5 rounded-md transition-all"
                              title="Mark Delivered to test Return & Exchange buttons"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-pink-500" />
                              <span>⚡ Mark Delivered (Test Return/Exchange)</span>
                            </button>
                          )}
                          {isDelivered && (
                            <button
                              type="button"
                              onClick={async () => {
                                await updateDeliveryStatus(orderId, 'Confirmed', 'Reset to Confirmed');
                                showToast(`Order #${orderId} reset to Confirmed! Cancel Order button is now active.`);
                              }}
                              className="text-[10px] text-purple-600 dark:text-purple-400 hover:text-purple-700 font-bold flex items-center gap-1 cursor-pointer bg-purple-500/10 hover:bg-purple-500/20 px-2 py-0.5 rounded-md transition-all"
                              title="Reset status to test Cancel button"
                            >
                              <RefreshCw className="w-2.5 h-2.5 text-purple-500" />
                              <span>⚡ Reset to Confirmed (Test Cancel)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/60 border border-purple-200 dark:border-brand-500/20 space-y-2 text-xs shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                      Default Shipping Address
                    </span>
                    <span className="text-[10px] text-pink-700 dark:text-pink-300 font-semibold bg-pink-100 dark:bg-pink-500/15 px-2 py-0.5 rounded border border-pink-200 dark:border-pink-500/30">
                      Verified
                    </span>
                  </div>
                  <p className="text-slate-900 dark:text-white font-medium">{effectiveUser.name}</p>
                  <p className="text-slate-600 dark:text-white/70">
                    {user?.address?.street || userOrders?.[0]?.shippingAddress?.street || '108 Fashion Boulevard, Suite 400'}
                  </p>
                  <p className="text-slate-600 dark:text-white/70">
                    {user?.address?.city || userOrders?.[0]?.shippingAddress?.city || 'Mumbai'}, {user?.address?.state || userOrders?.[0]?.shippingAddress?.state || 'Maharashtra'} - {user?.address?.postalCode || userOrders?.[0]?.shippingAddress?.postalCode || '400001'}
                  </p>
                  <p className="text-slate-600 dark:text-white/70 flex items-center gap-1 pt-1">
                    <Phone className="w-3 h-3 text-pink-600 dark:text-pink-400" />
                    {effectiveUser.phone || '+91 98765 43210'}
                  </p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {savedSuccess && (
                  <div className="p-3 rounded-xl bg-pink-100 dark:bg-pink-500/15 border border-pink-300 dark:border-pink-500/30 text-pink-700 dark:text-pink-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile updated successfully!</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-black border border-purple-200 dark:border-brand-500/30 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={effectiveUser.email}
                    className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-black/40 border border-purple-200 dark:border-brand-500/20 rounded-xl text-xs text-slate-400 dark:text-white/40 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-black border border-purple-200 dark:border-brand-500/30 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-purple-200 dark:border-brand-500/20">
                  <button
                    type="button"
                    onClick={() => {
                      closeProfile();
                      logout();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CUSTOMER REVIEW MODAL (PHOTO + AUDIO RECORDING)                        */}
      {/* ========================================================================= */}
      {reviewModalOpen && reviewingProduct && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setReviewingProduct(null);
          }}
          product={reviewingProduct}
          orderId={reviewingOrderId}
          onReviewSubmitted={() => {
            showToast('🌟 Review with photo and voice note submitted successfully!');
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. RETURN REQUEST MODAL                                                   */}
      {/* ========================================================================= */}
      {returnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0E0C18] border-2 border-purple-500/40 shadow-2xl p-6 text-slate-900 dark:text-white animate-slide-up space-y-4">
            <button
              onClick={() => setReturnModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black font-display text-slate-900 dark:text-white">
                  Request Order Return
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/60">
                  Order #{selectedOrderForReturn.id || selectedOrderForReturn._id} • Refund: ₹{selectedOrderForReturn.totalAmount}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitReturn} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  Reason for Return
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 cursor-pointer font-medium"
                >
                  <option value="Size doesn't fit properly">Size doesn't fit properly</option>
                  <option value="Quality not as expected">Quality not as expected</option>
                  <option value="Received damaged or defective piece">Received damaged or defective piece</option>
                  <option value="Color or style different from photos">Color or style different from photos</option>
                  <option value="Changed my mind / not needed">Changed my mind / not needed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={returnComment}
                  onChange={(e) => setReturnComment(e.target.value)}
                  placeholder="Tell us what went wrong so we can prepare the pickup partner..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 resize-none font-medium"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 text-slate-600 dark:text-white/70 text-[11px] space-y-1">
                <p className="font-bold text-purple-700 dark:text-purple-300">
                  📦 Doorstep Pickup & Refund Flow:
                </p>
                <p>1. Admin will assign a Delivery Partner to your address.</p>
                <p>2. Delivery Hero will collect the item and inspect tags.</p>
                <p>3. Delivery Hero confirms return & your refund is credited.</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Submit Return Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EXCHANGE REQUEST MODAL                                                 */}
      {/* ========================================================================= */}
      {exchangeModalOpen && selectedOrderForExchange && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0E0C18] border-2 border-pink-500/40 shadow-2xl p-6 text-slate-900 dark:text-white animate-slide-up space-y-4">
            <button
              onClick={() => setExchangeModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/40 border border-pink-300 dark:border-pink-500/40 flex items-center justify-center text-pink-600 dark:text-pink-300 shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black font-display text-slate-900 dark:text-white">
                  Request Item Exchange
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/60">
                  Order #{selectedOrderForExchange.id || selectedOrderForExchange._id} • Swap Size & Fit
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitExchange} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  Choose New Replacement Size
                </label>
                <div className="flex items-center gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setExchangeDesiredSize(sz)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        exchangeDesiredSize === sz
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  Choose Replacement Color
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Obsidian Black', 'Royal Purple', 'Chalk White', 'Blush Pink'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setExchangeDesiredColor(col)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        exchangeDesiredColor === col
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  Reason for Exchange
                </label>
                <select
                  value={exchangeReason}
                  onChange={(e) => setExchangeReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 cursor-pointer font-medium"
                >
                  <option value="Size too loose / oversized">Size too loose / oversized</option>
                  <option value="Size too tight / small">Size too tight / small</option>
                  <option value="Prefer a more relaxed streetwear fit">Prefer a more relaxed streetwear fit</option>
                  <option value="Minor stitch defect exchange">Minor stitch defect exchange</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  Instructions for Delivery Hero (Optional)
                </label>
                <textarea
                  rows={2}
                  value={exchangeComment}
                  onChange={(e) => setExchangeComment(e.target.value)}
                  placeholder="e.g. Please bring size L replacement during morning delivery..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 resize-none font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExchangeModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Confirm Exchange
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CANCEL ORDER MODAL                                                     */}
      {/* ========================================================================= */}
      {cancelModalOpen && selectedOrderForCancel && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0E0C18] border-2 border-red-500/40 shadow-2xl p-6 text-slate-900 dark:text-white animate-slide-up space-y-4">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-500/40 flex items-center justify-center text-red-600 dark:text-red-300 shrink-0">
                <Ban className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black font-display text-slate-900 dark:text-white">
                  Cancel Order
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/60">
                  Order #{selectedOrderForCancel.id || selectedOrderForCancel._id}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitCancel} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 cursor-pointer font-medium"
                >
                  <option value="Changed my mind / ordered by mistake">Changed my mind / ordered by mistake</option>
                  <option value="Need to change shipping address">Need to change shipping address</option>
                  <option value="Delivery time is too long">Delivery time is too long</option>
                  <option value="Want to apply another coupon or payment method">Want to apply another coupon or payment method</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-white/60">
                Are you sure you want to cancel this order? Once cancelled, the delivery assignment will be revoked.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Confirm Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;
