import React from 'react';
import { Shield, Truck, PenTool as Tool, Package } from 'lucide-react';

export default function ProductFeatures() {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'אחריות יצרן',
      description: 'שנה אחריות מלאה על כל המוצרים'
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'משלוח חינם',
      description: 'בהזמנה מעל ₪500'
    },
    {
      icon: <Tool className="w-6 h-6" />,
      title: 'התקנה מקצועית',
      description: 'שירות התקנה זמין בכל הארץ'
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: 'החזרות קלות',
      description: '14 ימי החזרה ללא שאלות'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {features.map((feature, index) => (
        <div 
          key={index}
          className="bg-white p-4 rounded-lg shadow-dynamic hover:shadow-lg transition-all duration-300 text-center"
        >
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="text-primary">{feature.icon}</div>
          </div>
          <h3 className="font-semibold mb-1">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}