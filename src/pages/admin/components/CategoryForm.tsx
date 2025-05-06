import React, { useState, useRef, useEffect } from 'react';
import { X, Image, Save, Plus, Info } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNotification } from '../../../context/NotificationContext';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  category: any;
  categories: {
    main: any[];
    sub: any[];
    product: any[];
  };
  selectedCategories: {
    main: string;
    sub: string;
  };
  setSelectedCategories: {
    main: (id: string) => void;
    sub: (id: string) => void;
  };
}

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  category,
  categories,
  selectedCategories,
  setSelectedCategories
}: CategoryFormProps) {
  const { showNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [categoryLevel, setCategoryLevel] = useState<'main' | 'sub' | 'product'>('main');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    parent_id: null
  });

  // Fixed main categories
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

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image_url: category.image_url || '',
        parent_id: category.parent_id || null
      });
      setPreviewUrl(category.image_url || '');

      // Determine category level
      if (category.parent?.parent) {
        setCategoryLevel('product');
      } else if (category.parent) {
        setCategoryLevel('sub');
      } else {
        setCategoryLevel('main');
      }
    } else {
      // Reset form for new category
      setFormData({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        parent_id: null
      });
      setPreviewUrl('');
      setCategoryLevel('main');
    }
  }, [category]);

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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const handleMainCategoryChange = (categoryId: string) => {
    setSelectedCategories.main(categoryId);
    setSelectedCategories.sub('');
    setFormData(prev => ({ ...prev, parent_id: categoryId }));
  };

  const handleSubCategoryChange = (categoryId: string) => {
    setSelectedCategories.sub(categoryId);
    setFormData(prev => ({ ...prev, parent_id: categoryId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `category-images/${fileName}`;

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
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {category ? 'עריכת קטגוריה' : 'הוספת קטגוריה חדשה'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Help text for category structure */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-700 mb-1">מבנה הקטגוריות</h3>
                <p className="text-sm text-blue-600">
                  מערכת הקטגוריות בנויה בצורה היררכית בשלוש רמות:
                </p>
                <ol className="text-sm text-blue-600 list-decimal list-inside mt-1 space-y-1">
                  <li>קטגוריה ראשית (למשל: "צמיגים")</li>
                  <li>תת-קטגוריה (למשל: "צמיגי שטח")</li>
                  <li>קטגוריית מוצר (למשל: "צמיגי All Terrain")</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Category Level Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">רמת הקטגוריה</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setCategoryLevel('main');
                  setSelectedCategories.main('');
                  setSelectedCategories.sub('');
                  setFormData(prev => ({ ...prev, parent_id: null }));
                }}
                className={`px-4 py-2 rounded-lg ${
                  categoryLevel === 'main'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                קטגוריה ראשית
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategoryLevel('sub');
                  setSelectedCategories.sub('');
                  setFormData(prev => ({ ...prev, parent_id: null }));
                }}
                className={`px-4 py-2 rounded-lg ${
                  categoryLevel === 'sub'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                תת-קטגוריה
              </button>
              <button
                type="button"
                onClick={() => setCategoryLevel('product')}
                className={`px-4 py-2 rounded-lg ${
                  categoryLevel === 'product'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                קטגוריית מוצר
              </button>
            </div>
          </div>

          {/* Parent Category Selection */}
          {categoryLevel !== 'main' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {categoryLevel === 'sub' ? 'בחר קטגוריה ראשית' : 'בחר קטגוריה ראשית ותת-קטגוריה'}
              </label>
              
              {/* Main Category Selection */}
              <select
                value={selectedCategories.main}
                onChange={(e) => handleMainCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                required
              >
                <option value="">בחר קטגוריה ראשית</option>
                {categories.main.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              {/* Sub Category Selection - Only for product level */}
              {categoryLevel === 'product' && selectedCategories.main && (
                <select
                  value={selectedCategories.sub}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">בחר תת-קטגוריה</option>
                  {categories.sub
                    .filter(cat => cat.parent_id === selectedCategories.main)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              )}
            </div>
          )}

          {/* Category Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם הקטגוריה</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={`לדוגמה: ${
                  categoryLevel === 'main' ? 'צמיגים' : 
                  categoryLevel === 'sub' ? 'צמיגי שטח' : 'צמיגי All Terrain'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={`לדוגמה: ${
                  categoryLevel === 'main' ? 'tires' : 
                  categoryLevel === 'sub' ? 'off-road-tires' : 'all-terrain'
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">
                ה-slug משמש ב-URL ויכול להכיל רק אותיות קטנות באנגלית, מספרים ומקפים
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="תיאור קצר של הקטגוריה"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">תמונת קטגוריה</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => {
                  setFormData({...formData, image_url: e.target.value});
                  setPreviewUrl(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title="העלה תמונה"
              >
                <Image className="w-5 h-5 text-gray-600" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            {previewUrl && (
              <div className="mt-2 p-2 border rounded-lg bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-1">תצוגה מקדימה:</p>
                <div className="flex justify-center">
                  <img 
                    src={previewUrl} 
                    alt="תצוגה מקדימה" 
                    className="max-h-40 object-contain rounded-lg" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
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
                  {category ? 'עדכן קטגוריה' : 'הוסף קטגוריה'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}