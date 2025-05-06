import React from 'react';
import { Image } from 'lucide-react';

interface ProductFormBasicProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
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
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string;
}

export default function ProductFormBasic({
  formData,
  setFormData,
  categories,
  selectedCategories,
  setSelectedCategories,
  fileInputRef,
  handleFileSelect,
  previewUrl
}: ProductFormBasicProps) {
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
    setSelectedCategories.product('');
  };

  const handleSubCategoryChange = (categoryId: string) => {
    setSelectedCategories.sub(categoryId);
    setSelectedCategories.product('');
  };

  const handleProductCategoryChange = (categoryId: string) => {
    setSelectedCategories.product(categoryId);
    setFormData(prev => ({ ...prev, category_id: categoryId }));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">שם המוצר</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
          />
          <p className="text-xs text-gray-500 mt-1">
            ה-slug משמש ב-URL ויכול להכיל רק אותיות קטנות באנגלית, מספרים ומקפים
          </p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">תיאור קצר</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">מחיר</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">מלאי</label>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
        
        {/* Main Category */}
        <select
          value={selectedCategories.main}
          onChange={(e) => handleMainCategoryChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
        >
          <option value="">בחר קטגוריה ראשית</option>
          {categories.main.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
        {/* Sub Category - Only show if main category is selected */}
        {selectedCategories.main && (
          <select
            value={selectedCategories.sub}
            onChange={(e) => handleSubCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
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
        
        {/* Product Category - Only show if sub category is selected */}
        {selectedCategories.sub && (
          <select
            value={selectedCategories.product}
            onChange={(e) => handleProductCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">בחר קטגוריית מוצר</option>
            {categories.product
              .filter(cat => cat.parent_id === selectedCategories.sub)
              .map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">תמונת מוצר</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
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

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="has_sizes"
            checked={formData.has_sizes}
            onChange={(e) => setFormData({...formData, has_sizes: e.target.checked})}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="has_sizes" className="ml-2 text-sm font-medium text-gray-700">
            למוצר יש מידות
          </label>
        </div>
        
        {formData.has_sizes && (
          <div className="mb-4 pl-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מידות זמינות
            </label>
            <p className="text-xs text-gray-500 mb-2">
              המידות מוגדרות כמערך. לדוגמה: ["S", "M", "L", "XL", "XXL"]
            </p>
            <textarea
              value={JSON.stringify(formData.available_sizes, null, 2)}
              onChange={(e) => {
                try {
                  const sizes = JSON.parse(e.target.value);
                  setFormData({...formData, available_sizes: sizes});
                } catch (error) {
                  // Handle invalid JSON
                  console.error('Invalid JSON for sizes:', error);
                }
              }}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            ></textarea>
          </div>
        )}
        
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="has_colors"
            checked={formData.has_colors}
            onChange={(e) => setFormData({...formData, has_colors: e.target.checked})}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="has_colors" className="ml-2 text-sm font-medium text-gray-700">
            למוצר יש צבעים
          </label>
        </div>
        
        {formData.has_colors && (
          <div className="pl-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              צבעים זמינים
            </label>
            <p className="text-xs text-gray-500 mb-2">
              הצבעים מוגדרים בפורמט JSON. לדוגמה: [{`{"name": "black", "label": "שחור", "hex": "#000000"}`}]
            </p>
            <textarea
              value={JSON.stringify(formData.available_colors, null, 2)}
              onChange={(e) => {
                try {
                  const colors = JSON.parse(e.target.value);
                  setFormData({...formData, available_colors: colors});
                } catch (error) {
                  // Handle invalid JSON
                  console.error('Invalid JSON for colors:', error);
                }
              }}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}