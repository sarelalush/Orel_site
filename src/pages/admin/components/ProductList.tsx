import React from 'react';
import { Edit, Trash2, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductListProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (productId: string) => void;
  getSortIcon: (field: string) => React.ReactNode;
  toggleSort: (field: string) => void;
  sortBy: string;
}

export default function ProductList({ 
  products, 
  onEdit, 
  onDelete,
  getSortIcon,
  toggleSort,
  sortBy
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">לא נמצאו מוצרים</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-right py-3 px-4">
              <button 
                onClick={() => toggleSort('name')}
                className="flex items-center font-medium text-gray-700"
              >
                שם {getSortIcon('name')}
              </button>
            </th>
            <th className="text-right py-3 px-4">קטגוריה</th>
            <th className="text-right py-3 px-4">
              <button 
                onClick={() => toggleSort('price')}
                className="flex items-center font-medium text-gray-700"
              >
                מחיר {getSortIcon('price')}
              </button>
            </th>
            <th className="text-right py-3 px-4">
              <button 
                onClick={() => toggleSort('stock')}
                className="flex items-center font-medium text-gray-700"
              >
                מלאי {getSortIcon('stock')}
              </button>
            </th>
            <th className="text-right py-3 px-4">תמונות</th>
            <th className="text-right py-3 px-4">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {product.description}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                {product.categories ? (
                  <div>
                    {product.categories.parent?.parent ? (
                      <div className="text-sm">
                        <span className="text-gray-500">{product.categories.parent.parent.name} / </span>
                        <span className="text-gray-500">{product.categories.parent.name} / </span>
                        <span>{product.categories.name}</span>
                      </div>
                    ) : product.categories.parent ? (
                      <div className="text-sm">
                        <span className="text-gray-500">{product.categories.parent.name} / </span>
                        <span>{product.categories.name}</span>
                      </div>
                    ) : (
                      <span>{product.categories.name}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">ללא קטגוריה</span>
                )}
              </td>
              <td className="py-3 px-4">₪{product.price.toLocaleString()}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.stock === 0
                    ? 'bg-red-100 text-red-800'
                    : product.stock <= 5
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.stock === 0 ? 'אזל מהמלאי' : product.stock}
                </span>
              </td>
              <td className="py-3 px-4">
                <Link
                  to={`/admin/product-images/${product.id}`}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded inline-flex items-center gap-1"
                  title="נהל תמונות"
                >
                  <Image className="w-5 h-5" />
                  <span className="text-sm">
                    {product.images && Array.isArray(product.images) ? product.images.length : 0}
                  </span>
                </Link>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="ערוך מוצר"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="מחק מוצר"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}