import React, { useState, useEffect } from 'react';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import { getUserLoyaltyPoints, getLoyaltyPointsTransactions } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from './LoadingSpinner';

interface LoyaltyPointsProps {
  onUsePoints?: (points: number) => void;
}

export default function LoyaltyPoints({ onUsePoints }: LoyaltyPointsProps) {
  const [points, setPoints] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (user) {
      fetchLoyaltyData();
    }
  }, [user]);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const pointsData = await getUserLoyaltyPoints();
      if (pointsData) {
        setPoints(pointsData.points);
      }

      const transactionsData = await getLoyaltyPointsTransactions();
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      showNotification('error', 'שגיאה בטעינת נתוני נקודות');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600">יש להתחבר כדי לצבור ולממש נקודות</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">נקודות מועדון</h3>
        </div>
        <div className="text-xl font-bold text-primary">
          {points.toLocaleString()} נקודות
        </div>
      </div>

      {points > 0 && onUsePoints && (
        <button
          onClick={() => onUsePoints(points)}
          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors mb-4"
        >
          ממש {points} נקודות (שווה ל-₪{(points * 0.01).toLocaleString()})
        </button>
      )}

      <button
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        היסטוריית נקודות
      </button>

      {showHistory && transactions.length > 0 && (
        <div className="mt-4 space-y-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center text-sm border-b pb-2"
            >
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-gray-500">
                  {new Date(transaction.created_at).toLocaleDateString('he-IL')}
                </p>
              </div>
              <span className={transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-red-600'}>
                {transaction.transaction_type === 'earn' ? '+' : '-'}
                {transaction.points}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}