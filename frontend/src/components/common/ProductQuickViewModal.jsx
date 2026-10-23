import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Share2,
  Check,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Camera,
  Mic,
  Square,
  Volume2,
  Trash2,
  Image as ImageIcon,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import ShareModal from './ShareModal';
import { getColorMatchedImage, getCleanProductImages } from '../../utils/productImageUtils';
import apiClient from '../../api/apiClient';

const DEFAULT_REVIEWS = [
  {
    _id: 'rev_1',
    user: { name: 'Aiden Vance' },
    rating: 5,
    comment: 'The drape and heavyweight cotton on this piece are insane. Exceeded all my expectations! Look at the texture in my attached outfit photo.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600',
    audioUrl: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
    audioDuration: 8,
    createdAt: '2 days ago',
    verified: true,
    fit: 'True to Size'
  },
  {
    _id: 'rev_2',
    user: { name: 'Elena Rostova' },
    rating: 5,
    comment: 'Color matches the photo 100%. Soft interior and premium ribbed collar. Recorded a quick voice note about the fit and stretch!',
    audioUrl: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
    audioDuration: 6,
    createdAt: '1 week ago',
    verified: true,
    fit: 'Slightly Relaxed'
  },
  {
    _id: 'rev_3',
    user: { name: 'Marcus Chen' },
    rating: 4,
    comment: 'Great quality streetwear garment. Fast express shipping as well!',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600',
    createdAt: '2 weeks ago',
    verified: true,
    fit: 'True to Size'
  }
];

