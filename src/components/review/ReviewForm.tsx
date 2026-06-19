import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createReview } from '../../services/api';
import StarRating from './StarRating';
import type { Review } from '../../types';

interface ReviewFormProps {
  productId: number;
  onReviewAdded: (review: Review) => void;
}

export default function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const { firebaseUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!firebaseUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Lütfen bir puan seçin.'); return; }
    if (comment.length < 5) { setError('Yorum en az 5 karakter olmalıdır.'); return; }

    setLoading(true); setError('');
    try {
      const review = await createReview(productId, { rating, comment });
      onReviewAdded(review);
      setRating(0); setComment('');
    } catch (err: any) {
      setError(err.message || 'Yorum eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl border border-slate-100 p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Yorum Yaz</h3>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      <div className="mb-4">
        <label className="block text-xs text-slate-500 mb-2">Puanınız</label>
        <StarRating rating={rating} interactive onRate={setRating} size="lg" />
      </div>

      <div className="mb-4">
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          placeholder="Ürün hakkında düşüncelerinizi yazın..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 transition-all disabled:opacity-60 cursor-pointer"
      >
        {loading ? 'Gönderiliyor...' : 'Yorum Gönder'}
      </button>
    </form>
  );
}
