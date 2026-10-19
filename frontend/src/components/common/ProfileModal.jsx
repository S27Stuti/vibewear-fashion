import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  ExternalLink
} from 'lucide-react';

const ProfileModal = () => {
  const {
    user,
    isAuthenticated,
    isProfileOpen,
    closeProfile,
    logout,
    updateUserProfile,
    userOrders
  } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'address' | 'settings'
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '+91 98765 43210');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isProfileOpen || !isAuthenticated || !user) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      phone: editPhone
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B12] border border-purple-200 dark:border-brand-500/30 shadow-2xl text-slate-900 dark:text-white animate-slide-up max-h-[90vh] flex flex-col">
        {/* Glow Spots */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-600/15 dark:bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-600/15 dark:bg-pink-600/25 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-purple-200 dark:border-brand-500/20 bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-brand-950 dark:via-black dark:to-pink-950/80 relative">
          <button
            onClick={closeProfile}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-pink-600 to-purple-600 p-0.5 shadow-xl shadow-brand-600/30">
              <div className="w-full h-full bg-white dark:bg-[#0B0B12] rounded-2xl flex items-center justify-center text-xl font-bold font-display text-slate-900 dark:text-white">
                {user.name ? user.name[0] : 'U'}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">{user.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 dark:bg-brand-500/20 dark:text-pink-300 border border-pink-200 dark:border-brand-500/30">
                  {user.role || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-white/60 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6 pt-2 border-t border-purple-200 dark:border-brand-500/20">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Order History ({userOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('address')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'address'
                  ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Shipping Address</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Order History Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 dark:bg-brand-600/10 border border-purple-200 dark:border-brand-500/20 flex items-center justify-center mx-auto dark:text-pink-400">
                    <Package className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">No orders placed yet</p>
                  <p className="text-xs text-slate-500 dark:text-white/60">Discover your style in our Men, Women, and Kids collections.</p>
                </div>
              ) : (
                userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-black/60 border border-purple-200/80 dark:border-brand-500/20 hover:border-pink-500/40 transition-all space-y-3 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-purple-200 dark:border-brand-500/15 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{order.id}</span>
                        <span className="text-slate-500 dark:text-white/60">• {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {order.orderStatus || 'Confirmed'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto py-1">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2 shrink-0 bg-white dark:bg-black/80 p-1.5 rounded-xl border border-purple-200 dark:border-brand-500/20 shadow-xs">
                          <img
                            src={it.image || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=200'}
                            alt="Item"
                            className="w-10 h-12 object-cover rounded-lg bg-slate-100 dark:bg-black"
                          />
                          <div className="text-[11px] pr-2">
                            <p className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-[130px]">{it.title}</p>
                            <p className="text-slate-500 dark:text-white/60">Qty: {it.qty || 1} • {it.size || 'M'}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-500 dark:text-white/60">Paid via {order.paymentMethod}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        Total: <strong className="text-pink-600 dark:text-pink-400">₹{order.totalAmount}</strong>
                      </span>
                    </div>
                  </div>
                ))
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
                <p className="text-slate-900 dark:text-white font-medium">{user.name}</p>
                <p className="text-slate-600 dark:text-white/70">
                  {user.address?.street || '108 Fashion Boulevard, Suite 400'}
                </p>
                <p className="text-slate-600 dark:text-white/70">
                  {user.address?.city || 'Mumbai'}, {user.address?.state || 'Maharashtra'} - {user.address?.postalCode || '400001'}
                </p>
                <p className="text-slate-600 dark:text-white/70 flex items-center gap-1 pt-1">
                  <Phone className="w-3 h-3 text-pink-600 dark:text-pink-400" />
                  {user.phone || '+91 98765 43210'}
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
                  value={user.email}
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
  );
};

export default ProfileModal;
