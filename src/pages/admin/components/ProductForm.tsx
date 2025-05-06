import React, { useState, useRef, useEffect } from 'react';
import { X, Image, Save, Plus, FileText, Truck, Tag, Layers } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNotification } from '../../../context/NotificationContext';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ProductFormBasic from './ProductFormBasic';
import ProductFormDescription from './ProductFormDescription';
import ProductFormSpecs from './ProductFormSpecs';
import ProductFormShipping from './ProductFormShipping';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  product: any;
  categories: {
    main: any[];
    sub: any[];
    product: any[];
  };
  selectedCategories: {
    main: string;
    sub: string;
    product: string;
  };
  setSelectedCategories: {
    main: (id: string) => void;
    sub: (id: string) => void;
    product: (id: string) => void;
  };
}

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  selectedCategories,
  setSelectedCategories
}: ProductFormProps) {
  const { showNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'description' | 'specs' | 'shipping'>('basic');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    image_url: '',
    category_id: '',
    has_sizes: false,
    has_colors: false,
    available_sizes: [],
    available_colors: [],
    detailed_description: '',
    technical_specs: [],
    shipping_info: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        image_url: product.image_url || '',
        category_id: product.category_id || '',
        has_sizes: product.has_sizes || false,
        has_colors: product.has_colors || false,
        available_sizes: product.available_sizes || [],
        available_colors: product.available_colors || [],
        detailed_description: product.detailed_description || '',
        technical_specs: product.technical_specs || [],
        shipping_info: product.shipping_info || `
<div>
  <h3 class="text-lg font-semibold mb-2">מדיניות משלוחים</h3>
  <p class="mb-4">משלוח חינם בהזמנה מעל ₪500. זמן אספקה 1-3 ימי עסקים.</p>
  
  <h3 class="text-lg font-semibold mb-2">מדיניות החזרות</h3>
  <p class="mb-4">ניתן להחזיר את המוצר תוך 14 יום מקבלתו. המוצר חייב להיות באריזתו המקורית ובמצב חדש.</p>
  
  <h3 class="text-lg font-semibold mb-2">אחריות</h3>
  <p>כל המוצרים שלנו מגיעים עם אחריות יצרן. תקופת האחריות משתנה בין המוצרים השונים, מ-6 חודשים ועד שנתיים.</p>
</div>
`
      });
      setPreviewUrl(product.image_url || '');
    }
  }, [product]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      // Prepare the final form data
      const finalFormData = {
        ...formData,
        image_url: imageUrl
      };

      onSubmit(finalFormData);
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('error', 'שגיאה בהעלאת התמונה');
    } finally {
      setUploadLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {product ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          <form onSubmit={handleSubmit}>
            {/* Tabs */}
            <div className="flex border-b mb-6 overflow-x-auto">
              <button
                type="button"
                className={`px-4 py-2 font-medium whitespace-nowrap ${
                  activeTab === 'basic' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('basic')}
              >
                <Layers className="w-4 h-4 inline-block ml-1" />
                פרטים בסיסיים
              </button>
              <button
                type="button"
                className={`px-4 py-2 font-medium whitespace-nowrap ${
                  activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('description')}
              >
                <FileText className="w-4 h-4 inline-block ml-1" />
                תיאור מפורט
              </button>
              <button
                type="button"
                className={`px-4 py-2 font-medium whitespace-nowrap ${
                  activeTab === 'specs' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('specs')}
              >
                <Tag className="w-4 h-4 inline-block ml-1" />
                מפרט טכני
              </button>
              <button
                type="button"
                className={`px-4 py-2 font-medium whitespace-nowrap ${
                  activeTab === 'shipping' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('shipping')}
              >
                <Truck className="w-4 h-4 inline-block ml-1" />
                משלוח והחזרות
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'basic' && (
              <ProductFormBasic
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                fileInputRef={fileInputRef}
                handleFileSelect={handleFileSelect}
                previewUrl={previewUrl}
              />
            )}

            {activeTab === 'description' && (
              <ProductFormDescription
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {activeTab === 'specs' && (
              <ProductFormSpecs
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {activeTab === 'shipping' && (
              <ProductFormShipping
                formData={formData}
                setFormData={setFormData}
              />
            )}

            <div className="flex justify-end gap-4 mt-6 border-t pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={uploadLoading}
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={uploadLoading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors min-w-[120px] h-10 flex items-center justify-center gap-2"
              >
                {uploadLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {product ? 'עדכן מוצר' : 'הוסף מוצר'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}