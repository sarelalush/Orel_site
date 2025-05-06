import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateUserMetadata } from '../../lib/api';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export default function Settings() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  useEffect(() => {
    if (user) {
      const [firstName = '', lastName = ''] = (user.user_metadata?.full_name || '').split(' ');
      setFormData({
        firstName,
        lastName,
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || '',
        city: user.user_metadata?.city || '',
        zipCode: user.user_metadata?.zipCode || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      // Validate phone number
      const phoneRegex = /^05\d{8}$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        showNotification('error', 'מספר טלפון לא תקין');
        return;
      }

      // Validate zip code
      const zipRegex = /^\d{5,7}$/;
      if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
        showNotification('error', 'מיקוד לא תקין');
        return;
      }

      const { error } = await updateUserMetadata(user.id, {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode
      });

      if (error) {
        showNotification('error', error.message);
        return;
      }

      showNotification('success', 'הפרטים עודכנו בהצלחה');
    } catch (error) {
      console.error('Error updating user details:', error);
      showNotification('error', 'שגיאה בעדכון הפרטים');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/account" className="text-gray-500 hover:text-gray-800">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">הגדרות חשבון</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם פרטי
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם משפחה
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                אימייל
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                טלפון
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="05xxxxxxxx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                כתובת
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                עיר
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מיקוד
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="מיקוד (5-7 ספרות)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 h-11"
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  שמור שינויים
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}