import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

// Verified Seeded Accounts (matching MySQL backend database)
const INITIAL_REGISTERED_ACCOUNTS = [
  {
    _id: 'usr_admin',
    id: 'usr_admin',
    name: 'Admin VibeWear',
    email: 'admin@vibewear.com',
    password: 'Password123!',
    role: 'Admin',
    createdAt: '2026-01-15T10:00:00Z',
    phone: '+91 98765 43210',
    vehicleDetails: 'Headquarters Dispatch',
    address: {
      fullName: 'Admin VibeWear',
      street: '108 Fashion Boulevard, Suite 400',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      phone: '+91 98765 43210'
    }
  },
  {
    _id: 'usr_customer_john',
    id: 'usr_customer_john',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123!',
    role: 'Customer',
    createdAt: '2026-02-20T14:30:00Z',
    phone: '+91 91234 56789',
    address: {
      fullName: 'John Doe',
      street: '42 MG Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      phone: '+91 91234 56789'
    }
  },
  {
    _id: 'usr_delivery_vikram',
    id: 'usr_delivery_vikram',
    name: 'Vikram Malhotra',
    email: 'delivery@vibewear.com',
    password: 'Password123!',
    role: 'DeliveryPartner',
    createdAt: '2026-03-01T08:00:00Z',
    phone: '+91 98201 55432',
    vehicleDetails: 'Hero Electric Optima - MH 02 CW 9921',
    address: {
      fullName: 'Vikram Malhotra',
      street: 'Hub Logistics Center, Sector 18',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
      phone: '+91 98201 55432'
    }
  }
];

// Active Verified Fleet Drivers available for Admin assignment
export const FLEET_RIDERS = [
  {
    id: 'usr_delivery_vikram',
    name: 'Vikram Malhotra',
    phone: '+91 98201 55432',
    email: 'delivery@vibewear.com',
    vehicle: 'Hero Electric Optima - MH 02 CW 9921',
    rating: '4.9 ★',
    status: 'Available'
  },
  {
    id: 'usr_delivery_arjun',
    name: 'Arjun Verma',
    phone: '+91 97112 33445',
    email: 'arjun.delivery@vibewear.com',
    vehicle: 'TVS iQube - MH 01 DX 4402',
    rating: '4.8 ★',
    status: 'Available'
  },
  {
    id: 'usr_delivery_rahul',
    name: 'Rahul Deshmukh',
    phone: '+91 98920 66778',
    email: 'rahul.delivery@vibewear.com',
    vehicle: 'Ather 450X - MH 03 EK 8192',
    rating: '4.9 ★',
    status: 'Available'
  },
  {
    id: 'usr_delivery_priya',
    name: 'Priya Singh',
    phone: '+91 99304 88123',
    email: 'priya.delivery@vibewear.com',
    vehicle: 'Ola S1 Pro - MH 04 DL 7731',
    rating: '4.9 ★',
    status: 'Available'
  }
];

