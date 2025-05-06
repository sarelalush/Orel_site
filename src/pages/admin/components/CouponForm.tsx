import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface CouponFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  coupon: any;
}

export default function CouponForm({
  isOpen,
  onClose,
  onSubmit,
  coupon
}: CouponFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_purchase: 0,
    max_uses: null as number | null,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
    created_by: user?.id
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        ...coupon,
        start_date: new Date(coupon.start_date).toISOString().split('T')[0],
        end_date: coupon.end_date ? new Date(coupon.end_date).toISOString().split('T')[0] : '',
        created_by: coupon.created_by || user?.id
      });
    }
  }, [coupon, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (formData.discount_type === 'percentage' && (formData.discount_value < 0 || formData.discount_value > 100)) {
        throw new Error('אחוז ההנחה חייב להיות בין 0 ל-100');
      }

      if (formData.discount_type === 'fixed' && formData.discount_value < 0) {
        throw new Error('סכום ההנחה חייב להיות חיובי');
      }

      if (formData.min_purchase < 0) {
        throw new Error('סכום מינימום להזמנה חייב להיות חיובי');
      }

      if (formData.max_uses !== null && formData.max_uses < 1) {
        throw new Error('מספר שימושים מקסימלי חייב להיות חיובי');
      }

      // Format dates
      const submitData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null
      };

      await onSubmit(submitData);
    } catch (error: any) {
      console.error('Error submitting coupon:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {coupon ? 'עריכת קופון' : 'יצירת קופון חדש'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                קוד קופון
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="לדוגמה: SUMMER2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סוג הנחה
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="percentage">אחוז הנחה</option>
                <option value="fixed">סכום קבוע</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.discount_type === 'percentage' ? 'אחוז הנחה' : 'סכום הנחה'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  max={formData.discount_type === 'percentage' ? "100" : undefined}
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="absolute left-3 top-2">
                  {formData.discount_type === 'percentage' ? '%' : '₪'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סכום מינימום להזמנה
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.min_purchase}
                  onChange={(e) => setFormData({ ...formData, min_purchase: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="absolute left-3 top-2">₪</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מספר שימושים מקסימלי
              </label>
              <input
                type="number"
                min="1"
                value={formData.max_uses || ''}
                onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="ללא הגבלה"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תאריך התחלה
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תאריך סיום
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                min={formData.start_date}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תיאור
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="תיאור אופציונלי של הקופון"
            />
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">קופון פעיל</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {coupon ? 'עדכן קופון' : 'צור קופון'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}