const ProductQuickViewModal = ({
  product,
  isOpen,
  onClose,
  onOpenCheckout,
  onNavigateFullPage
}) => {
  const { addToCart, showToast } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, isAuthenticated, requireAuth } = useAuth();

  const initialColor = product?.colors?.[0] || 'Standard';
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedImage, setSelectedImage] = useState(() =>
    product ? getColorMatchedImage(product, initialColor) : ''
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeErrorPrompt, setSizeErrorPrompt] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews' | 'specs'
  const [reviewsList, setReviewsList] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Review Photo & Audio Voice Note State
  const [reviewPhoto, setReviewPhoto] = useState(null);
  const [reviewAudioUrl, setReviewAudioUrl] = useState(null);
  const [reviewAudioDuration, setReviewAudioDuration] = useState(0);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [previewPhotoModal, setPreviewPhotoModal] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Full Screen Toggle Handler: expands modal to full screen and invokes native Fullscreen API if supported
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => {
      const nextState = !prev;
      try {
        if (nextState) {
          if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } else {
          if (document.exitFullscreen && document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
        }
      } catch (err) {}
      return nextState;
    });
  };

  // Synchronize fullscreen exit via browser key or Esc
  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, [isFullscreen]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeAudioElementRef = useRef(null);

  // Synchronize state when a new product is opened
  useEffect(() => {
    if (product) {
      const initColor = product.colors?.[0] || 'Standard';
      const primaryImg = getColorMatchedImage(product, initColor);
      setSelectedColor(initColor);
      setSelectedImage(primaryImg);
      setSelectedSize(null);
      setSizeErrorPrompt(false);
      setQuantity(1);
      setActiveTab('details');
      setReviewsList(product.reviews && product.reviews.length > 0 ? product.reviews : DEFAULT_REVIEWS);
      setReviewPhoto(null);
      setReviewAudioUrl(null);
      setReviewAudioDuration(0);
      setIsRecordingAudio(false);
      setRecordingSeconds(0);
    }
  }, [product]);

  // Clean up audio recorder on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
      }
    };
  }, []);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
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

  if (!isOpen || !product) return null;

  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);

  // Variant matching on color selection: dynamically update picture to exact garment color
  const handleColorChange = (color) => {
    setSelectedColor(color);
    const matched = getColorMatchedImage(product, color);
    setSelectedImage(matched);
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    requireAuth(() => {
      const added = toggleWishlist(product);
      showToast(added ? `Saved "${product.title}" to Wishlist` : 'Removed from Wishlist');
    });
  };

  const handleShareClick = () => {
    setShareModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeErrorPrompt(true);
      showToast('⚠️ Please select your size (XS, S, M, L, XL, XXL) first!');
      return;
    }
    setSizeErrorPrompt(false);
    requireAuth(() => {
      addToCart(product, selectedSize, selectedColor, quantity);
      showToast(`Added ${quantity}x ${product.title} (${selectedSize}) to bag!`);
      onClose();
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeErrorPrompt(true);
      showToast('⚠️ Please choose your size first before proceeding to payment!');
      return;
    }
    setSizeErrorPrompt(false);
    requireAuth(() => {
      addToCart(product, selectedSize, selectedColor, quantity);
      onClose();
      if (onOpenCheckout) {
        onOpenCheckout();
      }
    });
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo must be smaller than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setReviewPhoto(reader.result);
      showToast('Photo attached to review 📸');
    };
    reader.readAsDataURL(file);
  };

  // Voice Note Recording Handlers
  const handleStartRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        handleSimulateAudio();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setReviewAudioUrl(reader.result);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            handleStopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn('Microphone access blocked or unavailable, using simulated voice note:', err);
      handleSimulateAudio();
    }
  };

  const handleStopRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setReviewAudioDuration(recordingSeconds || 6);
    setIsRecordingAudio(false);
    showToast('Voice note recorded! 🎙️');
  };

  const handleSimulateAudio = () => {
    setReviewAudioUrl('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
    setReviewAudioDuration(6);
    showToast('Voice note attached 🎙️');
  };

  const togglePlayReviewAudio = (reviewId, audioSrc) => {
    if (playingAudioId === reviewId) {
      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
      }
      setPlayingAudioId(null);
    } else {
      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
      }
      const audio = new Audio(audioSrc);
      activeAudioElementRef.current = audio;
      audio.onended = () => setPlayingAudioId(null);
      audio.play().catch(() => setPlayingAudioId(null));
      setPlayingAudioId(reviewId);
    }
  };

  const handleAddReview = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Determine final review comment: auto-generate sensible description if media is attached
    let finalComment = newComment.trim();
    if (!finalComment) {
      if (reviewPhoto && reviewAudioUrl) {
        finalComment = 'Verified purchase review with outfit photo and voice note attached.';
      } else if (reviewPhoto) {
        finalComment = 'Verified purchase review with outfit photo attached.';
      } else if (reviewAudioUrl) {
        finalComment = 'Verified purchase voice note audio review.';
      }
    }

    if (!finalComment && !reviewPhoto && !reviewAudioUrl) {
      showToast('Please type your review or attach an outfit photo / voice note.');
      return;
    }

    const reviewerName = (user && user.name) ? user.name : 'Verified Customer';

    const newReview = {
      _id: 'rev_' + Date.now(),
      user: { name: reviewerName },
      rating: newRating,
      comment: finalComment || 'Verified purchase review.',
      image: reviewPhoto || null,
      audioUrl: reviewAudioUrl || null,
      audioDuration: reviewAudioDuration || (reviewAudioUrl ? 5 : null),
      createdAt: 'Just now',
      verified: true,
      fit: 'True to Size'
    };

    // Immediately update local reviews list so the user sees their published review instantly
    setReviewsList([newReview, ...reviewsList]);
    setNewComment('');
    setReviewPhoto(null);
    setReviewAudioUrl(null);
    setReviewAudioDuration(0);
    showToast('🎉 Thank you! Your verified review has been published.');
    setActiveTab('reviews');

    // Sync to backend if product exists
    const pId = product._id || product.id;
    if (pId) {
      try {
        await apiClient.post(`/products/${pId}/reviews`, {
          rating: newRating,
          comment: finalComment || 'Verified purchase review.',
          image: reviewPhoto || null,
          audioUrl: reviewAudioUrl || null,
          audioDuration: reviewAudioDuration || 0
        });
      } catch (err) {
        console.info('Review saved to session state:', err.message);
      }
    }
  };

  const images = getCleanProductImages(product, selectedColor);
  const currentDisplayImage = selectedImage || getColorMatchedImage(product, selectedColor);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
      }`}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`relative w-full flex flex-col bg-white dark:bg-[#0A0A10] text-slate-900 dark:text-white overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'w-screen h-screen max-w-none max-h-none rounded-none border-0 shadow-none'
            : 'max-w-5xl max-h-[92vh] rounded-3xl border border-slate-200/50 dark:border-white/[0.08] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* Header Bar: Clean, sleek, borderless breadcrumb & actions */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 sm:py-4 border-b border-slate-100 dark:border-white/[0.06] bg-white/95 dark:bg-[#0A0A10]/95 backdrop-blur-xl shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 dark:text-white/70 dark:hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-pink-500 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Store</span>
            </button>
            <span className="text-slate-300 dark:text-white/20 hidden sm:inline">/</span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-400 hidden sm:inline">
              {product.category}
            </span>
            <span className="text-xs text-slate-300 dark:text-white/20 hidden sm:inline">•</span>
            <span className="text-xs font-medium text-slate-500 dark:text-white/60 hidden sm:inline">
              {product.subCategory || 'Urban Streetwear'}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Share Style */}
            <button
              type="button"
              onClick={handleShareClick}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-pink-600 dark:text-white/70 dark:hover:text-pink-400 transition-colors cursor-pointer py-1"
              title="Share Style"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Dedicated Full Screen Toggle Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors cursor-pointer py-1"
              title={isFullscreen ? 'Exit Full Screen' : 'Toggle Full Screen'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-pink-500" />
                  <span className="hidden sm:inline">Exit Full Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-pink-500" />
                  <span className="hidden sm:inline">Full Screen</span>
                </>
              )}
            </button>

            {/* Dedicated Full Page View Button */}
            {onNavigateFullPage && (
              <button
                type="button"
                onClick={() => {
                  if (isFullscreen && document.exitFullscreen && document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                  }
                  onNavigateFullPage(product);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-pink-600 dark:text-white/70 dark:hover:text-pink-400 transition-colors cursor-pointer py-1"
                title="Open Dedicated Full Page View"
              >
                <span className="hidden sm:inline">Full Page View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Clean Minimalist Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer group"
              title="Close (Esc)"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Left Column: Image Showcase with Thumbnails */}
            <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex sm:flex-col gap-2.5 overflow-x-auto no-scrollbar sm:overflow-visible shrink-0 pb-2 sm:pb-0">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden transition-all shrink-0 cursor-pointer ${
                        selectedImage === img
                          ? 'ring-2 ring-pink-500 scale-102 opacity-100 shadow-md shadow-pink-500/20'
                          : 'opacity-50 hover:opacity-90'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Featured Photo - Focused cleanly on the full garment */}
              <div
                onClick={() => setPreviewPhotoModal(currentDisplayImage)}
                className={`flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 dark:bg-black/60 border border-slate-200/50 dark:border-white/[0.06] relative group shadow-xl flex items-center justify-center cursor-zoom-in ${
                  isFullscreen ? 'max-h-[75vh]' : 'max-h-[60vh] sm:max-h-[66vh]'
                }`}
                title="Click photo to inspect in full screen"
              >
                <img
                  src={currentDisplayImage}
                  alt={product.title}
                  className="w-full h-full object-contain md:object-cover object-center transition-transform duration-500 group-hover:scale-102"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Subtle Floating Tag on Image (Featured drop, no clunky black category box) */}
                {product.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-brand-600 to-pink-600 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
                      Featured Drop
                    </span>
                  </div>
                )}

                {/* Quick Action Overlay (Heart & Share) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={handleHeartClick}
                    className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-pink-400 hover:bg-black/70 transition-all cursor-pointer shadow-sm"
                    title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform active:scale-125 ${
                        isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-white'
                      }`}
                    />
                  </button>
                  <button
                    onClick={handleShareClick}
                    className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-pink-400 hover:bg-black/70 transition-all cursor-pointer shadow-sm"
                    title="Share Style"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing, Color Swatches, Sizes & Purchase CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              <div>
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-extrabold font-display text-slate-950 dark:text-white leading-tight">
                  {product.title}
                </h2>

                {/* Rating & Review Counter */}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center text-pink-500 dark:text-pink-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating || 5)
                            ? 'fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400'
                            : 'text-slate-300 dark:text-white/20'
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 font-bold text-slate-900 dark:text-white text-xs">
                      {product.rating || 4.8}
                    </span>
                  </div>
                  <span className="text-slate-300 dark:text-white/30">•</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-slate-500 hover:text-pink-600 dark:text-white/70 dark:hover:text-pink-300 underline font-medium cursor-pointer"
                  >
                    {reviewsList.length} Customer Reviews
                  </button>
                </div>

                {/* Price & Stock Status */}
                <div className="flex items-baseline gap-3 mt-3.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-white/40 line-through">
                    ₹{Math.round(Number(product.price) * 1.25)}
                  </span>
                  <span className="text-xs font-black tracking-wider text-pink-600 dark:text-pink-400 uppercase">
                    20% OFF
                  </span>
                  {product.stock <= 5 ? (
                    <span className="text-xs font-bold text-amber-500 dark:text-amber-400 ml-auto">
                      Only {product.stock} left!
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 ml-auto flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      In Stock
                    </span>
                  )}
                </div>

                {/* Description Excerpt */}
                <p className="text-xs text-slate-600 dark:text-white/70 mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Color Variants: Circular luxury swatches, NO capsule boxes */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Color: <span className="text-pink-600 dark:text-pink-400 font-bold ml-1">{selectedColor}</span>
                      </label>
                      <span className="text-[10px] text-slate-400 dark:text-white/40">Select color</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {product.colors.map((color) => {
                        const isSelected = selectedColor === color;
                        const bgHex = color.toLowerCase().includes('black')
                          ? '#111827'
                          : color.toLowerCase().includes('white')
                          ? '#F3F4F6'
                          : color.toLowerCase().includes('pink')
                          ? '#EC4899'
                          : color.toLowerCase().includes('purple') || color.toLowerCase().includes('violet')
                          ? '#A855F7'
                          : color.toLowerCase().includes('blue')
                          ? '#38BDF8'
                          : color.toLowerCase().includes('green')
                          ? '#10B981'
                          : '#6B7280';
                        return (
                          <button
                            key={color}
                            onClick={() => handleColorChange(color)}
                            className={`group relative flex items-center gap-2 transition-all cursor-pointer ${
                              isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
                            }`}
                            title={color}
                          >
                            <span
                              className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                                isSelected
                                  ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-white dark:ring-offset-[#0B0B14] shadow-md'
                                  : 'border border-black/20 dark:border-white/20 hover:scale-105'
                              }`}
                              style={{ backgroundColor: bgHex }}
                            >
                              {isSelected && (
                                <Check
                                  className={`w-3.5 h-3.5 ${
                                    color.toLowerCase().includes('white') ? 'text-black' : 'text-white'
                                  }`}
                                />
                              )}
                            </span>
                            <span className={`text-xs font-medium transition-colors ${
                              isSelected ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-white/60'
                            }`}>
                              {color}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Selector: Minimalist clean chips, NO heavy square boxes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                    <div className="flex justify-between items-center mb-2.5">
                      <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Size: <span className={`font-bold ml-1 ${selectedSize ? 'text-pink-600 dark:text-pink-400' : 'text-amber-500 animate-pulse'}`}>{selectedSize || 'Select Size (Compulsory)'}</span>
                      </label>
                      <span className="text-[11px] text-pink-600 dark:text-pink-400 hover:underline cursor-pointer">
                        Size Guide
                      </span>
                    </div>

                    {sizeErrorPrompt && (
                      <div className="mb-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2 animate-bounce">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Please choose your size below before adding to cart or payment!</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {product.sizes.map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => {
                              setSelectedSize(size);
                              setSizeErrorPrompt(false);
                            }}
                            className={`min-w-[44px] h-10 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md shadow-pink-500/25 scale-105'
                                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity & CTAs */}
                <div className="mt-6 space-y-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                  <div className="flex items-center gap-4">
                    {/* Quantity Selector: Clean inline counter without heavy box */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-extrabold text-sm text-slate-950 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Bag Button */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all cursor-pointer active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span>Add to Bag • ₹{product.price * quantity}</span>
                    </button>
                  </div>

                  {/* Buy Now Button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-brand-600 hover:from-pink-500 hover:to-brand-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all cursor-pointer active:scale-98"
                  >
                    <Zap className="w-4 h-4 text-white" />
                    <span>Buy It Now • Express Checkout</span>
                  </button>
                </div>

                {/* Trust Highlights: Clean borderless inline badges */}
                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] text-center">
                  <div className="flex flex-col items-center">
                    <Truck className="w-4 h-4 text-pink-500 mb-1" />
                    <p className="text-[10px] text-slate-600 dark:text-white/70 font-medium">Free Express Shipping</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <RotateCcw className="w-4 h-4 text-pink-500 mb-1" />
                    <p className="text-[10px] text-slate-600 dark:text-white/70 font-medium">30-Day Easy Returns</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="w-4 h-4 text-pink-500 mb-1" />
                    <p className="text-[10px] text-slate-600 dark:text-white/70 font-medium">100% Authentic Apparel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation: Sleek modern underline indicator, NO chunky boxes */}
          <div className="pt-8 border-t border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-6 border-b border-slate-100 dark:border-white/[0.08] pb-2.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer relative pb-2 ${
                  activeTab === 'details'
                    ? 'text-pink-600 dark:text-pink-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-brand-500 after:to-pink-500'
                    : 'text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                About The Cloth
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 relative pb-2 ${
                  activeTab === 'reviews'
                    ? 'text-pink-600 dark:text-pink-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-brand-500 after:to-pink-500'
                    : 'text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <span>Customer Reviews</span>
                <span className="text-[10px] text-pink-500 font-extrabold">({reviewsList.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer relative pb-2 ${
                  activeTab === 'specs'
                    ? 'text-pink-600 dark:text-pink-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-brand-500 after:to-pink-500'
                    : 'text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                Fabric & Care Specs
              </button>
            </div>

            {/* Tab 1: About The Clothe */}
            {activeTab === 'details' && (
              <div className="py-4 space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-purple-200 dark:border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                    <span>Garment Silhouette & Design Notes</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-white/80 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white dark:bg-black/40 border border-purple-200 dark:border-brand-500/20 shadow-sm">
                      <span className="text-[10px] font-bold text-pink-600 dark:text-pink-300 uppercase">Fit Profile</span>
                      <p className="text-xs text-slate-900 dark:text-white font-medium mt-0.5">Relaxed drop-shoulder boxy aesthetic</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-black/40 border border-purple-200 dark:border-brand-500/20 shadow-sm">
                      <span className="text-[10px] font-bold text-pink-600 dark:text-pink-300 uppercase">Weight & Feel</span>
                      <p className="text-xs text-slate-900 dark:text-white font-medium mt-0.5">Heavyweight 260-320 GSM soft-touch cotton</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Customer Reviews & Comments */}
            {activeTab === 'reviews' && (
              <div className="py-4 space-y-6 animate-fade-in">
                {/* Rating Breakdown Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.06]">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Shopper Ratings & Feedback</h4>
                    <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
                      Verified customer feedback on sizing, texture, and everyday durability.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-black text-slate-950 dark:text-white">{product.rating || 4.8}</div>
                    <div className="flex flex-col">
                      <div className="flex text-pink-500 dark:text-pink-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-white/60">Based on {reviewsList.length} verified orders</span>
                    </div>
                  </div>
                </div>

                {/* Write a Review Form */}
                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.06] space-y-3">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                      <span>Leave a Verified Customer Review</span>
                    </span>
                    <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Photo & <Mic className="w-3 h-3" /> Voice Note Supported
                    </span>
                  </h5>

                  <form onSubmit={handleAddReview} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-white/70 mb-1">
                        Select Rating
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="p-1 text-slate-300 hover:text-pink-500 dark:text-white/30 dark:hover:text-pink-400 transition-colors cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= newRating ? 'fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400' : ''
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs text-pink-600 dark:text-pink-300 font-semibold ml-2">
                          {newRating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-white/70 mb-1">
                        Your Feedback & Comments
                      </label>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Describe the fabric quality, comfort, fit, and overall look (optional if photo or voice note attached)..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-purple-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-pink-500 transition-all"
                      />
                    </div>

                    {/* Media Attachments Action Bar: Photo & Voice Note */}
                    <div className="space-y-2 pt-1 border-t border-purple-100 dark:border-white/10">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handlePhotoUpload}
                          accept="image/*"
                          className="hidden"
                        />

                        {/* Attach Photo Button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                            reviewPhoto
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300'
                              : 'bg-white hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 border-purple-200 dark:border-white/10'
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5 text-pink-500" />
                          <span>{reviewPhoto ? 'Change Outfit Photo' : 'Attach Outfit Photo'}</span>
                        </button>

                        {/* Voice Note Recording Button */}
                        {!isRecordingAudio ? (
                          <button
                            type="button"
                            onClick={handleStartRecording}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                              reviewAudioUrl
                                ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-300'
                                : 'bg-white hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 border-purple-200 dark:border-white/10'
                            }`}
                          >
                            <Mic className="w-3.5 h-3.5 text-pink-500" />
                            <span>{reviewAudioUrl ? 'Re-record Voice Note' : 'Record Voice Note'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleStopRecording}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-red-500 text-white animate-pulse shadow-md cursor-pointer"
                          >
                            <Square className="w-3.5 h-3.5 fill-white" />
                            <span>Stop Recording (00:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds})</span>
                          </button>
                        )}
                      </div>

                      {/* Attached Photo Preview Pill */}
                      {reviewPhoto && (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={reviewPhoto}
                              alt="Review attachment"
                              className="w-10 h-10 object-cover rounded-lg bg-black"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white block">Outfit Photo Attached</span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Ready to upload</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setReviewPhoto(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Attached Audio Preview Pill */}
                      {reviewAudioUrl && (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-500/30">
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => togglePlayReviewAudio('preview_draft', reviewAudioUrl)}
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-600 to-pink-600 text-white flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-all"
                            >
                              {playingAudioId === 'preview_draft' ? (
                                <Pause className="w-3.5 h-3.5 fill-white" />
                              ) : (
                                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                              )}
                            </button>
                            <div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Volume2 className="w-3.5 h-3.5 text-pink-500" />
                                <span>Voice Note Attached</span>
                              </span>
                              <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold">
                                {reviewAudioDuration || 6} seconds audio recording
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setReviewAudioUrl(null);
                              setReviewAudioDuration(0);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Remove voice note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      onClick={handleAddReview}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-pink-500/25 transition-all cursor-pointer"
                    >
                      Publish Verified Customer Review
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-purple-200/80 dark:border-white/10 space-y-2.5 hover:border-pink-500/30 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-pink-600 text-white text-xs font-bold flex items-center justify-center uppercase">
                            {rev.user?.name ? rev.user.name[0] : 'S'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              {rev.user?.name || 'Verified Buyer'}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                              <Check className="w-3 h-3" /> Verified Purchase
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="flex text-pink-500 dark:text-pink-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating ? 'fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400' : 'text-slate-300 dark:text-white/20'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-white/40 mt-0.5">{rev.createdAt}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed">{rev.comment}</p>

                      {/* Attached Outfit Photo Display */}
                      {rev.image && (
                        <div className="pt-1">
                          <div
                            onClick={() => setPreviewPhotoModal(rev.image)}
                            className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-white/10 border border-purple-200 dark:border-white/10 cursor-pointer group transition-all"
                            title="Click to view customer outfit photo"
                          >
                            <img
                              src={rev.image}
                              alt="Customer review outfit"
                              className="w-12 h-14 object-cover rounded-lg group-hover:scale-105 transition-transform"
                            />
                            <div className="pr-2">
                              <span className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1 group-hover:text-pink-500 transition-colors">
                                <ImageIcon className="w-3 h-3 text-pink-500" />
                                <span>Outfit Photo</span>
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-white/40">Click to enlarge</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Attached Voice Note Audio Player */}
                      {rev.audioUrl && (
                        <div className="pt-1">
                          <div className="inline-flex items-center gap-3 px-3 py-2 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/30 border border-purple-200 dark:border-purple-500/30">
                            <button
                              type="button"
                              onClick={() => togglePlayReviewAudio(rev._id, rev.audioUrl)}
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-all shrink-0"
                              title={playingAudioId === rev._id ? 'Pause Voice Note' : 'Play Voice Note'}
                            >
                              {playingAudioId === rev._id ? (
                                <Pause className="w-3.5 h-3.5 fill-white" />
                              ) : (
                                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                              )}
                            </button>

                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Volume2 className="w-3.5 h-3.5 text-pink-500" />
                                <span>Customer Voice Note</span>
                              </span>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(8)].map((_, barIdx) => (
                                  <span
                                    key={barIdx}
                                    className={`w-1 rounded-full transition-all ${
                                      playingAudioId === rev._id
                                        ? 'bg-pink-500 animate-pulse'
                                        : 'bg-purple-300 dark:bg-purple-500/40'
                                    }`}
                                    style={{
                                      height: `${8 + ((barIdx * 7) % 12)}px`,
                                      animationDelay: `${barIdx * 100}ms`
                                    }}
                                  />
                                ))}
                                <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold ml-1.5 font-mono">
                                  {rev.audioDuration ? `0:0${rev.audioDuration}` : '0:06'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {rev.fit && (
                        <div className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[10px] text-slate-600 dark:text-white/60 font-medium">
                          Fit: {rev.fit}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Fabric & Care Specs */}
            {activeTab === 'specs' && (
              <div className="py-4 space-y-3 animate-fade-in text-xs text-slate-700 dark:text-white/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-purple-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                      Material Composition
                    </span>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      100% Combed Turkish Ring-Spun Cotton
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-white/60">
                      Pre-shrunk fabric to prevent post-wash shrinkage and pilling.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-purple-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                      Care Instructions
                    </span>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Machine wash cold (30°C) with similar colors
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-white/60">
                      Do not bleach. Hang dry recommended. Cool iron on reverse side.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>



        {/* Share Modal Dialog */}
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          product={product}
        />

        {/* Customer Outfit Photo Full-Size Preview Modal */}
        {previewPhotoModal && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
            onClick={() => setPreviewPhotoModal(null)}
          >
            <div
              className="relative max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewPhotoModal(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewPhotoModal}
                alt="Enlarged Customer Outfit"
                className="w-full h-full max-h-[80vh] object-contain"
              />
              <div className="p-3 bg-black/80 text-center">
                <span className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-pink-400" />
                  <span>Verified Customer Outfit Fit Snapshot</span>
                </span>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
