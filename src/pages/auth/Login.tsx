import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { signIn } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Login() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        showNotification('error', error.message);
        return;
      }

      showNotification('success', 'התחברת בהצלחה!');
      navigate('/');
    } catch (error) {
      showNotification('error', 'שגיאה בהתחברות. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">התחברות</h1>
          <p className="text-gray-600">ברוכים הבאים חזרה ל-PRO ATV</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={loading}
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
                disabled={loading}
              />
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 h-11"
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                התחבר
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            עדיין אין לך חשבון?{' '}
            <Link to="/auth/register" className="text-primary hover:text-primary-dark">
              הירשם עכשיו
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}