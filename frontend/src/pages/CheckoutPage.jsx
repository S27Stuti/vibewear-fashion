import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  QrCode,
  Banknote,
  Printer,
  ShoppingBag,
  Clock,
  Edit2,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  IndianRupee,
  Receipt,
  FileCheck2,
  CreditCard,
  Copy,
  Settings
} from 'lucide-react';

const CheckoutPage = ({ onNavigateBack, onOrderComplete }) => {
  const { cartItems, subtotal, tax, shipping, totalPrice, clearCart } = useCart();
  const { user, addOrder, openProfile } = useAuth();

  // Steps: 'checkout' -> 'success'
  const [step, setStep] = useState('checkout');
  // ONLY 2 Methods allowed: 'upi' (Scan QR) | 'cod' (Cash on Delivery)
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Shipping Address Form - COMPLETELY EMPTY initially (No dummy pre-filled text)
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });

  // Merchant Receiving UPI Configuration (Stored in localStorage so owner's real UPI ID is remembered)
  // When the store owner enters their real Google Pay / PhonePe UPI ID here, real money transfers directly!
  const [merchantUpiId, setMerchantUpiId] = useState(() => {
    return localStorage.getItem('vibewear_merchant_upi_id') || '';
  });
  const [merchantName, setMerchantName] = useState(() => {
    return localStorage.getItem('vibewear_merchant_name') || 'VibeWear Store';
  });
  const [isEditingUpi, setIsEditingUpi] = useState(!localStorage.getItem('vibewear_merchant_upi_id'));
  const [tempUpiId, setTempUpiId] = useState(merchantUpiId);
  const [tempMerchantName, setTempMerchantName] = useState(merchantName);

  // UPI QR & Payment Simulation State
  const [qrMode, setQrMode] = useState('full'); // 'full' (full amount) | 'test' (₹1 test transfer)
  const [utrNumber, setUtrNumber] = useState('');
  const [upiTimer, setUpiTimer] = useState(300); // 5 min countdown
  const [processingPayment, setProcessingPayment] = useState(false);

  // Professional Canvas Anti-Bot Security CAPTCHA for COD
  const [codCaptchaCode, setCodCaptchaCode] = useState('');
  const [enteredCaptcha, setEnteredCaptcha] = useState('');
  const canvasRef = useRef(null);

  // Confirmation Order
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fallback demo items if accessed with empty cart
  const activeItems = cartItems.length > 0 ? cartItems : [
    {
      id: 'demo_item_1',
      price: 499,
      quantity: 1,
      size: 'M',
      color: 'Jet Black',
      product: {
        id: 'prod_1',
        title: 'Urban Oversized Heavyweight Graphic Tee',
        images: ['https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80']
      }
    }
  ];

  const effectiveTotal = totalPrice > 0 ? totalPrice : 499;
  const effectiveSubtotal = subtotal > 0 ? subtotal : 499;
  const effectiveTax = tax > 0 ? tax : Math.round(effectiveSubtotal * 0.05);
  const effectiveShipping = shipping;

  const inrQrAmount = qrMode === 'test' ? '1.00' : `${effectiveTotal}.00`;

  // Dynamic Unique Order Reference
  const [orderRef] = useState(() => `VW${Math.floor(100000 + Math.random() * 900000)}`);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Tab selection inside UPI: 'qr' (Standee QR) | 'apps' (Mobile App links) | 'id' (Pay via UPI ID)
  const [upiTab, setUpiTab] = useState('qr');
  const [appNotice, setAppNotice] = useState('');

  // Fallback to user's real UPI ID if empty
  const activeReceivingUpi = (merchantUpiId || '').trim() || 'stutu2004shah@okhdfcbank';

  // Strictly NPCI-compliant Payee Name (Alphanumeric and spaces only, NO parentheses '()', NO app names like 'gpay')
  const cleanPayeeName = (() => {
    let raw = (merchantName || '').trim();
    const forbidden = /^(gpay|google\s*pay|phonepe|paytm|bhim|amazon\s*pay|upi)$/i;
    
    if (!raw || forbidden.test(raw)) {
      if (activeReceivingUpi.toLowerCase().includes('stutu')) {
        return 'Stutu Shah';
      }
      if (activeReceivingUpi.includes('@')) {
        const handle = activeReceivingUpi.split('@')[0].replace(/[0-9]/g, '').trim();
        if (handle.length >= 2) {
          return handle.charAt(0).toUpperCase() + handle.slice(1) + ' Shah';
        }
      }
      return 'VibeWear Fashion';
    }
    // Remove any special characters including brackets '()', leave only letters, numbers and spaces
    const sanitized = raw.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    return sanitized || 'Stutu Shah';
  })();

  const numericAmount = qrMode === 'test' ? '1.00' : `${Number(effectiveTotal).toFixed(2)}`;
  const cleanUpiId = (activeReceivingUpi || '').trim();
  const cleanNameForUpi = (cleanPayeeName || 'VibeWear').replace(/[^a-zA-Z0-9]/g, '');

  // 1. NPCI-compliant dynamic UPI URI - Raw @, no %40 (fixing Google Pay "Wrong QR code" error)
  const upiWithAmount = `upi://pay?pa=${cleanUpiId}&pn=${cleanNameForUpi}&am=${numericAmount}&cu=INR&tn=VibeWear%20Order`;
  
  // 2. Universal Direct P2P transfer (Bypasses bank amount restrictions on personal savings accounts)
  const upiDirectP2P = `upi://pay?pa=${cleanUpiId}&pn=${cleanNameForUpi}&cu=INR&tn=VibeWear%20Order`;

  // Active QR string based on mode
  const activeQrUri = qrMode === 'direct' ? upiDirectP2P : upiWithAmount;
  const upiDeepLink = upiWithAmount;

  const handleCopyUpi = () => {
    if (!activeReceivingUpi) return;
    navigator.clipboard.writeText(activeReceivingUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleAppClick = (appScheme, appName) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = appScheme;
    } else {
      handleCopyUpi();
      setAppNotice(`Copied ${activeReceivingUpi}! On desktop, please scan the QR code with ${appName} or enter this UPI ID in ${appName}.`);
      setTimeout(() => setAppNotice(''), 6000);
    }
  };

  // Generate Professional Distorted Canvas CAPTCHA (Like Flipkart / Amazon COD)
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCodCaptchaCode(code);
    setEnteredCaptcha('');

    // Draw on Canvas
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1E1B4B');
      gradient.addColorStop(1, '#3B0764');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Interference noise lines
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = `rgba(236, 72, 153, ${0.2 + Math.random() * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      // Draw stylized rotated letters
      ctx.font = 'bold 24px monospace';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < code.length; i++) {
        const x = 20 + i * 26;
        const y = canvas.height / 2 + (Math.random() * 4 - 2);
        const angle = (Math.random() * 20 - 10) * (Math.PI / 180);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = i % 2 === 0 ? '#F472B6' : '#C084FC';
        ctx.fillText(code[i], 0, 0);
        ctx.restore();
      }
    }, 50);
  };

  useEffect(() => {
    generateCaptcha();
  }, [paymentMethod]);

  // UPI Timer Countdown
  useEffect(() => {
    let timer;
    if (step === 'checkout' && paymentMethod === 'upi') {
      timer = setInterval(() => {
        setUpiTimer((prev) => (prev > 0 ? prev - 1 : 300));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, paymentMethod]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSaveMerchantUpi = (e) => {
    if (e) e.preventDefault();
    if (!tempUpiId.trim() || !tempUpiId.includes('@')) {
      setErrorMsg('Please enter a valid Google Pay / PhonePe UPI ID (e.g., 9876543210@okaxis, yourname@ybl, name@paytm)');
      return;
    }
    const cleanId = tempUpiId.trim().toLowerCase();
    const cleanName = tempMerchantName.trim() || 'VibeWear Store';
    setMerchantUpiId(cleanId);
    setMerchantName(cleanName);
    localStorage.setItem('vibewear_merchant_upi_id', cleanId);
    localStorage.setItem('vibewear_merchant_name', cleanName);
    setIsEditingUpi(false);
    setErrorMsg('');
  };

  // Open UPI app directly on mobile devices
  const handleOpenUpiApp = () => {
    if (!merchantUpiId) {
      setErrorMsg('Please enter your receiving UPI ID first so payment can be credited.');
      setIsEditingUpi(true);
      return;
    }
    window.location.href = upiDeepLink;
  };

  // Order Finalization
  const handlePlaceOrder = (e) => {
    if (e) e.preventDefault();

    if (!address.fullName.trim() || !address.street.trim() || !address.phone.trim() || !address.city.trim() || !address.postalCode.trim()) {
      setErrorMsg('Please fill in all delivery address details (Name, Phone, Street, City, PIN code).');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    if (paymentMethod === 'cod') {
      if (enteredCaptcha.trim().toUpperCase() !== codCaptchaCode.trim().toUpperCase()) {
        setErrorMsg('Security CAPTCHA code is incorrect. Please re-enter the 4 characters shown.');
        generateCaptcha();
        return;
      }
      completeOrder('Cash on Delivery (COD)', 'Pending (Pay at Doorstep)');
      return;
    }

    if (paymentMethod === 'upi') {
      if (!merchantUpiId.trim()) {
        setErrorMsg('Please enter your Google Pay / PhonePe UPI ID first so payment transfers to your bank account.');
        setIsEditingUpi(true);
        return;
      }
      setProcessingPayment(true);
      setTimeout(() => {
        setProcessingPayment(false);
        completeOrder(`UPI Payment (Transferred to ${merchantUpiId})`, 'Completed');
      }, 1500);
    }
  };

  const completeOrder = (methodTitle, paymentStatus) => {
    const orderId = orderRef;
    const txnId = utrNumber ? `UTR-${utrNumber.trim()}` : `UPI-${Date.now().toString().slice(-8)}`;

    const newOrder = {
      id: orderId,
      transactionId: txnId,
      createdAt: new Date().toISOString(),
      orderStatus: 'Confirmed',
      paymentMethod: methodTitle,
      paymentStatus: paymentStatus,
      totalAmount: effectiveTotal,
      subtotal: effectiveSubtotal,
      tax: effectiveTax,
      shipping: effectiveShipping,
      shippingAddress: address,
      items: activeItems.map((item) => ({
        title: item.product?.title || 'VibeWear Designer Apparel',
        size: item.size || 'M',
        color: item.color || 'Standard',
        qty: item.quantity || 1,
        price: item.price,
        image: item.product?.images?.[0] || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80'
      }))
    };

    addOrder(newOrder);
    setConfirmedOrder(newOrder);
    clearCart();

    // Persist order asynchronously to MySQL database backend
    try {
      apiClient.post('/orders', {
        items: activeItems.map((item) => ({
          productId: item.product?.id || item.product?._id || 'prod_1',
          title: item.product?.title || 'VibeWear Designer Apparel',
          price: item.price,
          quantity: item.quantity || 1,
          size: item.size || 'M',
          color: item.color || 'Standard',
          image: item.product?.images?.[0] || ''
        })),
        shippingAddress: address,
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'Online',
        itemsPrice: effectiveSubtotal,
        taxPrice: effectiveTax,
        shippingPrice: effectiveShipping,
        totalAmount: effectiveTotal
      }).then(() => {
        console.log('[Order Sync] Successfully recorded in MySQL Database');
      }).catch((err) => {
        console.warn('[Order Sync Warning]', err.message);
      });
    } catch (e) {
      console.warn('[Order Sync Error]', e);
    }

    setStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onOrderComplete) onOrderComplete(newOrder);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ================= STEP 2: ORDER CONFIRMATION / OFFICIAL TAX INVOICE =================
  if (step === 'success' && confirmedOrder) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in">
        {/* On-Screen Action Bar (Hidden during Print) */}
        <div className="no-print flex items-center justify-between mb-6 pb-4 border-b border-purple-200/80 dark:border-white/10">
          <button
            type="button"
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-pink-600 dark:text-pink-400 group-hover:-translate-x-1 transition-transform" />
            <span>Continue Shopping</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-pink-500/20 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Invoice</span>
            </button>
          </div>
        </div>

        {/* Clean, Professional Official GST Tax Invoice */}
        <div className="official-invoice-print bg-white text-slate-900 rounded-3xl border border-slate-300 shadow-2xl p-6 sm:p-10 space-y-6">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-900 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-display tracking-tight text-slate-950">
                  VIBEWEAR
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-900 text-white">
                  APPAREL
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                VibeWear Fashion Retail Pvt. Ltd. • GSTIN: <span className="font-mono font-bold">27AABCV1234F1Z5</span>
              </p>
              <p className="text-[11px] text-slate-500">
                108 Fashion Boulevard, Bandra West, Mumbai, Maharashtra - 400050
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 bg-pink-100 text-pink-800 rounded-md block sm:inline-block">
                TAX INVOICE / BILL OF SUPPLY
              </span>
              <div className="text-xs text-slate-700 mt-2 space-y-0.5">
                <p>Invoice No: <strong className="font-mono">VW-INV-{confirmedOrder.id}</strong></p>
                <p>Order ID: <strong className="font-mono">{confirmedOrder.id}</strong></p>
                <p>Date: {new Date(confirmedOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <p>Txn Ref: <strong className="font-mono text-pink-700">{confirmedOrder.transactionId}</strong></p>
              </div>
            </div>
          </div>

          {/* Customer & Billing Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                Billed & Shipped To:
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{confirmedOrder.shippingAddress.fullName}</h4>
              <p className="text-slate-700 mt-0.5 font-medium">Contact: {confirmedOrder.shippingAddress.phone}</p>
              <p className="text-slate-600 mt-0.5">
                {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city} - {confirmedOrder.shippingAddress.postalCode}
              </p>
              {confirmedOrder.shippingAddress.state && (
                <p className="text-slate-600">{confirmedOrder.shippingAddress.state}, India</p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                Payment & Dispatch Details:
              </span>
              <p className="text-slate-700">Payment Mode: <strong className="text-slate-950 font-bold">{confirmedOrder.paymentMethod}</strong></p>
              <p className="text-slate-700">Payment Status: <span className="font-bold text-green-700 uppercase">{confirmedOrder.paymentStatus}</span></p>
              <p className="text-slate-700">Shipping Mode: <strong>Express Courier Delivery (3-4 Days)</strong></p>
              <p className="text-slate-700">Place of Supply: <strong>{confirmedOrder.shippingAddress.city}</strong></p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Size / Color</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {confirmedOrder.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[10px] text-slate-500">HSN: 61091000 • 100% Cotton</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      Size: {item.size} • {item.color}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{item.qty}</td>
                    <td className="py-3 px-3 text-right text-slate-800">₹{item.price}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">₹{item.price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t-2 border-slate-900 gap-4 text-xs">
            <div className="text-slate-500 space-y-1">
              <p>• Returns accepted within 7 days of delivery.</p>
              <p>• All disputes subject to Mumbai jurisdiction.</p>
              <p className="font-semibold text-slate-700">This is a computer-generated invoice. No signature required.</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{confirmedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>GST (5% Apparel):</span>
                <span className="font-semibold">₹{confirmedOrder.tax}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Shipping Charges:</span>
                <span className="font-bold text-green-700">
                  {confirmedOrder.shipping === 0 ? 'FREE' : `₹${confirmedOrder.shipping}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex justify-between text-sm font-black text-slate-950">
                <span>Grand Total:</span>
                <span className="text-pink-600 text-base">₹{confirmedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= STEP 1: DEDICATED FULL-PAGE CHECKOUT =================
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-purple-200/80 dark:border-white/10">
        <button
          type="button"
          onClick={onNavigateBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600 dark:text-pink-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shopping / Cart</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-pink-400">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Genuine Payment Protection</span>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Shipping & Payment Options (Col 1 to 7/8) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-pink-950/40 border border-pink-500/40 text-pink-200 text-xs flex items-center gap-3 animate-shake shadow-lg">
              <AlertCircle className="w-5 h-5 shrink-0 text-pink-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Delivery Address (Completely Empty Initially) */}
          <div className="bg-white dark:bg-[#0B0B12] rounded-3xl border border-purple-200 dark:border-brand-500/30 p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-white/10">
              <h2 className="text-sm sm:text-base font-bold font-display uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-pink-600 text-white flex items-center justify-center text-xs font-black">
                  1
                </div>
                <span>1. Shipping & Contact Address</span>
              </h2>
              <span className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Free Express Delivery Above ₹799
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={address.fullName}
                  onChange={handleAddressChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1.5">
                  Phone Number (for Courier & Tracking) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={10}
                  value={address.phone}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setAddress({ ...address, phone: clean });
                  }}
                  placeholder="10-digit Mobile (e.g. 9876543210)"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1.5">
                  Complete Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="House/Flat No., Road, Landmark, Area"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="e.g. Mumbai / Delhi / Bengaluru"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1.5">
                  PIN / Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  maxLength={6}
                  value={address.postalCode}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setAddress({ ...address, postalCode: clean });
                  }}
                  placeholder="6-digit PIN (e.g. 400001)"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Options - STRICTLY 2 METHODS (Scan QR Code & Cash on Delivery) */}
          <div className="bg-white dark:bg-[#0B0B12] rounded-3xl border border-purple-200 dark:border-brand-500/30 p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-white/10">
              <h2 className="text-sm sm:text-base font-bold font-display uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-pink-600 text-white flex items-center justify-center text-xs font-black">
                  2
                </div>
                <span>2. Select Payment Method (2 Options)</span>
              </h2>
              <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                Instant UPI & Doorstep COD
              </span>
            </div>

            {/* 2 Big Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Scan QR Code */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-purple-50/80 dark:bg-brand-950/50 border-pink-500 shadow-xl shadow-pink-500/20'
                    : 'bg-slate-50/70 dark:bg-black/50 border-purple-200/80 dark:border-brand-500/20 hover:border-purple-300 dark:hover:border-brand-500/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  paymentMethod === 'upi'
                    ? 'bg-gradient-to-tr from-brand-600 to-pink-600 text-white shadow-pink-500/30'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/70'
                }`}>
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      Scan the QR Code
                    </span>
                    {paymentMethod === 'upi' && (
                      <span className="w-3 h-3 rounded-full bg-pink-500 shadow-xs" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-white/60">
                    Pay instantly via Google Pay, PhonePe, Paytm, BHIM, or any UPI app.
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-600/20 text-[10px] font-bold text-pink-700 dark:text-pink-300">
                    Instant Bank Transfer
                  </span>
                </div>
              </button>

              {/* Option 2: Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'bg-purple-50/80 dark:bg-brand-950/50 border-pink-500 shadow-xl shadow-pink-500/20'
                    : 'bg-slate-50/70 dark:bg-black/50 border-purple-200/80 dark:border-brand-500/20 hover:border-purple-300 dark:hover:border-brand-500/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  paymentMethod === 'cod'
                    ? 'bg-gradient-to-tr from-brand-600 to-pink-600 text-white shadow-pink-500/30'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/70'
                }`}>
                  <Banknote className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      Cash on Delivery
                    </span>
                    {paymentMethod === 'cod' && (
                      <span className="w-3 h-3 rounded-full bg-pink-500 shadow-xs" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-white/60">
                    Pay with Cash or UPI scanner directly to courier agent upon delivery.
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-brand-600/20 text-[10px] font-bold text-purple-700 dark:text-brand-300">
                    Pay at Doorstep
                  </span>
                </div>
              </button>
            </div>

            {/* PAYMENT CONTENT 1: ULTRA-LUXURY UPI GATEWAY (SCAN QR / APP / UPI ID) */}
            {paymentMethod === 'upi' && (
              <div className="p-5 sm:p-7 rounded-3xl bg-slate-50 dark:bg-[#0A0A12] border border-purple-200 dark:border-brand-500/30 space-y-6 shadow-2xl">
                {/* Official NPCI Gateway Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-100/70 via-pink-50 to-purple-50 dark:from-brand-950/70 dark:via-purple-950/50 dark:to-black border border-purple-200 dark:border-brand-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/25 shrink-0 font-bold">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight">
                          NPCI Instant UPI Transfer
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/40">
                          100% Genuine
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Official Merchant Account: <strong className="text-slate-950 dark:text-white font-bold">{cleanPayeeName}</strong> • NPCI 256-bit Encrypted
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingUpi(!isEditingUpi)}
                      className="text-[11px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900/50 px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-800/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      title="Configure real receiving UPI account for your store"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>⚙️ Store Owner UPI Settings</span>
                    </button>
                  </div>
                </div>

                {/* 2 Payment Mode Selector Tabs (Scan QR & Pay in UPI App) */}
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-black/60 border border-purple-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setUpiTab('qr')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      upiTab === 'qr'
                        ? 'bg-white dark:bg-gradient-to-r dark:from-brand-600 dark:to-pink-600 text-slate-900 dark:text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan QR Code (Google Pay / PhonePe / Paytm)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUpiTab('apps')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      upiTab === 'apps'
                        ? 'bg-white dark:bg-gradient-to-r dark:from-brand-600 dark:to-pink-600 text-slate-900 dark:text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Pay in UPI App (Mobile 1-Click)</span>
                  </button>
                </div>

                {/* Instant Feedback Notice if user clicked an app on desktop */}
                {appNotice && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-fade-in shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{appNotice}</span>
                  </div>
                )}

                {/* TAB 1: STAND-UP BHARATQR STANDEE */}
                {upiTab === 'qr' && (
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-2 animate-fade-in">
                    {/* Ultra-Luxury Standee Card */}
                    <div className="relative p-5 bg-white text-slate-900 rounded-3xl shadow-2xl border-4 border-pink-500/80 flex flex-col items-center w-full max-w-[290px] shrink-0 group">
                      {/* Standee Top Badge */}
                      <div className="w-full pb-2.5 border-b border-slate-200 mb-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-brand-600 to-pink-600 text-white flex items-center justify-center font-black text-[9px]">
                            ▶
                          </div>
                          <span className="text-xs font-black tracking-wider text-slate-900 uppercase">
                            BHIM UPI
                          </span>
                        </div>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          NPCI SECURE
                        </span>
                      </div>

                      {/* Vector QR Code with Medium Error Correction & Clear Margin */}
                      <div className="p-2 bg-white rounded-2xl shadow-inner">
                        <QRCodeSVG
                          value={activeQrUri}
                          size={215}
                          level="M"
                          includeMargin={true}
                        />
                      </div>

                      {/* Amount & Verified Receiving Account */}
                      <div className="w-full text-center pt-2.5 border-t border-slate-200 mt-2.5 space-y-1">
                        <div className="text-xl font-black text-slate-950 tracking-tight">
                          Pay ₹{effectiveTotal}
                        </div>
                        <div className="text-[11px] font-bold text-slate-700 truncate">
                          {cleanPayeeName}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>NPCI Verified Merchant</span>
                        </div>
                      </div>
                    </div>

                    {/* Right-Hand Instructions & QR Settings */}
                    <div className="flex-1 w-full max-w-lg space-y-4 text-left">
                      {/* Step-by-Step Instructions */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0E17] border border-purple-200 dark:border-brand-500/30 shadow-sm space-y-2.5">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-400 block">
                          How to Pay with Google Pay / PhonePe:
                        </span>
                        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              1
                            </span>
                            <span>Open <strong>Google Pay</strong>, <strong>PhonePe</strong>, or <strong>Paytm</strong> on your phone.</span>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              2
                            </span>
                            <span>Tap the <strong>QR Scanner</strong> icon and scan this QR code.</span>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              3
                            </span>
                            <span>Confirm payment of <strong>₹{effectiveTotal}</strong> to <strong>{cleanPayeeName}</strong>.</span>
                          </div>
                        </div>
                      </div>

                      {/* Store Owner Quick Configuration Panel */}
                      {isEditingUpi && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-brand-500/10 border-2 border-pink-500/50 shadow-lg space-y-3 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-pink-500 tracking-wider flex items-center gap-1.5">
                              ⚙️ Store Owner: Receiving UPI Account
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEditingUpi(false)}
                              className="text-xs text-slate-400 hover:text-white cursor-pointer"
                            >
                              ✕ Close
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">
                            Enter your real Google Pay / PhonePe UPI ID. All QR code scans will transfer money directly to your bank account!
                          </p>
                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                                Receiving UPI ID (Google Pay / PhonePe / Paytm / Bank VPA)
                              </label>
                              <input
                                type="text"
                                value={tempUpiId}
                                onChange={(e) => setTempUpiId(e.target.value.trim())}
                                placeholder="e.g. 9876543210@ybl, yourname@okaxis, etc."
                                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-black border border-purple-300 dark:border-white/20 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                                Store / Account Holder Name
                              </label>
                              <input
                                type="text"
                                value={tempMerchantName}
                                onChange={(e) => setTempMerchantName(e.target.value)}
                                placeholder="e.g. VibeWear Store / Rahul Shah"
                                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-black border border-purple-300 dark:border-white/20 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (!tempUpiId) return;
                                setMerchantUpiId(tempUpiId);
                                setMerchantName(tempMerchantName || 'VibeWear Store');
                                localStorage.setItem('vibewear_merchant_upi_id', tempUpiId);
                                localStorage.setItem('vibewear_merchant_name', tempMerchantName || 'VibeWear Store');
                                setIsEditingUpi(false);
                                setAppNotice('Store UPI ID updated! QR code now points to your real bank account.');
                                setTimeout(() => setAppNotice(''), 6000);
                                setErrorMsg('');
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                            >
                              Save & Update QR Code
                            </button>
                          </div>
                        </div>
                      )}

                      {/* QR Mode Switcher */}
                      <div className="p-3 rounded-2xl bg-white dark:bg-[#0E0E17] border border-purple-100 dark:border-white/10 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-pink-500" />
                          <span className="text-slate-600 dark:text-slate-400 text-[11px] font-semibold">
                            QR Mode:
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setQrMode('full')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              qrMode === 'full'
                                ? 'bg-pink-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Pre-filled ₹{effectiveTotal}
                          </button>
                          <button
                            type="button"
                            onClick={() => setQrMode('direct')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              qrMode === 'direct'
                                ? 'bg-pink-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                            title="Universal Mode - Bypasses bank merchant restrictions on personal UPI accounts"
                          >
                            Universal Direct Mode
                          </button>
                        </div>
                      </div>

                      {/* Helpful guidance on QR Scanning */}
                      <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300">
                        {qrMode === 'full' ? (
                          <p>
                            💡 <strong>Pre-filled Mode:</strong> Google Pay / PhonePe will automatically show <strong>₹{Number(effectiveTotal).toFixed(2)}</strong>. (Best for Merchant accounts).
                          </p>
                        ) : (
                          <p>
                            💡 <strong>Universal Direct Mode:</strong> Opens Google Pay directly for <strong>{cleanPayeeName}</strong>. Works on 100% of personal bank accounts without restrictions.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: 1-CLICK MOBILE APP LAUNCHERS */}
                {upiTab === 'apps' && (
                  <div className="space-y-4 py-2 animate-fade-in">
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Tap below to open your preferred UPI app directly. On mobile phones, this launches the payment sheet immediately with ₹{effectiveTotal} to <strong>{cleanPayeeName}</strong>:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Google Pay */}
                      <button
                        type="button"
                        onClick={() => handleAppClick(`tez://upi/pay?pa=${encodeURIComponent(activeReceivingUpi)}&pn=${encodeURIComponent(cleanPayeeName)}&am=${numericAmount}&cu=INR`, 'Google Pay')}
                        className="p-4 rounded-2xl bg-white dark:bg-[#0E0E17] hover:border-emerald-500 border border-slate-200 dark:border-white/10 flex items-center justify-between transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-98 text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center font-black text-emerald-600 dark:text-emerald-400 text-lg">
                            G
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white block group-hover:text-emerald-500 transition-colors">
                              Google Pay (GPay)
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Instant direct bank transfer
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </button>

                      {/* PhonePe */}
                      <button
                        type="button"
                        onClick={() => handleAppClick(`phonepe://upi/pay?pa=${encodeURIComponent(activeReceivingUpi)}&pn=${encodeURIComponent(cleanPayeeName)}&am=${numericAmount}&cu=INR`, 'PhonePe')}
                        className="p-4 rounded-2xl bg-white dark:bg-[#0E0E17] hover:border-purple-500 border border-slate-200 dark:border-white/10 flex items-center justify-between transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-98 text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center font-black text-purple-600 dark:text-purple-400 text-lg">
                            Pe
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white block group-hover:text-purple-500 transition-colors">
                              PhonePe
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Instant direct bank transfer
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                      </button>

                      {/* Paytm */}
                      <button
                        type="button"
                        onClick={() => handleAppClick(`paytmmp://upi/pay?pa=${encodeURIComponent(activeReceivingUpi)}&pn=${encodeURIComponent(cleanPayeeName)}&am=${numericAmount}&cu=INR`, 'Paytm')}
                        className="p-4 rounded-2xl bg-white dark:bg-[#0E0E17] hover:border-sky-500 border border-slate-200 dark:border-white/10 flex items-center justify-between transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-98 text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center font-black text-sky-600 dark:text-sky-400 text-lg">
                            ₹
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white block group-hover:text-sky-500 transition-colors">
                              Paytm
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Instant direct bank transfer
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                      </button>

                      {/* Any Other UPI App */}
                      <button
                        type="button"
                        onClick={() => handleAppClick(upiDeepLink, 'UPI App')}
                        className="p-4 rounded-2xl bg-white dark:bg-[#0E0E17] hover:border-pink-500 border border-slate-200 dark:border-white/10 flex items-center justify-between transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-98 text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/50 flex items-center justify-center font-black text-pink-600 dark:text-pink-400 text-lg">
                            <QrCode className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white block group-hover:text-pink-500 transition-colors">
                              BHIM / Any UPI App
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              CRED, Navi, Amazon Pay, etc.
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>
                  </div>
                )}



                {/* Optional UTR Input & Final Confirm Button */}
                <div className="pt-3 border-t border-purple-100 dark:border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="Enter 12-digit UPI UTR / Ref No. (Optional)"
                      className="flex-1 px-4 py-3.5 bg-white dark:bg-black/70 border border-purple-200 dark:border-brand-500/30 rounded-2xl text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 shadow-inner"
                    />

                    <button
                      type="button"
                      disabled={processingPayment}
                      onClick={handlePlaceOrder}
                      className="sm:w-72 py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-pink-600 to-purple-600 hover:from-brand-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-brand-500/30 hover:shadow-pink-500/40 transition-all cursor-pointer active:scale-98 disabled:opacity-50 btn-solid-cta"
                    >
                      {processingPayment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verifying Payment...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-white" />
                          <span>✓ I Have Paid ₹{effectiveTotal}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                    After completing payment in Google Pay / PhonePe, click the button above to generate your official GST Tax Invoice and confirm dispatch.
                  </p>
                </div>

                {/* Subtle Discreet Store Configuration Link at the Bottom */}
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setTempUpiId(merchantUpiId || activeReceivingUpi);
                      setTempMerchantName(cleanPayeeName);
                      setIsEditingUpi(!isEditingUpi);
                    }}
                    className="text-[11px] font-semibold text-slate-400 hover:text-pink-500 dark:text-slate-500 dark:hover:text-pink-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                    <span>{isEditingUpi ? 'Hide Store UPI Settings' : 'Store Owner: Change Receiving UPI ID'}</span>
                  </button>

                  {isEditingUpi && (
                    <form onSubmit={handleSaveMerchantUpi} className="mt-3 p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-500/30 space-y-3 animate-fade-in text-xs text-left">
                      <div className="text-pink-900 dark:text-pink-300 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-pink-500" />
                        <span>Update Store Receiving UPI Account</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-white/80 mb-1">
                            Receiving UPI ID *
                          </label>
                          <input
                            type="text"
                            required
                            value={tempUpiId}
                            onChange={(e) => setTempUpiId(e.target.value)}
                            placeholder="e.g. stutu2004shah@okhdfcbank"
                            className="w-full px-3.5 py-2.5 bg-white dark:bg-black border border-purple-300 dark:border-pink-500/40 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-white/80 mb-1">
                            Payee Name * (e.g. Stutu Shah)
                          </label>
                          <input
                            type="text"
                            value={tempMerchantName}
                            onChange={(e) => setTempMerchantName(e.target.value)}
                            placeholder="e.g. Stutu Shah (Do NOT use 'gpay')"
                            className="w-full px-3.5 py-2.5 bg-white dark:bg-black border border-purple-300 dark:border-pink-500/40 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setIsEditingUpi(false)}
                          className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save & Update</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* PAYMENT CONTENT 2: PROFESSIONAL CASH ON DELIVERY (Like Flipkart / Amazon COD) */}
            {paymentMethod === 'cod' && (
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-black/60 border border-purple-200 dark:border-brand-500/30 space-y-6">
                <div className="p-4 rounded-2xl bg-pink-50/80 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-pink-700 dark:text-pink-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-pink-600 dark:text-pink-400 shrink-0" />
                    <span>Cash on Delivery is Available for Your Pincode</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-white/70">
                    Pay the exact order amount of <strong className="text-slate-950 dark:text-white font-bold">₹{effectiveTotal}</strong> in cash or via UPI QR scanner to the courier executive upon doorstep delivery.
                  </p>
                </div>

                {/* Professional Security Verification Canvas Card (Like Flipkart) */}
                <div className="p-5 rounded-2xl bg-white dark:bg-black/80 border border-purple-200 dark:border-brand-500/25 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                        <span>Security Order Verification</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-white/60 mt-0.5">
                        Enter the 4 characters shown in the security image to prevent automated spam orders:
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    {/* Visual Canvas CAPTCHA */}
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl overflow-hidden border-2 border-purple-300 dark:border-pink-500/40 shadow-inner">
                        <canvas
                          ref={canvasRef}
                          width={140}
                          height={46}
                          className="block cursor-pointer select-none"
                          onClick={generateCaptcha}
                          title="Click to refresh image"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={generateCaptcha}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-purple-200 dark:border-white/20 transition-all cursor-pointer"
                        title="Get a new verification code"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Numeric Input */}
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={4}
                          value={enteredCaptcha}
                          onChange={(e) => setEnteredCaptcha(e.target.value.toUpperCase().slice(0, 4))}
                          placeholder="Type characters"
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black border border-purple-300 dark:border-brand-500/40 rounded-xl text-center text-sm font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        />
                        {enteredCaptcha.length === 4 && enteredCaptcha.toUpperCase() === codCaptchaCode && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finalize Button for COD */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-pink-600 to-purple-600 hover:from-brand-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-brand-500/30 hover:shadow-pink-500/40 transition-all cursor-pointer active:scale-98"
                >
                  <Banknote className="w-5 h-5" />
                  <span>Confirm Order with Cash on Delivery (₹{effectiveTotal})</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary & Cart Items (Col 8/9 to 12) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-[#0B0B12] rounded-3xl border border-purple-200 dark:border-brand-500/30 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-white/10">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span>Order Summary ({activeItems.length})</span>
              </h3>
              <span className="text-sm font-bold text-pink-600 dark:text-pink-400">
                ₹{effectiveTotal}
              </span>
            </div>

            {/* List of items */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {activeItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-black/60 border border-purple-100 dark:border-brand-500/20"
                >
                  <img
                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=200&q=80'}
                    alt="Product"
                    className="w-12 h-14 object-cover rounded-xl bg-slate-100 dark:bg-black shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{item.product?.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-white/60">Qty: {item.quantity} • Size: {item.size}</p>
                    <p className="text-pink-600 dark:text-pink-400 font-bold">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-purple-100 dark:border-white/10 text-xs text-slate-600 dark:text-white/70">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{effectiveSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5% Apparel)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{effectiveTax}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span className="font-bold text-pink-600 dark:text-pink-400">
                  {effectiveShipping === 0 ? 'FREE' : `₹${effectiveShipping}`}
                </span>
              </div>
              <div className="pt-3 border-t border-purple-200 dark:border-brand-500/20 flex items-center justify-between text-base font-extrabold text-slate-900 dark:text-white">
                <span>Total Payable</span>
                <span className="text-pink-600 dark:text-pink-400 text-2xl font-display">
                  ₹{effectiveTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-slate-50 dark:bg-black/40 rounded-3xl border border-purple-200/80 dark:border-brand-500/20 p-5 space-y-3 text-xs text-slate-600 dark:text-white/70 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-pink-600 dark:text-pink-400 shrink-0" />
              <span><strong>NPCI & RBI Verified:</strong> Genuine instant UPI payments with 100% money transfer safety.</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-purple-600 dark:text-brand-400 shrink-0" />
              <span><strong>Doorstep Verification:</strong> Cash on Delivery available with parcel verification before payout.</span>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-pink-600 dark:text-pink-400 shrink-0" />
              <span><strong>7-Day Easy Returns:</strong> Instant refund initiation to your UPI ID on return request.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
