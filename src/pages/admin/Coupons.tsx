import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import CouponForm from './components/CouponForm';

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  max_uses: number | null;
  uses_count: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      showNotification('error', 'שגיאה בטעינת הקופונים');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (editingCoupon) {
        // Update existing coupon
        const { error } = await supabase
          .from('coupons')
          .update(formData)
          .eq('id', editingCoupon.id);

        if (error) throw error;
        showNotification('success', 'הקופון עודכן בהצלחה');
      } else {
        // Create new coupon
        const { error } = await supabase
          .from('coupons')
          .insert([formData]);

        if (error) throw error;
        showNotification('success', 'הקופון נוצר בהצלחה');
      }

      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      showNotification('error', 'שגיאה בשמירת הקופון');
    }
  };

  const toggleCouponStatus = async (couponId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', couponId);

      if (error) throw error;
      showNotification('success', `הקופון ${currentStatus ? 'הושבת' : 'הופעל'} בהצלחה`);
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      showNotification('error', 'שגיאה בעדכון סטטוס הקופון');
    }
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ניהול קופונים</h1>
        <div className="flex gap-3">
          <button
            onClick={fetchCoupons}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            רענן
          </button>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setShowModal(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            צור קופון
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="חיפוש קופונים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Coupons Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-3 px-4">קוד קופון</th>
                <th className="text-right py-3 px-4">תיאור</th>
                <th className="text-right py-3 px-4">הנחה</th>
                <th className="text-right py-3 px-4">מינימום הזמנה</th>
                <th className="text-right py-3 px-4">תוקף</th>
                <th className="text-right py-3 px-4">שימושים</th>
                <th className="text-right py-3 px-4">סטטוס</th>
                <th className="text-right py-3 px-4">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono">{coupon.code}</td>
                  <td className="py-3 px-4">{coupon.description || '-'}</td>
                  <td className="py-3 px-4">
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}%`
                      : `₪${coupon.discount_value}`}
                  </td>
                  <td className="py-3 px-4">
                    {coupon.min_purchase > 0 ? `₪${coupon.min_purchase}` : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div>{new Date(coupon.start_date).toLocaleDateString('he-IL')}</div>
                        {coupon.end_date && (
                          <div className="text-sm text-gray-500">
                            עד {new Date(coupon.end_date).toLocaleDateString('he-IL')}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {coupon.max_uses ? (
                      <span>
                        {coupon.uses_count}/{coupon.max_uses}
                      </span>
                    ) : (
                      <span>{coupon.uses_count}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        coupon.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coupon.is_active ? 'פעיל' : 'לא פעיל'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ערוך
                      </button>
                      <button
                        onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                        className={coupon.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                      >
                        {coupon.is_active ? 'השבת' : 'הפעל'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Coupon Modal */}
      {showModal && (
        <CouponForm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          coupon={editingCoupon}
        />
      )}
    </div>
  );
}