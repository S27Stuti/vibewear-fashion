import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Phone,
  MessageSquare,
  Bike,
  Navigation,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playNotificationChime } from '../../utils/deliveryAudioUtils';

const OutForDeliveryGlobalBanner = ({
  onOpenTracking,
  onOpenCall,
  onOpenChat
}) => {
  const { liveDeliveryAlert, dismissDeliveryAlert, userOrders, isDeliveryPartner } = useAuth();
  const [progress, setProgress] = useState(100);

  // If user is a delivery partner or no live dispatch alert has been triggered, do NOT show anything!
  if (isDeliveryPartner || !liveDeliveryAlert) {
    return null;
  }

  // Find corresponding full order object for modal actions
  const targetOrder =
    userOrders?.find(
      (o) => o.id === liveDeliveryAlert.orderId || o._id === liveDeliveryAlert.orderId
    ) ||
    liveDeliveryAlert.order ||
    userOrders?.[0] ||
    null;

  // Sound chime when alert triggers
  useEffect(() => {
    if (liveDeliveryAlert) {
      playNotificationChime();
      setProgress(100);
    }
  }, [liveDeliveryAlert?.timestamp]);

  // Auto-dismiss countdown (15 seconds)
  useEffect(() => {
    if (!liveDeliveryAlert) return;

    const DURATION = 15000;
    const INTERVAL = 100;
    const step = (INTERVAL / DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          dismissDeliveryAlert();
          return 0;
        }
        return Math.max(0, prev - step);
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [liveDeliveryAlert, dismissDeliveryAlert]);

  const orderId = liveDeliveryAlert.orderId || 'VW-98241';
  const riderName = liveDeliveryAlert.riderName || 'Vikram Malhotra';
  const riderPhone = liveDeliveryAlert.riderPhone || '+91 98201 55432';
  const riderVehicle = liveDeliveryAlert.riderVehicle || 'Hero Electric Optima - MH 02 CW 9921';
  const riderMessage =
    liveDeliveryAlert.message ||
    'Namaste! Main aapka package leke nikal gaya hoon. 10-15 minute me pahuch raha hoon!';

  const handleCall = () => {
    if (onOpenCall && targetOrder) {
      onOpenCall(targetOrder);
    }
  };

  const handleChat = () => {
    if (onOpenChat && targetOrder) {
      onOpenChat(targetOrder);
    }
  };

  const handleTrack = () => {
    if (onOpenTracking) {
      onOpenTracking(orderId);
    }
    dismissDeliveryAlert();
  };

  return (
    <div className="fixed top-24 right-4 sm:right-6 z-50 max-w-md w-[calc(100%-2rem)] sm:w-[420px] animate-slide-down">
      <div className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-[#0B0B14]/95 border-2 border-pink-500 shadow-2xl backdrop-blur-2xl p-4 sm:p-5 text-slate-900 dark:text-white shadow-glow-pink">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/25 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Pill & Dismiss Button */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-purple-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xs">
              {liveDeliveryAlert.type === 'driver_accepted'
                ? '🎉 Driver Ne Request Accept Kar Li!'
                : '🛵 Driver Nikal Gaya Hai'}
            </span>
            <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400">
              #{orderId}
            </span>
          </div>

          <button
            type="button"
            onClick={dismissDeliveryAlert}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body with Driver Details and Incoming Message */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-pink-600 to-purple-600 p-0.5 shadow-lg shadow-pink-500/30 shrink-0">
            <div className="w-full h-full bg-white dark:bg-[#0C0C16] rounded-2xl flex items-center justify-center text-lg font-black text-slate-900 dark:text-white font-display">
              {riderName[0]}
            </div>
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-sm font-black font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{riderName}</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded-md">
                  Assigned Rider
                </span>
              </h4>
              <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold">Just now</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-white/90 bg-purple-50/80 dark:bg-white/5 p-2 rounded-xl border border-purple-100 dark:border-white/5 italic">
              "{riderMessage}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-1 pt-0.5 text-[11px]">
              <span className="text-slate-500 dark:text-white/60 font-semibold flex items-center gap-1">
                <Bike className="w-3.5 h-3.5 text-pink-500" />
                <span>{riderVehicle}</span>
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                📞 {riderPhone}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: CALL DELIVERY HERO, MESSAGE, TRACK LIVE */}
        <div className="grid grid-cols-3 gap-2">
          {/* Call Delivery Hero button */}
          <button
            type="button"
            onClick={handleCall}
            className="py-2.5 px-2 sm:px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Call Delivery Hero"
          >
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            <span className="truncate">Call Hero</span>
          </button>

          {/* Message / Chat button */}
          <button
            type="button"
            onClick={handleChat}
            className="py-2.5 px-2 sm:px-3 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Open Live Chat / Message"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="truncate">Message</span>
          </button>

          {/* Track Live button */}
          <button
            type="button"
            onClick={handleTrack}
            className="py-2.5 px-2 sm:px-3 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-white/10 dark:hover:bg-white/20 border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            title="Track Order on Map"
          >
            <Navigation className="w-3.5 h-3.5 text-pink-500" />
            <span className="truncate">Track</span>
          </button>
        </div>

        {/* Auto-dismiss countdown bar */}
        <div className="mt-3 w-full h-1 bg-purple-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default OutForDeliveryGlobalBanner;
