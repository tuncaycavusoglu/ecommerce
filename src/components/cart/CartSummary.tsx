import { useCart } from '../../context/CartContext';

export default function CartSummary() {
  const { totalItems, totalPrice, clearCart } = useCart();

  const priceFormatted = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(totalPrice);

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Ürün Adedi</span>
          <span className="text-slate-700">{totalItems}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Kargo</span>
          <span className="text-emerald-500 font-medium">Ücretsiz</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="text-slate-800 font-semibold">Toplam</span>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            {priceFormatted}
          </span>
        </div>
      </div>

      <button
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        id="checkout-button"
      >
        Siparişi Tamamla
      </button>

      <button
        onClick={clearCart}
        className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-red-500 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-sm font-medium transition-all duration-300 cursor-pointer"
        id="clear-cart-button"
      >
        Sepeti Temizle
      </button>
    </div>
  );
}
