import { Link } from 'react-router-dom';
import type { ShoeProduct } from '../../types';

interface ProductCardProps {
  product: ShoeProduct;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const priceFormatted = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(product.basePrice);

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 hover:border-violet-200 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/10"
      style={{ animationDelay: `${index * 100}ms` }}
      id={`product-card-${product.id}`}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-gradient-to-br from-slate-50 to-gray-100 p-6 sm:p-8 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[-5deg] drop-shadow-lg"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Rating Badge */}
        {product.averageRating !== undefined && product.averageRating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm">
            <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            <span className="text-xs font-semibold text-slate-700">{product.averageRating.toFixed(1)}</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 sm:p-5 space-y-3">
        <span className="text-violet-600 text-xs font-semibold uppercase tracking-wider">
          {product.brand}
        </span>

        <div className="flex items-start justify-between gap-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-slate-800 font-semibold text-base sm:text-lg leading-tight hover:text-violet-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <span className="text-violet-600 font-bold text-base sm:text-lg whitespace-nowrap">
            {priceFormatted}
          </span>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="mt-4 block w-full text-center py-2.5 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500 text-slate-600 hover:text-white text-sm font-medium border border-slate-200 hover:border-transparent transition-all duration-300"
        >
          Detayları İncele
        </Link>
      </div>
    </div>
  );
}
