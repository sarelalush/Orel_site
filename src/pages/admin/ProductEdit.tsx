import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProductForm from './components/ProductForm';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState({
    main: [],
    sub: [],
    product: []
  });
  const [selectedCategories, setSelectedCategories] = useState({
    main: '',
    sub: '',
    product: ''
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          parent:parent_id (
            id,
            name,
            parent_id,
            parent:parent_id (
              id,
              name
            )
          )
        `)
        .order('name');

      if (error) throw error;

      // Organize categories by level
      const mainCats = data.filter(c => !c.parent_id);
      const subCats = data.filter(c => c.parent_id && !c.parent?.parent_id);
      const productCats = data.filter(c => c.parent_id && c.parent?.parent_id);

      setCategories({
        main: mainCats,
        sub: subCats,
        product: productCats
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification('error', 'שגיאה בטעינת הקטגוריות');
    }
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            id,
            name,
            parent_id,
            parent:parent_id (
              id,
              name,
              parent_id,
              parent:parent_id (
                id,
                name
              )
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setProduct(data);

      // Set selected categories based on product's category
      if (data.categories) {
        if (data.categories.parent?.parent) {
          setSelectedCategories({
            main: data.categories.parent.parent.id,
            sub: data.categories.parent.id,
            product: data.categories.id
          });
        } else if (data.categories.parent) {
          setSelectedCategories({
            main: data.categories.parent.id,
            sub: data.categories.id,
            product: ''
          });
        } else {
          setSelectedCategories({
            main: data.categories.id,
            sub: '',
            product: ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showNotification('error', 'שגיאה בטעינת המוצר');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', id);

        if (error) throw error;
        showNotification('success', 'המוצר עודכן בהצלחה');
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([formData]);

        if (error) throw error;
        showNotification('success', 'המוצר נוסף בהצלחה');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification('error', 'שגיאה בשמירת המוצר');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">
          {id ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
        </h1>
      </div>

      <ProductForm
        isOpen={true}
        onClose={() => navigate('/admin/products')}
        onSubmit={handleSubmit}
        product={product}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={{
          main: (id) => setSelectedCategories(prev => ({ ...prev, main: id, sub: '', product: '' })),
          sub: (id) => setSelectedCategories(prev => ({ ...prev, sub: id, product: '' })),
          product: (id) => setSelectedCategories(prev => ({ ...prev, product: id }))
        }}
      />
    </div>
  );
}