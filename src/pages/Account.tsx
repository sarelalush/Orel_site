import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, Clock, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">החשבון שלי</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* הזמנות */}
        <Link 
          to="/account/orders"
          className="bg-white rounded-lg p-6 shadow-dynamic hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">הזמנות</h2>
          </div>
          <p className="text-gray-600">צפה בהיסטוריית ההזמנות שלך</p>
        </Link>

        {/* מועדפים */}
        <Link 
          to="/wishlist"
          className="bg-white rounded-lg p-6 shadow-dynamic hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">מועדפים</h2>
          </div>
          <p className="text-gray-600">המוצרים ששמרת לצפייה מאוחרת</p>
        </Link>

        {/* היסטוריה */}
        <Link 
          to="/account/history"
          className="bg-white rounded-lg p-6 shadow-dynamic hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">היסטוריה</h2>
          </div>
          <p className="text-gray-600">המוצרים שצפית בהם לאחרונה</p>
        </Link>

        {/* הגדרות */}
        <Link 
          to="/account/settings"
          className="bg-white rounded-lg p-6 shadow-dynamic hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">הגדרות</h2>
          </div>
          <p className="text-gray-600">עדכן את פרטי החשבון שלך</p>
        </Link>
      </div>

      {/* פרטי חשבון */}
      <div className="mt-12 bg-white rounded-lg p-8 shadow-dynamic">
        <h2 className="text-2xl font-bold mb-6">פרטי חשבון</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-4">פרטים אישיים</h3>
            <div className="space-y-2 text-gray-600">
              <p>שם: {user?.user_metadata?.full_name || 'לא צוין'}</p>
              <p>אימייל: {user?.email}</p>
              <p>טלפון: {user?.phone || 'לא צוין'}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">כתובת למשלוח</h3>
            <div className="space-y-2 text-gray-600">
              <p>רחוב: {user?.user_metadata?.address || 'לא צוין'}</p>
              <p>עיר: {user?.user_metadata?.city || 'לא צוין'}</p>
              <p>מיקוד: {user?.user_metadata?.zipCode || 'לא צוין'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* כפתור התנתקות */}
      <div className="mt-8 flex justify-end">
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          התנתק
        </button>
      </div>
    </div>
  );
}