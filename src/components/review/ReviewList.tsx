import { useState, useEffect } from 'react';
import { fetchReviews } from '../../services/api';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import type { Review } from '../../types';

interface ReviewListProps {
  productId: number;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews(productId)
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Yorumlar</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={Math.round(avgRating)} size="sm" />
              <span className="text-sm text-slate-500">
                {avgRating.toFixed(1)} ({reviews.length} yorum)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Yorum Formu */}
      <div className="mb-6">
        <ReviewForm
          productId={productId}
          onReviewAdded={(review) => setReviews([review, ...reviews])}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <svg className="w-6 h-6 animate-spin text-violet-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75"/></svg>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{review.userDisplayName?.charAt(0) || '?'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{review.userDisplayName}</p>
                    <p className="text-xs text-slate-400">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
