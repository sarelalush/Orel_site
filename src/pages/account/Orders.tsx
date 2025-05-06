import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronLeft, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';

interface OrderItem {
  id: string;
  product: {
    name: string;
    image_url: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items (
            id,
            quantity,
            price,
            product:products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('error', 'שגיאה בטעינת ההזמנות');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/account" className="text-gray-500 hover:text-primary transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">ההזמנות שלי</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">אין הזמנות</h2>
          <p className="text-gray-500 mb-4">עדיין לא ביצעת הזמנות באתר</p>
          <Link
            to="/catalog"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            התחל בקניות
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-dynamic p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">מספר הזמנה: {order.id}</p>
                  <p className="text-sm text-gray-500">
                    תאריך: {new Date(order.created_at).toLocaleDateString('he-IL')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'completed' ? 'הושלם' :
                     order.status === 'cancelled' ? 'בוטל' :
                     order.status === 'processing' ? 'בטיפול' :
                     'ממתין לאישור'}
                  </span>
                  <span className="font-bold">₪{order.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">פריטים בהזמנה</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">כמות: {item.quantity}</p>
                        </div>
                      </div>
                      <span>₪{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
                  <Eye className="w-5 h-5" />
                  צפה בפרטי ההזמנה
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}