import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
  UserPlus,
  Truck,
  Phone,
  Bike,
  KeyRound,
  FileCheck2,
  CheckCircle2,
  Info
} from 'lucide-react';

const AuthModal = ({ onLoginSuccess }) => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    loading,
    authError,
    setAuthError,
    authSuccessNotice,
    setAuthSuccessNotice,
    needRegisterFirst,
    switchDemoUser
  } = useAuth();

  const [loginRoleTab, setLoginRoleTab] = useState('Customer'); // 'Customer' | 'DeliveryPartner' | 'Admin'
  const [registerRole, setRegisterRole] = useState('Customer'); // 'Customer' | 'DeliveryPartner' | 'Admin'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleDetails: '',
    licenseNumber: '',
    securityKey: ''
  });

  if (!authModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (authError) setAuthError(null);
    if (authSuccessNotice) setAuthSuccessNotice(null);
  };

  const handleInstantDemoLogin = (role) => {
    if (switchDemoUser) {
      switchDemoUser(role);
    }
    setAuthModalOpen(false);
    if (onLoginSuccess) {
      onLoginSuccess(role);
    }
  };

  const handleQuickFillLogin = (role) => {
    setLoginRoleTab(role);
    if (role === 'DeliveryPartner') {
      setFormData((prev) => ({
        ...prev,
        email: 'delivery@vibewear.com',
        password: 'Password123!'
      }));
    } else if (role === 'Customer') {
      setFormData((prev) => ({
        ...prev,
        email: 'john@example.com',
        password: 'Password123!'
      }));
    } else if (role === 'Admin') {
      setFormData((prev) => ({
        ...prev,
        email: 'admin@vibewear.com',
        password: 'Password123!'
      }));
    }
    if (authError) setAuthError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authModalMode === 'login') {
      const res = await login(formData.email, formData.password, loginRoleTab);
      if (res?.success) {
        if (onLoginSuccess) {
          onLoginSuccess(res.user?.role || loginRoleTab);
        }
      }
    } else {
      if (!formData.password || formData.password.length < 8) {
        setAuthError('Password must be at least 8 characters or digits long.');
        return;
      }

      // Security validations for specialized roles
      if (registerRole === 'Admin') {
        if (!formData.email.toLowerCase().endsWith('@vibewear.com')) {
          setAuthError('Admin registration requires an official corporate email ending with @vibewear.com');
          return;
        }
        if (formData.securityKey !== 'VIBE-ADMIN-2026') {
          setAuthError('Invalid Admin Security Key! You must enter the authorized master key (VIBE-ADMIN-2026).');
          return;
        }
      } else if (registerRole === 'DeliveryPartner') {
        if (!formData.phone || formData.phone.length < 10) {
          setAuthError('Valid contact phone number is compulsory for delivery fleet registration.');
          return;
        }
        if (!formData.vehicleDetails || formData.vehicleDetails.length < 4) {
          setAuthError('Vehicle details (model & registration number) are required.');
          return;
        }
        if (!formData.licenseNumber || formData.licenseNumber.length < 6) {
          setAuthError('Valid Driving License Number (DL No.) is compulsory.');
          return;
        }
        if (formData.securityKey !== 'VIBE-RIDER-2026') {
          setAuthError('Invalid Rider Access Code! Enter the authorized rider code (VIBE-RIDER-2026).');
          return;
        }
      }

      const res = await register(
        formData.name,
        formData.email,
        formData.password,
        registerRole,
        formData.phone,
        formData.vehicleDetails,
        formData.licenseNumber,
        formData.securityKey
      );

      if (res?.success) {
        setLoginRoleTab(registerRole);
        setFormData((prev) => ({ ...prev, password: '', securityKey: '' }));
      }
    }
  };

  const switchToRegister = () => {
    setAuthModalMode('register');
    setAuthError(null);
    if (setAuthSuccessNotice) setAuthSuccessNotice(null);
  };

  const switchToLogin = () => {
    setAuthModalMode('login');
    setAuthError(null);
    if (setAuthSuccessNotice) setAuthSuccessNotice(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B12] shadow-2xl border border-purple-200 dark:border-brand-500/30 text-slate-900 dark:text-white animate-slide-up max-h-[92vh] flex flex-col">
        {/* Glow Accents */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-brand-600/20 dark:bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-pink-600/15 dark:bg-pink-600/25 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setAuthError(null);
            if (setAuthSuccessNotice) setAuthSuccessNotice(null);
          }}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-8 overflow-y-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-pink-600 to-purple-500 shadow-lg shadow-brand-500/30 mb-2">
              {authModalMode === 'login' ? (
                loginRoleTab === 'DeliveryPartner' ? (
                  <Truck className="w-6 h-6 text-white" />
                ) : loginRoleTab === 'Admin' ? (
                  <ShieldCheck className="w-6 h-6 text-white" />
                ) : (
                  <Sparkles className="w-6 h-6 text-white" />
                )
              ) : registerRole === 'DeliveryPartner' ? (
                <Bike className="w-6 h-6 text-white" />
              ) : registerRole === 'Admin' ? (
                <KeyRound className="w-6 h-6 text-white" />
              ) : (
                <UserPlus className="w-6 h-6 text-white" />
              )}
            </div>

            <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">
              {authModalMode === 'login'
                ? loginRoleTab === 'DeliveryPartner'
                  ? '🛵 Rider Hub Portal Login'
                  : loginRoleTab === 'Admin'
                  ? '👑 Executive Admin Console'
                  : 'Sign In to VibeWear'
                : registerRole === 'DeliveryPartner'
                ? '🛵 Register Delivery Partner Fleet'
                : registerRole === 'Admin'
                ? '👑 Register Store Administrator'
                : 'Create Customer Account'}
            </h3>

            <p className="text-xs text-slate-500 dark:text-white/70 mt-1 max-w-sm mx-auto">
              {authModalMode === 'login'
                ? loginRoleTab === 'DeliveryPartner'
                  ? 'Delivery Hero authorization required. Access customer routes & status updates.'
                  : loginRoleTab === 'Admin'
                  ? 'Restricted to verified administrators with store management clearance.'
                  : 'Access your shopping bag, order tracking, and customized wishlist.'
                : registerRole === 'DeliveryPartner'
                ? 'Requires verified Driving License, vehicle registration, and Rider Access Code.'
                : registerRole === 'Admin'
                ? 'Requires corporate @vibewear.com email and Admin Security Key (VIBE-ADMIN-2026).'
                : 'Join VibeWear to explore premium fashion drops and express 1-day delivery.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-purple-200 dark:border-brand-500/20 mb-5">
            <button
              type="button"
              onClick={switchToLogin}
              className={`flex-1 pb-3 text-sm font-bold transition-all relative cursor-pointer ${
                authModalMode === 'login'
                  ? 'text-pink-600 dark:text-pink-400'
                  : 'text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white'
              }`}
            >
              Sign In
              {authModalMode === 'login' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 to-pink-500 rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={switchToRegister}
              className={`flex-1 pb-3 text-sm font-bold transition-all relative cursor-pointer ${
                authModalMode === 'register'
                  ? 'text-pink-600 dark:text-pink-400'
                  : 'text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white'
              }`}
            >
              Create Account
              {authModalMode === 'register' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-brand-500 rounded-full" />
              )}
            </button>
          </div>

          {/* 1-Click Instant Demo Login & Dashboard Launch */}
          {authModalMode === 'login' && (
            <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-purple-300/70 dark:border-white/10 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  1-Click Instant Login & Open Dashboard:
                </span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-white/40">Demo Quick Access</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin('Customer')}
                  className="p-2 rounded-xl bg-white dark:bg-[#12121E] hover:bg-pink-50 dark:hover:bg-pink-950/40 border border-purple-200 dark:border-white/10 text-slate-800 dark:text-white flex flex-col items-center text-center gap-1 transition-all hover:scale-[1.02] cursor-pointer shadow-xs group"
                >
                  <User className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black">Customer</span>
                  <span className="text-[9px] text-pink-600 dark:text-pink-400 font-semibold">John Doe</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin('DeliveryPartner')}
                  className="p-2 rounded-xl bg-white dark:bg-[#12121E] hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-purple-200 dark:border-white/10 text-slate-800 dark:text-white flex flex-col items-center text-center gap-1 transition-all hover:scale-[1.02] cursor-pointer shadow-xs group"
                >
                  <Truck className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black">Driver / Rider</span>
                  <span className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold">Vikram (Fleet)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin('Admin')}
                  className="p-2 rounded-xl bg-white dark:bg-[#12121E] hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-purple-200 dark:border-white/10 text-slate-800 dark:text-white flex flex-col items-center text-center gap-1 transition-all hover:scale-[1.02] cursor-pointer shadow-xs group"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black">Store Admin</span>
                  <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold">VibeWear HQ</span>
                </button>
              </div>
            </div>
          )}

          {/* LOGIN ROLE SELECTOR TABS */}
          {authModalMode === 'login' && (
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 block mb-1.5">
                Manual Portal Sign In:
              </span>
              <div className="p-1 rounded-2xl bg-purple-50 dark:bg-white/[0.04] border border-purple-200 dark:border-white/10 flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickFillLogin('Customer')}
                  className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    loginRoleTab === 'Customer'
                      ? 'bg-white dark:bg-[#12121E] text-slate-900 dark:text-white shadow-xs border border-purple-200/60 dark:border-pink-500/30'
                      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-pink-500" />
                  <span>Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFillLogin('DeliveryPartner')}
                  className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    loginRoleTab === 'DeliveryPartner'
                      ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Delivery Hero</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFillLogin('Admin')}
                  className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    loginRoleTab === 'Admin'
                      ? 'bg-gradient-to-r from-purple-700 to-slate-900 text-white shadow-md'
                      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Verified Demo Credentials Hint */}
              <div className="mt-2 text-[11px] text-slate-500 dark:text-white/60 flex items-center justify-between">
                <span>Quick demo credentials auto-filled for instant testing.</span>
                <span className="font-mono text-pink-600 dark:text-pink-400 font-bold">Password123!</span>
              </div>
            </div>
          )}

          {/* REGISTER ACCOUNT TYPE SELECTOR */}
          {authModalMode === 'register' && (
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1.5">
                Select Registration Clearance:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRegisterRole('Customer');
                    if (authError) setAuthError(null);
                  }}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    registerRole === 'Customer'
                      ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-500 text-pink-700 dark:text-pink-300 shadow-sm'
                      : 'bg-white dark:bg-white/5 border-purple-200 dark:border-white/10 text-slate-700 dark:text-white/70'
                  }`}
                >
                  <User className="w-4 h-4 text-pink-500" />
                  <span>Customer</span>
                  <span className="text-[9px] opacity-70">General Shopper</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRegisterRole('DeliveryPartner');
                    if (authError) setAuthError(null);
                  }}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    registerRole === 'DeliveryPartner'
                      ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-500 text-pink-700 dark:text-pink-300 shadow-sm'
                      : 'bg-white dark:bg-white/5 border-purple-200 dark:border-white/10 text-slate-700 dark:text-white/70'
                  }`}
                >
                  <Bike className="w-4 h-4 text-pink-500" />
                  <span>Driver / Rider</span>
                  <span className="text-[9px] opacity-70">Fleet Partner</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRegisterRole('Admin');
                    if (authError) setAuthError(null);
                  }}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    registerRole === 'Admin'
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm'
                      : 'bg-white dark:bg-white/5 border-purple-200 dark:border-white/10 text-slate-700 dark:text-white/70'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span>Store Admin</span>
                  <span className="text-[9px] opacity-70">Operations Staff</span>
                </button>
              </div>
            </div>
          )}

          {/* Success notice */}
          {authSuccessNotice && authModalMode === 'login' && (
            <div className="mb-4 p-3.5 rounded-2xl bg-purple-50 dark:bg-brand-950/70 border border-purple-300 dark:border-brand-500/50 text-slate-800 dark:text-white text-xs space-y-1 shadow-sm animate-fade-in">
              <div className="flex items-start gap-2 text-pink-700 dark:text-pink-300 font-bold">
                <Sparkles className="w-4 h-4 shrink-0 text-pink-600 dark:text-pink-400 mt-0.5" />
                <span>{authSuccessNotice}</span>
              </div>
            </div>
          )}

          {/* Auth Error Banner */}
          {authError && (
            <div className="mb-4 p-3.5 rounded-2xl bg-pink-50 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-500/50 text-pink-800 dark:text-pink-200 text-xs flex items-start gap-2.5 animate-slide-up">
              <AlertCircle className="w-4 h-4 shrink-0 text-pink-600 dark:text-pink-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Verification Notice</span>
                <span className="leading-relaxed">{authError}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">
                    Full Name <span className="text-pink-600 dark:text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={registerRole === 'DeliveryPartner' ? 'e.g. Vikram Malhotra' : 'e.g. Ananya Sharma'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Driver-Specific Required Fields */}
                {registerRole === 'DeliveryPartner' && (
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-white/[0.03] border border-purple-200 dark:border-white/10 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      Rider Fleet Verification Details
                    </span>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-white/80 mb-1">
                        Mobile Phone Number <span className="text-pink-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98201 55432"
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black border border-purple-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-white/80 mb-1">
                        Vehicle Details & Reg Number <span className="text-pink-500">*</span>
                      </label>
                      <div className="relative">
                        <Bike className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="vehicleDetails"
                          required
                          value={formData.vehicleDetails}
                          onChange={handleChange}
                          placeholder="e.g. Hero Electric Optima - MH 02 CW 9921"
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black border border-purple-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-white/80 mb-1">
                        Driving License Number (DL No.) <span className="text-pink-500">*</span>
                      </label>
                      <div className="relative">
                        <FileCheck2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="licenseNumber"
                          required
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          placeholder="e.g. DL-MH-02-2023-88412"
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black border border-purple-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-white/80 mb-1">
                        Rider Access Code <span className="text-pink-500">*</span>
                      </label>
                      <div className="relative">
                        <KeyRound className="w-3.5 h-3.5 text-pink-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="securityKey"
                          required
                          value={formData.securityKey}
                          onChange={handleChange}
                          placeholder="Enter Code: VIBE-RIDER-2026"
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black border border-pink-500/50 rounded-xl text-xs text-slate-900 dark:text-white font-mono font-bold"
                        />
                      </div>
                      <span className="text-[10px] text-pink-600 dark:text-pink-400 block mt-1">
                        🔑 Authorized Rider Passcode is <strong>VIBE-RIDER-2026</strong>
                      </span>
                    </div>
                  </div>
                )}

                {/* Admin-Specific Required Fields */}
                {registerRole === 'Admin' && (
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-white/[0.03] border border-purple-200 dark:border-white/10 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Executive Security Clearance
                    </span>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-white/80 mb-1">
                        Admin Security Master Key <span className="text-purple-500">*</span>
                      </label>
                      <div className="relative">
                        <KeyRound className="w-3.5 h-3.5 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          name="securityKey"
                          required
                          value={formData.securityKey}
                          onChange={handleChange}
                          placeholder="Enter Key: VIBE-ADMIN-2026"
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black border border-purple-500/50 rounded-xl text-xs text-slate-900 dark:text-white font-mono font-bold"
                        />
                      </div>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 block mt-1">
                        🔑 Authorized Admin Master Key is <strong>VIBE-ADMIN-2026</strong>
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">
                Email Address <span className="text-pink-600 dark:text-pink-400">*</span>
                {authModalMode === 'register' && registerRole === 'Admin' && (
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 ml-1">(@vibewear.com required)</span>
                )}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={
                    authModalMode === 'register' && registerRole === 'Admin'
                      ? 'admin@vibewear.com'
                      : authModalMode === 'login' && loginRoleTab === 'DeliveryPartner'
                      ? 'delivery@vibewear.com'
                      : 'you@domain.com'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-white/80">
                  Password <span className="text-pink-600 dark:text-pink-400">*</span>
                </label>
                {authModalMode === 'register' && (
                  <span className="text-[10px] text-slate-400 dark:text-white/40 font-mono">Min 8 characters</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-pink-600 to-purple-600 hover:from-brand-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : authModalMode === 'login' ? (
                <>
                  <span>Sign In as {loginRoleTab}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Register Verified {registerRole}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-5 text-center text-xs text-slate-500 dark:text-white/60">
            {authModalMode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={switchToRegister}
                  className="font-bold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
                >
                  Create an Account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="font-bold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
                >
                  Sign In Directly
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
