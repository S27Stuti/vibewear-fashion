import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Copy,
  Check,
  X,
  Smartphone,
  ShieldCheck,
  Bike
} from 'lucide-react';
import {
  startPhoneRingtone,
  speakRiderVoice,
  stopSpeech
} from '../../utils/deliveryAudioUtils';

const CallDeliveryHeroModal = ({
  isOpen,
  onClose,
  deliveryPartner = {
    name: 'Vikram Malhotra',
    phone: '+91 98201 55432',
    vehicle: 'Hero Electric Optima - MH 02 CW 9921',
    rating: '4.9 ★'
  },
  orderId = 'VW-98241',
  customerName = 'Customer',
  deliveryPin = '5821'
}) => {
  const [callState, setCallState] = useState('ringing'); // 'ringing' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [riderSpeechText, setRiderSpeechText] = useState(
    'Namaste! Main Vikram bol raha hoon VibeWear delivery se. Main aapke delivery address ke paas hoon. Please keep your delivery PIN ready!'
  );
  const [customerSpokenMessage, setCustomerSpokenMessage] = useState('');

  const ringtoneStopperRef = useRef(null);

  // Initialize call when modal opens
  useEffect(() => {
    if (isOpen) {
      setCallState('ringing');
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeakerOn(true);
      setCustomerSpokenMessage('');
      setRiderSpeechText(
        `Namaste ${customerName}! Main Vikram bol raha hoon VibeWear express se. Main aapki location ke bilkul paas hoon!`
      );

      // 1. Start audio ringtone
      ringtoneStopperRef.current = startPhoneRingtone();

      // 2. Automatically connect after 2.4 seconds
      const connectTimer = setTimeout(() => {
        if (ringtoneStopperRef.current) {
          ringtoneStopperRef.current();
          ringtoneStopperRef.current = null;
        }
        setCallState('connected');
        // Rider speaks
        speakRiderVoice(
          `Namaste! Main Vikram bol raha hoon VibeWear delivery se. Main aapke delivery address ke paas hoon. Please keep delivery PIN ${deliveryPin} ready!`
        );
      }, 2400);

      return () => {
        clearTimeout(connectTimer);
        if (ringtoneStopperRef.current) {
          ringtoneStopperRef.current();
          ringtoneStopperRef.current = null;
        }
        stopSpeech();
      };
    }
  }, [isOpen]);

  // Call timer interval when connected
  useEffect(() => {
    let interval;
    if (isOpen && callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, callState]);

  const handleEndCall = () => {
    if (ringtoneStopperRef.current) {
      ringtoneStopperRef.current();
      ringtoneStopperRef.current = null;
    }
    stopSpeech();
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleManualConnect = () => {
    if (ringtoneStopperRef.current) {
      ringtoneStopperRef.current();
      ringtoneStopperRef.current = null;
    }
    setCallState('connected');
    speakRiderVoice(
      `Hello! Main Vikram bol raha hoon VibeWear express se. Main aapki location ke pass hoon!`
    );
  };

  const handleCustomerReply = (userMessage, riderReplyVoice) => {
    setCustomerSpokenMessage(userMessage);
    setRiderSpeechText(riderReplyVoice);
    speakRiderVoice(riderReplyVoice);
  };

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(deliveryPartner.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeDial = () => {
    const cleanPhone = (deliveryPartner.phone || '+91 98201 55432').replace(/\s+/g, '');
    window.open(`tel:${cleanPhone}`, '_self');
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const cleanPhone = (deliveryPartner.phone || '+91 98201 55432').replace(/\s+/g, '');
  const whatsAppUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
    `Hello ${deliveryPartner.name}, I am following up on my VibeWear delivery for Order #${orderId}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-white">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#080811] border-2 border-emerald-500/50 shadow-2xl p-6 text-center animate-slide-up">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Close */}
        <button
          type="button"
          onClick={handleEndCall}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title="Close / End Call"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Small Verified Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>VibeWear Express Secure Line</span>
        </div>

        {/* Rider Avatar with Rings */}
        <div className="relative w-28 h-28 mx-auto my-3 flex items-center justify-center">
          {callState === 'ringing' && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-emerald-500/30 animate-pulse" />
            </>
          )}
          {callState === 'connected' && (
            <div className="absolute inset-0 rounded-full bg-emerald-500/15 animate-pulse" />
          )}

          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 via-pink-600 to-emerald-500 p-0.5 shadow-2xl relative z-10">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-4xl font-black font-display text-white">
              {deliveryPartner.name[0]}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1 mb-4">
          <h3 className="text-xl font-black font-display text-white">
            {deliveryPartner.name}
          </h3>
          <p className="text-xs text-white/60 font-mono">
            {deliveryPartner.phone}
          </p>
          <p className="text-[11px] text-pink-400 font-semibold flex items-center justify-center gap-1">
            <Bike className="w-3.5 h-3.5" />
            <span>{deliveryPartner.vehicle}</span>
          </p>

          {/* Call Status Indicator */}
          {callState === 'ringing' && (
            <div className="pt-2">
              <p className="text-xs font-bold text-amber-400 animate-pulse flex items-center justify-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
                <span>Ringing Delivery Hero...</span>
              </p>
              <button
                type="button"
                onClick={handleManualConnect}
                className="mt-2 text-[10px] text-white/60 underline hover:text-white cursor-pointer"
              >
                (Click here to connect immediately)
              </button>
            </div>
          )}

          {callState === 'connected' && (
            <div className="pt-2 space-y-1.5">
              <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Connected • In Call ({formatTimer(callDuration)})</span>
              </p>

              {/* Live Speech Bubble from Vikram */}
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-left text-xs text-white/90 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold mb-1">
                  <span>Vikram (Rider Audio):</span>
                  <span>Live</span>
                </div>
                <p className="italic font-medium leading-relaxed">
                  "{riderSpeechText}"
                </p>
              </div>

              {customerSpokenMessage && (
                <div className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-right text-[11px] text-pink-200">
                  <span className="font-bold">You said:</span> "{customerSpokenMessage}"
                </div>
              )}

              {/* Quick Customer Voice Reply Prompts */}
              <div className="text-left pt-1">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider block mb-1">
                  Quick Voice Replies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleCustomerReply(
                        'Main gate par aa gaya hoon.',
                        'Ji sir, main 2 minute me aapke gate par pahuch raha hoon!'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-white/80 hover:text-white transition-all cursor-pointer"
                  >
                    "Main gate par hoon"
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleCustomerReply(
                        'Parcel security desk par chhod dein.',
                        'Ji theek hai, main security guard ko submit karke update kar deta hoon!'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-white/80 hover:text-white transition-all cursor-pointer"
                  >
                    "Security pe chhod dein"
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleCustomerReply(
                        'Doorbell baja dena please.',
                        'Ji bilkul! Door par pahuchte hi doorbell baja dunga.'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-white/80 hover:text-white transition-all cursor-pointer"
                  >
                    "Doorbell baja dena"
                  </button>
                </div>
              </div>
            </div>
          )}

          {callState === 'ended' && (
            <p className="text-xs font-bold text-pink-400 pt-2">
              Call Ended
            </p>
          )}
        </div>

        {/* Secondary Controls (Mute, Speaker, WhatsApp, Copy) */}
        <div className="grid grid-cols-4 gap-2 mb-6 text-xs">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
              isMuted ? 'bg-pink-600/30 text-pink-300 border border-pink-500/50' : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="text-[9px] font-bold">{isMuted ? 'Muted' : 'Mute'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
              isSpeakerOn ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
            title="Speakerphone"
          >
            {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[9px] font-bold">Speaker</span>
          </button>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            title="Open WhatsApp Chat"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[9px] font-bold">WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={handleCopyPhone}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            title="Copy Phone Number"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="text-[9px] font-bold">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Native Smartphone Dial Option Pill */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleNativeDial}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-white/80 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-pink-400" />
            <span>Open Phone App Directly ({deliveryPartner.phone})</span>
          </button>
        </div>

        {/* Big Red Hang Up Button */}
        <button
          type="button"
          onClick={handleEndCall}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600 via-rose-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Hang Up Call"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
        <p className="text-[10px] text-white/50 mt-2 font-medium">Click red button to end call</p>
      </div>
    </div>
  );
};

export default CallDeliveryHeroModal;
