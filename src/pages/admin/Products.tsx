import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProductList from './components/ProductList';
import { getProducts, deleteProduct } from '../../lib/api';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showNotification } = useNotification();
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('error', 'שגיאה בטעינת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) return;

    try {
      await deleteProduct(id);
      showNotification('success', 'המוצר נמחק בהצלחה');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('error', 'שגיאה במחיקת המוצר');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ניהול מוצרים</h1>
        <Link
          to="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          הוסף מוצר
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="חיפוש מוצרים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Products List Component */}
        <ProductList
          products={filteredProducts}
          onEdit={(product) => navigate(`/admin/products/edit/${product.id}`)}
          onDelete={handleDeleteProduct}
          getSortIcon={getSortIcon}
          toggleSort={toggleSort}
          sortBy={sortBy}
        />
      </div>
    </div>
  );
}