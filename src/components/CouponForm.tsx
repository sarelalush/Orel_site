import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { validateCoupon } from '../lib/api';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from './LoadingSpinner';

interface CouponFormProps {
  onApply: (discount: number) => void;
}

export default function CouponForm({ onApply }: CouponFormProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { total } = useCart();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      const result = await validateCoupon(code, total);
      
      if (result.is_valid) {
        onApply(result.discount_amount);
        showNotification('success', 'הקופון הופעל בהצלחה');
      } else {
        showNotification('error', result.message);
      }
    } catch (error: any) {
      showNotification('error', error.message || 'שגיאה בהפעלת הקופון');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="הזן קוד קופון"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !code.trim()}
        className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
      >
        {loading ? <LoadingSpinner /> : 'הפעל'}
      </button>
    </form>
  );
}