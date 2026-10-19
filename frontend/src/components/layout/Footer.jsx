import React, { useState } from 'react';
import {
  Send,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  Globe,
  Share2
} from 'lucide-react';

const Footer = ({ onSelectCategory }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-white dark:bg-[#06060A] border-t border-purple-200 dark:border-brand-500/20 text-slate-700 dark:text-slate-300 transition-colors duration-200">
      {/* Brand Value Pillars */}
      <div className="border-b border-purple-100 dark:border-white/10 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-purple-100 dark:border-transparent hover:border-purple-300 dark:hover:border-brand-500/30 transition-all shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-brand-600 dark:text-brand-500" />
            </div>
            <div>
              <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">Free Express Delivery</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">On all orders over $75</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-purple-100 dark:border-transparent hover:border-purple-300 dark:hover:border-brand-500/30 transition-all shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 text-pink-600 dark:text-pink-500" />
            </div>
            <div>
              <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">30-Day Easy Returns</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Instant store credit or refund</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-purple-100 dark:border-transparent hover:border-purple-300 dark:hover:border-brand-500/30 transition-all shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-brand-600 dark:text-brand-500" />
            </div>
            <div>
              <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">100% Authentic Quality</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Premium combed fabrics</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-purple-100 dark:border-transparent hover:border-purple-300 dark:hover:border-brand-500/30 transition-all shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6 text-pink-600 dark:text-pink-500" />
            </div>
            <div>
              <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">24/7 Priority Support</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Dedicated styling assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-pink-600 flex items-center justify-center text-white font-display font-black text-lg shadow-md shadow-brand-600/30">
                V
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-slate-950 dark:text-white">
                VIBE<span className="text-pink-500">WEAR</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm font-normal">
              VibeWear is an independent fashion house delivering curated streetwear, refined essentials, and modern playful aesthetics for Men, Women, and Kids globally.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#instagram"
                className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-white/5 hover:bg-brand-600 dark:hover:bg-brand-600/30 border border-purple-200 dark:border-white/10 flex items-center justify-center text-purple-700 dark:text-slate-400 hover:text-white transition-all shadow-sm dark:shadow-none"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#twitter"
                className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-white/5 hover:bg-brand-600 dark:hover:bg-brand-600/30 border border-purple-200 dark:border-white/10 flex items-center justify-center text-purple-700 dark:text-slate-400 hover:text-white transition-all shadow-sm dark:shadow-none"
                aria-label="X Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="#youtube"
                className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-white/5 hover:bg-brand-600 dark:hover:bg-brand-600/30 border border-purple-200 dark:border-white/10 flex items-center justify-center text-purple-700 dark:text-slate-400 hover:text-white transition-all shadow-sm dark:shadow-none"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h5 className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button type="button" onClick={() => onSelectCategory('Men')} className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer text-left">
                  Men's Streetwear
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('Women')} className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer text-left">
                  Women's Contemporary
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('Kids')} className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer text-left">
                  Kids' Playful Apparel
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('All')} className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer text-left">
                  Featured Drops
                </button>
              </li>
              <li>
                <span className="text-pink-600 dark:text-pink-400 font-bold cursor-pointer">
                  Season Clearance (Up to 50%)
                </span>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Customer Support
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li><a href="#orders" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Track Order Status</a></li>
              <li><a href="#shipping" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Shipping & Customs</a></li>
              <li><a href="#returns" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Returns & Exchanges</a></li>
              <li><a href="#sizing" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Size Guide & Fit Matrix</a></li>
              <li><a href="#contact" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">support@vibewear.com</a></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h5 className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              VIP Club
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              Subscribe for secret drops, exclusive early access, and 15% off your first checkout.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-purple-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 transition-all pr-10 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-pink-600 dark:text-pink-400 flex items-center gap-1.5 animate-fade-in font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Welcome to the VIP club! Check your inbox.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-purple-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} VibeWear Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <a href="http://localhost:5000/database" target="_blank" rel="noopener noreferrer" className="text-pink-600 dark:text-pink-400 font-bold hover:underline flex items-center gap-1">
              <span>💾 Live Database Inspector</span>
              <span class="text-xs">↗</span>
            </a>
            <a href="http://localhost:5000/api/health" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              Backend Health API
            </a>
            <a href="#privacy" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
