import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import type { Review } from '@/types/types';

interface ReviewListProps {
  reviews: Review[];
}

type SortOption = 'most-recent' | 'highest-rating' | 'lowest-rating';

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [sortBy, setSortBy] = useState<SortOption>('most-recent');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];

    switch (sortBy) {
      case 'most-recent':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'highest-rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest-rating':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [reviews, sortBy]);

  const sortOptions = [
    { value: 'most-recent' as SortOption, label: 'Most Recent' },
    { value: 'highest-rating' as SortOption, label: 'Highest Rating' },
    { value: 'lowest-rating' as SortOption, label: 'Lowest Rating' }
  ];

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with sort options */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Customer Reviews ({reviews.length})
        </h2>

        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:border-gray-400 transition-colors"
          >
            <span className="text-sm">
              {sortOptions.find(option => option.value === sortBy)?.label}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {showSortDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSortDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px]">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      sortBy === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};
