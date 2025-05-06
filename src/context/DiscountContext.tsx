import React, { createContext, useContext, useState } from 'react';
import { useNotification } from './NotificationContext';

interface DiscountContextType {
  appliedCoupon: string | null;
  discountAmount: number;
  applyDiscount: (code: string, amount: number) => void;
  clearDiscount: () => void;
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export function DiscountProvider({ children }: { children: React.ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { showNotification } = useNotification();

  const applyDiscount = (code: string, amount: number) => {
    setAppliedCoupon(code);
    setDiscountAmount(amount);
    showNotification('success', `הקופון ${code} הופעל בהצלחה`);
  };

  const clearDiscount = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  return (
    <DiscountContext.Provider value={{
      appliedCoupon,
      discountAmount,
      applyDiscount,
      clearDiscount
    }}>
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscount() {
  const context = useContext(DiscountContext);
  if (context === undefined) {
    throw new Error('useDiscount must be used within a DiscountProvider');
  }
  return context;
}