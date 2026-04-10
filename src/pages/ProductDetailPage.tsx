import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../mocks/products';
import { categories } from '../mocks/products';
import ColorSelector from '../components/product/ColorSelector';
import SizeSelector from '../components/product/SizeSelector';
import StockBadge from '../components/product/StockBadge';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const product = products.find((p) => p.id === id);

  const uniqueColors = useMemo(() => {
    if (!product) return [];
    const map = new Map<string, string>();
    product.variants.forEach((v) => map.set(v.color, v.colorHexCode));
    return Array.from(map.entries()).map(([color, colorHexCode]) => ({
      color,
      colorHexCode,
    }));
  }, [product]);

  const [selectedColor, setSelectedColor] = useState(uniqueColors[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const categoryName = useMemo(() => {
    if (!product) return '';
    return categories.find((c) => c.id === product.categoryId)?.name || '';
  }, [product]);

  const currentImage = useMemo(() => {
    if (!product) return '';
    const variant = product.variants.find((v) => v.color === selectedColor);
    return variant?.imageUrl || product.variants[0]?.imageUrl || '';
  }, [product, selectedColor]);

  const sizesForColor = useMemo(() => {
    if (!product) return [];
    const colorVariants = product.variants.filter((v) => v.color === selectedColor);
    const uniqueSizes = Array.from(new Set(colorVariants.map((v) => v.size))).sort((a, b) => a - b);
    return uniqueSizes.map((size) => {
      const variant = colorVariants.find((v) => v.size === size);
      return {
        size,
        inStock: (variant?.stockQuantity || 0) > 0,
      };
    });
  }, [product, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    ) || null;
  }, [product, selectedColor, selectedSize]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };

  const priceFormatted = product
    ? new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
      }).format(product.basePrice)
    : '';

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
          <span className="text-slate-500">{categoryName}</span>
          <span>/</span>
          <span className="text-slate-800 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Image Section */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl p-8 sm:p-12 flex items-center justify-center border border-slate-100 overflow-hidden group">
              <img
                key={currentImage}
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-lg transition-all duration-700 group-hover:scale-105 animate-fade-in"
              />
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-4">
              {uniqueColors.map(({ color, colorHexCode }) => {
                const img = product.variants.find((v) => v.color === color)?.imageUrl;
                return (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 p-2 border transition-all duration-300 cursor-pointer ${
                      selectedColor === color
                        ? 'border-violet-400 shadow-lg shadow-violet-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={color} className="w-full h-full object-contain" />
                    <div
                      className="w-2 h-2 rounded-full mx-auto mt-1"
                      style={{ backgroundColor: colorHexCode }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-lg bg-violet-100 border border-violet-200 text-violet-600 text-xs font-semibold uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-slate-400 text-xs">{categoryName}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 sm:mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                {priceFormatted}
              </span>
            </div>

            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-800 text-sm font-semibold">Renk Seçin</span>
                <span className="text-slate-400 text-xs">{selectedColor}</span>
              </div>
              <ColorSelector
                colors={uniqueColors}
                selectedColor={selectedColor}
                onColorSelect={handleColorChange}
              />
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-800 text-sm font-semibold">Numara Seçin</span>
                {selectedSize && (
                  <span className="text-slate-400 text-xs">{selectedSize} Numara</span>
                )}
              </div>
              <SizeSelector
                sizes={sizesForColor}
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
      </div>
    </main>
  );
}
