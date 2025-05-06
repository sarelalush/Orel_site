import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';
import { useCart } from '../context/CartContext';
import { useDiscount } from '../context/DiscountContext';
import { CreditCard, Truck, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import CheckoutForm from '../components/CheckoutForm';
import CouponForm from '../components/CouponForm';
import LoyaltyPoints from '../components/LoyaltyPoints';

interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total } = useCart();
  const { appliedCoupon, discountAmount, applyDiscount, clearDiscount } = useDiscount();
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');
  const [usedLoyaltyPoints, setUsedLoyaltyPoints] = useState(0);
  
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
    window.scrollTo(0, 0);
  };

  const handleLoyaltyPointsUse = (points: number) => {
    setUsedLoyaltyPoints(points);
  };

  // Calculate final total
  const subtotal = total;
  const couponDiscount = discountAmount;
  const pointsDiscount = usedLoyaltyPoints * 0.01; // 1 point = 0.01₪
  const finalTotal = Math.max(0, subtotal - couponDiscount - pointsDiscount);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">סל הקניות ריק</h1>
        <button
          onClick={() => navigate('/catalog')}
          className="text-primary hover:text-primary-dark"
        >
          חזרה לקטלוג
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* סטטוס התקדמות */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`flex-1 text-center ${currentStep === 'shipping' ? 'text-primary font-bold' : 'text-gray-500'}`}>
              פרטי משלוח
            </div>
            <div className={`flex-1 text-center ${currentStep === 'payment' ? 'text-primary font-bold' : 'text-gray-500'}`}>
              תשלום
            </div>
          </div>
          <div className="relative mt-2">
            <div className="h-2 bg-gray-200 rounded">
              <div 
                className="h-full bg-primary rounded transition-all duration-300"
                style={{ 
                  width: currentStep === 'shipping' ? '50%' : '100%' 
                }}
              ></div>
            </div>
          </div>
        </div>

        {currentStep === 'shipping' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">פרטי משלוח</h2>
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.fullName}
                    onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                  <input
                    type="email"
                    required
                    value={shippingDetails.email}
                    onChange={(e) => setShippingDetails({...shippingDetails, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                  <input
                    type="tel"
                    required
                    pattern="05[0-9]{8}"
                    placeholder="05xxxxxxxx"
                    value={shippingDetails.phone}
                    onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">כתובת</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.address}
                    onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">עיר</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מיקוד</label>
                  <input
                    type="text"
                    required
                    pattern="\d{5,7}"
                    placeholder="מיקוד (5-7 ספרות)"
                    value={shippingDetails.zipCode}
                    onChange={(e) => setShippingDetails({...shippingDetails, zipCode: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ChevronRight className="w-5 h-5" />
                  חזרה לסל הקניות
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  המשך לתשלום
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {currentStep === 'payment' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">פרטי תשלום</h2>
            
            {/* Order Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">סיכום הזמנה</h3>
              <div className="border-t border-b py-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.product.size || ''}-${item.product.color || ''}`} className="flex justify-between items-center mb-2">
                    <div>
                      <span>{item.product.name}</span>
                      {(item.product.size || item.product.color) && (
                        <span className="text-sm text-gray-500 block">
                          {item.product.size && <span className="ml-2">מידה: {item.product.size}</span>}
                          {item.product.color && <span>צבע: {item.product.color}</span>}
                        </span>
                      )}
                      <span className="text-sm text-gray-500">כמות: {item.quantity}</span>
                    </div>
                    <span>₪{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Discounts Section */}
              <div className="mt-6 space-y-4">
                {/* Coupon Form */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">קוד קופון</h4>
                  <CouponForm onApply={applyDiscount} />
                </div>

                {/* Loyalty Points */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">נקודות מועדון</h4>
                  <LoyaltyPoints onUsePoints={handleLoyaltyPointsUse} />
                </div>
              </div>

              {/* Price Summary */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>סכום ביניים:</span>
                  <span>₪{subtotal.toLocaleString()}</span>
                </div>
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>הנחת קופון:</span>
                    <span>-₪{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>הנחת נקודות:</span>
                    <span>-₪{pointsDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-4 border-t">
                  <span>סה"כ לתשלום:</span>
                  <span>₪{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Details Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">פרטי משלוח</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><span className="font-medium">שם:</span> {shippingDetails.fullName}</p>
                <p><span className="font-medium">אימייל:</span> {shippingDetails.email}</p>
                <p><span className="font-medium">טלפון:</span> {shippingDetails.phone}</p>
                <p><span className="font-medium">כתובת:</span> {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.zipCode}</p>
              </div>
            </div>

            {/* Payment Form */}
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                shippingDetails={shippingDetails}
                finalAmount={finalTotal}
                discounts={{
                  coupon: appliedCoupon ? {
                    code: appliedCoupon,
                    amount: couponDiscount
                  } : null,
                  points: usedLoyaltyPoints > 0 ? {
                    points: usedLoyaltyPoints,
                    amount: pointsDiscount
                  } : null
                }}
              />
            </Elements>

            <div className="mt-6">
              <button
                onClick={() => setCurrentStep('shipping')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ChevronRight className="w-5 h-5" />
                חזרה לפרטי משלוח
              </button>
            </div>
          </div>
        )}

        {/* מידע נוסף */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-primary ml-3" />
            <div>
              <h3 className="font-semibold">תשלום מאובטח</h3>
              <p className="text-sm text-gray-500">כל העסקאות מוצפנות ומאובטחות</p>
            </div>
          </div>
          <div className="flex items-center">
            <Truck className="w-6 h-6 text-primary ml-3" />
            <div>
              <h3 className="font-semibold">משלוח חינם</h3>
              <p className="text-sm text-gray-500">בהזמנה מעל ₪500</p>
            </div>
          </div>
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 text-primary ml-3" />
            <div>
              <h3 className="font-semibold">תשלום מאובטח</h3>
              <p className="text-sm text-gray-500">תומך בכל כרטיסי האשראי</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}