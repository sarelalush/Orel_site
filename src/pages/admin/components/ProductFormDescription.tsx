import React from 'react';

interface ProductFormDescriptionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function ProductFormDescription({
  formData,
  setFormData
}: ProductFormDescriptionProps) {
  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          תיאור מפורט
        </label>
        <p className="text-xs text-gray-500 mb-2">
          ניתן להשתמש ב-HTML לעיצוב התיאור המפורט
        </p>
        <textarea
          value={formData.detailed_description}
          onChange={(e) => setFormData({...formData, detailed_description: e.target.value})}
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
          dangerouslySetInnerHTML={{ __html: formData.detailed_description || '<p>אין תיאור מפורט</p>' }}>
        </div>
      </div>
    </div>
  );
}