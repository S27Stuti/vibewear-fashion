import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Ruler,
  X,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Send,
  CheckCircle2,
  Flame,
  Shirt,
  Info,
  Crown,
  Activity,
  GraduationCap,
  Smile,
  Check,
  Eye,
  Zap,
  User,
  RotateCcw,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

// Intelligent Fashion Query Engine
function processStylistQuery(rawQuery, allProducts) {
  const q = (rawQuery || '').toLowerCase().trim();

  // 1. Target Gender / Collection Detection
  let targetCategory = null;
  const isKids = /\b(kid|kids|child|children|toddler|baby|babies)\b/i.test(q);
  const isWomen = /\b(women|woman|female|ladies|lady|dress|dresses|skirt|heels|gown|kurti|saree|blouse|crop)\b/i.test(q);
  const isMen = !isWomen && /\b(men|man|male|gent|gentleman|guy|guys|boy|boys)\b/i.test(q);

  if (isKids) targetCategory = 'Kids';
  else if (isWomen) targetCategory = 'Women';
  else if (isMen) targetCategory = 'Men';

  // Filter pool by category if detected
  let pool = targetCategory
    ? allProducts.filter((p) => (p.category || '').toLowerCase() === targetCategory.toLowerCase())
    : allProducts;

  if (pool.length === 0) pool = allProducts;

  let replyText = '';
  let matched = [];

  // 2. Fancy / Party / Glam / Cocktail / Formal
  if (
    q.includes('fancy') ||
    q.includes('party') ||
    q.includes('glam') ||
    q.includes('cocktail') ||
    q.includes('night out') ||
    q.includes('club') ||
    q.includes('wedding') ||
    q.includes('formal') ||
    q.includes('date night') ||
    q.includes('elegant') ||
    q.includes('luxury')
  ) {
    if (targetCategory === 'Women') {
      replyText =
        'Here are stunning, high-glam fancy styles curated exclusively from our Women’s Collection! These feature luxurious draping, rich satin textures, and signature VibeWear elegance perfect for special evenings and parties:';
      matched = pool
        .filter(
          (p) =>
            (p.subCategory || '').toLowerCase().includes('dress') ||
            (p.subCategory || '').toLowerCase().includes('jacket') ||
            (p.subCategory || '').toLowerCase().includes('top') ||
            (p.description || '').toLowerCase().includes('satin') ||
            (p.description || '').toLowerCase().includes('velour') ||
            (p.description || '').toLowerCase().includes('blazer') ||
            p.isFeatured
        )
        .slice(0, 3);
    } else if (targetCategory === 'Men') {
      replyText =
        'For an elevated party or night-out aesthetic, here are our sharpest tailored layers and heavyweight statement silhouettes for Men:';
      matched = pool
        .filter(
          (p) =>
            (p.subCategory || '').toLowerCase().includes('jacket') ||
            (p.subCategory || '').toLowerCase().includes('shirt') ||
            (p.subCategory || '').toLowerCase().includes('sweater') ||
            (p.description || '').toLowerCase().includes('wool') ||
            p.isFeatured
        )
        .slice(0, 3);
    } else {
      replyText =
        'Here are our most celebrated, high-impact evening and party garments crafted with premium textures and standout silhouettes:';
      matched = pool.filter((p) => p.isFeatured || (p.rating || 0) >= 4.8).slice(0, 3);
    }
  }
  // 3. Hoodies / Sweatshirts / Fleece
  else if (q.includes('hoodie') || q.includes('sweatshirt') || q.includes('fleece')) {
    const catLabel = targetCategory ? ` for ${targetCategory}` : '';
    replyText = `Our heavyweight 360–450 GSM French terry hoodies feature drop-shoulder relaxed cuts and thermal brushback lining. Here are the top picks${catLabel}:`;
    matched = pool
      .filter(
        (p) =>
          (p.subCategory || '').toLowerCase().includes('hoodie') ||
          (p.subCategory || '').toLowerCase().includes('sweatshirt') ||
          (p.title || '').toLowerCase().includes('hoodie')
      )
      .slice(0, 3);
  }
  // 4. Cargo / Pants / Trousers / Joggers
  else if (
    q.includes('cargo') ||
    q.includes('pant') ||
    q.includes('trouser') ||
    q.includes('jogger') ||
    q.includes('jean')
  ) {
    const catLabel = targetCategory ? ` for ${targetCategory}` : '';
    replyText = `Engineered with reinforced ripstop cotton, modular 3D utility pockets, and articulated knees. Check out these tactical and relaxed trousers${catLabel}:`;
    matched = pool
      .filter(
        (p) =>
          (p.subCategory || '').toLowerCase().includes('pant') ||
          (p.title || '').toLowerCase().includes('cargo') ||
          (p.title || '').toLowerCase().includes('trousers') ||
          (p.title || '').toLowerCase().includes('jogger')
      )
      .slice(0, 3);
  }
  // 5. T-Shirts / Graphic Tees / Tops
  else if (q.includes('tee') || q.includes('t-shirt') || q.includes('top') || q.includes('shirt')) {
    const catLabel = targetCategory ? ` for ${targetCategory}` : '';
    replyText = `Crafted from 240–260 GSM combed Turkish cotton with pre-shrunk anti-pill finish. Here are our essential tops${catLabel}:`;
    matched = pool
      .filter(
        (p) =>
          (p.subCategory || '').toLowerCase().includes('t-shirt') ||
          (p.subCategory || '').toLowerCase().includes('top') ||
          (p.subCategory || '').toLowerCase().includes('shirt')
      )
      .slice(0, 3);
  }
  // 6. Gym / Workout / Activewear
  else if (
    q.includes('gym') ||
    q.includes('workout') ||
    q.includes('active') ||
    q.includes('athletic') ||
    q.includes('yoga')
  ) {
    replyText =
      'Engineered with 4-way stretch moisture-wicking compression fibers for seamless mobility. Check out our activewear picks:';
    matched = pool
      .filter(
        (p) =>
          (p.subCategory || '').toLowerCase().includes('active') ||
          (p.title || '').toLowerCase().includes('athletic') ||
          (p.title || '').toLowerCase().includes('legging') ||
          (p.title || '').toLowerCase().includes('shorts')
      )
      .slice(0, 3);
  }
  // 7. Colors (Pink, Purple, Black, White)
  else if (q.includes('pink') || q.includes('purple') || q.includes('black') || q.includes('white')) {
    let colorTarget = 'pink';
    if (q.includes('purple') || q.includes('violet') || q.includes('plum')) colorTarget = 'purple';
    else if (q.includes('black') || q.includes('dark')) colorTarget = 'black';
    else if (q.includes('white')) colorTarget = 'white';

    replyText = `Here are standout pieces featuring our signature ${colorTarget} tonal palette:`;
    matched = pool
      .filter((p) => (p.colors || []).some((c) => c.toLowerCase().includes(colorTarget)))
      .slice(0, 3);
  }
  // 8. Size & Fit question
  else if (q.includes('size') || q.includes('fit') || q.includes('measurement')) {
    replyText =
      'Our garments are pre-shrunk and tailored with authentic modern drapes. If you love a boxy oversized look, order your standard size or one size up. You can also use our "AI Fit & Size Finder" tab above to compute your exact fit using your height and weight!';
    matched = [];
  }
  // 9. Shipping, Payment, Safety
  else if (q.includes('shipping') || q.includes('delivery') || q.includes('return') || q.includes('payment') || q.includes('cod') || q.includes('upi') || q.includes('qr')) {
    replyText =
      'We provide complimentary express delivery across India on orders over ₹499, 7-day hassle-free size exchanges, and 100% verified payment methods: Scan UPI QR Code (Google Pay, PhonePe, Paytm, BHIM) and Cash on Delivery with visual CAPTCHA verification!';
    matched = [];
  }
  // 10. Fallback with Category-Aware Recommendations
  else {
    const catLabel = targetCategory ? ` from our ${targetCategory}'s Collection` : '';
    replyText = `Based on your request, our AI Stylist recommends pairing dark luxury basics with contrasting purple and pink accents. Check out these trending picks${catLabel}:`;
    matched = pool.slice(0, 3);
  }

  // Ensure fallback products if matched was empty on a product search
  if (matched.length === 0 && !q.includes('size') && !q.includes('shipping')) {
    matched = pool.slice(0, 3);
  }

  return { text: replyText, recommendedProducts: matched };
}

