import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Share2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const TwitterXIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ShareModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useCart();

  if (!isOpen || !product) return null;

  const shareUrl = `${window.location.origin}/?product=${product.id || product._id || ''}`;
  const shareTitle = `VibeWear • ${product.title}`;
  const shareText = `Check out this aesthetic style on VibeWear: "${product.title}" for only $${product.price}!`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      showToast('🔗 Product link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Link copied!');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        showToast('Shared successfully!');
        onClose();
      } catch (err) {
        // User cancelled or aborted
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#0B0B12] border border-purple-200 dark:border-brand-500/30 p-6 shadow-2xl text-slate-900 dark:text-white animate-slide-up space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-brand-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-600/20 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Share This Style</h3>
              <p className="text-[11px] text-slate-500 dark:text-white/60">Share with friends or across your socials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Card Snippet */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-black/60 border border-purple-100 dark:border-brand-500/20">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=200'}
            alt={product.title}
            className="w-14 h-16 object-cover rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{product.title}</h4>
            <p className="text-[11px] text-slate-500 dark:text-white/60">{product.category} • {product.subCategory || 'Streetwear'}</p>
            <p className="text-xs font-extrabold text-pink-600 dark:text-pink-400 mt-0.5">${Number(product.price).toFixed(2)}</p>
          </div>
        </div>

        {/* Direct Link Copy Bar */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 dark:text-white/70 block uppercase tracking-wider">
            Copy Direct Link
          </label>
          <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-slate-100 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30">
            <span className="text-xs font-mono text-slate-600 dark:text-white/80 truncate flex-1">
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-white/70 block uppercase tracking-wider">
            Share To
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs hover:scale-102"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleTwitterShare}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs hover:scale-102"
            >
              <TwitterXIcon className="w-5 h-5 text-slate-800 dark:text-white" />
              <span>Twitter / X</span>
            </button>

            <button
              type="button"
              onClick={handleTelegramShare}
              className="py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/30 dark:hover:bg-sky-900/40 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs hover:scale-102"
            >
              <Send className="w-5 h-5 text-sky-500" />
              <span>Telegram</span>
            </button>
          </div>
        </div>

        {/* Native Mobile Share Button */}
        {typeof navigator !== 'undefined' && Boolean(navigator.share) && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-purple-50 dark:bg-white/10 dark:hover:bg-white/15 border border-purple-200 dark:border-white/20 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4 text-pink-500" />
            <span>More Sharing Options...</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
