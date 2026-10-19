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
  const [pendingAction, setPendingAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authSuccessNotice, setAuthSuccessNotice] = useState(null);
  const [needRegisterFirst, setNeedRegisterFirst] = useState(false);

  // User orders history
  const [userOrders, setUserOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('vibewear_user_orders');
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch {
      return [];
    }
  });

  // Get registered accounts from local storage
  const getRegisteredAccounts = () => {
    try {
      const stored = localStorage.getItem('vibewear_registered_accounts');
      if (stored) {
        return JSON.parse(stored);
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

  // Login handler: ONLY REAL REGISTERED ACCOUNTS CAN LOG IN!
  const login = async (email, password) => {
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
      const response = await apiClient.post('/auth/login', { email: cleanEmail, password });
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      setAuthModalOpen(false);

      if (pendingAction) {
        pendingAction(userData);
        setPendingAction(null);
      }
      return { success: true };
    } catch (err) {
      // If backend responded with 401 / 404
      const serverMsg = err.response?.data?.message;

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
        const msg = serverMsg || 'Incorrect password! Please enter the correct password.';
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
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // Register handler: Compulsory before login!
  const register = async (name, email, password, role = 'Customer') => {
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

    try {
      // 1. Try registering on real MySQL backend
      let registeredId = 'usr_' + Date.now();
      try {
        const response = await apiClient.post('/auth/register', {
          name: cleanName,
          email: cleanEmail,
          password,
          role
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
        role: role || 'Customer',
        createdAt: new Date().toISOString()
      };
      accounts.push(newAccount);
      localStorage.setItem('vibewear_registered_accounts', JSON.stringify(accounts));

      // COMPULSORY LOGIN AFTER REGISTER:
      // Do NOT auto login! Make user login with their credentials.
      setUser(null);
      setToken(null);
      setAuthModalMode('login');
      const succMsg = '✅ Registration successful! You must now log in with your credentials to start shopping.';
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

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'Admin',
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
        openProfile: () => setIsProfileOpen(true),
        closeProfile: () => setIsProfileOpen(false),
        updateUserProfile,
        userOrders,
        addOrder
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
