import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle, Sparkles, UserPlus } from 'lucide-react';

const AuthModal = () => {
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
    needRegisterFirst
  } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Customer'
  });

  if (!authModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (authError) setAuthError(null);
    if (authSuccessNotice) setAuthSuccessNotice(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authModalMode === 'login') {
      await login(formData.email, formData.password);
    } else {
      if (!formData.password || formData.password.length < 8) {
        setAuthError('Password must be at least 8 characters or digits long.');
        return;
      }
      const res = await register(formData.name, formData.email, formData.password, formData.role);
      if (res?.success) {
        // Clear password to enforce manual login after registration
        setFormData((prev) => ({ ...prev, password: '' }));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0B0B12] shadow-2xl border border-purple-200 dark:border-brand-500/30 text-slate-900 dark:text-white animate-slide-up">
        {/* Glow Accents - Strictly Purple & Pink */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-brand-600/20 dark:bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-pink-600/15 dark:bg-pink-600/25 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setAuthError(null);
            if (setAuthSuccessNotice) setAuthSuccessNotice(null);
          }}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 sm:p-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-pink-600 to-purple-500 shadow-lg shadow-brand-500/30 mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              {authModalMode === 'login' ? 'Sign In to VibeWear' : 'Create an Account'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/70 mt-1">
              {authModalMode === 'login'
                ? 'Sign in to access your bag, saved items, and checkout.'
                : 'Please register first (minimum 8-character password), then log in.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-purple-200 dark:border-brand-500/20 mb-6">
            <button
              type="button"
              onClick={switchToLogin}
              className={`flex-1 pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
                authModalMode === 'login'
                  ? 'text-slate-900 dark:text-white'
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
              className={`flex-1 pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
                authModalMode === 'register'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white'
              }`}
            >
              Register (Required)
              {authModalMode === 'register' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-brand-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Success notice after registration instructing compulsory login */}
          {authSuccessNotice && authModalMode === 'login' && (
            <div className="mb-5 p-4 rounded-2xl bg-purple-50 dark:bg-brand-950/70 border border-purple-300 dark:border-brand-500/50 text-slate-800 dark:text-white text-xs space-y-1.5 shadow-sm animate-fade-in">
              <div className="flex items-start gap-2 text-pink-700 dark:text-pink-300 font-bold">
                <Sparkles className="w-5 h-5 shrink-0 text-pink-600 dark:text-pink-400 mt-0.5" />
                <span>{authSuccessNotice}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-white/70 pl-7">
                Please enter your registered password below and click "Sign In" to proceed.
              </p>
            </div>
          )}

          {/* Special Notice if user needs to register first */}
          {needRegisterFirst && authModalMode === 'login' && (
            <div className="mb-5 p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-500/50 text-slate-800 dark:text-white text-xs space-y-2.5 animate-pulse-subtle">
              <div className="flex items-start gap-2 text-pink-700 dark:text-pink-300 font-bold">
                <AlertCircle className="w-5 h-5 shrink-0 text-pink-600 dark:text-pink-400 mt-0.5" />
                <span>Account not found! You must create an account first before you can log in.</span>
              </div>
              <button
                type="button"
                onClick={switchToRegister}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-pink-600 to-brand-600 hover:from-pink-500 hover:to-brand-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create an Account First</span>
              </button>
            </div>
          )}

          {/* Generic Auth Error */}
          {authError && !needRegisterFirst && (
            <div className="mb-4 p-3 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-300 dark:border-pink-500/40 text-pink-700 dark:text-pink-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-pink-600 dark:text-pink-400" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
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
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all hover:border-purple-300"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                Email Address <span className="text-pink-600 dark:text-pink-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all hover:border-purple-300"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-white/80">
                  Password <span className="text-pink-600 dark:text-pink-400">*</span>
                </label>
                {authModalMode === 'register' && (
                  <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold">Min 8 Characters Required</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={authModalMode === 'register' ? 8 : 6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={authModalMode === 'register' ? 'Minimum 8 characters / digits' : 'Enter your password'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all hover:border-purple-300"
                />
              </div>
              {authModalMode === 'register' && (
                <p className="text-[10px] text-slate-500 dark:text-white/50 mt-1">
                  * Password must be at least 8 characters or digits.
                </p>
              )}
            </div>

            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                  Account Type
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-all cursor-pointer"
                >
                  <option value="Customer" className="bg-white dark:bg-[#0B0B12] text-slate-900 dark:text-white">Customer (Shopper)</option>
                  <option value="Admin" className="bg-white dark:bg-[#0B0B12] text-slate-900 dark:text-white">Admin (Manager)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 hover:shadow-pink-600/40 transition-all disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authModalMode === 'login' ? 'Sign In to Account' : 'Complete Registration'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-5 text-center text-xs text-slate-500 dark:text-white/60">
            {authModalMode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={switchToRegister}
                  className="text-pink-600 dark:text-pink-400 hover:underline font-bold cursor-pointer"
                >
                  Register Here First
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-purple-600 dark:text-brand-400 hover:underline font-bold cursor-pointer"
                >
                  Sign In Here
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
