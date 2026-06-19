import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import SizeSelector from '../components/product/SizeSelector';
import StockBadge from '../components/product/StockBadge';
import ReviewList from '../components/review/ReviewList';
import QuestionList from '../components/qa/QuestionList';
import type { ShoeProduct } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ShoeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProductById(Number(id))
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedSize) return null;
    return product.variants.find((v) => v.size === selectedSize) || null;
  }, [product, selectedSize]);

  const priceFormatted = product
    ? new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
      }).format(product.basePrice)
    : '';

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      brand: product.brand,
      size: selectedVariant.size,
      price: product.basePrice,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-violet-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75"/></svg>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-slate-500 text-xl mb-4">Ürün bulunamadı</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 sm:mb-8">
          <Link to="/" className="hover:text-violet-600 transition-colors">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span className="text-slate-500">{product.categoryName}</span>
          <span>/</span>
          <span className="text-slate-800 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Image Section */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl p-8 sm:p-12 flex items-center justify-center border border-slate-100 overflow-hidden group">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-lg transition-all duration-700 group-hover:scale-105 animate-fade-in"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-lg bg-violet-100 border border-violet-200 text-violet-600 text-xs font-semibold uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-slate-400 text-xs">{product.categoryName}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 sm:mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                {priceFormatted}
              </span>
              {product.averageRating !== undefined && product.averageRating > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200">
                  <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <span className="text-sm font-semibold text-amber-700">{product.averageRating.toFixed(1)}</span>
                  <span className="text-xs text-amber-600">({product.reviewCount})</span>
                </div>
              )}
            </div>

            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-800 text-sm font-semibold">Numara Seçin</span>
                {selectedSize && (
                  <span className="text-slate-400 text-xs">{selectedSize} Numara</span>
                )}
              </div>
              <SizeSelector
                sizes={product.variants.map((v) => ({ size: v.size, inStock: v.stockQuantity > 0 }))}
                selectedSize={selectedSize}
                onSizeSelect={(size) => {
                  setSelectedSize(size);
                }}
              />
            </div>

            {/* Stock Badge */}
            {selectedVariant && (
              <div className="mb-6">
                <StockBadge stock={selectedVariant.stockQuantity} />
              </div>
            )}

            {/* Sepete Ekle Butonu */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
              className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 cursor-pointer mb-6 ${
                addedToCart
                  ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {addedToCart ? '✓ Sepete Eklendi' : 'Sepete Ekle'}
            </button>

            {/* Extra Info */}
            <div className="grid grid-cols-3 gap-3 mt-2 sm:mt-4">
              {[
                { icon: '🚚', label: 'Ücretsiz Kargo' },
                { icon: '🔄', label: '14 Gün İade' },
                { icon: '✅', label: 'Orijinal Ürün' },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center"
                >
                  <span className="text-lg sm:text-xl">{icon}</span>
                  <span className="text-slate-500 text-[10px] sm:text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Yorumlar */}
        <ReviewList productId={product.id} />

        {/* Soru & Cevap */}
        <QuestionList productId={product.id} />
      </div>
    </main>
  );
}
