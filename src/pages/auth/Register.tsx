import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { signUp } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';

export default function Register() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      
      if (error) {
        showNotification('error', error.message);
        return;
      }

      showNotification('success', 'נרשמת בהצלחה! אנא התחבר.');
      navigate('/auth/login');
    } catch (error) {
      showNotification('error', 'שגיאה בהרשמה. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">הרשמה</h1>
          <p className="text-gray-600">צור חשבון חדש ב-PRO ATV</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם מלא
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <User className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              אימייל
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סיסמה
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                minLength={6}
              />
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              הסיסמה חייבת להכיל לפחות 6 תווים
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              'נרשם...'
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                הירשם
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            כבר יש לך חשבון?{' '}
            <Link to="/auth/login" className="text-primary hover:text-primary-dark">
              התחבר כאן
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}