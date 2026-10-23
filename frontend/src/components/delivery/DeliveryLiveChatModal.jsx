import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Phone,
  PhoneCall,
  X,
  Check,
  CheckCheck,
  Bike,
  ShieldCheck,
  MapPin,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { playNotificationChime } from '../../utils/deliveryAudioUtils';

const DeliveryLiveChatModal = ({
  isOpen,
  onClose,
  onStartCall,
  deliveryPartner = {
    name: 'Vikram Malhotra',
    phone: '+91 98201 55432',
    vehicle: 'Hero Electric Optima - MH 02 CW 9921',
    rating: '4.9 ★'
  },
  orderId = 'VW-98241',
  customerName = 'Customer',
  deliveryPin = '5821',
  totalAmount = 2499,
  isCod = true
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'rider',
      text: `Namaste ${customerName}! Main Vikram Malhotra, aapka VibeWear Delivery Hero. Aapka parcel leke main aapke location ke liye nikal chuka hoon. 10-15 minute me pahuch raha hoon.`,
      time: 'Just now'
    },
    {
      id: 2,
      sender: 'rider',
      text: `📦 Parcel Info: Order #${orderId} ${isCod ? `• Cash to Collect: ₹${totalAmount}` : '• Prepaid'} • Delivery Security PIN: ${deliveryPin}. Koi instructions ho toh yahan message karein!`,
      time: 'Just now'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isRiderTyping, setIsRiderTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickChips = [
    'Gate par aake call karein',
    'Security guard ke paas rakh dein',
    'Doorbell baja dena',
    'Cash ready hai'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      playNotificationChime();
    }
  }, [isOpen, messages]);

  const handleSendMessage = (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'customer',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate realistic Rider response
    setIsRiderTyping(true);
    setTimeout(() => {
      setIsRiderTyping(false);
      let reply = 'Ji bilkul sir! Main note kar liya hai, usi hisaab se delivery karunga.';

      const lower = text.toLowerCase();
      if (lower.includes('gate') || lower.includes('call')) {
        reply = 'Ji sir, building gate par pahuchte hi aapko turant call karunga!';
      } else if (lower.includes('security') || lower.includes('guard')) {
        reply = 'Ji sure, parcel security desk par handover kar deta hoon!';
      } else if (lower.includes('doorbell') || lower.includes('bell')) {
        reply = 'Haan ji bilkul, door pe aake doorbell baja dunga.';
      } else if (lower.includes('cash') || lower.includes('ready')) {
        reply = `Bahut achha sir, exact ₹${totalAmount} ready rakhne ke liye shukriya!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'rider',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      playNotificationChime();
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in text-slate-900 dark:text-white">
      <div className="relative w-full max-w-lg h-[620px] max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#0B0B14] border-2 border-pink-500/40 shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-900 via-brand-900 to-pink-900 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-pink-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-lg font-black text-white font-display">
                  {deliveryPartner.name[0]}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black font-display text-white">
                  {deliveryPartner.name}
                </h3>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white">
                  Delivery Hero
                </span>
              </div>
              <p className="text-[11px] text-pink-200 flex items-center gap-1">
                <Bike className="w-3 h-3" />
                <span>En Route (~1.5 km away) • {deliveryPartner.vehicle.split('-')[0]}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onStartCall}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Call Delivery Hero"
            >
              <Phone className="w-3.5 h-3.5 animate-pulse" />
              <span>Call Hero</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security / Delivery PIN Banner */}
        <div className="px-4 py-2 bg-pink-50 dark:bg-pink-950/40 border-b border-pink-200 dark:border-pink-500/30 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-pink-800 dark:text-pink-300 font-bold text-[11px]">
            <ShieldCheck className="w-4 h-4 text-pink-500" />
            <span>Delivery Security PIN:</span>
            <span className="font-mono text-xs bg-pink-600 text-white px-2 py-0.5 rounded-md font-black">
              {deliveryPin}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-white/60">
            Share only with Vikram on handover
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70 dark:bg-[#07070D]">
          {messages.map((m) => {
            const isMe = m.sender === 'customer';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs shadow-sm leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-[#141422] border border-purple-200/80 dark:border-white/10 text-slate-800 dark:text-white rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <div
                    className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                      isMe ? 'text-white/70' : 'text-slate-400 dark:text-white/40'
                    }`}
                  >
                    <span>{m.time}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                  </div>
                </div>
              </div>
            );
          })}

          {isRiderTyping && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#141422] border border-purple-200/50 dark:border-white/10 text-xs text-slate-500 dark:text-white/60 w-fit animate-pulse">
              <span className="font-bold text-pink-500">{deliveryPartner.name.split(' ')[0]}</span>
              <span>is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white dark:bg-[#0B0B14] border-t border-purple-100 dark:border-white/10 overflow-x-auto flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-400 dark:text-white/40 font-bold shrink-0">Quick reply:</span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-white/15 border border-purple-200 dark:border-white/10 text-[11px] text-slate-800 dark:text-white font-medium whitespace-nowrap transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white dark:bg-[#0B0B14] border-t border-purple-200 dark:border-white/10 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message for Vikram..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-pink-500/20"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryLiveChatModal;
