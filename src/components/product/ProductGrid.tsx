import { useMemo } from 'react';
import { products } from '../../mocks/products';
import { useFilter } from '../../context/FilterContext';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const { selectedCategoryId } = useFilter();

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return products;
    return products.filter((p) => p.categoryId === selectedCategoryId);
  }, [selectedCategoryId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" id="product-grid">
      {filteredProducts.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}

      {filteredProducts.length === 0 && (
        <div className="col-span-full text-center py-20">
          <div className="text-6xl mb-4">👟</div>
          <p className="text-slate-500 text-lg">Bu kategoride henüz ürün bulunmamaktadır.</p>
        </div>
      )}
    </div>
  );
}
