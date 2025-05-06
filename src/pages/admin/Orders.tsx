import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Eye, Truck, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';

interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  created_at: string;
  user: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      image_url: string;
    };
  }>;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { showNotification } = useNotification();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, sortBy, sortOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          user:user_id (
            full_name,
            email,
            phone,
            address,
            city
          ),
          items:order_items (
            id,
            product_id,
            quantity,
            price,
            product:products (
              name,
              image_url
            )
          )
        `);

      // Apply status filter
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('error', 'שגיאה בטעינת ההזמנות');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      showNotification('success', 'סטטוס ההזמנה עודכן בהצלחה');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      showNotification('error', 'שגיאה בעדכון סטטוס ההזמנה');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">ממתין לאישור</Badge>;
      case 'processing':
        return <Badge variant="info">בטיפול</Badge>;
      case 'completed':
        return <Badge variant="success">הושלם</Badge>;
      case 'cancelled':
        return <Badge variant="error">בוטל</Badge>;
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchString = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchString) ||
      order.user?.full_name?.toLowerCase().includes(searchString) ||
      order.user?.email?.toLowerCase().includes(searchString)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ניהול הזמנות</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="חיפוש הזמנות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span>סינון וחיפוש מתקדם</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">כל ההזמנות</option>
                  <option value="pending">ממתין לאישור</option>
                  <option value="processing">בטיפול</option>
                  <option value="completed">הושלם</option>
                  <option value="cancelled">בוטל</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מיון לפי</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="created_at-desc">תאריך (מהחדש לישן)</option>
                  <option value="created_at-asc">תאריך (מהישן לחדש)</option>
                  <option value="total-desc">סכום (מהגבוה לנמוך)</option>
                  <option value="total-asc">סכום (מהנמוך לגבוה)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">לא נמצאו הזמנות</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">מספר הזמנה</th>
                  <th className="text-right py-3 px-4">לקוח</th>
                  <th className="text-right py-3 px-4">תאריך</th>
                  <th className="text-right py-3 px-4">סכום</th>
                  <th className="text-right py-3 px-4">סטטוס</th>
                  <th className="text-right py-3 px-4">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono">{order.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{order.user?.full_name}</div>
                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(order.created_at).toLocaleDateString('he-IL')}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      ₪{order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="צפה בפרטי ההזמנה"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="pending">ממתין לאישור</option>
                          <option value="processing">בטיפול</option>
                          <option value="completed">הושלם</option>
                          <option value="cancelled">בוטל</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">פרטי הזמנה #{selectedOrder.id}</h2>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 130px)' }}>
              {/* Order Status */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">סטטוס הזמנה</h3>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(selectedOrder.status)}
                      <span className="text-gray-500">
                        עודכן ב-{new Date(selectedOrder.created_at).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                  </div>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="pending">ממתין לאישור</option>
                    <option value="processing">בטיפול</option>
                    <option value="completed">הושלם</option>
                    <option value="cancelled">בוטל</option>
                  </select>
                </div>
              </div>

              {/* Customer Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">פרטי לקוח</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">שם מלא</p>
                      <p className="font-medium">{selectedOrder.user?.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">אימייל</p>
                      <p className="font-medium">{selectedOrder.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">טלפון</p>
                      <p className="font-medium">{selectedOrder.user?.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">כתובת</p>
                      <p className="font-medium">
                        {selectedOrder.user?.address}, {selectedOrder.user?.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">פריטים בהזמנה</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-right py-3 px-4">מוצר</th>
                        <th className="text-right py-3 px-4">כמות</th>
                        <th className="text-right py-3 px-4">מחיר ליחידה</th>
                        <th className="text-right py-3 px-4">סה"כ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <div className="font-medium">{item.product.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{item.quantity}</td>
                          <td className="py-3 px-4">₪{item.price.toLocaleString()}</td>
                          <td className="py-3 px-4 font-medium">
                            ₪{(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr className="border-t">
                        <td colSpan={3} className="py-3 px-4 text-left font-medium">
                          סה"כ
                        </td>
                        <td className="py-3 px-4 font-bold">
                          ₪{selectedOrder.total.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="text-lg font-semibold mb-4">היסטוריית הזמנה</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">ההזמנה התקבלה</p>
                      <p className="text-sm text-gray-500">
                        {new Date(selectedOrder.created_at).toLocaleDateString('he-IL')}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.status === 'processing' && (
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Truck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">ההזמנה בטיפול</p>
                        <p className="text-sm text-gray-500">ההזמנה נמצאת בתהליך הכנה למשלוח</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'completed' && (
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">ההזמנה הושלמה</p>
                        <p className="text-sm text-gray-500">ההזמנה נמסרה ללקוח</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'cancelled' && (
                    <div className="flex items-start gap-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">ההזמנה בוטלה</p>
                        <p className="text-sm text-gray-500">ההזמנה בוטלה</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}