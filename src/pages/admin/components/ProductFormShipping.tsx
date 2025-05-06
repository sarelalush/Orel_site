import React from 'react';

interface ProductFormShippingProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function ProductFormShipping({
  formData,
  setFormData
}: ProductFormShippingProps) {
  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          מידע על משלוח והחזרות
        </label>
        <p className="text-xs text-gray-500 mb-2">
          ניתן להשתמש ב-HTML לעיצוב המידע
        </p>
        <textarea
          value={formData.shipping_info}
          onChange={(e) => setFormData({...formData, shipping_info: e.target.value})}
          rows={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          תצוגה מקדימה
        </label>
        <div 
          className="prose max-w-none border p-4 rounded-lg bg-white min-h-[200px]"
          dangerouslySetInnerHTML={{ __html: formData.shipping_info || '<p>אין מידע על משלוח והחזרות</p>' }}>
        </div>
      </div>
    </div>
  );
}