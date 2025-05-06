import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getProductReviews, createReview, markReviewHelpful } from '../lib/api';
import LoadingSpinner from './LoadingSpinner';

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('helpfulReviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviews = await getProductReviews(productId);
      setReviews(reviews);
      setReviewCount(reviews.length);
      
      // Calculate average rating
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(totalRating / reviews.length);
      }

      // Check if the current user has already reviewed
      if (user) {
        const userReview = reviews.find(review => review.user_id === user.id);
        setHasUserReviewed(!!userReview);
        setUserReview(userReview || null);
        if (userReview) {
          setUserRating(userReview.rating);
          setUserComment(userReview.comment);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showNotification('error', 'שגיאה בטעינת הביקורות');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification('error', 'יש להתחבר כדי לכתוב ביקורת');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview(productId, {
        rating: userRating,
        comment: userComment.trim()
      });

      showNotification('success', hasUserReviewed ? 'הביקורת עודכנה בהצלחה' : 'הביקורת נוספה בהצלחה');
      fetchReviews();
      if (!hasUserReviewed) {
        setUserComment('');
        setUserRating(5);
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      showNotification('error', error.message || 'שגיאה בשמירת הביקורת');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (!user) {
      showNotification('error', 'יש להתחבר כדי לסמן ביקורת כמועילה');
      return;
    }

    // Check if already marked as helpful
    if (helpfulReviews.includes(reviewId)) {
      showNotification('info', 'כבר סימנת ביקורת זו כמועילה');
      return;
    }

    try {
      await markReviewHelpful(reviewId);
      
      // Update local state
      const newHelpfulReviews = [...helpfulReviews, reviewId];
      setHelpfulReviews(newHelpfulReviews);
      localStorage.setItem('helpfulReviews', JSON.stringify(newHelpfulReviews));
      
      // Update review count in the UI
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, helpful_count: (review.helpful_count || 0) + 1 }
          : review
      ));
      
      showNotification('success', 'תודה על המשוב!');
    } catch (error: any) {
      // If the error is a conflict (already marked), update local state
      if (error.code === 'CONFLICT') {
        const newHelpfulReviews = [...helpfulReviews, reviewId];
        setHelpfulReviews(newHelpfulReviews);
        localStorage.setItem('helpfulReviews', JSON.stringify(newHelpfulReviews));
        showNotification('info', 'כבר סימנת ביקורת זו כמועילה');
      } else {
        console.error('Error marking review as helpful:', error);
        showNotification('error', 'שגיאה בסימון הביקורת כמועילה');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">ביקורות לקוחות</h2>

        {/* סיכום ביקורות */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="mr-2 text-lg font-semibold">
                {averageRating.toFixed(1)} מתוך 5
              </span>
            </div>
            <p className="text-gray-600">
              מבוסס על {reviewCount} ביקורות
            </p>
          </div>
        </div>

        {/* טופס ביקורת חדשה */}
        {user ? (
          <form onSubmit={handleSubmitReview} className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              {hasUserReviewed ? 'ערוך את הביקורת שלך' : 'כתוב ביקורת'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                דירוג
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= userRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הביקורת שלך
              </label>
              <textarea
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="שתף את החוויה שלך עם המוצר..."
                required
                minLength={10}
                maxLength={1000}
              />
              <p className="mt-1 text-sm text-gray-500">
                {userComment.length}/1000 תווים
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || userComment.length < 10}
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoadingSpinner />
              ) : hasUserReviewed ? (
                'עדכן ביקורת'
              ) : (
                'שלח ביקורת'
              )}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">
              יש להתחבר כדי לכתוב ביקורת
            </p>
          </div>
        )}

        {/* רשימת ביקורות */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">אין ביקורות עדיין. היה הראשון לכתוב ביקורת!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {review.user_metadata?.full_name || 'משתמש אנונימי'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('he-IL')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                <button
                  onClick={() => handleHelpful(review.id)}
                  disabled={helpfulReviews.includes(review.id)}
                  className={`flex items-center gap-2 text-sm ${
                    helpfulReviews.includes(review.id)
                      ? 'text-primary cursor-default'
                      : 'text-gray-500 hover:text-primary'
                  } transition-colors`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>
                    {review.helpful_count} אנשים מצאו את הביקורת הזו מועילה
                  </span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}