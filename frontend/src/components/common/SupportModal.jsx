import React, { useState } from 'react';
import {
  X,
  Headphones,
  PhoneCall,
  MessageCircle,
  Mail,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  ExternalLink,
  Copy
} from 'lucide-react';
import EmailComposerModal from './EmailComposerModal';

const SupportModal = ({ isOpen, onClose, onNavigateTrack, onNavigateDelivery }) => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'contact' | 'faqs'
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'agent',
      text: 'Namaste! Welcome to VibeWear 24/7 Priority Support. How can we help you today with your order or fashion styles?',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [copiedLabel, setCopiedLabel] = useState('');

  if (!isOpen) return null;

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(''), 2500);
  };

  const FAQS = [
    {
      q: 'Where is my order & how can I contact my delivery driver?',
      a: 'You can track your package live using our "Track Orders" feature in the top navbar. When your order is "Out for Delivery", you get real-time status and can directly call your delivery hero with the "Call Delivery Hero" button.'
    },
    {
      q: 'How does Cash on Delivery (COD) payment work?',
      a: 'We accept Cash on Delivery without any extra fee. When our delivery partner arrives, you can pay via Cash or UPI QR scan directly to the rider.'
    },
    {
      q: 'What is the 7-day Return & Exchange policy?',
      a: 'We offer an instant, zero-question 7-day doorstep replacement and exchange policy on unworn apparel with original tags attached.'
    },
    {
      q: 'What is the Delivery PIN & how do I share it with the driver?',
      a: 'For security, every order has a 4-digit Delivery PIN shown on your Live Order Tracking screen. Share this PIN with your rider upon doorstep handover.'
    }
  ];

  const handleSendChatMessage = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: timeStr }]);
    setChatInput('');

    // Instant helpful automated reply
    setTimeout(() => {
      let reply = 'Thank you for your message! Our 24/7 care desk has recorded your query. A senior support specialist is reviewing your order details.';
      const lower = userMsg.toLowerCase();
      if (lower.includes('track') || lower.includes('order') || lower.includes('kaha') || lower.includes('deliver')) {
        reply = 'You can track your order in real-time on our Live Tracking page. If your order is out for delivery, your delivery partner is on their way with express speed!';
      } else if (lower.includes('return') || lower.includes('exchange') || lower.includes('size')) {
        reply = 'We provide instant 7-day doorstep exchange for sizing issues. Keep your package tags intact and our courier team will swap it at zero cost.';
      } else if (lower.includes('driver') || lower.includes('rider') || lower.includes('phone') || lower.includes('call')) {
        reply = 'Your delivery partner details are available on the Live Tracking page. You can click "Call Delivery Hero" to connect directly with your rider!';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 700);
  };

  const handleQuickPrompt = (promptText) => {
    setChatInput(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0B0B14] border-2 border-purple-200 dark:border-brand-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-brand-600 flex items-center justify-center shadow-lg shadow-pink-500/30 shrink-0">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black font-display tracking-tight text-white">
                    VibeWear 24/7 Support Desk
                  </h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live & Online
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-0.5">
                  Instant help for order tracking, rider contact, returns & inquiries
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close Support Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Live Assistant Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'contact'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Direct Hotline & Channels</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('faqs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'faqs'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant FAQs</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[380px]">
              {/* Message History */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'agent' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600 to-pink-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                        VW
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white rounded-tr-xs shadow-md'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-purple-200/50 dark:border-white/10'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="block text-[9px] opacity-60 text-right mt-1">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-1.5 py-2 border-t border-purple-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Where is my package and driver right now?')}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 dark:bg-white/5 hover:bg-pink-100 dark:hover:bg-pink-950/40 text-slate-700 dark:text-white/80 border border-purple-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  📍 Track my package
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('How do I contact my delivery partner?')}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 dark:bg-white/5 hover:bg-pink-100 dark:hover:bg-pink-950/40 text-slate-700 dark:text-white/80 border border-purple-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  🚴 Call delivery hero
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('How does 7-day exchange work?')}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 dark:bg-white/5 hover:bg-pink-100 dark:hover:bg-pink-950/40 text-slate-700 dark:text-white/80 border border-purple-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  🔄 Exchange or returns
                </button>
              </div>

              {/* Chat Input Box */}
              <form onSubmit={handleSendChatMessage} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your question or order number..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/50 border border-purple-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white shadow-md shadow-pink-500/20 cursor-pointer transition-all active:scale-95"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: DIRECT CHANNELS */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              {/* Toll-free phone */}
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-black/40 border border-purple-200 dark:border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      24/7 Toll-Free Helpline
                    </h4>
                    <p className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                      1800-842-3227 (1800-VIBE-CARE)
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-white/50">
                      Average wait time: Under 1 minute
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy('18008423227', 'Helpline')}
                    className="p-2 rounded-xl bg-white dark:bg-white/10 border border-purple-200 dark:border-white/10 text-slate-600 dark:text-white/80 hover:text-pink-500 transition-colors cursor-pointer"
                    title="Copy Phone Number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href="tel:18008423227"
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>

              {/* WhatsApp Desk */}
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-black/40 border border-purple-200 dark:border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Official WhatsApp Concierge
                    </h4>
                    <p className="text-sm font-black font-mono text-teal-600 dark:text-teal-400 mt-0.5">
                      +91 98201 55432
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-white/50">
                      Instant order tracking, size advice & invoices
                    </span>
                  </div>
                </div>

                <a
                  href="https://wa.me/919820155432?text=Hello%20VibeWear%20Support!%20I%20need%20help%20with%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              </div>

              {/* Email Desk */}
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-black/40 border border-purple-200 dark:border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Executive Email Desk
                    </h4>
                    <p className="text-xs font-bold font-mono text-pink-600 dark:text-pink-400 mt-0.5">
                      support@vibewear.com
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-white/50">
                      Guaranteed reply within 2 business hours
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEmailComposerOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>
              </div>

              {/* Navigation Shortcuts */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigateTrack) onNavigateTrack();
                  }}
                  className="p-3 rounded-2xl bg-purple-100 hover:bg-purple-200 dark:bg-white/5 dark:hover:bg-white/10 border border-purple-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Truck className="w-4 h-4 text-pink-500" />
                  <span>Open Live Order Tracking</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigateDelivery) onNavigateDelivery();
                  }}
                  className="p-3 rounded-2xl bg-purple-100 hover:bg-purple-200 dark:bg-white/5 dark:hover:bg-white/10 border border-purple-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-500" />
                  <span>Rider Delivery Partner Hub</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-purple-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-pink-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-slate-600 dark:text-white/70 border-t border-purple-100 dark:border-white/5 pt-2 leading-relaxed animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {copiedLabel && (
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center">
              Copied {copiedLabel} to clipboard!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-black/60 border-t border-purple-100 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50 shrink-0">
          <span>Official VibeWear Customer Care • Mumbai, India</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <EmailComposerModal
        isOpen={emailComposerOpen}
        onClose={() => setEmailComposerOpen(false)}
        recipientEmail="support@vibewear.com"
        recipientName="VibeWear Executive Care"
        defaultSubject="VibeWear Customer Support Inquiry"
      />
    </div>
  );
};

export default SupportModal;
