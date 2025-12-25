import type { Review } from '@/types/types';

// Mock reviews data
export const reviews: Review[] = [
  {
    id: '1',
    user_id: 'user1',
    user_name: 'Rahul Sharma',
    product_id: '1',
    rating: 5,
    title: 'Amazing quality and comfort!',
    comment: 'This HYMNS t-shirt is absolutely fantastic. The fabric is so soft and comfortable, perfect for everyday wear. The print quality is excellent and hasn\'t faded even after multiple washes. Highly recommend!',
    created_at: '2024-12-20T10:30:00Z',
    verified_purchase: true
  },
  {
    id: '2',
    user_id: 'user2',
    user_name: 'Priya Patel',
    product_id: '1',
    rating: 4,
    title: 'Great fit and style',
    comment: 'Love the design and the fit is perfect. The color is exactly as shown in the pictures. Only minor issue is that it arrived a bit wrinkled, but that\'s common with cotton tees.',
    created_at: '2024-12-18T14:20:00Z',
    verified_purchase: true
  },
  {
    id: '3',
    user_id: 'user3',
    user_name: 'Amit Kumar',
    product_id: '1',
    rating: 5,
    title: 'Best HYMNS merchandise!',
    comment: 'As a huge HYMNS fan, this t-shirt is a must-have. The quality is premium and it shows my support for the band. Will definitely buy more products from HYMNS.',
    created_at: '2024-12-15T09:15:00Z',
    verified_purchase: true
  },
  {
    id: '4',
    user_id: 'user4',
    user_name: 'Sneha Gupta',
    product_id: '2',
    rating: 5,
    title: 'Perfect winter essential',
    comment: 'This hoodie is so warm and cozy! The material is thick but not heavy, and the HYMNS logo looks amazing. Perfect for winter concerts and casual wear.',
    created_at: '2024-12-22T16:45:00Z',
    verified_purchase: true
  },
  {
    id: '5',
    user_id: 'user5',
    user_name: 'Vikram Singh',
    product_id: '2',
    rating: 4,
    title: 'Good quality hoodie',
    comment: 'Nice hoodie with great print quality. The fit is a bit loose but that\'s what I wanted. Only wish it had kangaroo pockets, but overall very satisfied.',
    created_at: '2024-12-19T11:30:00Z',
    verified_purchase: true
  },
  {
    id: '6',
    user_id: 'user6',
    user_name: 'Anjali Verma',
    product_id: '3',
    rating: 4,
    title: 'Stylish and comfortable cap',
    comment: 'The cap is very stylish and comfortable to wear. The adjustable strap works perfectly. The HYMNS logo is prominent and looks great. Would recommend!',
    created_at: '2024-12-21T13:20:00Z',
    verified_purchase: true
  },
  {
    id: '7',
    user_id: 'user7',
    user_name: 'Rohan Mehta',
    product_id: '4',
    rating: 5,
    title: 'Unique and cool shoes',
    comment: 'These shoes are unlike anything I\'ve seen before. The design is unique and the quality is excellent. They\'re comfortable for all-day wear and get lots of compliments.',
    created_at: '2024-12-17T08:10:00Z',
    verified_purchase: true
  },
  {
    id: '8',
    user_id: 'user8',
    user_name: 'Kavita Joshi',
    product_id: '4',
    rating: 3,
    title: 'Good but could be better',
    comment: 'The shoes look great and are comfortable, but the sole is a bit thin. They\'re good for indoor wear but might not last long for outdoor activities.',
    created_at: '2024-12-14T15:40:00Z',
    verified_purchase: true
  }
];

// Utility functions for reviews
export const getReviewsByProductId = (productId: string): Review[] => {
  return reviews.filter(review => review.product_id === productId);
};

export const getAverageRating = (productId: string): number => {
  const productReviews = getReviewsByProductId(productId);
  if (productReviews.length === 0) return 0;

  const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / productReviews.length) * 10) / 10;
};

export const getRatingDistribution = (productId: string) => {
  const productReviews = getReviewsByProductId(productId);
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  productReviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++;
  });

  return distribution;
};

export const addReview = (review: Omit<Review, 'id' | 'created_at'>): Review => {
  const newReview: Review = {
    ...review,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };

  reviews.push(newReview);
  return newReview;
};

export const hasUserReviewed = (userId: string, productId: string): boolean => {
  return reviews.some(review => review.user_id === userId && review.product_id === productId);
};
