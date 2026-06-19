import { useState, useEffect } from 'react';
import { fetchProducts } from '../../services/api';
import ProductCard from './ProductCard';
import type { ShoeProduct } from '../../types';

export default function ProductGrid() {
  const [products, setProducts] = useState<ShoeProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <svg className="w-8 h-8 animate-spin text-violet-500" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" id="product-grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}

      {products.length === 0 && (
        <div className="col-span-full text-center py-20">
          <div className="text-6xl mb-4">👟</div>
          <p className="text-slate-500 text-lg">Bu kategoride henüz ürün bulunmamaktadır.</p>
        </div>
      )}
    </div>
  );
}