const VibeAIModal = ({
  isOpen,
  onClose,
  products = [],
  onSelectProduct,
  onQuickView,
  onOpenCart
}) => {
  const [activeTab, setActiveTab] = useState('outfit'); // 'outfit' | 'size' | 'chat'
  const { addToCart, showToast } = useCart();
  const { isDark } = useTheme();

  // In-modal visual feedback when adding items to cart
  const [addedItems, setAddedItems] = useState({});
  const [inModalCartAlert, setInModalCartAlert] = useState(null);

  const handleAddToCartInModal = (product) => {
    const selectedSize = product.sizes?.[0] || 'M';
    const selectedColor = product.colors?.[0] || 'Standard';
    addToCart(product, selectedSize, selectedColor, 1);
    
    // Show instant visual feedback on the button
    const prodId = product.id || product._id;
    setAddedItems((prev) => ({ ...prev, [prodId]: true }));
    setInModalCartAlert({
      id: prodId,
      title: product.title,
      price: product.price
    });
    showToast(`Added ${product.title} to Bag!`, 'success');

    // Auto-reset button state after 3.5s
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = { ...prev };
        delete next[prodId];
        return next;
      });
    }, 3500);

    // Auto-dismiss top banner after 5s
    setTimeout(() => {
      setInModalCartAlert(null);
    }, 5000);
  };

  // ------------------ TAB 1: OUTFIT GENERATOR STATE ------------------
  const [outfitCategory, setOutfitCategory] = useState('Men');
  const [outfitOccasion, setOutfitOccasion] = useState('Night Out / Club / Party');
  const [outfitVibe, setOutfitVibe] = useState('Cyberpunk Black & Purple');
  const [isGeneratingOutfit, setIsGeneratingOutfit] = useState(false);
  const [generatedLook, setGeneratedLook] = useState(null);

  // ------------------ TAB 2: FIT & SIZE PREDICTOR STATE ------------------
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(68);
  const [bodyType, setBodyType] = useState('Athletic');
  const [fitPreference, setFitPreference] = useState('Oversized / Streetwear');
  const [isPredictingSize, setIsPredictingSize] = useState(false);
  const [sizePrediction, setSizePrediction] = useState(null);

  // ------------------ TAB 3: STYLIST CHATBOT STATE ------------------
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatBottomRef = useRef(null);
  const chatContainerRef = useRef(null);
  const latestMessageRef = useRef(null);

  // Auto-generate initial outfit when opened or category changed
  useEffect(() => {
    if (isOpen && !generatedLook) {
      generateOutfitLook();
    }
  }, [isOpen, outfitCategory]);

  // Keyboard Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (activeTab === 'chat' && chatMessages.length > 0) {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [chatMessages.length, isBotTyping, activeTab]);

  if (!isOpen) return null;

  // ------------------ GENERATE OUTFIT LOGIC ------------------
  const generateOutfitLook = () => {
    setIsGeneratingOutfit(true);
    setTimeout(() => {
      const catProducts = products.filter(
        (p) => (p.category || '').toLowerCase() === outfitCategory.toLowerCase()
      );

      // Attempt to find Top, Bottom, and Layer/Outerwear
      let topItem = catProducts.find(
        (p) =>
          (p.subCategory || '').toLowerCase().includes('shirt') ||
          (p.subCategory || '').toLowerCase().includes('top') ||
          (p.subCategory || '').toLowerCase().includes('tee')
      );
      let bottomItem = catProducts.find(
        (p) =>
          (p.subCategory || '').toLowerCase().includes('pant') ||
          (p.subCategory || '').toLowerCase().includes('jean') ||
          (p.subCategory || '').toLowerCase().includes('short') ||
          (p.subCategory || '').toLowerCase().includes('skirt')
      );
      let layerItem = catProducts.find(
        (p) =>
          (p.subCategory || '').toLowerCase().includes('jacket') ||
          (p.subCategory || '').toLowerCase().includes('hoodie') ||
          (p.subCategory || '').toLowerCase().includes('blazer') ||
          (p.subCategory || '').toLowerCase().includes('sweater') ||
          (p.subCategory || '').toLowerCase().includes('dress')
      );

      // Fallbacks
      if (!topItem && catProducts[0]) topItem = catProducts[0];
      if (!bottomItem && catProducts[1]) bottomItem = catProducts[1];
      if (!layerItem && catProducts[2]) layerItem = catProducts[2];

      const lookItems = [topItem, bottomItem, layerItem].filter(Boolean);

      const lookStyles = [
        {
          title: `${outfitOccasion} Lookbook`,
          matchScore: 98,
          curatorNote: `Calculated with neural harmonic palette matching ${outfitVibe}. Balances structured statement layers with relaxed everyday comfort.`,
          items: lookItems
        },
        {
          title: `High-Contrast ${outfitCategory} Silhouette`,
          matchScore: 96,
          curatorNote: `Engineered for spotlight presence. Deep obsidian shades paired with high-voltage purple and pink micro-accents.`,
          items: lookItems.slice().reverse()
        }
      ];

      setGeneratedLook(lookStyles[Math.floor(Math.random() * lookStyles.length)]);
      setIsGeneratingOutfit(false);
    }, 600);
  };

  // Add all items from look to cart
  const handleAddFullLookToBag = () => {
    if (!generatedLook || !generatedLook.items) return;
    generatedLook.items.forEach((item) => {
      addToCart(item, item.sizes?.[0] || 'M', item.colors?.[0] || 'Standard', 1);
    });
    showToast(`✨ ${generatedLook.items.length} items from AI Look added to bag!`);
    if (onOpenCart) {
      setTimeout(() => {
        onClose();
        onOpenCart();
      }, 500);
    }
  };

  // ------------------ PREDICT SIZE LOGIC ------------------
  const handlePredictSize = (e) => {
    e.preventDefault();
    setIsPredictingSize(true);
    setTimeout(() => {
      let predicted = 'M';
      let confidence = 96;

      const bmi = weightKg / Math.pow(heightCm / 100, 2);

      if (bmi < 19) {
        predicted = fitPreference.includes('Oversized') ? 'M' : 'S';
      } else if (bmi < 24) {
        if (fitPreference.includes('Oversized')) {
          predicted = heightCm > 178 ? 'XL' : 'L';
        } else if (fitPreference.includes('Slim')) {
          predicted = 'M';
        } else {
          predicted = heightCm > 175 ? 'L' : 'M';
        }
      } else if (bmi < 28) {
        predicted = fitPreference.includes('Oversized') ? 'XXL' : 'L';
        confidence = 94;
      } else {
        predicted = 'XXL';
        confidence = 92;
      }

      setSizePrediction({
        size: predicted,
        confidence: confidence,
        details: [
          `Chest Ease: Tailored with 2.8" ease for a contemporary aesthetic drape.`,
          `Length: Sits 1.5" below hip bone based on your ${heightCm}cm height.`,
          `Shoulder Seam: ${fitPreference.includes('Oversized') ? 'Dropped 1.2" for authentic streetwear posture.' : 'Precisely aligned with acromion bone.'}`
        ],
        advice: `For ${fitPreference.toLowerCase()} wear, Size ${predicted} provides optimum comfort without looking boxy or restricting movement.`
      });
      setIsPredictingSize(false);
    }, 600);
  };

  // ------------------ CHATBOT LOGIC ------------------
  const handleSendMessage = (textToSend) => {
    const query = (textToSend || chatInput || '').trim();
    if (!query) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text: query, timestamp: timeStr };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      const response = processStylistQuery(query, products);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response.text,
          recommendedProducts: response.recommendedProducts,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsBotTyping(false);
    }, 550);
  };

  const handleClearChat = () => {
    setChatMessages([]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#090910] border border-purple-200 dark:border-brand-500/30 shadow-2xl text-slate-900 dark:text-white overflow-hidden animate-slide-up">
        {/* Glow ambient spots */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-600/15 dark:bg-brand-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-600/15 dark:bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating In-Modal Cart Notification Toast */}
        {inModalCartAlert && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-[#12121D]/95 text-white border border-emerald-500/50 shadow-2xl backdrop-blur-xl animate-slide-down">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">
              Added <strong className="text-emerald-300 font-bold">"{inModalCartAlert.title}"</strong> to Bag!
            </span>
            {onOpenCart && (
              <button
                type="button"
                onClick={() => {
                  if (onClose) onClose();
                  onOpenCart();
                }}
                className="ml-1 px-3 py-1 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-[11px] font-bold text-white shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <span>View Bag</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-brand-500/20 flex items-center justify-between shrink-0 bg-white/95 dark:bg-[#06060A]/95 relative z-10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-display text-slate-950 dark:text-white">
                  VibeAI • Fashion Intelligence
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-500/40">
                  AI Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-white/70">
                Personal styling, outfit lookbooks & instant fit prediction
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-pink-600 border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:text-white flex items-center justify-center shadow-md transition-all cursor-pointer group hover:rotate-90 hover:scale-105 shrink-0"
            aria-label="Close VibeAI Assistant"
            title="Close Assistant (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modern Tabs Bar */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-100/90 dark:bg-black/60 border-b border-purple-100 dark:border-brand-500/20 flex gap-2 overflow-x-auto relative z-10">
          <button
            type="button"
            onClick={() => setActiveTab('outfit')}
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'outfit'
                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md shadow-pink-500/30 scale-102 btn-solid-cta'
                : 'text-slate-700 dark:text-white/70 hover:text-purple-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-purple-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Outfit Generator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('size')}
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'size'
                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md shadow-pink-500/30 scale-102 btn-solid-cta'
                : 'text-slate-700 dark:text-white/70 hover:text-purple-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-purple-200'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>AI Fit & Size Finder</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md shadow-pink-500/30 scale-102 btn-solid-cta'
                : 'text-slate-700 dark:text-white/70 hover:text-purple-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-purple-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Stylist Chatbot</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 relative z-10 flex flex-col overflow-hidden">
          {/* ================= TAB 1: AI OUTFIT GENERATOR ================= */}
          {activeTab === 'outfit' && (
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
              {/* Premium Controls Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#06060A]/90 border border-purple-200 dark:border-brand-500/30 shadow-xl space-y-5">
                {/* 1. Target Collection (Modern Interactive Cards) */}
                <div>
                  <label className="block text-[11px] font-extrabold text-pink-500 uppercase tracking-wider mb-2.5">
                    1. Target Department Collection
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'Men', label: 'Men', sub: 'Urban Streetwear', icon: Shirt },
                      { id: 'Women', label: 'Women', sub: 'Luxury Silhouettes', icon: Sparkles },
                      { id: 'Kids', label: 'Kids', sub: 'Play & Fleece', icon: Smile }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = outfitCategory === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setOutfitCategory(item.id)}
                          className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border relative overflow-hidden group ${
                            isActive
                              ? 'bg-gradient-to-b from-brand-600/30 to-pink-600/25 border-pink-500 shadow-lg shadow-pink-500/20 ring-2 ring-pink-500/30 scale-102'
                              : 'bg-slate-50 dark:bg-white/5 border-purple-100 dark:border-white/10 hover:border-pink-500/40 hover:bg-purple-50 dark:hover:bg-white/10'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mb-1.5 transition-transform group-hover:scale-110 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                          <span className={`text-xs font-extrabold ${isActive ? 'text-purple-950 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                            {item.label}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{item.sub}</span>
                          {isActive && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Occasion / Event (Modern Icon Chips) */}
                <div>
                  <label className="block text-[11px] font-extrabold text-pink-500 uppercase tracking-wider mb-2.5">
                    2. Occasion & Lifestyle Vibe
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Night Out / Club / Party', icon: Flame },
                      { name: 'Streetwear / Casual Chill', icon: Shirt },
                      { name: 'College & Campus', icon: GraduationCap },
                      { name: 'Gym & Athletic', icon: Activity },
                      { name: 'Luxury Formal / Date Night', icon: Crown }
                    ].map((occ) => {
                      const Icon = occ.icon;
                      const isActive = outfitOccasion === occ.name;
                      return (
                        <button
                          key={occ.name}
                          type="button"
                          onClick={() => setOutfitOccasion(occ.name)}
                          className={`py-2 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white border-pink-400 shadow-md shadow-pink-500/25 scale-102 btn-solid-cta'
                              : 'bg-slate-50 dark:bg-white/5 border-purple-100 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-pink-500/40 hover:text-slate-950 dark:hover:text-white'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-pink-500'}`} />
                          <span>{occ.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Aesthetic Palette Vibe (Color Swatch Chips) */}
                <div>
                  <label className="block text-[11px] font-extrabold text-pink-500 uppercase tracking-wider mb-2.5">
                    3. Signature Aesthetic Color Harmony
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: 'Cyberpunk Black & Purple', c1: '#0B0B12', c2: '#A855F7' },
                      { name: 'High-Street Luxury', c1: '#3B0764', c2: '#EC4899' },
                      { name: 'Minimal Monochrome', c1: '#111827', c2: '#F3F4F6' },
                      { name: 'Trendy Pastel Pink', c1: '#F472B6', c2: '#E9D5FF' }
                    ].map((vb) => {
                      const isActive = outfitVibe === vb.name;
                      return (
                        <button
                          key={vb.name}
                          type="button"
                          onClick={() => setOutfitVibe(vb.name)}
                          className={`py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                            isActive
                              ? 'bg-gradient-to-r from-brand-600/30 to-pink-600/30 border-pink-500 text-purple-950 dark:text-white shadow-md ring-2 ring-pink-500/30'
                              : 'bg-slate-50 dark:bg-white/5 border-purple-100 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-pink-500/40'
                          }`}
                        >
                          <div className="flex -space-x-1 shrink-0">
                            <span className="w-3 h-3 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: vb.c1 }} />
                            <span className="w-3 h-3 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: vb.c2 }} />
                          </div>
                          <span className="truncate">{vb.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Master Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={generateOutfitLook}
                    disabled={isGeneratingOutfit}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-pink-600 to-purple-600 hover:from-brand-500 hover:via-pink-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-brand-600/30 hover:shadow-pink-600/50 transition-all cursor-pointer active:scale-98 disabled:opacity-50 group hover-glow btn-solid-cta"
                  >
                    {isGeneratingOutfit ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Synthesizing Aesthetic Palette Lookbook...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-500" />
                        <span>Generate AI Styled Lookbook</span>
                        <Zap className="w-4 h-4 text-pink-200" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Look Result Showcase */}
              {generatedLook && (
                <div className="p-5 rounded-3xl bg-white dark:bg-[#06060A]/80 border border-purple-200 dark:border-brand-500/40 shadow-2xl space-y-4 animate-slide-up">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-100 dark:border-brand-500/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-pink-500" />
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {generatedLook.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-white/70 mt-1 max-w-xl">
                        {generatedLook.curatorNote}
                      </p>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-500/20 border border-pink-300 dark:border-pink-500 text-pink-700 dark:text-pink-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{generatedLook.matchScore}% Match Harmony</span>
                    </div>
                  </div>

                  {/* 3-Piece Outfit Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {generatedLook.items.map((prod, idx) => (
                      <div
                        key={prod.id || idx}
                        onClick={() => onSelectProduct && onSelectProduct(prod)}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-black/60 border border-purple-100 dark:border-brand-500/20 hover:border-pink-500 transition-all flex flex-col justify-between group cursor-pointer hover:-translate-y-1 shadow-sm dark:shadow-none"
                      >
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-200 dark:bg-black/40 mb-2">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80'}
                            alt={prod.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-white/90 dark:bg-black/80 text-purple-950 dark:text-white backdrop-blur-md border border-purple-200 dark:border-white/20">
                            Piece {idx + 1}
                          </span>
                        </div>

                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-pink-500 transition-colors">
                            {prod.title}
                          </h5>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs font-extrabold text-pink-600 dark:text-pink-400">₹{prod.price}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{prod.subCategory || 'Apparel'}</span>
                          </div>
                        </div>

                        <div className="mt-2.5 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onQuickView) onQuickView(prod);
                              else if (onSelectProduct) onSelectProduct(prod);
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-purple-200 dark:border-white/20 text-[10px] font-bold text-slate-800 dark:text-white hover:bg-pink-600 hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Quick View</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCartInModal(prod);
                            }}
                            className={`p-1.5 px-2.5 rounded-lg text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                              addedItems[prod.id || prod._id]
                                ? 'bg-emerald-600 shadow-emerald-500/30'
                                : 'bg-pink-600 hover:bg-pink-500 btn-solid-cta'
                            }`}
                            title={addedItems[prod.id || prod._id] ? 'Added to Bag!' : 'Add to Bag'}
                          >
                            {addedItems[prod.id || prod._id] ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white" />
                                <span>Added</span>
                              </>
                            ) : (
                              <ShoppingBag className="w-3.5 h-3.5 text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 1-Click Buy Full Outfit CTA */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleAddFullLookToBag}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-pink-600 to-purple-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 transition-all cursor-pointer active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span>Add Complete 3-Piece Lookbook to Bag</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: AI FIT & SIZE PREDICTOR ================= */}
          {activeTab === 'size' && (
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
              <form onSubmit={handlePredictSize} className="p-5 rounded-3xl bg-white dark:bg-[#06060A]/90 border border-purple-200 dark:border-brand-500/30 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-pink-500 uppercase tracking-wider pb-2 border-b border-purple-100 dark:border-brand-500/20">
                  <Ruler className="w-4 h-4" />
                  <span>Biometric Body Parameters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Height */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
                      <span>Height:</span>
                      <strong className="text-pink-500 font-mono">{heightCm} cm ({Math.floor(heightCm / 30.48)}' {Math.round((heightCm % 30.48) / 2.54)}")</strong>
                    </div>
                    <input
                      type="range"
                      min={140}
                      max={210}
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
                      <span>Weight:</span>
                      <strong className="text-pink-500 font-mono">{weightKg} kg ({Math.round(weightKg * 2.20462)} lbs)</strong>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={130}
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Body Build / Frame
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Slim', 'Athletic', 'Average', 'Broad'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBodyType(b)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          bodyType === b
                            ? 'bg-pink-600/30 border-pink-500 text-purple-950 dark:text-white shadow-md ring-2 ring-pink-500/20'
                            : 'bg-slate-50 dark:bg-white/5 border-purple-100 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fit Preference */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Preferred Fit Aesthetic
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Slim Fit', 'Standard Regular', 'Oversized / Streetwear'].map((fit) => (
                      <button
                        key={fit}
                        type="button"
                        onClick={() => setFitPreference(fit)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          fitPreference === fit
                            ? 'bg-pink-600/30 border-pink-500 text-purple-950 dark:text-white shadow-md ring-2 ring-pink-500/20'
                            : 'bg-slate-50 dark:bg-white/5 border-purple-100 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPredictingSize}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-pink-600 to-purple-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 transition-all cursor-pointer disabled:opacity-50 btn-solid-cta"
                >
                  {isPredictingSize ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Calculating Silhouette Matrix...</span>
                    </>
                  ) : (
                    <>
                      <Ruler className="w-4 h-4" />
                      <span>Predict My Guaranteed Perfect Size</span>
                    </>
                  )}
                </button>
              </form>

              {/* Prediction Results */}
              {sizePrediction && (
                <div className="p-5 rounded-3xl bg-white dark:bg-[#06060A]/90 border border-purple-200 dark:border-brand-500/40 shadow-2xl space-y-4 animate-slide-up">
                  <div className="flex justify-between items-center pb-3 border-b border-purple-100 dark:border-brand-500/20">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-pink-500 tracking-wider">
                        Recommended VibeWear Size
                      </span>
                      <div className="text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-0.5">
                        Size {sizePrediction.size}
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-600/20 border border-pink-300 dark:border-pink-500 text-pink-700 dark:text-pink-300 font-extrabold text-xs">
                      {sizePrediction.confidence}% AI Confidence
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {sizePrediction.advice}
                  </p>

                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-black/60 border border-purple-100 dark:border-brand-500/20">
                    <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold block mb-1">Fit Intelligence Breakdown:</span>
                    {sizePrediction.details.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: STYLIST CHATBOT ================= */}
          {activeTab === 'chat' && (
            <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden bg-slate-50/50 dark:bg-[#06060A]">
              {/* Chat Subheader */}
              <div className="px-4 sm:px-6 py-2.5 bg-white/90 dark:bg-black/40 border-b border-purple-100 dark:border-brand-500/20 flex items-center justify-between shrink-0 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      VibeAI Haute Couture Concierge
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30">
                      Live
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="text-xs font-semibold text-slate-600 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-400 transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 cursor-pointer shadow-xs active:scale-95"
                    title="Start New Conversation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>New Chat</span>
                  </button>
                </div>
              </div>

              {/* Message Thread Scroll Area */}
              <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-6 scroll-smooth">
                <div className="max-w-4xl mx-auto w-full space-y-6">
                  {/* Hero Welcome Card when conversation is empty */}
                  {chatMessages.length === 0 && (
                    <div className="py-2 text-center animate-fade-in my-auto">
                      {/* Glowing Bot Avatar */}
                      <div className="relative inline-flex mb-3">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-brand-600 via-pink-500 to-purple-600 blur-lg opacity-60 animate-pulse" />
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-purple-600 to-pink-600 p-0.5 shadow-xl">
                          <div className="w-full h-full bg-[#0E0E17] rounded-2xl flex items-center justify-center">
                            <Bot className="w-7 h-7 text-pink-400" />
                          </div>
                        </div>
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[8px] font-black uppercase tracking-wider shadow">
                          LIVE
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black font-display text-slate-950 dark:text-white mb-1 tracking-tight">
                        Meet <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-brand-400 bg-clip-text text-transparent">VibeBot</span> • Your Personal Fashion Concierge
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed mb-4">
                        Curating luxury silhouettes, runway pairings, and tailored recommendations with Indian Rupee (₹) pricing.
                      </p>

                      {/* 4 Interactive Starter Prompt Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mx-auto text-left">
                        {[
                          {
                            title: "Women's Evening & Party Glam",
                            subtitle: "Cocktail dresses, satin silhouettes & night heels",
                            icon: Sparkles,
                            prompt: "I want fancy clothes for women with a glamorous night party look"
                          },
                          {
                            title: "Urban Streetwear & Hoodies",
                            subtitle: "Heavyweight drop-shoulder hoodies & cargo pants",
                            icon: Shirt,
                            prompt: "Show me men oversized heavyweight hoodies and streetwear cargo pants"
                          },
                          {
                            title: "Kids Cozy Fleece & Sets",
                            subtitle: "Soft organic cotton sets, joggers & fleece",
                            icon: Smile,
                            prompt: "Show me cozy fleece sets and comfy casual wear for kids"
                          },
                          {
                            title: "Smart Size & Fit Guidance",
                            subtitle: "Accurate size suggestions for your measurements",
                            icon: Ruler,
                            prompt: "How should I choose the right size and fit for VibeWear clothes?"
                          }
                        ].map((card) => {
                          const Icon = card.icon;
                          return (
                            <button
                              key={card.title}
                              type="button"
                              onClick={() => handleSendMessage(card.prompt)}
                              className="p-3 rounded-2xl bg-white dark:bg-[#0E0E17]/90 border border-purple-100 dark:border-brand-500/20 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-200 group cursor-pointer text-left flex items-start gap-3 shadow-xs"
                            >
                              <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors">
                                    {card.title}
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                  {card.subtitle}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Render messages */}
                  {chatMessages.map((msg, index) => {
                    const isAi = msg.sender === 'ai';
                    const isLatest = index === chatMessages.length - 1;
                    return (
                      <div
                        key={index}
                        ref={isLatest ? latestMessageRef : null}
                        className={`flex gap-3 animate-fade-in ${isAi ? 'justify-start mr-auto max-w-4xl w-full' : 'justify-end ml-auto max-w-2xl'}`}
                      >
                        {isAi && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-500/25 mt-1">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}

                        <div className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} flex-1 min-w-0`}>
                          {isAi && (
                            <div className="flex items-center gap-2 mb-1.5 px-1">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                VibeBot Stylist
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300">
                                AI
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {msg.timestamp || 'Just now'}
                              </span>
                            </div>
                          )}

                          <div
                            className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                              isAi
                                ? 'bg-white dark:bg-[#0E0E17]/90 border border-purple-100 dark:border-brand-500/20 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-sm dark:shadow-none w-full space-y-3'
                                : 'bg-gradient-to-r from-brand-600 to-pink-600 text-white rounded-tr-sm shadow-md shadow-pink-500/20 btn-solid-cta'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>

                            {/* Attached Product Recommendations */}
                            {isAi && msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                              <div className="pt-3 border-t border-purple-100 dark:border-white/10 mt-3">
                                <div className="flex items-center justify-between mb-2.5">
                                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Curated Outfits From Catalog
                                  </span>
                                  <span className="text-[10px] text-slate-400">Prices in ₹ INR</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                  {msg.recommendedProducts.map((p) => (
                                    <div
                                      key={p.id || p._id}
                                      onClick={() => onSelectProduct && onSelectProduct(p)}
                                      className="rounded-2xl bg-white dark:bg-[#11111B] border border-purple-100 dark:border-white/10 hover:border-pink-500/80 p-3 flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 dark:hover:shadow-pink-500/5 hover:-translate-y-0.5"
                                    >
                                      {/* Fashion Portrait Image Container */}
                                      <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 dark:bg-black/60 mb-2.5 relative shadow-inner">
                                        <img
                                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80'}
                                          alt={p.title}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                          onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80';
                                          }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-white/95 dark:bg-black/80 text-slate-900 dark:text-white backdrop-blur-md shadow-xs">
                                          {p.category}
                                        </span>
                                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-pink-600 text-white shadow-sm flex items-center gap-0.5">
                                          ★ {p.rating || '4.9'}
                                        </span>
                                      </div>

                                      {/* Title & Price Breakdown */}
                                      <div className="space-y-1">
                                        <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-pink-500 transition-colors">
                                          {p.title}
                                        </h5>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="text-sm font-black text-pink-600 dark:text-pink-400">
                                            ₹{p.price}
                                          </span>
                                          <span className="text-[10px] text-slate-400 line-through">
                                            ₹{p.price + 500}
                                          </span>
                                          <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">
                                            Save ₹500
                                          </span>
                                        </div>
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="mt-3 flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (onQuickView) onQuickView(p);
                                            else if (onSelectProduct) onSelectProduct(p);
                                          }}
                                          className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-pink-600 hover:text-white dark:hover:bg-pink-600 border border-slate-200 dark:border-white/10 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                                        >
                                          <Eye className="w-3.5 h-3.5 text-pink-500 group-hover:text-white" />
                                          <span>Quick View</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCartInModal(p);
                                          }}
                                          className={`py-2 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md active:scale-95 shrink-0 ${
                                            addedItems[p.id || p._id]
                                              ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                                              : 'bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white'
                                          }`}
                                          title={addedItems[p.id || p._id] ? 'Added to Bag!' : 'Add to Bag'}
                                        >
                                          {addedItems[p.id || p._id] ? (
                                            <>
                                              <Check className="w-3.5 h-3.5 text-white" />
                                              <span>Added</span>
                                            </>
                                          ) : (
                                            <>
                                              <ShoppingBag className="w-3.5 h-3.5 text-white" />
                                              <span className="hidden sm:inline">Add</span>
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {!isAi && (
                            <span className="text-[10px] text-slate-400 mt-1 px-1">
                              {msg.timestamp || 'Just now'}
                            </span>
                          )}
                        </div>

                        {!isAi && (
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-1">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isBotTyping && (
                    <div className="flex gap-3 items-start animate-fade-in max-w-xl">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-500/25 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="p-4 rounded-2xl rounded-tl-sm bg-white dark:bg-[#0E0E17]/90 border border-purple-100 dark:border-brand-500/20 flex items-center gap-3 shadow-xs">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          VibeAI is scanning collection & styling pieces...
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>
              </div>

              {/* Floating Bottom Input Dock */}
              <div className="w-full shrink-0 mt-auto px-4 sm:px-6 pt-2 pb-2.5 sm:pb-3 bg-white/95 dark:bg-[#07070E]/95 border-t border-purple-100 dark:border-brand-500/20 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto w-full space-y-2">
                  {/* Quick Suggestion Chips Carousel */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
                    <span className="text-pink-500 font-extrabold shrink-0 flex items-center gap-1 mr-1 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      Try asking:
                    </span>
                    {[
                      'Fancy clothes for women',
                      'Men oversized heavyweight hoodie',
                      'Cozy fleece sets for kids',
                      'What size should I choose?',
                      'Payment & COD details'
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="py-1 px-3 rounded-full bg-slate-100 dark:bg-white/5 border border-purple-100 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-pink-500 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-950/20 whitespace-nowrap transition-all cursor-pointer font-medium shadow-xs"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>

                  {/* Modern Input Bar */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="relative flex items-center rounded-2xl bg-slate-50 dark:bg-[#0E0E17] border border-purple-200 dark:border-brand-500/30 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20 transition-all shadow-inner"
                  >
                    <div className="pl-4 text-slate-400 shrink-0">
                      <MessageSquare className="w-4 h-4 text-pink-500" />
                    </div>

                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask VibeAI: 'Fancy dresses for women', 'Men streetwear hoodies under ₹999'..."
                      className="flex-1 px-3.5 py-3 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    />

                    {chatInput && (
                      <button
                        type="button"
                        onClick={() => setChatInput('')}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer mr-1"
                        title="Clear input"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    <span className="hidden md:inline text-[10px] text-slate-400 dark:text-slate-500 mr-2 select-none">
                      Press Enter ↵
                    </span>

                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isBotTyping}
                      className="mr-2 p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white shadow-md transition-all cursor-pointer disabled:opacity-30 active:scale-95 shrink-0 btn-solid-cta"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Bar (shown only for Outfit Generator & Size tabs) */}
        {activeTab !== 'chat' && (
          <div className="px-5 py-3 border-t border-purple-100 dark:border-brand-500/20 bg-white/95 dark:bg-[#06060A]/95 flex items-center justify-between shrink-0 relative z-10 backdrop-blur-xl mt-auto">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span className="truncate">VibeWear Neural Style Engine • 100% Privacy Protected</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-3.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-pink-600 text-slate-700 dark:text-white hover:text-white text-xs font-bold border border-slate-300 dark:border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 shadow-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close Assistant</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VibeAIModal;
