import { products } from '../../mocks/products';
import ProductCard from './ProductCard';

export default function ProductGrid() {
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
