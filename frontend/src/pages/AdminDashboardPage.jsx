import React, { useState } from 'react';
import { useAuth, FLEET_RIDERS } from '../context/AuthContext';
import {
  ShieldCheck,
  Package,
  Truck,
  Bike,
  Users,
  Search,
  ExternalLink,
  LogOut,
  Sparkles,
  Banknote,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  KeyRound,
  Eye,
  AlertTriangle,
  Layers,
  ArrowUpDown,
  Filter,
  Check,
  Send,
  RefreshCw,
  Plus,
  Trash2,
  X,
  AlertCircle
} from 'lucide-react';

const AdminDashboardPage = ({
  onNavigateHome,
  onNavigateCustomer,
  onNavigateDelivery,
  products = [],
  onAddProduct,
  onDeleteProduct,
  onUpdateProductStock
}) => {
  const {
    user,
    userOrders,
    updateDeliveryStatus,
    triggerDriverDeparture,
    assignRiderToOrder,
    cancelOrder,
    logout,
    fleetRiders
  } = useAuth();

  const activeFleet = fleetRiders || FLEET_RIDERS;

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'fleet' | 'products' | 'security'
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'pending_driver' | 'rejected_driver' | 'accepted_driver' | 'pending_assign' | 'active' | 'Delivered' | 'returns_exchanges' | 'Cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState('');
  const [assignRiderModalOrder, setAssignRiderModalOrder] = useState(null);
  const [selectedRiderName, setSelectedRiderName] = useState('Vikram Malhotra');

  // Product Catalog Management State (Fully connected with Storefront!)
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [newProductData, setNewProductData] = useState({
    title: '',
    category: 'Men',
    price: 1999,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
    description: 'Premium heavyweight cotton modern silhouette streetwear.'
  });
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  const handleAddNewProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductData.title.trim()) return;
    const newProd = {
      id: 'prod_' + Date.now(),
      _id: 'prod_' + Date.now(),
      title: newProductData.title,
      category: newProductData.category,
      price: Number(newProductData.price) || 999,
      stock: Number(newProductData.stock) || 10,
      image: newProductData.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      description: newProductData.description || 'Premium VibeWear drop',
      rating: 4.9,
      reviewsCount: 1,
      isNew: true
    };
    if (onAddProduct) {
      onAddProduct(newProd);
    }
    setAddProductModalOpen(false);
    setActionSuccessNotice(`✨ Product "${newProd.title}" added to store catalog!`);
    setTimeout(() => setActionSuccessNotice(''), 5000);
  };

  const handleDeleteProductClick = (productId, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the store catalog?`)) {
      if (onDeleteProduct) {
        onDeleteProduct(productId);
      }
      setActionSuccessNotice(`🗑️ Product "${title}" removed from catalog.`);
      setTimeout(() => setActionSuccessNotice(''), 4000);
    }
  };

  const allOrders = userOrders || [];

  // Filter orders
  const filteredOrders = allOrders.filter((ord) => {
    if (orderFilter !== 'all') {
      if (orderFilter === 'pending_driver') {
        if (ord.driverRequestStatus !== 'pending_acceptance') return false;
      } else if (orderFilter === 'rejected_driver') {
        if (ord.driverRequestStatus !== 'rejected') return false;
      } else if (orderFilter === 'accepted_driver') {
        if (ord.driverRequestStatus !== 'accepted') return false;
      } else if (orderFilter === 'pending_assign') {
        if (ord.orderStatus !== 'Confirmed' && ord.orderStatus !== 'Processing') return false;
      } else if (orderFilter === 'active') {
        if (!['Assigned', 'Shipped', 'Out for Delivery'].includes(ord.orderStatus)) return false;
      } else if (orderFilter === 'returns_exchanges') {
        const returnExchangeStatuses = [
          'Return Requested', 'Return Approved', 'Return In Progress', 'Returned',
          'Exchange Requested', 'Exchange Approved', 'Exchange In Progress', 'Exchanged'
        ];
        if (!returnExchangeStatuses.includes(ord.orderStatus)) return false;
      } else if (ord.orderStatus !== orderFilter) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const orderId = (ord.id || ord._id || '').toLowerCase();
      const customer = (ord.shippingAddress?.fullName || '').toLowerCase();
      const city = (ord.shippingAddress?.city || '').toLowerCase();
      const rider = (ord.deliveryPartnerName || '').toLowerCase();
      return orderId.includes(q) || customer.includes(q) || city.includes(q) || rider.includes(q);
    }
    return true;
  });

  // KPI Metrics Calculation
  const totalOrdersCount = allOrders.length;
  const pendingDriverCount = allOrders.filter((o) => o.driverRequestStatus === 'pending_acceptance').length;
  const rejectedDriverCount = allOrders.filter((o) => o.driverRequestStatus === 'rejected').length;
  const acceptedDriverCount = allOrders.filter((o) => o.driverRequestStatus === 'accepted').length;
  const enRouteOrdersCount = allOrders.filter((o) => o.orderStatus === 'Out for Delivery').length;
  const deliveredOrdersCount = allOrders.filter((o) => o.orderStatus === 'Delivered').length;
  const shippedOrdersCount = allOrders.filter((o) => o.orderStatus === 'Shipped').length;
  const returnsCount = allOrders.filter((o) =>
    ['Return Requested', 'Return Approved', 'Return In Progress', 'Returned', 'Exchange Requested', 'Exchange Approved', 'Exchange In Progress', 'Exchanged'].includes(o.orderStatus)
  ).length;

  const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0) + 342850;

  const handleStatusChange = async (orderId, newStatus) => {
    await updateDeliveryStatus(orderId, newStatus, `Status updated to ${newStatus} by Admin`);
    setActionSuccessNotice(`Order #${orderId} status successfully updated to "${newStatus}"!`);
    setTimeout(() => setActionSuccessNotice(''), 4000);
  };

  const handleAssignRider = async (orderId, riderObj) => {
    await assignRiderToOrder(orderId, riderObj);
    setAssignRiderModalOrder(null);
    setActionSuccessNotice(`🛵 Rider ${riderObj.name} assigned to Order #${orderId}! Delivery/Pickup scheduled.`);
    setTimeout(() => setActionSuccessNotice(''), 4000);
  };

  const handleAdminCancelOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to cancel Order #${orderId}?`)) {
      await cancelOrder(orderId, 'Cancelled by Admin Console');
      setActionSuccessNotice(`❌ Order #${orderId} has been cancelled by Admin.`);
      setTimeout(() => setActionSuccessNotice(''), 4000);
    }
  };

  const handleSimulateDispatch = async (orderId) => {
    await triggerDriverDeparture(orderId);
    setActionSuccessNotice(`🛵 Driver dispatched for Order #${orderId}! Real-time customer alert triggered.`);
    setTimeout(() => setActionSuccessNotice(''), 4000);
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

      {/* ADMIN CONTROL HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-purple-200 dark:border-brand-500/40 p-6 sm:p-8 shadow-2xl mb-8">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-purple-600/20 via-pink-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 pb-6 border-b border-purple-100 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-purple-700 via-brand-600 to-pink-600 p-1 shadow-xl shadow-purple-600/30 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-white">
                <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                  VibeWear Operations Console
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-pink-300 border border-purple-200 dark:border-purple-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-pink-400" />
                  Super Admin
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-white/70">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Administrator: {user?.name || 'Admin VibeWear'}
                </span>
                <span>•</span>
                <span className="font-mono text-pink-600 dark:text-pink-400">
                  {user?.email || 'admin@vibewear.com'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Operational Database
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3.5 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-white/10 border border-purple-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
            </button>

            <button
              type="button"
              onClick={onNavigateCustomer}
              className="px-3.5 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 text-xs font-bold text-pink-700 dark:text-pink-300 transition-all cursor-pointer flex items-center gap-1.5"
              title="Open Customer Account & Orders"
            >
              <Users className="w-3.5 h-3.5 text-pink-500" />
              <span>Customer Portal</span>
            </button>

            <button
              type="button"
              onClick={onNavigateDelivery}
              className="px-3.5 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-xs font-bold text-purple-700 dark:text-purple-300 transition-all cursor-pointer flex items-center gap-1.5"
              title="Open Driver / Rider Hub"
            >
              <Bike className="w-3.5 h-3.5 text-purple-500" />
              <span>Driver Hub</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-2xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-500/30 text-pink-600 dark:text-pink-400 transition-all cursor-pointer"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 OVERVIEW KPI METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-black/40 border border-purple-200/80 dark:border-white/10">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">
              Total Gross Revenue
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                ₹{totalRevenue.toLocaleString()}
              </span>
              <Banknote className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
              ↑ +24.8% this month
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-black/40 border border-purple-200/80 dark:border-white/10">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">
              Total Customer Orders
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                {totalOrdersCount}
              </span>
              <Package className="w-5 h-5 text-brand-500" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-white/60 font-semibold mt-1 block">
              {shippedOrdersCount} Shipped • {deliveredOrdersCount} Delivered
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-black/40 border border-pink-200/80 dark:border-pink-500/20">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">
              Active Out for Delivery
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl sm:text-2xl font-black font-display text-pink-600 dark:text-pink-400">
                {enRouteOrdersCount}
              </span>
              <Truck className="w-5 h-5 text-pink-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold mt-1 block">
              Assigned to Vikram Malhotra
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-black/40 border border-purple-200/80 dark:border-white/10">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 block">
              Catalog Apparel SKUs
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                120+
              </span>
              <Layers className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-white/60 font-semibold mt-1 block">
              Men, Women & Kids Streetwear
            </span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#0B0B14] border border-purple-200 dark:border-brand-500/30 shadow-sm text-xs font-bold overflow-x-auto no-scrollbar max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders ({totalOrdersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fleet')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'fleet'
                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Riders & Fleet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-purple-700 to-slate-900 text-white shadow-md'
                : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Security</span>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full sm:w-auto min-w-[240px] sm:min-w-[280px]">
          <Search className="w-4 h-4 text-pink-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, customers, or riders..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-[#0B0B14] border border-purple-200 dark:border-brand-500/30 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 shadow-xs"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ORDERS MANAGEMENT                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Status Pill Filters - Smooth Horizontal Swipe on Mobile */}
          <div className="flex items-center gap-2 pb-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: `All Orders (${totalOrdersCount})` },
              { id: 'pending_driver', label: `⏳ Awaiting Driver (${pendingDriverCount})` },
              { id: 'rejected_driver', label: `❌ Driver Declined (${rejectedDriverCount})` },
              { id: 'accepted_driver', label: `✅ Driver Accepted (${acceptedDriverCount})` },
              { id: 'pending_assign', label: 'Pending Assign' },
              { id: 'active', label: `Active (${enRouteOrdersCount + shippedOrdersCount})` },
              { id: 'Delivered', label: `Delivered (${deliveredOrdersCount})` },
              { id: 'returns_exchanges', label: `Returns & Exchanges (${returnsCount})` },
              { id: 'Cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setOrderFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  orderFilter === tab.id
                    ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-sm'
                    : 'bg-white dark:bg-white/5 border border-purple-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-pink-500/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Orders Card View (< lg screens) */}
          <div className="block lg:hidden space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#0B0B14] rounded-3xl border border-purple-200 dark:border-white/10 text-slate-500 text-xs">
                No matching orders found in this filter.
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const orderId = ord.id || ord._id;
                const isCOD = ord.paymentMethod === 'COD' || ord.paymentMethod === 'Cash on Delivery';
                return (
                  <div key={orderId} className="p-4 rounded-2xl bg-white dark:bg-[#0B0B14] border border-purple-200 dark:border-brand-500/25 shadow-md space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-100 dark:border-white/10">
                      <div>
                        <span className="font-mono font-black text-pink-600 dark:text-pink-400 text-xs">#{orderId}</span>
                        <span className="block text-[10px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm text-slate-900 dark:text-white">₹{ord.totalAmount}</span>
                        <span className={`block text-[9px] font-bold ${isCOD ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {isCOD ? '💵 COD' : '💳 Paid Online'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{ord.shippingAddress?.fullName || 'Customer'}</span>
                        <span className="text-[11px] text-slate-500 dark:text-white/60">{ord.shippingAddress?.city} • {ord.shippingAddress?.phone}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                        {ord.orderStatus || 'Confirmed'}
                      </span>
                    </div>

                    {/* Driver Status Card on Mobile */}
                    <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-white/[0.03] border border-purple-100 dark:border-white/10 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Delivery Partner:</span>
                        {ord.driverRequestStatus === 'accepted' && (
                          <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">✅ Accepted</span>
                        )}
                        {ord.driverRequestStatus === 'pending_acceptance' && (
                          <span className="text-[9px] font-bold text-amber-500 animate-pulse flex items-center gap-1">⏳ Awaiting</span>
                        )}
                        {ord.driverRequestStatus === 'rejected' && (
                          <span className="text-[9px] font-bold text-red-500 flex items-center gap-1">❌ Declined</span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">
                        {ord.deliveryPartnerName || 'No Driver Assigned'}
                      </p>
                      {ord.driverRejectionReason && (
                        <p className="text-[10px] text-red-500 italic">"{ord.driverRejectionReason}"</p>
                      )}
                    </div>

                    {/* Actions on Mobile */}
                    <div className="flex items-center gap-2 pt-1">
                      {(ord.driverRequestStatus === 'rejected' || !ord.deliveryPartnerName) && (
                        <button
                          type="button"
                          onClick={() => {
                            setAssignRiderModalOrder(ord);
                            setSelectedRiderName('Vikram Malhotra');
                          }}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 text-white font-bold text-xs shadow-md"
                        >
                          {ord.driverRequestStatus === 'rejected' ? 'Reassign Driver' : 'Assign Rider'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedOrderDetails(ord)}
                        className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white font-bold text-xs hover:bg-slate-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Orders Table - Desktop & Tablet Expanded View */}
          <div className="hidden lg:block overflow-x-auto rounded-3xl bg-white dark:bg-[#0B0B14] border border-purple-200 dark:border-brand-500/30 shadow-xl">
            <table className="w-full text-left border-collapse text-xs min-w-[950px]">
              <thead>
                <tr className="border-b border-purple-100 dark:border-white/10 bg-purple-50/50 dark:bg-white/[0.02] text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-white/60">
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer & City</th>
                  <th className="py-3.5 px-4">Package Items</th>
                  <th className="py-3.5 px-4">Amount & Payment</th>
                  <th className="py-3.5 px-4">Delivery Partner</th>
                  <th className="py-3.5 px-4">Lifecycle Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 dark:divide-white/5 font-medium">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-500 dark:text-white/50">
                      No matching orders found in this filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const orderId = ord.id || ord._id;
                    const st = ord.orderStatus || 'Confirmed';
                    const isCOD = ord.paymentMethod === 'COD' || ord.paymentMethod === 'Cash on Delivery';
                    const isDelivered = st === 'Delivered';
                    const isEnRoute = st === 'Out for Delivery';
                    const isReturnReq = st === 'Return Requested';
                    const isExchangeReq = st === 'Exchange Requested';
                    const isReturnInProg = st === 'Return Approved' || st === 'Return In Progress';
                    const isExchangeInProg = st === 'Exchange Approved' || st === 'Exchange In Progress';
                    const isReturned = st === 'Returned';
                    const isExchanged = st === 'Exchanged';
                    const isCancelled = st === 'Cancelled';
                    const isUnassigned = st === 'Confirmed' || st === 'Processing';

                    return (
                      <tr key={orderId} className="hover:bg-purple-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        {/* ID & Date */}
                        <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          <span>#{orderId}</span>
                          <span className="block text-[10px] text-slate-400 dark:text-white/40 font-normal">
                            {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-4">
                          <p className="font-bold text-slate-900 dark:text-white">{ord.shippingAddress?.fullName || 'Customer'}</p>
                          <p className="text-[11px] text-slate-500 dark:text-white/50">{ord.shippingAddress?.city || 'Mumbai'}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{ord.shippingAddress?.phone}</p>
                        </td>

                        {/* Items */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {ord.items?.[0] && (
                              <img
                                src={ord.items[0].image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100'}
                                alt="Item"
                                className="w-9 h-10 object-cover rounded-lg bg-slate-200 dark:bg-slate-800"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                                {ord.items?.[0]?.title || 'Apparel Item'}
                              </p>
                              <span className="text-[10px] text-slate-500 dark:text-white/50">
                                {ord.items?.length || 1} item(s) • Size {ord.items?.[0]?.size || 'M'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-4">
                          <span className="font-black text-slate-900 dark:text-white">₹{ord.totalAmount}</span>
                          <span className={`block text-[10px] font-bold ${isCOD ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {isCOD ? '💵 Cash on Delivery' : '💳 Paid Online'}
                          </span>
                        </td>

                        {/* Assigned Driver & Driver Response Status */}
                        <td className="py-4 px-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Bike className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">
                                  {ord.deliveryPartnerName || 'Unassigned'}
                                </p>
                                <span className="text-[10px] text-slate-400 dark:text-white/40 block truncate max-w-[140px]">
                                  {ord.deliveryPartnerVehicle || 'Awaiting assignment'}
                                </span>
                              </div>
                            </div>

                            {/* Live Driver Response State */}
                            {ord.driverRequestStatus === 'accepted' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span>Accepted by Driver</span>
                              </span>
                            )}
                            {ord.driverRequestStatus === 'pending_acceptance' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                                <Clock className="w-3 h-3 text-amber-500" />
                                <span>Awaiting Acceptance</span>
                              </span>
                            )}
                            {ord.driverRequestStatus === 'rejected' && (
                              <div className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-[10px] text-red-600 dark:text-red-400 space-y-0.5 max-w-[170px]">
                                <span className="font-black uppercase flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                                  Declined by Rider
                                </span>
                                <p className="text-[9px] text-slate-600 dark:text-white/70 italic truncate" title={ord.driverRejectionReason}>
                                  "{ord.driverRejectionReason || 'Unavailable'}"
                                </p>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Lifecycle Status & Dropdown */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {isReturnReq && (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold text-[10px] border border-amber-500/30">
                                ⚠️ Return Req: {ord.returnReason || 'Fit Issue'}
                              </span>
                            )}
                            {isExchangeReq && (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-600 dark:text-pink-300 font-bold text-[10px] border border-pink-500/30">
                                🔁 Exchange: Size {ord.exchangeDesiredSize || 'L'}{ord.exchangeDesiredColor ? ` • ${ord.exchangeDesiredColor}` : ''}
                              </span>
                            )}
                            {isReturned && (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-[10px] border border-purple-500/30">
                                ✅ Returned & Refunded
                              </span>
                            )}
                            {isExchanged && (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-700 dark:text-pink-300 font-bold text-[10px] border border-pink-500/30">
                                ✅ Exchanged
                              </span>
                            )}
                            {isCancelled && (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-red-500/20 text-red-600 dark:text-red-300 font-bold text-[10px] border border-red-500/30">
                                ❌ Cancelled
                              </span>
                            )}

                            <div>
                              <select
                                value={st}
                                onChange={(e) => handleStatusChange(orderId, e.target.value)}
                                className="px-2 py-1 rounded-xl text-xs font-bold bg-white dark:bg-black border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 cursor-pointer"
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Return Requested">Return Requested</option>
                                <option value="Return Approved">Return Approved</option>
                                <option value="Return In Progress">Return In Progress</option>
                                <option value="Returned">Returned</option>
                                <option value="Exchange Requested">Exchange Requested</option>
                                <option value="Exchange Approved">Exchange Approved</option>
                                <option value="Exchange In Progress">Exchange In Progress</option>
                                <option value="Exchanged">Exchanged</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        </td>

                        {/* Quick Action Button */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            {/* If Driver Rejected -> Flashy Reassign to Another Driver Button */}
                            {ord.driverRequestStatus === 'rejected' && (
                              <button
                                type="button"
                                onClick={() => setAssignRiderModalOrder(ord)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
                                title="Rider declined delivery. Click to choose another driver!"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Reassign Driver</span>
                              </button>
                            )}

                            {/* Unassigned or Pending -> Assign / Change Delivery Partner */}
                            {(isUnassigned || ord.driverRequestStatus === 'pending_acceptance') && ord.driverRequestStatus !== 'rejected' && (
                              <button
                                type="button"
                                onClick={() => setAssignRiderModalOrder(ord)}
                                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                              >
                                <Bike className="w-3 h-3" />
                                <span>{ord.driverRequestStatus === 'pending_acceptance' ? 'Change Rider' : 'Assign Rider'}</span>
                              </button>
                            )}

                            {/* Return Requested -> Approve & Assign Rider */}
                            {isReturnReq && (
                              <button
                                type="button"
                                onClick={() => {
                                  const rider = FLEET_RIDERS[0];
                                  handleAssignRider(orderId, rider);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                title="Approve Return and Assign Delivery Partner for Doorstep Pickup"
                              >
                                <Truck className="w-3 h-3" />
                                <span>Approve & Assign Pickup</span>
                              </button>
                            )}

                            {/* Exchange Requested -> Approve & Assign Rider */}
                            {isExchangeReq && (
                              <button
                                type="button"
                                onClick={() => {
                                  const rider = FLEET_RIDERS[0];
                                  handleAssignRider(orderId, rider);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                title="Approve Exchange and Assign Delivery Partner"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Approve & Dispatch Size {ord.exchangeDesiredSize || 'L'}</span>
                              </button>
                            )}

                            {/* Assigned / Shipped -> Dispatch Rider */}
                            {(st === 'Assigned' || st === 'Shipped') && (
                              <button
                                type="button"
                                onClick={() => handleSimulateDispatch(orderId)}
                                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                title="Trigger Driver Departure and send Out for Delivery message to customer"
                              >
                                <Send className="w-3 h-3" />
                                <span>Dispatch</span>
                              </button>
                            )}

                            {/* Cancel Order */}
                            {(isUnassigned || st === 'Assigned') && (
                              <button
                                type="button"
                                onClick={() => handleAdminCancelOrder(orderId)}
                                className="text-[10px] text-red-500 hover:text-red-600 font-bold underline cursor-pointer"
                              >
                                Cancel Order
                              </button>
                            )}

                            {isEnRoute && (
                              <span className="text-[10px] font-black text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-950/40 px-2 py-0.5 rounded-md">
                                Rider On Route
                              </span>
                            )}
                            {isDelivered && (
                              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                                Completed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADMIN ASSIGN RIDER MODAL */}
      {assignRiderModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0E0C18] border-2 border-brand-500/40 shadow-2xl p-6 text-slate-900 dark:text-white animate-slide-up space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-purple-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-pink-500" />
                <h3 className="text-base font-black font-display text-slate-900 dark:text-white">
                  {assignRiderModalOrder.driverRequestStatus === 'rejected' ? 'Reassign Delivery Partner' : 'Assign Delivery Partner'}
                </h3>
              </div>
              <button
                onClick={() => setAssignRiderModalOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Rejection Notice Banner */}
            {assignRiderModalOrder.driverRequestStatus === 'rejected' && (
              <div className="p-3 rounded-2xl bg-red-500/10 border-2 border-red-500/30 text-xs text-red-600 dark:text-red-300 space-y-1 animate-pulse">
                <p className="font-black flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Rider {assignRiderModalOrder.deliveryPartnerName} Declined Delivery
                </p>
                <p className="text-[11px] text-slate-700 dark:text-white/80">
                  Reason: "{assignRiderModalOrder.driverRejectionReason || 'Driver unavailable'}". Select another delivery partner below to send a new delivery request.
                </p>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-white/60">
              Select an available delivery partner for Order #{assignRiderModalOrder.id || assignRiderModalOrder._id} (Customer: {assignRiderModalOrder.shippingAddress?.fullName}, {assignRiderModalOrder.shippingAddress?.city}):
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {activeFleet.map((rider) => {
                const isPreviousDeclined =
                  assignRiderModalOrder.driverRequestStatus === 'rejected' &&
                  rider.name === assignRiderModalOrder.deliveryPartnerName;

                return (
                  <div
                    key={rider.name}
                    onClick={() => setSelectedRiderName(rider.name)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      selectedRiderName === rider.name
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30 shadow-md'
                        : isPreviousDeclined
                        ? 'border-red-300/40 bg-red-50/30 dark:bg-red-950/20 opacity-70'
                        : 'border-purple-200 dark:border-white/10 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm ${
                        isPreviousDeclined ? 'bg-red-500' : 'bg-gradient-to-tr from-brand-600 to-pink-600'
                      }`}>
                        {rider.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{rider.name}</p>
                          {isPreviousDeclined && (
                            <span className="text-[9px] font-black uppercase text-red-500 bg-red-100 dark:bg-red-950/60 px-1.5 py-0.2 rounded">
                              Declined
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-white/50">{rider.vehicle}</p>
                        <p className="text-[10px] text-pink-500 font-mono">{rider.phone}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-500 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      {rider.rating}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAssignRiderModalOrder(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const rider = activeFleet.find((r) => r.name === selectedRiderName) || activeFleet[0];
                  handleAssignRider(assignRiderModalOrder.id || assignRiderModalOrder._id, rider);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                {assignRiderModalOrder.driverRequestStatus === 'rejected' ? `Reassign to ${selectedRiderName}` : `Send Request to ${selectedRiderName}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DELIVERY FLEET & RIDERS OVERSIGHT                                  */}
      {/* ========================================================================= */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Delivery Hero Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-purple-200 dark:border-brand-500/30 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-pink-600 p-0.5 shadow-lg shadow-pink-500/25">
                    <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-xl font-black text-white font-display">
                      V
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">Vikram Malhotra</h3>
                      <span className="px-2 py-0.2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">
                        🟢 Active On Duty
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-white/60">
                      VibeWear Certified Lead Dispatch Rider
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  4.9 ★ (1,420+ drops)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] space-y-2 text-xs border border-purple-100 dark:border-white/5">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/60">Fleet Email:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">delivery@vibewear.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/60">Phone Contact:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">+91 98201 55432</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/60">Assigned EV Vehicle:</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400">Hero Electric Optima - MH 02 CW 9921</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/60">Driving License:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">DL-MH-02-2023-88412</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-white/60">
                  Active Assigned Orders: <strong>{allOrders.length} packages</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleSimulateDispatch('VW-98241')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  Simulate Rider Dispatch
                </button>
              </div>
            </div>

            {/* Fleet Registration & Security Code Policy */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-purple-200 dark:border-brand-500/30 shadow-xl space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-pink-500" />
                <span>Rider Fleet Registration Policy</span>
              </h3>

              <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed">
                To prevent unauthorized users from registering as delivery partners, riders must provide valid government driving credentials and the company access key:
              </p>

              <div className="p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-white">Required Rider Authorization Code:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-pink-600 text-white font-mono font-black text-xs">
                    VIBE-RIDER-2026
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-white/70 text-[11px] pt-1">
                  <li>Mandatory Driving License Number verification</li>
                  <li>Mandatory Registered EV / Two-wheeler details</li>
                  <li>Direct access to customer addresses, call hero, and dispatch updater</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRODUCT CATALOG & STOCK (CONNECTED WITH STOREFRONT)                */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (() => {
        const liveCatalog = products && products.length > 0 ? products : [];
        const filteredCatalog = liveCatalog.filter((prod) => {
          if (productCategoryFilter !== 'All') {
            if ((prod.category || '').toLowerCase() !== productCategoryFilter.toLowerCase()) {
              return false;
            }
          }
          if (productSearch.trim()) {
            const q = productSearch.toLowerCase();
            return (
              (prod.title || '').toLowerCase().includes(q) ||
              (prod.category || '').toLowerCase().includes(q)
            );
          }
          return true;
        });

        return (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#0B0B14] p-4 rounded-3xl border border-purple-200 dark:border-brand-500/30 shadow-lg">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
                {['All', 'Men', 'Women', 'Kids', 'Accessories'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      productCategoryFilter === cat
                        ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-sm'
                        : 'bg-purple-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:bg-purple-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 md:w-56">
                  <Search className="w-4 h-4 text-pink-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search product catalog..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black/40 border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setAddProductModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-pink-500/25 cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredCatalog.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#0B0B14] rounded-3xl border border-purple-200 dark:border-white/10 p-8 space-y-3">
                <Package className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">No products match your search</h4>
                <p className="text-xs text-slate-500 dark:text-white/60">Try clearing filters or click "Add Product" to add a new clothing item.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredCatalog.map((prod) => {
                  const pId = prod.id || prod._id;
                  const currentStock = prod.stock ?? 25;
                  const isOutOfStock = currentStock <= 0;

                  return (
                    <div
                      key={pId}
                      className="bg-white dark:bg-[#0B0B14] rounded-3xl border border-purple-200 dark:border-brand-500/30 p-4 shadow-xl flex flex-col justify-between group hover:border-pink-500/50 transition-all"
                    >
                      <div>
                        <div className="relative rounded-2xl overflow-hidden aspect-4/3 mb-3 bg-slate-100 dark:bg-slate-800">
                          <img
                            src={prod.image || prod.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                            alt={prod.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 text-white backdrop-blur-md">
                            {prod.category || 'Apparel'}
                          </span>
                          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/90 dark:bg-black/80 text-slate-900 dark:text-white backdrop-blur-md">
                            ID: {String(pId).slice(0, 10)}
                          </span>
                        </div>

                        <h4 className="font-black text-sm text-slate-900 dark:text-white line-clamp-1">{prod.title}</h4>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="font-extrabold text-pink-600 dark:text-pink-400">₹{prod.price}</span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isOutOfStock
                                ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                                : currentStock < 15
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {isOutOfStock ? 'Out of Stock' : `${currentStock} units`}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-purple-100 dark:border-white/10 flex items-center justify-between gap-2 text-xs">
                        {/* Stock Quick Adjustment */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onUpdateProductStock && onUpdateProductStock(pId, Math.max(0, currentStock - 5))}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold flex items-center justify-center cursor-pointer"
                            title="Decrease 5 stock units"
                          >
                            -5
                          </button>
                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-white min-w-[20px] text-center">
                            {currentStock}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateProductStock && onUpdateProductStock(pId, currentStock + 10)}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold flex items-center justify-center cursor-pointer"
                            title="Add 10 stock units"
                          >
                            +10
                          </button>
                        </div>

                        {/* Remove / Delete Product */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProductClick(pId, prod.title)}
                          className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                          title="Remove product from store"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ADD PRODUCT MODAL */}
            {addProductModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#0E0C18] border-2 border-brand-500/40 shadow-2xl p-6 text-slate-900 dark:text-white animate-slide-up space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-100 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-pink-500" />
                      <h3 className="text-base font-black font-display text-slate-900 dark:text-white">
                        Add New Fashion Item to Storefront
                      </h3>
                    </div>
                    <button
                      onClick={() => setAddProductModalOpen(false)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddNewProductSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Cyberpunk Streetwear Hoodie"
                        value={newProductData.title}
                        onChange={(e) => setNewProductData({ ...newProductData, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">Category</label>
                        <select
                          value={newProductData.category}
                          onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 cursor-pointer"
                        >
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                          <option value="Kids">Kids</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">Price (₹ INR) *</label>
                        <input
                          type="number"
                          required
                          min="99"
                          value={newProductData.price}
                          onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">Initial Stock Units</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={newProductData.stock}
                          onChange={(e) => setNewProductData({ ...newProductData, stock: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">Image URL</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={newProductData.image}
                          onChange={(e) => setNewProductData({ ...newProductData, image: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={newProductData.description}
                        onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setAddProductModalOpen(false)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/25 transition-all cursor-pointer"
                      >
                        Add to Storefront
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* TAB 4: SECURITY & USER ACCESS RULES                                       */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-purple-300 dark:border-brand-500/40 shadow-xl space-y-6">
            <div className="border-b border-purple-100 dark:border-white/10 pb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <span>Multi-Tier Role Authorization & Registration Security Policy</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-white/70 mt-1">
                As requested, random or unauthorized visitors cannot register or login as an Administrator or Delivery Driver without strict verification:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer Tier */}
              <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-white/[0.02] border border-purple-200 dark:border-white/10 space-y-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white">
                  Tier 1: Customer
                </span>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">Shopper & Buyer</h4>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-white/70">
                  <li>✓ Open registration with Name & Email</li>
                  <li>✓ Minimum 8-character password enforcement</li>
                  <li>✓ Access: Storefront, Cart, Wishlist, Order Tracking</li>
                  <li>✕ Cannot access Rider Hub or Admin Console</li>
                </ul>
              </div>

              {/* Delivery Partner Tier */}
              <div className="p-5 rounded-2xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-300 dark:border-pink-500/30 space-y-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-600 text-white">
                  Tier 2: Delivery Hero (Rider)
                </span>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">Fleet Partner</h4>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-white/70">
                  <li>🔒 <strong>Access Code:</strong> <code className="bg-pink-100 dark:bg-pink-950 px-1 py-0.5 rounded font-bold text-pink-600">VIBE-RIDER-2026</code></li>
                  <li>✓ Valid Driving License Number required</li>
                  <li>✓ Vehicle Registration & Model required</li>
                  <li>✓ Access: Rider Delivery Portal, Order Items Inspect</li>
                </ul>
              </div>

              {/* Administrator Tier */}
              <div className="p-5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/20 border border-purple-400 dark:border-purple-500/40 space-y-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-700 text-white">
                  Tier 3: Executive Admin
                </span>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">Store & Operations Control</h4>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-white/70">
                  <li>🔒 <strong>Master Key:</strong> <code className="bg-purple-100 dark:bg-purple-950 px-1 py-0.5 rounded font-bold text-purple-600">VIBE-ADMIN-2026</code></li>
                  <li>✓ Official corporate <strong>@vibewear.com</strong> email only</li>
                  <li>✓ Access: Revenue Analytics, Full Order Control, Fleet Reassign</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
