import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Home, Shield, FolderTree,
  TrendingUp, CreditCard, Calendar, ArrowUp, ArrowDown, DollarSign, ShoppingBag, Activity,
  Menu, X, Ticket
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/LoadingSpinner';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'לוח בקרה', exact: true },
  { path: '/admin/products', icon: Package, label: 'ניהול מוצרים' },
  { path: '/admin/categories', icon: FolderTree, label: 'ניהול קטגוריות' },
  { path: '/admin/orders', icon: ShoppingCart, label: 'ניהול הזמנות' },
  { path: '/admin/coupons', icon: Ticket, label: 'ניהול קופונים' },
  { path: '/admin/users', icon: Users, label: 'לקוחות' },
  { path: '/admin/fix-rls', icon: Shield, label: 'תיקון הרשאות' },
  { path: '/admin/settings', icon: Settings, label: 'הגדרות' }
];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  });
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: []
  });
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: []
  });
  const [statusData, setStatusData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (location.pathname === '/admin') {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) throw ordersError;

      // Fetch users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*');

      if (usersError) throw usersError;

      // Calculate statistics
      const totalSales = orders?.reduce((sum, order) => sum + order.total, 0) || 0;
      const totalOrders = orders?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
      const totalCustomers = users?.length || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
      const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;
      const cancelledOrders = orders?.filter(order => order.status === 'cancelled').length || 0;

      setStats({
        totalSales,
        totalOrders,
        averageOrderValue,
        totalCustomers,
        pendingOrders,
        completedOrders,
        cancelledOrders
      });

      // Prepare sales data for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const salesByDay = last7Days.map(date => {
        const dayOrders = orders?.filter(order => 
          order.created_at.startsWith(date)
        ) || [];
        return dayOrders.reduce((sum, order) => sum + order.total, 0);
      });

      setSalesData({
        labels: last7Days.map(date => new Date(date).toLocaleDateString('he-IL')),
        datasets: [{
          label: 'מכירות יומיות',
          data: salesByDay,
          borderColor: '#FF8C00',
          backgroundColor: 'rgba(255, 140, 0, 0.1)',
          fill: true,
          tension: 0.4
        }]
      });

      // Prepare order status data
      setStatusData({
        labels: ['ממתין לאישור', 'הושלם', 'בוטל'],
        datasets: [{
          data: [pendingOrders, completedOrders, cancelledOrders],
          backgroundColor: ['#FFA533', '#10B981', '#EF4444'],
          borderWidth: 0
        }]
      });

      // Prepare category data (simulated for now)
      setCategoryData({
        labels: ['ציוד שטח', 'צמיגים', 'תאורה', 'אבזור חיצוני', 'אבזור פנימי'],
        datasets: [{
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            '#FF8C00',
            '#10B981',
            '#3B82F6',
            '#8B5CF6',
            '#EC4899'
          ],
          borderWidth: 0
        }]
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Render the admin layout
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar - Desktop */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-secondary flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6" />
              ניהול PRO ATV
            </h1>
          </div>
          <Link 
            to="/"
            className="flex items-center gap-2 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Home className="w-5 h-5" />
            חזרה לדף הבית
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path))
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t mt-8 pt-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              התנתק
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        {location.pathname === '/admin' ? (
          loading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-dynamic">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-700">סה"כ מכירות</h3>
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold">₪{stats.totalSales.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2 text-green-500">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm">12% מהחודש שעבר</span>
                  </div>
                </div>

                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-dynamic">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-700">הזמנות</h3>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
                    </div>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.totalOrders}</p>
                  <div className="flex items-center gap-2 mt-2 text-green-500">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm">8% מהחודש שעבר</span>
                  </div>
                </div>

                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-dynamic">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-700">ממוצע להזמנה</h3>
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 text-green-500" />
                    </div>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold">₪{stats.averageOrderValue.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2 text-red-500">
                    <ArrowDown className="w-4 h-4" />
                    <span className="text-sm">3% מהחודש שעבר</span>
                  </div>
                </div>

                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-dynamic">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-700">לקוחות</h3>
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" />
                    </div>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.totalCustomers}</p>
                  <div className="flex items-center gap-2 mt-2 text-green-500">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm">15% מהחודש שעבר</span>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-dynamic">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-6">מכירות לפי יום</h3>
                  <div style={{ height: '300px', position: 'relative' }}>
                    <Line
                      data={salesData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) => `₪${value}`
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Orders by Status */}
                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-dynamic">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-6">הזמנות לפי סטטוס</h3>
                  <div style={{ height: '300px', position: 'relative' }}>
                    <Doughnut
                      data={statusData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 20
                            }
                          }
                        },
                        cutout: '60%'
                      }}
                    />
                  </div>
                </div>

                {/* Sales by Category */}
                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-dynamic lg:col-span-2">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-6">מכירות לפי קטגוריה</h3>
                  <div style={{ height: '300px', position: 'relative' }}>
                    <Bar
                      data={categoryData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) => `${value}%`
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}