import React from 'react';
import { Edit, Trash2, ChevronRight, FolderTree } from 'lucide-react';

interface CategoryListProps {
  categories: any[];
  onEdit: (category: any) => void;
  onDelete: (categoryId: string) => void;
  fixedCategories: string[];
}

export default function CategoryList({
  categories,
  onEdit,
  onDelete,
  fixedCategories
}: CategoryListProps) {
  const renderCategoryTree = (categories: any[], level = 0) => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <tr className={`border-b hover:bg-gray-50 ${level === 0 ? 'bg-gray-50' : ''}`}>
          <td className="py-3 px-4">
            <div style={{ paddingRight: `${level * 20}px` }} className="flex items-center">
              {level > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />}
              {level === 0 ? (
                <div className="flex items-center gap-2 font-bold text-lg">
                  <FolderTree className="w-5 h-5 text-primary" />
                  {category.name}
                </div>
              ) : (
                category.name
              )}
              {fixedCategories.includes(category.name) && level === 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  קטגוריה ראשית קבועה
                </span>
              )}
            </div>
          </td>
          <td className="py-3 px-4">{category.slug}</td>
          <td className="py-3 px-4">
            {category.parent?.parent ? (
              // Level 3 - Product category
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">קטגוריה ראשית: {category.parent.parent.name}</span>
                <span className="text-xs text-gray-500">תת-קטגוריה: {category.parent.name}</span>
                <span className="font-medium">קטגוריית מוצר</span>
              </div>
            ) : category.parent ? (
              // Level 2 - Subcategory
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">קטגוריה ראשית: {category.parent.name}</span>
                <span className="font-medium">תת-קטגוריה</span>
              </div>
            ) : (
              // Level 1 - Main category
              <span className="font-medium">קטגוריה ראשית</span>
            )}
          </td>
          <td className="py-3 px-4">
            {category.image_url ? (
              <div className="flex items-center">
                <img 
                  src={category.image_url} 
                  alt={category.name} 
                  className="w-8 h-8 object-cover rounded mr-2" 
                />
                <span className="text-xs text-gray-500">יש תמונה</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">אין תמונה</span>
            )}
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEdit(category)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                title="ערוך קטגוריה"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onDelete(category.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="מחק קטגוריה"
                disabled={fixedCategories.includes(category.name) && level === 0}
              >
                <Trash2 className={`w-5 h-5 ${fixedCategories.includes(category.name) && level === 0 ? 'opacity-30 cursor-not-allowed' : ''}`} />
              </button>
            </div>
          </td>
        </tr>
        {category.children && category.children.length > 0 && (
          <>
            {renderCategoryTree(category.children, level + 1)}
            {level === 0 && (
              <tr>
                <td colSpan={5} className="py-4 border-b border-gray-200">
                  {/* Visual separator between main categories */}
                </td>
              </tr>
            )}
          </>
        )}
      </React.Fragment>
    ));
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">לא נמצאו קטגוריות</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-right py-3 px-4">שם</th>
            <th className="text-right py-3 px-4">Slug</th>
            <th className="text-right py-3 px-4">רמה</th>
            <th className="text-right py-3 px-4">תמונה</th>
            <th className="text-right py-3 px-4">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {renderCategoryTree(categories)}
        </tbody>
      </table>
    </div>
  );
}