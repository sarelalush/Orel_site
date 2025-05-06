import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export default function Reviews({ product }: { product: Product }) {
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      productId: product.id,
      userName: "יוסי כהן",
      rating: 5,
      comment: "מוצר מעולה! שימושי מאוד בטיולי שטח",
      date: "2024-03-15",
      helpful: 12
    },
    {
      id: 2,
      productId: product.id,
      userName: "דנה לוי",
      rating: 4,
      comment: "איכות טובה, משלוח מהיר. מומלץ!",
      date: "2024-03-10",
      helpful: 8
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // כאן יהיה הטיפול בשמירת הביקורת
    console.log('New review:', newReview);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">ביקורות לקוחות</h2>

      {/* סיכום ביקורות */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="w-6 h-6 text-yellow-400 fill-current" 
                />
              ))}
              <span className="mr-2 text-lg font-semibold">4.5 מתוך 5</span>
            </div>
            <p className="text-gray-600">מבוסס על {reviews.length} ביקורות</p>
          </div>
          <button
            onClick={() => document.getElementById('write-review')?.focus()}
            className="button-3d bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 inline-block ml-2" />
            כתוב ביקורת
          </button>
        </div>
      </div>

      {/* רשימת ביקורות */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="card-3d bg-white p-6 rounded-lg shadow-dynamic">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <h3 className="font-semibold">{review.userName}</h3>
              </div>
              <span className="text-gray-500">{new Date(review.date).toLocaleDateString('he-IL')}</span>
            </div>
            <p className="text-gray-600 mb-4">{review.comment}</p>
            <button className="flex items-center text-gray-500 hover:text-primary transition-colors">
              <ThumbsUp className="w-4 h-4 ml-1" />
              <span>({review.helpful}) מועיל</span>
            </button>
          </div>
        ))}
      </div>

      {/* טופס ביקורת חדשה */}
      <form onSubmit={handleSubmitReview} className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">כתוב ביקורת</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">דירוג</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewReview({ ...newReview, rating: star })}
                className="focus:outline-none"
              >
                <Star 
                  className={`w-8 h-8 ${star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="write-review" className="block text-sm font-medium text-gray-700 mb-2">
            הביקורת שלך
          </label>
          <textarea
            id="write-review"
            rows={4}
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="שתף את החוויה שלך עם המוצר..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="button-3d bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300"
        >
          שלח ביקורת
        </button>
      </form>
    </div>
  );
}