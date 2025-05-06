import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, Printer, Download } from 'lucide-react';

export default function OrderConfirmation() {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDate, setOrderDate] = useState('');
  
  useEffect(() => {
    // Generate a random order number
    setOrderNumber(Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
    
    // Set current date
    const now = new Date();
    setOrderDate(now.toLocaleDateString('he-IL'));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-green-500 mb-2">תודה על הזמנתך!</h1>
            <p className="text-gray-600">מספר הזמנה: {orderNumber}</p>
            <p className="text-gray-600">תאריך: {orderDate}</p>
          </div>

          <div className="border-t border-b py-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">סטטוס ההזמנה</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center ml-4">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">ההזמנה התקבלה</h3>
                  <p className="text-sm text-gray-500">אנחנו מתחילים לטפל בהזמנה שלך</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center ml-4">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">בהכנה</h3>
                  <p className="text-sm text-gray-500">ההזמנה שלך בתהליך אריזה</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center ml-4">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">במשלוח</h3>
                  <p className="text-sm text-gray-500">ההזמנה בדרך אליך</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">פרטי משלוח</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">שם:</span> ישראל ישראלי</p>
              <p><span className="font-medium">כתובת:</span> רחוב הרצל 1, תל אביב, 6120101</p>
              <p><span className="font-medium">טלפון:</span> 052-1234567</p>
              <p><span className="font-medium">אימייל:</span> israel@example.com</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">פרטי תשלום</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">שיטת תשלום:</span> כרטיס אשראי</p>
              <p><span className="font-medium">מספר כרטיס:</span> XXXX-XXXX-XXXX-1234</p>
              <p><span className="font-medium">סכום:</span> ₪2,751</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
              <Printer className="w-5 h-5" />
              הדפס חשבונית
            </button>
            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-5 h-5" />
              הורד חשבונית
            </button>
          </div>

          <div className="text-center mt-8 space-y-4">
            <p className="text-gray-600">
              שלחנו לך אימייל עם פרטי ההזמנה המלאים.
              <br />
              ניתן לעקוב אחר סטטוס ההזמנה באזור האישי.
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center text-primary hover:text-primary-dark"
            >
              <ArrowRight className="w-5 h-5 ml-1" />
              המשך בקניות
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}