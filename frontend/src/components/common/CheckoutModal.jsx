import React from 'react';
import CheckoutPage from '../../pages/CheckoutPage';

/**
 * CheckoutModal adapter
 * Renders the dedicated full-screen Checkout experience, ensuring checkout is never
 * confined inside a cramped modal dialog box.
 */
const CheckoutModal = ({ isOpen, onClose, onOrderComplete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F8FAFC] dark:bg-[#06060A] animate-fade-in">
      <CheckoutPage
        onNavigateBack={onClose}
        onOrderComplete={(order) => {
          if (onOrderComplete) onOrderComplete(order);
          onClose();
        }}
      />
    </div>
  );
};

export default CheckoutModal;
