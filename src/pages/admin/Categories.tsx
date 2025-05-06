import React, { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import CategoryForm from './components/CategoryForm';
import CategoryList from './components/CategoryList';

// Define the fixed main categories
const FIXED_MAIN_CATEGORIES = [
  'ציוד שטח',
  'חלקי חילוף',
  'כלי עבודה',
  'ספורט ימי',
  'צמיגים',
  'שמנים',
  'חלקי פנים',
  'חלקי חוץ'
];

export default function Categories() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const { showNotification } = useNotification();
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch all categories with their full hierarchy
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          parent:parent_id (
            id,
            name,
            slug,
            parent_id,
            parent:parent_id (
              id,
              name,
              slug
            )
          )
        `)
        .order('name');
      
      if (error) throw error;
      
      // Store all categories
      setCategories(data || []);
      
      // Separate categories by level
      const mainCats = data?.filter(c => !c.parent_id) || [];
      const subCats = data?.filter(c => c.parent_id && !c.parent?.parent_id) || [];
      const productCats = data?.filter(c => c.parent_id && c.parent?.parent_id) || [];
      
      setMainCategories(mainCats);
      setSubCategories(subCats);
      setProductCategories(productCats);
      
      // Organize into hierarchy
      const roots = [];
      const categoriesMap = new Map();
      
      // First pass: create map of all categories
      (data || []).forEach(category => {
        categoriesMap.set(category.id, { ...category, children: [] });
      });
      
      // Second pass: build hierarchy
      (data || []).forEach(category => {
        const categoryWithChildren = categoriesMap.get(category.id);
        if (!categoryWithChildren) return;
        
        if (category.parent_id) {
          const parent = categoriesMap.get(category.parent_id);
          if (parent) {
            if (!parent.children) parent.children = [];
            parent.children.push(categoryWithChildren);
          }
        } else {
          roots.push(categoryWithChildren);
        }
      });
      
      // Sort roots to match FIXED_MAIN_CATEGORIES order
      roots.sort((a, b) => {
        const aIndex = FIXED_MAIN_CATEGORIES.indexOf(a.name);
        const bIndex = FIXED_MAIN_CATEGORIES.indexOf(b.name);
        if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
      
      setCategories(roots);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification('error', 'שגיאה בטעינת הקטגוריות');
    } finally {
      setLoading(false);
    }
  };

  const refreshCategoriesData = async () => {
    setRefreshing(true);
    try {
      await fetchCategories();
      showNotification('success', 'הקטגוריות עודכנו בהצלחה');
    } catch (error) {
      console.error('Error refreshing categories:', error);
      showNotification('error', 'שגיאה בעדכון הקטגוריות');
    } finally {
      setRefreshing(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    
    // Set category selections based on category's hierarchy
    if (category.parent?.parent) {
      // This is a product category (level 3)
      setSelectedMainCategory(category.parent.parent.id);
      setSelectedSubCategory(category.parent.id);
    } else if (category.parent) {
      // This is a subcategory (level 2)
      setSelectedMainCategory(category.parent.id);
      setSelectedSubCategory('');
    } else {
      // This is a main category (level 1)
      setSelectedMainCategory('');
      setSelectedSubCategory('');
    }
    
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    // Check if category has children
    const hasChildren = categories.some(cat => cat.parent_id === categoryId);
    
    let confirmMessage = 'האם אתה בטוח שברצונך למחוק קטגוריה זו?';
    if (hasChildren) {
      confirmMessage = 'קטגוריה זו מכילה תתי-קטגוריות. מחיקתה תגרום לניתוק הקשר עם תתי-הקטגוריות. האם אתה בטוח שברצונך למחוק?';
    }
    
    if (!window.confirm(confirmMessage)) return;

    try {
      // First update any child categories to remove the parent reference
      if (hasChildren) {
        const { error: updateError } = await supabase
          .from('categories')
          .update({ parent_id: null })
          .eq('parent_id', categoryId);

        if (updateError) throw updateError;
      }

      // Then delete the category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      showNotification('success', 'הקטגוריה נמחקה בהצלחה');
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);
      showNotification('error', 'שגיאה במחיקת הקטגוריה');
    }
  };

  const handleCategorySubmit = async (formData) => {
    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        
        showNotification('success', 'הקטגוריה עודכנה בהצלחה');
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([formData]);

        if (error) throw error;
        
        showNotification('success', 'הקטגוריה נוספה בהצלחה');
      }

      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      showNotification('error', 'שגיאה בשמירת הקטגוריה');
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold">ניהול קטגוריות</h1>
        <div className="flex gap-3">
          <button
            onClick={refreshCategoriesData}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
            disabled={refreshing}
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'מרענן...' : 'רענן קטגוריות'}
          </button>
          <button
            onClick={() => {
              setEditingCategory(null);
              setSelectedMainCategory('');
              setSelectedSubCategory('');
              setShowModal(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            הוסף קטגוריה
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="חיפוש קטגוריות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Categories Table */}
        <CategoryList 
          categories={filteredCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          fixedCategories={FIXED_MAIN_CATEGORIES}
        />
      </div>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <CategoryForm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCategorySubmit}
          category={editingCategory}
          categories={{
            main: mainCategories,
            sub: subCategories,
            product: productCategories
          }}
          selectedCategories={{
            main: selectedMainCategory,
            sub: selectedSubCategory
          }}
          setSelectedCategories={{
            main: setSelectedMainCategory,
            sub: setSelectedSubCategory
          }}
        />
      )}
    </div>
  );
}