// Initial Realistic Orders for Live Tracking & Delivery Experience
const INITIAL_SYSTEM_ORDERS = [
  {
    id: 'VW-98241',
    _id: 'VW-98241',
    userId: 'usr_customer_john',
    transactionId: 'TXN_98241001',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    orderStatus: 'Shipped',
    driverRequestStatus: 'accepted',
    driverAcceptedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    totalAmount: 2499,
    subtotal: 2380,
    tax: 119,
    shipping: 0,
    shippingAddress: {
      fullName: 'Ananya Sharma',
      phone: '+91 98200 12345',
      street: 'Flat 402, Sea Breeze Tower, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India'
    },
    deliveryPartnerId: 'usr_delivery_vikram',
    deliveryPartnerName: 'Vikram Malhotra',
    deliveryPartnerPhone: '+91 98201 55432',
    deliveryPartnerEmail: 'delivery@vibewear.com',
    deliveryPartnerVehicle: 'Hero Electric Optima - MH 02 CW 9921',
    deliveryNotes: 'Assigned to driver Vikram Malhotra. Package verified at local hub, awaiting departure.',
    estimatedDeliveryTime: 'Today by 6:30 PM (Express 1-Day Delivery)',
    trackingTimeline: [
      {
        step: 1,
        status: 'Confirmed',
        title: 'Order Confirmed & Placed',
        location: 'VibeWear Digital Fashion Hub, Mumbai',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        completed: true,
        description: 'Order placed and verified by automated dispatch system.'
      },
      {
        step: 2,
        status: 'Processing',
        title: 'Quality Inspected & Packed',
        location: 'Central Fulfilment Center, Warehouse 4',
        timestamp: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
        completed: true,
        description: 'Quality approved and sealed in premium tamper-proof biodegradable mailer.'
      },
      {
        step: 3,
        status: 'Shipped',
        title: 'Request Accepted by Vikram Malhotra',
        location: 'Bandra Express Delivery Terminal',
        timestamp: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
        completed: true,
        description: 'Driver Vikram Malhotra (MH 02 CW 9921) accepted delivery request.'
      },
      {
        step: 4,
        status: 'Out for Delivery',
        title: 'Out for Delivery',
        location: 'Bandra West Delivery Zone',
        timestamp: null,
        completed: false,
        description: 'Awaiting rider departure from local logistics terminal.'
      },
      {
        step: 5,
        status: 'Delivered',
        title: 'Delivered Successfully',
        location: 'Flat 402, Sea Breeze Tower, Bandra West',
        timestamp: null,
        completed: false,
        description: 'Awaiting customer handover and cash collection.'
      }
    ],
    items: [
      {
        title: 'Midnight Shadow Cyberpunk Hoodie',
        size: 'L',
        color: 'Onyx Black',
        qty: 1,
        price: 2499,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'VW-98242',
    _id: 'VW-98242',
    userId: 'usr_customer_john',
    transactionId: 'TXN_98242002',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    orderStatus: 'Assigned',
    driverRequestStatus: 'pending_acceptance',
    paymentMethod: 'Online',
    paymentStatus: 'Completed',
    totalAmount: 1899,
    subtotal: 1808,
    tax: 91,
    shipping: 0,
    shippingAddress: {
      fullName: 'Rohan Mehra',
      phone: '+91 97690 98765',
      street: '12th Floor, Oberoi Splendor, JVLR, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400060',
      country: 'India'
    },
    deliveryPartnerId: 'usr_delivery_vikram',
    deliveryPartnerName: 'Vikram Malhotra',
    deliveryPartnerPhone: '+91 98201 55432',
    deliveryPartnerEmail: 'delivery@vibewear.com',
    deliveryPartnerVehicle: 'Hero Electric Optima - MH 02 CW 9921',
    deliveryNotes: 'Admin sent delivery request to Vikram Malhotra. Awaiting driver confirmation.',
    estimatedDeliveryTime: 'Tomorrow by 2:00 PM',
    trackingTimeline: [
      {
        step: 1,
        status: 'Confirmed',
        title: 'Order Confirmed & Placed',
        location: 'VibeWear Digital Fashion Hub, Mumbai',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        completed: true,
        description: 'Order confirmed and verified.'
      },
      {
        step: 2,
        status: 'Processing',
        title: 'Quality Inspected & Packed',
        location: 'Central Fulfilment Center, Warehouse 4',
        timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
        completed: true,
        description: 'Quality approved and packaged.'
      },
      {
        step: 3,
        status: 'Assigned',
        title: 'Assigned to Driver Vikram Malhotra',
        location: 'Andheri Logistics Hub',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        completed: true,
        description: 'Admin assigned request to Vikram Malhotra (Hero Electric Optima). Awaiting acceptance.'
      }
    ],
    items: [
      {
        title: 'Neo-Tokyo Oversized Graphic Tee',
        size: 'M',
        color: 'Acid Purple',
        qty: 1,
        price: 1899,
        image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'VW-98243',
    _id: 'VW-98243',
    userId: 'usr_customer_john',
    transactionId: 'TXN_98243003',
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    orderStatus: 'Confirmed',
    driverRequestStatus: 'none',
    paymentMethod: 'Online',
    paymentStatus: 'Completed',
    totalAmount: 3499,
    subtotal: 3332,
    tax: 167,
    shipping: 0,
    shippingAddress: {
      fullName: 'Sneha Kapur',
      phone: '+91 98334 11223',
      street: 'Tower B, 1402 Hiranandani Gardens, Powai',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400076',
      country: 'India'
    },
    deliveryPartnerId: null,
    deliveryPartnerName: null,
    deliveryPartnerPhone: null,
    deliveryPartnerVehicle: null,
    deliveryNotes: 'Order packed & ready at central hub. Awaiting Admin driver assignment.',
    estimatedDeliveryTime: 'Tomorrow by 5:00 PM',
    trackingTimeline: [
      {
        step: 1,
        status: 'Confirmed',
        title: 'Order Confirmed & Placed',
        location: 'VibeWear Digital Fashion Hub, Mumbai',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        completed: true,
        description: 'Order confirmed and verified.'
      },
      {
        step: 2,
        status: 'Processing',
        title: 'Quality Inspected & Packed',
        location: 'Central Fulfilment Center, Warehouse 4',
        timestamp: new Date(Date.now() - 0.5 * 3600 * 1000).toISOString(),
        completed: true,
        description: 'Quality approved and packaged. Ready for Admin to select a delivery driver.'
      }
    ],
    items: [
      {
        title: 'Neon Glow Cropped Puffer Jacket',
        size: 'S',
        color: 'Electric Lime',
        qty: 1,
        price: 3499,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('vibewear_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('vibewear_token') || null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileActiveTab, setProfileActiveTab] = useState('orders');
  const [pendingAction, setPendingAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authSuccessNotice, setAuthSuccessNotice] = useState(null);
  const [needRegisterFirst, setNeedRegisterFirst] = useState(false);
  const [liveDeliveryAlert, setLiveDeliveryAlert] = useState(null);

  // Orders repository
  const [userOrders, setUserOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('vibewear_user_orders');
      if (savedOrders) {
        let parsed = JSON.parse(savedOrders);
        // Ensure VW-98241 starts in 'Shipped' state unless driver departs
        parsed = parsed.map((o) => {
          if ((o.id === 'VW-98241' || o._id === 'VW-98241') && o.orderStatus === 'Out for Delivery') {
            return {
              ...o,
              orderStatus: 'Shipped',
              trackingTimeline: o.trackingTimeline?.map((t) =>
                t.step >= 4 ? { ...t, completed: false, timestamp: null } : t
              )
            };
          }
          return o;
        });
        localStorage.setItem('vibewear_user_orders', JSON.stringify(parsed));
        return parsed.length > 0 ? parsed : INITIAL_SYSTEM_ORDERS;
      }
      localStorage.setItem('vibewear_user_orders', JSON.stringify(INITIAL_SYSTEM_ORDERS));
      return INITIAL_SYSTEM_ORDERS;
    } catch {
      return INITIAL_SYSTEM_ORDERS;
    }
  });

  const dismissDeliveryAlert = () => {
    setLiveDeliveryAlert(null);
  };

  // Get registered accounts from local storage
  const getRegisteredAccounts = () => {
    try {
      const stored = localStorage.getItem('vibewear_registered_accounts');
      if (stored) {
        const list = JSON.parse(stored);
        // Ensure DeliveryPartner exists in registered accounts
        const hasDelivery = list.some((a) => a.email === 'delivery@vibewear.com');
        if (!hasDelivery) {
          const merged = [...list, INITIAL_REGISTERED_ACCOUNTS[2]];
          localStorage.setItem('vibewear_registered_accounts', JSON.stringify(merged));
          return merged;
        }
        return list;
      }
      localStorage.setItem('vibewear_registered_accounts', JSON.stringify(INITIAL_REGISTERED_ACCOUNTS));
      return INITIAL_REGISTERED_ACCOUNTS;
    } catch {
      return INITIAL_REGISTERED_ACCOUNTS;
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('vibewear_user_orders', JSON.stringify(userOrders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  }, [userOrders]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('vibewear_token', token);
    } else {
      localStorage.removeItem('vibewear_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vibewear_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vibewear_user');
    }
  }, [user]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // Security access keys for administrative and delivery fleet clearance
  const ADMIN_SECURITY_KEY = 'VIBE-ADMIN-2026';
  const RIDER_SECURITY_KEY = 'VIBE-RIDER-2026';

  // Login handler with optional requestedRole enforcement
  const login = async (email, password, requestedRole = null) => {
    setLoading(true);
    setAuthError(null);
    setNeedRegisterFirst(false);

    const cleanEmail = email.trim().toLowerCase();

    // Email format validation
    if (!validateEmail(cleanEmail)) {
      setLoading(false);
      const msg = 'Please enter a valid email address (e.g., name@domain.com)';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    if (!password || password.length < 6) {
      setLoading(false);
      const msg = 'Password must be at least 6 characters long';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    try {
      // 1. Try real MySQL backend authentication endpoint
      try {
        const response = await apiClient.post('/auth/login', {
          email: cleanEmail,
          password,
          requestedRole
        });
        const { user: userData, token: userToken } = response.data;

        // Role mismatch check
        if (requestedRole === 'Admin' && userData.role !== 'Admin') {
          const msg = 'Access Denied: This account does not possess Administrator clearance.';
          setAuthError(msg);
          return { success: false, message: msg };
        }
        if (requestedRole === 'DeliveryPartner' && userData.role !== 'DeliveryPartner') {
          const msg = 'Access Denied: This account is not registered as an authorized Delivery Partner.';
          setAuthError(msg);
          return { success: false, message: msg };
        }

        setUser(userData);
        setToken(userToken);
        setAuthModalOpen(false);

        if (pendingAction) {
          pendingAction(userData);
          setPendingAction(null);
        }
        return { success: true, user: userData };
      } catch (backendErr) {
        if (backendErr.response?.data?.message) {
          const bMsg = backendErr.response.data.message;
          if (bMsg.includes('Access Denied')) {
            setAuthError(bMsg);
            return { success: false, message: bMsg };
          }
        }
        // Fallback to local accounts matching if backend is in transition
      }

      // 2. Check local registered accounts
      const accounts = getRegisteredAccounts();
      const existingAccount = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

      // If user is not registered anywhere:
      if (!existingAccount) {
        setNeedRegisterFirst(true);
        const msg = 'Account not found! You must create an account first before you can log in.';
        setAuthError(msg);
        return { success: false, message: msg, needRegister: true };
      }

      // If account exists but password doesn't match:
      if (existingAccount.password !== password) {
        const msg = 'Incorrect password! Please enter the correct password.';
        setAuthError(msg);
        return { success: false, message: msg };
      }

      // Check role enforcement for special portals
      if (requestedRole === 'Admin' && existingAccount.role !== 'Admin') {
        const msg = 'Access Denied: This account does not possess Administrator clearance. Please sign in via Customer portal.';
        setAuthError(msg);
        return { success: false, message: msg };
      }
      if (requestedRole === 'DeliveryPartner' && existingAccount.role !== 'DeliveryPartner') {
        const msg = 'Access Denied: This account is not registered as an authorized Delivery Hero / Rider. Please sign in via Customer portal.';
        setAuthError(msg);
        return { success: false, message: msg };
      }

      // Valid registered credentials matched!
      const authenticatedUser = {
        _id: existingAccount._id || existingAccount.id,
        id: existingAccount.id || existingAccount._id,
        name: existingAccount.name,
        email: existingAccount.email,
        role: existingAccount.role,
        createdAt: existingAccount.createdAt,
        phone: existingAccount.phone || '',
        vehicleDetails: existingAccount.vehicleDetails || '',
        licenseNumber: existingAccount.licenseNumber || '',
        address: existingAccount.address || null
      };

      const userToken = 'jwt_token_' + Date.now();
      setUser(authenticatedUser);
      setToken(userToken);
      setAuthModalOpen(false);

      if (pendingAction) {
        pendingAction(authenticatedUser);
        setPendingAction(null);
      }
      return { success: true, user: authenticatedUser };
    } finally {
      setLoading(false);
    }
  };

  // Register handler with strict role rules
  const register = async (
    name,
    email,
    password,
    role = 'Customer',
    phone = '',
    vehicleDetails = '',
    licenseNumber = '',
    securityKey = ''
  ) => {
    setLoading(true);
    setAuthError(null);
    setNeedRegisterFirst(false);

    const cleanName = name ? name.trim() : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    if (!cleanName || cleanName.length < 2) {
      setLoading(false);
      const msg = 'Please enter your full name (at least 2 characters)';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    if (!validateEmail(cleanEmail)) {
      setLoading(false);
      const msg = 'Please enter a valid email address (e.g., name@domain.com)';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    if (!password || password.length < 8) {
      setLoading(false);
      const msg = 'Password must be at least 8 characters long (Compulsory).';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    // STRICT ROLE VERIFICATION RULES
    let verifiedRole = 'Customer';

    if (role === 'Admin') {
      if (securityKey !== ADMIN_SECURITY_KEY || !cleanEmail.endsWith('@vibewear.com')) {
        setLoading(false);
        const msg =
          'Admin Registration Denied: Corporate @vibewear.com email address and valid Admin Security Access Key (VIBE-ADMIN-2026) are strictly required.';
        setAuthError(msg);
        return { success: false, message: msg };
      }
      verifiedRole = 'Admin';
    } else if (role === 'DeliveryPartner') {
      if (
        securityKey !== RIDER_SECURITY_KEY ||
        !phone.trim() ||
        !vehicleDetails.trim() ||
        !licenseNumber.trim()
      ) {
        setLoading(false);
        const msg =
          'Rider Registration Denied: Valid Driving License Number, Vehicle Registration Details, Contact Phone, and Authorized Rider Access Code (VIBE-RIDER-2026) are strictly required.';
        setAuthError(msg);
        return { success: false, message: msg };
      }
      verifiedRole = 'DeliveryPartner';
    }

    try {
      let registeredId = 'usr_' + Date.now();
      try {
        const response = await apiClient.post('/auth/register', {
          name: cleanName,
          email: cleanEmail,
          password,
          role: verifiedRole,
          phone,
          vehicleDetails,
          licenseNumber,
          securityKey
        });
        if (response.data?.user?.id) {
          registeredId = response.data.user.id;
        }
      } catch (backendErr) {
        if (backendErr.response?.data?.message) {
          const sMsg = backendErr.response.data.message;
          if (sMsg.toLowerCase().includes('already exists')) {
            setAuthError('This email is already registered! Please sign in directly.');
            return { success: false, message: sMsg };
          }
          if (sMsg.includes('Denied') || sMsg.includes('Unauthorized')) {
            setAuthError(sMsg);
            return { success: false, message: sMsg };
          }
        }
      }

      // Check if already in local list
      const accounts = getRegisteredAccounts();
      const duplicate = accounts.some((acc) => acc.email.toLowerCase() === cleanEmail);
      if (duplicate) {
        const msg = 'This email is already registered! Please sign in directly.';
        setAuthError(msg);
        return { success: false, message: msg };
      }

      // Save to registered accounts list
      const newAccount = {
        _id: registeredId,
        id: registeredId,
        name: cleanName,
        email: cleanEmail,
        password,
        role: verifiedRole,
        phone: phone || (verifiedRole === 'DeliveryPartner' ? '+91 98201 55432' : ''),
        vehicleDetails: vehicleDetails || (verifiedRole === 'DeliveryPartner' ? 'Hero Electric Optima - MH 02 CW 9921' : ''),
        licenseNumber: licenseNumber || '',
        createdAt: new Date().toISOString()
      };
      accounts.push(newAccount);
      localStorage.setItem('vibewear_registered_accounts', JSON.stringify(accounts));

      setUser(null);
      setToken(null);
      setAuthModalMode('login');
      const succMsg = `✅ ${verifiedRole} registered successfully! Please log in with your credentials to access your dashboard.`;
      setAuthSuccessNotice(succMsg);
      setAuthError(null);

      return { success: true, requireLogin: true, email: cleanEmail };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vibewear_token');
    localStorage.removeItem('vibewear_user');
  };

  const updateUserProfile = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    try {
      const accounts = getRegisteredAccounts();
      const idx = accounts.findIndex((a) => a.email === user.email);
      if (idx > -1) {
        accounts[idx] = { ...accounts[idx], ...updatedData };
        localStorage.setItem('vibewear_registered_accounts', JSON.stringify(accounts));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addOrder = (order) => {
    setUserOrders((prev) => [order, ...prev]);
  };

  // Delivery status updater (called by Delivery Partner or Customer simulation)
  const updateDeliveryStatus = async (orderId, newStatus, riderNotes = '', paymentStatusUpdate = null) => {
    const now = new Date();
    const timeStr = now.toISOString();

    let targetOrderForAlert = null;

    setUserOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === orderId || ord._id === orderId) {
          const isDelivered = newStatus === 'Delivered';
          const isCOD = ord.paymentMethod === 'COD' || ord.paymentMethod === 'Cash on Delivery';

          // Update tracking timeline
          let updatedTimeline = Array.isArray(ord.trackingTimeline)
            ? JSON.parse(JSON.stringify(ord.trackingTimeline))
            : [];

          if (updatedTimeline.length > 0) {
            if (newStatus === 'Shipped') {
              updatedTimeline = updatedTimeline.map((step) =>
                step.status === 'Shipped' ? { ...step, completed: true, timestamp: timeStr } : step
              );
            } else if (newStatus === 'Out for Delivery') {
              updatedTimeline = updatedTimeline.map((step) =>
                step.status === 'Shipped' || step.status === 'Out for Delivery'
                  ? { ...step, completed: true, timestamp: step.timestamp || timeStr }
                  : step
              );
            } else if (newStatus === 'Delivered') {
              updatedTimeline = updatedTimeline.map((step) => ({
                ...step,
                completed: true,
                timestamp: step.timestamp || timeStr
              }));
            }
          }

          const updated = {
            ...ord,
            orderStatus: newStatus,
            deliveryNotes: riderNotes || ord.deliveryNotes || 'Delivery status updated by rider.',
            deliveredAt: isDelivered ? now.toISOString() : ord.deliveredAt,
            paymentStatus:
              paymentStatusUpdate ||
              (isDelivered && isCOD ? 'Completed' : ord.paymentStatus),
            paidAt: isDelivered && isCOD ? now.toISOString() : ord.paidAt,
            deliveryPartnerName: ord.deliveryPartnerName || user?.name || 'Vikram Malhotra',
            deliveryPartnerPhone: ord.deliveryPartnerPhone || user?.phone || '+91 98201 55432',
            deliveryPartnerEmail: ord.deliveryPartnerEmail || user?.email || 'delivery@vibewear.com',
            deliveryPartnerVehicle: ord.deliveryPartnerVehicle || user?.vehicleDetails || 'Hero Electric Optima - MH 02 CW 9921',
            trackingTimeline: updatedTimeline
          };

          if (newStatus === 'Out for Delivery') {
            targetOrderForAlert = updated;
          }

          return updated;
        }
        return ord;
      })
    );

    // If driver sets out for delivery, generate real-time dispatch alert!
    if (newStatus === 'Out for Delivery') {
      const driverName = targetOrderForAlert?.deliveryPartnerName || user?.name || 'Vikram Malhotra';
      const driverPhone = targetOrderForAlert?.deliveryPartnerPhone || user?.phone || '+91 98201 55432';
      const driverVehicle = targetOrderForAlert?.deliveryPartnerVehicle || user?.vehicleDetails || 'Hero Electric Optima - MH 02 CW 9921';
      const msg = riderNotes || 'Namaste! Main aapka package leke nikal gaya hoon. 10-15 minute me pahuch raha hoon!';

      setLiveDeliveryAlert({
        orderId,
        order: targetOrderForAlert,
        riderName: driverName,
        riderPhone: driverPhone,
        riderVehicle: driverVehicle,
        message: msg,
        timestamp: Date.now()
      });
    }

    // Sync with backend API
    try {
      await apiClient.put(`/orders/${orderId}/delivery-status`, {
        orderStatus: newStatus,
        deliveryNotes: riderNotes,
        paymentStatus: paymentStatusUpdate
      });
    } catch (e) {
      console.info('[Delivery Sync] Operating on local storage state:', e.message);
    }
  };

  // Helper: Trigger driver departure simulation
  const triggerDriverDeparture = async (orderId = 'VW-98241', customNote = '') => {
    await updateDeliveryStatus(
      orderId,
      'Out for Delivery',
      customNote || 'Namaste! Main aapka package leke nikal gaya hoon. 10-15 minute me pahuch raha hoon! Please keep delivery PIN 5821 ready.'
    );
  };

  // Claim order for delivery partner
  const claimOrder = async (orderId) => {
    setUserOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord._id === orderId) {
          return {
            ...ord,
            deliveryPartnerId: user?.id || 'usr_delivery_vikram',
            deliveryPartnerName: user?.name || 'Vikram Malhotra',
            deliveryPartnerPhone: user?.phone || '+91 98201 55432',
            deliveryPartnerEmail: user?.email || 'delivery@vibewear.com',
            deliveryPartnerVehicle: user?.vehicleDetails || 'Hero Electric Optima - MH 02 CW 9921',
            orderStatus: ord.orderStatus === 'Confirmed' || ord.orderStatus === 'Pending' ? 'Shipped' : ord.orderStatus,
            deliveryNotes: `Claimed and accepted by rider ${user?.name || 'Vikram Malhotra'}`
          };
        }
        return ord;
      })
    );

    try {
      await apiClient.put(`/orders/${orderId}/claim-delivery`);
    } catch (e) {
      // Offline fallback
    }
  };

  // Customer cancels order
  const cancelOrder = async (orderId, reason = 'Cancelled by customer') => {
    setUserOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId || ord._id === orderId) {
          const timeline = [...(ord.trackingTimeline || [])];
          timeline.push({
            step: timeline.length + 1,
            status: 'Cancelled',
            title: 'Order Cancelled',
            location: 'Customer Request',
            timestamp: new Date().toISOString(),
            completed: true,
            description: reason
          });
          return {
            ...ord,
            orderStatus: 'Cancelled',
            cancellationReason: reason,
            trackingTimeline: timeline,
            paymentStatus: ord.paymentStatus === 'Completed' ? 'Refunded' : ord.paymentStatus
          };
        }
        return ord;
      });
      localStorage.setItem('vibewear_user_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      await apiClient.put(`/orders/${orderId}/cancel`, { reason });
    } catch (e) {
      // Local fallback
    }
  };

  // Customer requests return
  const requestReturn = async (orderId, reasonOrOptions = {}, maybeComment = '') => {
    let reason = 'Size/Fit Issue';
    let comment = '';
    if (typeof reasonOrOptions === 'object' && reasonOrOptions !== null) {
      reason = reasonOrOptions.reason || 'Size/Fit Issue';
      comment = reasonOrOptions.comment || '';
    } else if (typeof reasonOrOptions === 'string') {
      reason = reasonOrOptions;
      comment = maybeComment || '';
    }

    setUserOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId || ord._id === orderId) {
          const timeline = [...(ord.trackingTimeline || [])];
          timeline.push({
            step: timeline.length + 1,
            status: 'Return Requested',
            title: 'Doorstep Return Requested',
            location: 'Doorstep Pickup Pending',
            timestamp: new Date().toISOString(),
            completed: true,
            description: `Reason: ${reason}. ${comment ? `Note: ${comment}` : ''}`
          });
          return {
            ...ord,
            orderStatus: 'Return Requested',
            returnReason: reason,
            returnComment: comment,
            returnStatus: 'Requested',
            trackingTimeline: timeline
          };
        }
        return ord;
      });
      localStorage.setItem('vibewear_user_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      await apiClient.put(`/orders/${orderId}/return`, { reason, comment });
    } catch (e) {
      // Local fallback
    }
  };

  // Customer requests exchange
  const requestExchange = async (
    orderId,
    reasonOrOptions = {},
    maybeSize = 'M',
    maybeColor = 'Obsidian Black',
    maybeComment = ''
  ) => {
    let reason = 'Size Exchange';
    let desiredSize = 'M';
    let desiredColor = 'Obsidian Black';
    let comment = '';

    if (typeof reasonOrOptions === 'object' && reasonOrOptions !== null) {
      reason = reasonOrOptions.reason || 'Size Exchange';
      desiredSize = reasonOrOptions.desiredSize || 'M';
      desiredColor = reasonOrOptions.desiredColor || 'Obsidian Black';
      comment = reasonOrOptions.comment || '';
    } else if (typeof reasonOrOptions === 'string') {
      reason = reasonOrOptions;
      desiredSize = maybeSize || 'M';
      desiredColor = maybeColor || 'Obsidian Black';
      comment = maybeComment || '';
    }

    setUserOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId || ord._id === orderId) {
          const timeline = [...(ord.trackingTimeline || [])];
          timeline.push({
            step: timeline.length + 1,
            status: 'Exchange Requested',
            title: `Exchange Requested (New Size: ${desiredSize}, Color: ${desiredColor})`,
            location: 'Size & Color Replacement Exchange',
            timestamp: new Date().toISOString(),
            completed: true,
            description: `Swap requested for Size: ${desiredSize} • Color: ${desiredColor}. ${comment ? `Note: ${comment}` : ''}`
          });
          return {
            ...ord,
            orderStatus: 'Exchange Requested',
            exchangeReason: reason,
            exchangeDesiredSize: desiredSize,
            exchangeDesiredColor: desiredColor,
            exchangeComment: comment,
            exchangeStatus: 'Requested',
            trackingTimeline: timeline
          };
        }
        return ord;
      });
      localStorage.setItem('vibewear_user_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      await apiClient.put(`/orders/${orderId}/exchange`, { reason, desiredSize, desiredColor, comment });
    } catch (e) {
      // Local fallback
    }
  };

  // Admin assigns delivery partner
  const assignRiderToOrder = async (orderId, riderInfo = {}) => {
    const riderName = riderInfo.name || 'Vikram Malhotra';
    const riderPhone = riderInfo.phone || '+91 98201 55432';
    const riderVehicle = riderInfo.vehicle || 'Hero Electric Optima - MH 02 CW 9921';
    const riderId = riderInfo.id || 'usr_delivery_vikram';

    setUserOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId || ord._id === orderId) {
          let newStatus = 'Assigned';
          if (ord.orderStatus === 'Return Requested') newStatus = 'Return Approved';
          if (ord.orderStatus === 'Exchange Requested') newStatus = 'Exchange Approved';

          const timeline = [...(ord.trackingTimeline || [])];
          timeline.push({
            step: timeline.length + 1,
            status: newStatus,
            title: `Assigned to ${riderName}`,
            location: 'Central Logistics Hub',
            timestamp: new Date().toISOString(),
            completed: true,
            description: `Admin sent delivery request to ${riderName} (${riderVehicle}). Awaiting driver acceptance.`
          });

          return {
            ...ord,
            orderStatus: newStatus,
            deliveryPartnerId: riderId,
            deliveryPartnerName: riderName,
            deliveryPartnerPhone: riderPhone,
            deliveryPartnerVehicle: riderVehicle,
            driverRequestStatus: 'pending_acceptance',
            driverRejectionReason: null,
            trackingTimeline: timeline
          };
        }
        return ord;
      });
      localStorage.setItem('vibewear_user_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      await apiClient.put(`/orders/${orderId}/assign-rider`, {
        deliveryPartnerId: riderId,
        deliveryPartnerName: riderName,
        deliveryPartnerPhone: riderPhone,
        deliveryPartnerVehicle: riderVehicle
      });
    } catch (e) {
      // Local fallback
    }
  };

  // Delivery Hero accepts order
  const acceptDeliveryOrder = async (orderId) => {
    let capturedOrder = null;
    const currentRiderName = user?.name || 'Vikram Malhotra';
    const currentRiderPhone = user?.phone || '+91 98201 55432';
    const currentRiderVehicle = user?.vehicleDetails || 'Hero Electric Optima - MH 02 CW 9921';
    const currentRiderId = user?.id || user?._id || 'usr_delivery_vikram';

    setUserOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId || ord._id === orderId) {
          let newStatus = 'Shipped';
          if (ord.orderStatus === 'Return Approved' || ord.orderStatus === 'Return Requested') {
            newStatus = 'Return In Progress';
          } else if (ord.orderStatus === 'Exchange Approved' || ord.orderStatus === 'Exchange Requested') {
            newStatus = 'Exchange In Progress';
          }

          const timeline = [...(ord.trackingTimeline || [])];
          timeline.push({
            step: timeline.length + 1,
            status: newStatus,
            title: `Request Accepted by Driver ${currentRiderName}`,
            location: 'En Route to Hub/Customer',
            timestamp: new Date().toISOString(),
            completed: true,
            description: `Driver ${currentRiderName} (${currentRiderVehicle}) accepted the delivery task! Contact: ${currentRiderPhone}`
          });

          const res = {
            ...ord,
            orderStatus: newStatus,
            deliveryPartnerId: currentRiderId,
            deliveryPartnerName: currentRiderName,
            deliveryPartnerPhone: currentRiderPhone,
            deliveryPartnerVehicle: currentRiderVehicle,
            driverRequestStatus: 'accepted',
            driverAcceptedAt: new Date().toISOString(),
            trackingTimeline: timeline
          };
          capturedOrder = res;
          return res;
        }
        return ord;
      });
      localStorage.setItem('vibewear_user_orders', JSON.stringify(updated));
      return updated;
    });

    // TRIGGER LIVE NOTIFICATION MESSAGE FOR CUSTOMER WITH COMPLETE DRIVER DETAILS!
    setLiveDeliveryAlert({
      orderId,
      order: capturedOrder,
      type: 'driver_accepted',
      title: '🎉 Delivery Partner Has Accepted Your Order!',
      message: `Driver ${currentRiderName} has accepted your delivery request! On the way with vehicle ${currentRiderVehicle}. Direct Contact: ${currentRiderPhone}`,
      riderName: currentRiderName,
      riderPhone: currentRiderPhone,
      riderVehicle: currentRiderVehicle,
      timestamp: Date.now()
    });

    try {
      await apiClient.put(`/orders/${orderId}/accept`);
    } catch (e) {
      // Local fallback
    }
  };

  // Delivery Hero declines/rejects order
  const rejectDeliveryOrder = async (orderId, reason) => {
    const currentRiderName = user?.name || 'Vikram Malhotra';
    const rejectionReason = reason || 'Driver currently unavailable / out of operational zone';

    setUserOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId || ord._id === orderId) {
          const timeline = [...(ord.trackingTimeline || [])];
          timeline.push({
            step: timeline.length + 1,
            status: 'Driver Declined Request',
            title: `Declined by ${currentRiderName}`,
            location: 'Logistics Hub',
            timestamp: new Date().toISOString(),
            completed: true,
            description: `Delivery Partner indicated: "${rejectionReason}". Order returned to Admin queue for reassignment to another driver.`
          });

          const history = Array.isArray(ord.driverRejectionHistory) ? [...ord.driverRejectionHistory] : [];
          history.push({
            driverName: currentRiderName,
            reason: rejectionReason,
            timestamp: new Date().toISOString()
          });

          return {
            ...ord,
            driverRequestStatus: 'rejected',
            driverRejectedAt: new Date().toISOString(),
            driverRejectionReason: rejectionReason,
            driverRejectionHistory: history,
            trackingTimeline: timeline
          };
        }
        return ord;
      });
      localStorage.setItem('vibewear_user_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      await apiClient.put(`/orders/${orderId}/reject`, { reason: rejectionReason });
    } catch (e) {
      // Local fallback
    }
  };

  // Delivery Hero completes return pickup / exchange
  const completeReturnPickup = async (orderId, { refundAmount, notes } = {}) => {
    setUserOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId || ord._id === orderId) {
          const isExchange = ord.orderStatus === 'Exchange In Progress' || ord.orderStatus === 'Exchange Approved';
          const newStatus = isExchange ? 'Exchanged' : 'Returned';

          const timeline = [...(ord.trackingTimeline || [])];
          timeline.push({
            step: timeline.length + 1,
            status: newStatus,
            title: isExchange ? 'Exchange Completed' : 'Return Collected & Refund Handover',
            location: 'Customer Doorstep',
            timestamp: new Date().toISOString(),
            completed: true,
            description: isExchange
              ? 'Replacement item handed over. Returned item collected.'
              : `Package picked up safely. Refund of ₹${refundAmount || ord.totalAmount} processed.`
          });

          return {
            ...ord,
            orderStatus: newStatus,
            returnStatus: 'Completed',
            exchangeStatus: isExchange ? 'Completed' : ord.exchangeStatus,
            paymentStatus: isExchange ? ord.paymentStatus : 'Refunded',
            deliveryNotes: notes || (isExchange ? 'Exchange completed at doorstep.' : `Return package collected. Refund of ₹${refundAmount || ord.totalAmount} issued.`),
            trackingTimeline: timeline
          };
        }
        return ord;
      });
      localStorage.setItem('vibewear_user_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      await apiClient.put(`/orders/${orderId}/complete-return`, { refundAmount, notes });
    } catch (e) {
      // Local fallback
    }
  };

  const requireAuth = (callback) => {
    if (user && token) {
      callback(user);
    } else {
      setPendingAction(() => callback);
      setAuthModalMode('login');
      setAuthModalOpen(true);
    }
  };

  const openAuthModal = (mode = 'login', callback = null) => {
    setAuthModalMode(mode);
    setAuthError(null);
    setNeedRegisterFirst(false);
    if (callback) {
      setPendingAction(() => callback);
    }
    setAuthModalOpen(true);
  };

  // Instant 1-click switcher for testing all roles (Customer, Driver, Admin)
  const switchDemoUser = (role) => {
    let target = null;
    if (role === 'Admin') {
      target = INITIAL_REGISTERED_ACCOUNTS[0]; // Admin VibeWear
    } else if (role === 'Customer') {
      target = INITIAL_REGISTERED_ACCOUNTS[1]; // John Doe
    } else if (role === 'DeliveryPartner') {
      target = INITIAL_REGISTERED_ACCOUNTS[2]; // Vikram Malhotra
    }

    if (target) {
      setUser(target);
      const demoToken = `mock_token_${target.role.toLowerCase()}_2026`;
      setToken(demoToken);
      try {
        localStorage.setItem('vibewear_user', JSON.stringify(target));
        localStorage.setItem('vibewear_token', demoToken);
      } catch (e) {
        console.error('Storage error', e);
      }
      return target;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'Admin',
        isDeliveryPartner: user?.role === 'DeliveryPartner',
        switchDemoUser,
        loading,
        authError,
        setAuthError,
        authSuccessNotice,
        setAuthSuccessNotice,
        needRegisterFirst,
        setNeedRegisterFirst,
        login,
        register,
        logout,
        requireAuth,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        isProfileOpen,
        setIsProfileOpen,
        profileActiveTab,
        setProfileActiveTab,
        openProfile: (tab = 'orders') => {
          setProfileActiveTab(tab);
          setIsProfileOpen(true);
        },
        openOrders: () => {
          setProfileActiveTab('orders');
          setIsProfileOpen(true);
        },
        closeProfile: () => setIsProfileOpen(false),
        updateUserProfile,
        userOrders,
        addOrder,
        updateDeliveryStatus,
        claimOrder,
        cancelOrder,
        requestReturn,
        requestExchange,
        assignRiderToOrder,
        acceptDeliveryOrder,
        rejectDeliveryOrder,
        completeReturnPickup,
        fleetRiders: FLEET_RIDERS,
        liveDeliveryAlert,
        setLiveDeliveryAlert,
        dismissDeliveryAlert,
        triggerDriverDeparture
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
