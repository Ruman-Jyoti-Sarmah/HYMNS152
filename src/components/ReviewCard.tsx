import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import type { Review } from '@/types/types';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      {/* Header with user name and rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">
              {review.user_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
            {review.verified_purchase && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="h-3 w-3" />
                <span>Verified Purchase</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {renderStars(review.rating)}
          </div>
          <span className="text-sm text-gray-600">{review.rating}</span>
        </div>
      </div>

      {/* Review title */}
      <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>

      {/* Review comment */}
      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      {/* Review date */}
      <div className="text-sm text-gray-500">
        {formatDate(review.created_at)}
      </div>
    </div>
  );
};
