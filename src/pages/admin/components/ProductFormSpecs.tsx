import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface ProductFormSpecsProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function ProductFormSpecs({
  formData,
  setFormData
}: ProductFormSpecsProps) {
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const addTechnicalSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    
    setFormData({
      ...formData,
      technical_specs: [
        ...formData.technical_specs,
        { label: newSpecLabel, value: newSpecValue }
      ]
    });
    
    setNewSpecLabel('');
    setNewSpecValue('');
  };

  const removeTechnicalSpec = (index: number) => {
    const updatedSpecs = [...formData.technical_specs];
    updatedSpecs.splice(index, 1);
    setFormData({ ...formData, technical_specs: updatedSpecs });
  };

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          מפרט טכני
        </label>
        <p className="text-xs text-gray-500 mb-2">
          הוסף מאפיינים טכניים למוצר
        </p>

        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם המאפיין
              </label>
              <input
                type="text"
                value={newSpecLabel}
                onChange={(e) => setNewSpecLabel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="לדוגמה: משקל"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ערך
              </label>
              <input
                type="text"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="לדוגמה: 1.2 ק״ג"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={addTechnicalSpec}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            הוסף מאפיין
          </button>
        </div>

        {formData.technical_specs.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right py-2 px-4 font-medium">מאפיין</th>
                  <th className="text-right py-2 px-4 font-medium">ערך</th>
                  <th className="text-right py-2 px-4 font-medium">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {formData.technical_specs.map((spec: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{spec.label}</td>
                    <td className="py-2 px-4">{spec.value}</td>
                    <td className="py-2 px-4">
                      <button
                        type="button"
                        onClick={() => removeTechnicalSpec(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 border rounded-lg">
            <p className="text-gray-500">אין מאפיינים טכניים</p>
          </div>
        )}
      </div>
    </div>
  );
}